
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        const role = data.user?.app_metadata?.role;
        
        if (role !== 'staff') {
          await supabase.auth.signOut();
          throw new Error("Accès non autorisé. Vous devez avoir un rôle de staff.");
        }
        
        toast({
          description: "Connexion réussie !",
        });
        onLoginSuccess();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Une erreur est survenue lors de la connexion");
      toast({
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects ou accès non autorisé",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/7f130c86-3649-4b42-85b4-9e0384dd5952.png"
              alt="Brasserie de Jean" 
              className="h-20 w-auto"
            />
          </div>
          <CardTitle className="text-2xl">Administration</CardTitle>
          <CardDescription>Connectez-vous pour accéder au panneau d'administration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="jdeo.unity@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-brasserie-gold hover:bg-brasserie-gold/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
