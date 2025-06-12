
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@supabase/supabase-js";
import { DashboardHeader } from "./DashboardHeader";
import { StatsCards } from "./StatsCards";
import { ReservationCalendar } from "./ReservationCalendar";
import { SettingsPanel } from "./SettingsPanel";
import { ReservationTimeline } from "./ReservationTimeline";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  user: User | null;
  onLogout: () => Promise<void>;
}

export const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dataUpdated, setDataUpdated] = useState(false);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        (payload) => {
          console.log('Change received!', payload);
          setDataUpdated(prev => !prev); // Toggle to trigger refreshes
          toast({
            description: "Les données de réservation ont été mises à jour.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border w-full grid grid-cols-3 h-auto">
            <TabsTrigger value="dashboard" className="py-3">Tableau de Bord</TabsTrigger>
            <TabsTrigger value="calendar" className="py-3">Calendrier</TabsTrigger>
            <TabsTrigger value="settings" className="py-3">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <StatsCards dataUpdated={dataUpdated} />
            <ReservationTimeline dataUpdated={dataUpdated} />
          </TabsContent>
          
          <TabsContent value="calendar">
            <ReservationCalendar dataUpdated={dataUpdated} />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
