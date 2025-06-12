
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

const BordJean = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Use setTimeout to avoid deadlocks
          setTimeout(() => {
            checkStaffRole(newSession.user);
          }, 0);
        } else {
          setIsStaff(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await checkStaffRole(session.user);
      }
      setLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkStaffRole = async (user: User) => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Error getting user data:", error);
        setIsStaff(false);
        return;
      }
      
      const role = data.user?.app_metadata?.role;
      setIsStaff(role === 'staff');
    } catch (error) {
      console.error("Failed to check staff role:", error);
      setIsStaff(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsStaff(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-brasserie-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {session && isStaff ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <AdminLogin onLoginSuccess={() => {}} />
      )}
    </div>
  );
};

export default BordJean;
