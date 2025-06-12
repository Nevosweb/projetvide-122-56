
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => Promise<void>;
}

export const DashboardHeader = ({ user, onLogout }: DashboardHeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/7f130c86-3649-4b42-85b4-9e0384dd5952.png" 
            alt="Brasserie de Jean" 
            className="h-10 w-auto"
          />
          <div>
            <h1 className="text-xl font-semibold">Bord Jean</h1>
            <p className="text-sm text-gray-500">Administration</p>
          </div>
        </div>
        
        <div className="flex items-center">
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-gray-500">Staff</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
