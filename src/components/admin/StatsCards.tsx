
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Calendar, Users, Table } from "lucide-react";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format, isToday } from "date-fns";
import { fr } from "date-fns/locale";

interface StatsCardsProps {
  dataUpdated: boolean;
}

export const StatsCards = ({ dataUpdated }: StatsCardsProps) => {
  const [todayCount, setTodayCount] = useState<number | null>(null);
  const [weekCount, setWeekCount] = useState<number | null>(null);
  const [availableTables, setAvailableTables] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const now = new Date();
        
        // Today's reservations
        const today = startOfDay(now);
        const endToday = endOfDay(now);
        
        const { data: todayReservations, error: todayError } = await supabase
          .from('reservations')
          .select('count')
          .eq('canceled', false)
          .gte('start_time', today.toISOString())
          .lte('start_time', endToday.toISOString());
        
        if (todayError) throw todayError;
        
        // Week's reservations
        const startWeek = startOfWeek(now, { locale: fr });
        const endWeek = endOfWeek(now, { locale: fr });
        
        const { data: weekReservations, error: weekError } = await supabase
          .from('reservations')
          .select('count')
          .eq('canceled', false)
          .gte('start_time', startWeek.toISOString())
          .lte('start_time', endWeek.toISOString());
        
        if (weekError) throw weekError;
        
        // Current reservations for available tables calculation
        const { data: settings, error: settingsError } = await supabase
          .from('settings')
          .select('total_tables')
          .single();
        
        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
        
        const totalTables = settings?.total_tables || 10;
        
        const { data: currentReservations, error: currentError } = await supabase
          .from('reservations')
          .select('count')
          .eq('canceled', false)
          .lte('start_time', now.toISOString())
          .gte('end_time', now.toISOString());
        
        if (currentError) throw currentError;
        
        const currentTablesOccupied = currentReservations?.[0]?.count || 0;
        
        // Update states
        setTodayCount(todayReservations[0]?.count || 0);
        setWeekCount(weekReservations[0]?.count || 0);
        setAvailableTables(Math.max(0, totalTables - currentTablesOccupied));
      } catch (error) {
        console.error('Error fetching reservation stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dataUpdated]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Réservations aujourd'hui</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <div className="text-2xl font-bold">{todayCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(), "'Le' d MMMM yyyy", { locale: fr })}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Réservations cette semaine</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <div className="text-2xl font-bold">{weekCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {format(startOfWeek(new Date(), { locale: fr }), "d MMM", { locale: fr })} - {format(endOfWeek(new Date(), { locale: fr }), "d MMM", { locale: fr })}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tables libres maintenant</CardTitle>
          <Table className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <div className="text-2xl font-bold">{availableTables}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(), "'À' HH:mm", { locale: fr })}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
