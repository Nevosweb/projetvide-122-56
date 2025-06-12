
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday, isAfter, isBefore, addHours, differenceInHours } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, Users, AlertTriangle, Check, X, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatTime } from "@/lib/utils";

interface ReservationData {
  id: string;
  customer_name: string;
  customer_email: string;
  party_size: number;
  start_time: string;
  end_time: string;
  canceled: boolean;
}

interface ReservationCalendarProps {
  dataUpdated: boolean;
}

export const ReservationCalendar = ({ dataUpdated }: ReservationCalendarProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  const hours = Array.from({ length: 11 }, (_, i) => 10 + i); // 10AM to 8PM
  
  useEffect(() => {
    if (!date) return;
    
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .gte('start_time', startDate.toISOString())
          .lte('start_time', endDate.toISOString())
          .order('start_time', { ascending: true });
        
        if (error) throw error;
        
        setReservations(data || []);
      } catch (error) {
        console.error('Error fetching reservations for date:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les réservations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [date, dataUpdated, toast]);

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;
    
    setCancellingId(selectedReservation.id);
    
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ canceled: true })
        .eq('id', selectedReservation.id);
      
      if (error) throw error;
      
      // Update local state
      setReservations(reservations.map(res => 
        res.id === selectedReservation.id ? { ...res, canceled: true } : res
      ));
      
      toast({
        title: "Réservation annulée",
        description: "La réservation a été annulée avec succès.",
      });
      
      // Close dialog
      setDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const getReservationStyle = (reservation: ReservationData) => {
    if (reservation.canceled) {
      return "bg-red-100 border-red-200 text-red-700";
    }
    
    const startTime = new Date(reservation.start_time);
    const now = new Date();
    
    if (isToday(startTime) && differenceInHours(startTime, now) < 2) {
      return "bg-amber-100 border-amber-200 text-amber-800";
    }
    
    return "bg-green-100 border-green-200 text-green-800";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">
            {date ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
          </h2>
          <p className="text-muted-foreground">Consultez toutes les réservations pour cette journée</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setDate(new Date())}
            className="whitespace-nowrap"
          >
            Aujourd'hui
          </Button>
          
          <div className="relative">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 flex-wrap gap-y-2">
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-green-100 border border-green-200 rounded-full"></span>
          <span className="text-sm">Confirmée</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-full"></span>
          <span className="text-sm">À venir (&lt;2h)</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-red-100 border border-red-200 rounded-full"></span>
          <span className="text-sm">Annulée</span>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 py-4">
          <CardTitle className="text-lg">Réservations du {date ? format(date, "d MMMM", { locale: fr }) : "..."}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <CalendarIcon className="h-6 w-6 animate-spin text-brasserie-gold" />
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucune réservation pour cette journée
            </div>
          ) : (
            <div className="divide-y">
              {reservations.map((reservation) => {
                const startTime = new Date(reservation.start_time);
                
                return (
                  <div 
                    key={reservation.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${getReservationStyle(reservation)}`}
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setDialogOpen(true);
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{reservation.customer_name}</h3>
                        {reservation.canceled && <Badge variant="outline" className="border-red-300 text-red-600">Annulée</Badge>}
                      </div>
                      <div className="font-semibold mt-1 sm:mt-0">
                        {format(startTime, "HH:mm", { locale: fr })}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 opacity-70" />
                        <span>{reservation.party_size} personne{reservation.party_size > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 opacity-70" />
                        <span>{format(startTime, "HH:mm", { locale: fr })} - {format(new Date(reservation.end_time), "HH:mm", { locale: fr })}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {selectedReservation && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Détails de la réservation</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Nom</div>
                    <div className="font-medium">{selectedReservation.customer_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{selectedReservation.customer_email}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">{formatDate(new Date(selectedReservation.start_time))}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Heure</div>
                    <div className="font-medium">
                      {formatTime(selectedReservation.start_time)} - {formatTime(selectedReservation.end_time)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Couverts</div>
                  <div className="font-medium">{selectedReservation.party_size} personne{selectedReservation.party_size > 1 ? 's' : ''}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Statut</div>
                  <div className="font-medium flex items-center gap-2 mt-1">
                    {selectedReservation.canceled ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        <span>Annulée</span>
                      </>
                    ) : (
                      <>
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span>Confirmée</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Fermer</Button>
                </DialogClose>
                
                {!selectedReservation.canceled && (
                  <Button 
                    variant="destructive"
                    onClick={handleCancelReservation}
                    disabled={!!cancellingId}
                  >
                    {cancellingId === selectedReservation.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Annulation...
                      </>
                    ) : (
                      'Annuler la réservation'
                    )}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
