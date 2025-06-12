import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock, Users, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  phone: string;
  guests: string;
  date: Date | undefined;
  time: string;
  comments: string;
}

interface AvailabilityStatus {
  available: boolean;
  message: string;
}

const ReservationConfirmation = ({ onNewReservation }: { onNewReservation: () => void }) => {
  return (
    <Card className="w-full bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-green-800 text-xl">
          Réservation confirmée !
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-green-700">
          Votre réservation a été enregistrée avec succès. Vous recevrez un email de confirmation sous peu.
        </p>
        <Button 
          onClick={onNewReservation}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Nouvelle réservation
        </Button>
      </CardContent>
    </Card>
  );
};

export const ReservationForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    guests: "",
    date: undefined,
    time: "",
    comments: ""
  });
  
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const timeSlots = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30", "20:00", "20:30", "21:00"
  ];

  const handleChange = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'date' || field === 'time' || field === 'guests') {
      setAvailabilityStatus(null);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    handleChange('date', date);
    setIsCalendarOpen(false);
  };

  const isTimeSlotAvailable = (time: string): boolean => {
    if (!formData.date) return true;
    
    const now = new Date();
    const selectedDate = new Date(formData.date);
    const [hours, minutes] = time.split(':').map(Number);
    const timeSlotDate = new Date(selectedDate);
    timeSlotDate.setHours(hours, minutes, 0, 0);
    
    return timeSlotDate > now;
  };

  const validateFormFields = (): boolean => {
    if (!formData.name.trim()) {
      toast({ title: "Erreur", description: "Le nom est requis", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim()) {
      toast({ title: "Erreur", description: "L'email est requis", variant: "destructive" });
      return false;
    }
    if (!formData.phone.trim()) {
      toast({ title: "Erreur", description: "Le téléphone est requis", variant: "destructive" });
      return false;
    }
    if (!formData.guests) {
      toast({ title: "Erreur", description: "Le nombre de personnes est requis", variant: "destructive" });
      return false;
    }
    if (!formData.date) {
      toast({ title: "Erreur", description: "La date est requise", variant: "destructive" });
      return false;
    }
    if (!formData.time) {
      toast({ title: "Erreur", description: "L'heure est requise", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleCheckAvailability = async () => {
    if (!formData.date || !formData.time || !formData.guests) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner une date, une heure et le nombre de personnes",
        variant: "destructive"
      });
      return;
    }

    setIsCheckingAvailability(true);
    setAvailabilityStatus(null);

    try {
      const [hours, minutes] = formData.time.split(':');
      const startTime = new Date(formData.date);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const response = await fetch('/api/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          partySize: parseInt(formData.guests),
          shouldReserve: false
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAvailabilityStatus({
          available: data.available,
          message: data.available 
            ? "Créneau disponible ! Vous pouvez procéder à la réservation."
            : "Ce créneau n'est pas disponible. Veuillez choisir une autre heure."
        });
      } else {
        throw new Error(data.error || 'Erreur lors de la vérification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier la disponibilité. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormFields()) return;
    
    if (!availabilityStatus?.available) {
      toast({
        title: "Vérification requise",
        description: "Veuillez d'abord vérifier la disponibilité",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const [hours, minutes] = formData.time.split(':');
      const startTime = new Date(formData.date!);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const response = await fetch('/api/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: startTime.toISOString(),
          partySize: parseInt(formData.guests),
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          comments: formData.comments,
          shouldReserve: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setReservationComplete(true);
          toast({
            title: "Réservation confirmée !",
            description: "Votre réservation a été enregistrée avec succès."
          });
        } else {
          throw new Error(data.error || 'Erreur lors de la réservation');
        }
      } else {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser la réservation. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewReservation = () => {
    setReservationComplete(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      guests: "",
      date: undefined,
      time: "",
      comments: ""
    });
    setAvailabilityStatus(null);
  };

  if (reservationComplete) {
    return <ReservationConfirmation onNewReservation={handleNewReservation} />;
  }

  return (
    <Card className="w-full bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-brasserie-darkgreen mb-2">
          Réserver une table
        </CardTitle>
        <p className="text-gray-600">
          Remplissez le formulaire ci-dessous pour réserver votre table
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nom complet *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Votre nom complet"
                className="border-gray-300 focus:border-brasserie-gold focus:ring-brasserie-gold"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="votre@email.com"
                className="border-gray-300 focus:border-brasserie-gold focus:ring-brasserie-gold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Téléphone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="06 12 34 56 78"
                className="border-gray-300 focus:border-brasserie-gold focus:ring-brasserie-gold"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guests" className="text-sm font-medium text-gray-700">
                Nombre de personnes *
              </Label>
              <Select value={formData.guests} onValueChange={(value) => handleChange('guests', value)}>
                <SelectTrigger className="border-gray-300 focus:border-brasserie-gold focus:ring-brasserie-gold">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {num} {num === 1 ? 'personne' : 'personnes'}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Date *
              </Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-300 focus:border-brasserie-gold focus:ring-brasserie-gold",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-0 bg-white border shadow-lg z-50" 
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateChange}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    initialFocus
                    locale={fr}
                    className="rounded-md"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                Heure *
              </Label>
              <Select value={formData.time} onValueChange={(value) => handleChange('time', value)}>
                <SelectTrigger className="border-gray-300 focus:border-brasserie-gold focus:ring-brasserie-gold">
                  <SelectValue placeholder="Sélectionner une heure" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => {
                    const available = isTimeSlotAvailable(time);
                    return (
                      <SelectItem 
                        key={time} 
                        value={time} 
                        disabled={!available}
                        className={!available ? "opacity-50" : ""}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {time}
                          {!available && <span className="text-xs text-gray-400">(passé)</span>}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium text-gray-700">
              Commentaires (optionnel)
            </Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
              placeholder="Allergies, demandes spéciales, occasion..."
              className="border-gray-300 focus:border-brasserie-gold focus:ring-brasserie-gold min-h-[80px]"
              rows={3}
            />
          </div>

          {availabilityStatus && (
            <div className={cn(
              "p-4 rounded-lg border",
              availabilityStatus.available 
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            )}>
              <div className="flex items-center gap-2">
                {availabilityStatus.available ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{availabilityStatus.message}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCheckAvailability}
              disabled={isCheckingAvailability || !formData.date || !formData.time || !formData.guests}
              className="flex-1 border-brasserie-gold text-brasserie-darkgreen hover:bg-brasserie-gold/10"
            >
              {isCheckingAvailability ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Vérifier la disponibilité
                </>
              )}
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting || !availabilityStatus?.available}
              className="flex-1 bg-brasserie-darkgreen hover:bg-brasserie-darkgreen/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Réservation...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmer la réservation
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};