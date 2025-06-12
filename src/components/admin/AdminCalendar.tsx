
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

interface AdminCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  party_size: number;
  start_time: string;
  end_time: string;
  canceled?: boolean;
}

export const AdminCalendar = ({ selectedDate, setSelectedDate }: AdminCalendarProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reservationsCount, setReservationsCount] = useState<{[key: string]: number}>({});
  
  // Fetch reservations for the selected date
  useEffect(() => {
    const fetchReservationsForDate = async () => {
      setIsLoading(true);
      try {
        // Get date range for the selected day
        const dayStart = new Date(selectedDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(selectedDate);
        dayEnd.setHours(23, 59, 59, 999);
        
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .gte('start_time', dayStart.toISOString())
          .lt('start_time', dayEnd.toISOString())
          .order('start_time', { ascending: true });
        
        if (error) throw error;
        
        setReservations(data || []);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationsForDate();
  }, [selectedDate]);
  
  // Get daily reservation counts for the calendar
  useEffect(() => {
    const fetchReservationCounts = async () => {
      try {
        // Calculate the first and last day of the month
        const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        
        const { data, error } = await supabase
          .from('reservations')
          .select('start_time, canceled')
          .gte('start_time', firstDayOfMonth.toISOString())
          .lt('start_time', lastDayOfMonth.toISOString())
          .eq('canceled', false);
          
        if (error) throw error;
        
        // Calculate number of reservations per day
        const counts: {[key: string]: number} = {};
        
        data?.forEach(reservation => {
          const date = new Date(reservation.start_time).toISOString().split('T')[0];
          counts[date] = (counts[date] || 0) + 1;
        });
        
        setReservationsCount(counts);
      } catch (error) {
        console.error("Error fetching reservation counts:", error);
      }
    };
    
    fetchReservationCounts();
  }, [selectedDate]);

  // Navigation functions
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };
  
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };
  
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Calendar day styling
  const getDayClass = (day: Date | undefined) => {
    if (!day) return "";
    
    const dateStr = day.toISOString().split('T')[0];
    const count = reservationsCount[dateStr] || 0;
    
    if (count === 0) return "";
    if (count < 3) return "bg-green-100 text-green-800 font-medium";
    if (count < 6) return "bg-amber-100 text-amber-800 font-medium";
    return "bg-red-100 text-red-800 font-medium";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100 mb-12">
      <h2 className="heading-md text-brasserie-darkgreen mb-6">Calendrier des réservations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sélectionnez une date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center my-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                classNames={{
                  day: (date) => getDayClass(date)
                } as any}
                className="pointer-events-auto"
              />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={goToPreviousDay}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextDay}>
                  Suivant <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Aujourd'hui
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-green-100 rounded-full"></span>
                <span>1-2 réservations</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-amber-100 rounded-full"></span>
                <span>3-5 réservations</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-red-100 rounded-full"></span>
                <span>6+ réservations</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              {format(selectedDate, "d MMMM yyyy", { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-brasserie-gold" />
              </div>
            ) : reservations.length === 0 ? (
              <div className="h-64 flex flex-col justify-center items-center text-gray-500">
                <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
                <p>Aucune réservation pour cette date</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {reservations.map((reservation) => (
                  <div 
                    key={reservation.id}
                    className={`p-3 rounded-lg border ${
                      reservation.canceled 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{reservation.customer_name}</span>
                      <span>{formatTime(reservation.start_time)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>
                        {reservation.party_size} personne{reservation.party_size > 1 ? 's' : ''}
                      </span>
                      {reservation.canceled && 
                        <Badge variant="outline" className="text-red-600 border-red-300">Annulée</Badge>
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
