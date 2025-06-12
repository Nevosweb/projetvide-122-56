
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatTime } from "@/lib/utils";
import { ReservationDetailsDialog, Reservation } from "./ReservationDetailsDialog";

interface DailyReservationsListProps {
  selectedDate: Date;
}

export const DailyReservationsList = ({ selectedDate }: DailyReservationsListProps) => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setCancelingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

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
        toast({
          title: "Erreur",
          description: "Impossible de charger les réservations.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Load reservations for the selected date
    fetchReservationsForDate();
  }, [selectedDate, toast]);

  const cancelReservation = async (id: string) => {
    setCancelingId(id);
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ canceled: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setReservations(reservations.map(res => 
        res.id === id ? { ...res, canceled: true } : res
      ));
      
      toast({
        title: "Réservation annulée",
        description: "La réservation a été annulée avec succès.",
      });
    } catch (error) {
      console.error("Error canceling reservation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation.",
        variant: "destructive"
      });
    } finally {
      setCancelingId(null);
    }
  };

  const handleReservationUpdated = () => {
    // Refresh reservations list by re-fetching from database
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
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
      <h2 className="heading-md text-brasserie-darkgreen mb-6">
        Réservations du {format(selectedDate, "d MMMM yyyy", { locale: fr })}
      </h2>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brasserie-gold" />
        </div>
      ) : reservations.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Heure</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Personnes</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Commentaires</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id} className={reservation.canceled ? "bg-gray-50 text-gray-500" : ""}>
                  <TableCell>{formatTime(reservation.start_time)}</TableCell>
                  <TableCell>{reservation.customer_name}</TableCell>
                  <TableCell>{reservation.customer_email}</TableCell>
                  <TableCell>{reservation.party_size}</TableCell>
                  <TableCell>{reservation.canceled ? "Annulée" : "Confirmée"}</TableCell>
                  <TableCell>
                    {reservation.comments ? (
                      <div>
                        {/* Show a preview of comment if exists */}
                        <p className="text-sm text-gray-600 truncate max-w-[150px]">
                          {reservation.comments}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center text-blue-600 mt-1"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setDialogOpen(true);
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Voir plus
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">Aucun</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {!reservation.canceled && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelReservation(reservation.id)}
                        disabled={!!isCanceling}
                      >
                        {isCanceling === reservation.id ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Annulation...
                          </>
                        ) : (
                          "Annuler"
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Aucune réservation pour ce jour.</p>
        </div>
      )}

      <ReservationDetailsDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        reservation={selectedReservation}
        onCanceled={handleReservationUpdated}
      />
    </div>
  );
};
