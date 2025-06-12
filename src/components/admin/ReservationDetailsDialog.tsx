
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

export interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  party_size: number;
  start_time: string;
  end_time: string;
  created_at: string;
  canceled: boolean;
  comments?: string;
}

interface ReservationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
  onCanceled: () => void;
}

export const ReservationDetailsDialog = ({ 
  open, 
  onOpenChange, 
  reservation, 
  onCanceled 
}: ReservationDetailsDialogProps) => {
  const { toast } = useToast();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  if (!reservation) {
    return null;
  }

  const cancelReservation = async (id: string) => {
    setCancellingId(id);
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ canceled: true })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Réservation annulée",
        description: "La réservation a été annulée avec succès.",
      });
      
      onCanceled();
      onOpenChange(false);
    } catch (error) {
      console.error("Error canceling reservation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation.",
        variant: "destructive"
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Détails de la réservation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-muted-foreground">Nom</div>
              <div className="font-medium">{reservation.customer_name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{reservation.customer_email}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{formatDate(new Date(reservation.start_time))}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Heure</div>
              <div className="font-medium">
                {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Couverts</div>
            <div className="font-medium">{reservation.party_size} personne{reservation.party_size > 1 ? 's' : ''}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Statut</div>
            <div className="font-medium flex items-center gap-2 mt-1">
              {reservation.canceled ? (
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
          
          {reservation.comments && (
            <div>
              <div className="text-sm text-muted-foreground">Commentaires et demandes spéciales</div>
              <div className="p-3 bg-gray-50 rounded-md mt-1 border text-gray-700">
                {reservation.comments}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
          
          {!reservation.canceled && (
            <Button 
              variant="destructive"
              onClick={() => cancelReservation(reservation.id)}
              disabled={!!cancellingId}
            >
              {cancellingId === reservation.id ? (
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
      </DialogContent>
    </Dialog>
  );
};
