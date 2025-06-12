
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday, addHours } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, Calendar, Clock, Users } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

interface ReservationData {
  id: string;
  customer_name: string;
  customer_email: string;
  party_size: number;
  start_time: string;
  end_time: string;
  canceled?: boolean;
}

interface ReservationTimelineProps {
  dataUpdated: boolean;
}

export const ReservationTimeline = ({ dataUpdated }: ReservationTimelineProps) => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const now = new Date();
        
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .eq('canceled', false)
          .gte('start_time', now.toISOString())
          .order('start_time', { ascending: true })
          .limit(10);
        
        if (error) throw error;
        
        setReservations(data || []);
      } catch (error) {
        console.error('Error fetching upcoming reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [dataUpdated]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochaines Réservations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-brasserie-gold" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune réservation à venir
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => {
              const startTime = new Date(reservation.start_time);
              const isToday = new Date().toDateString() === startTime.toDateString();
              
              return (
                <div key={reservation.id} className="border-l-4 border-brasserie-gold pl-4 pb-6 relative">
                  <div className="absolute w-3 h-3 bg-white border-2 border-brasserie-gold rounded-full -left-[6.5px] top-0"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="font-medium">{reservation.customer_name}</h3>
                    {isToday && (
                      <Badge className="bg-green-600 w-fit">Aujourd'hui</Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-1">
                    {reservation.customer_email}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(new Date(reservation.start_time))}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{formatTime(reservation.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{reservation.party_size} personne{reservation.party_size > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
