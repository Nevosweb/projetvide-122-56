import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { format, isBefore, startOfDay, endOfDay, subDays, addDays, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, Calendar as CalendarIcon, Download, Check, AlertTriangle, X, Filter, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatTime } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";

interface ReservationData {
  id: string;
  customer_name: string;
  customer_email: string;
  party_size: number;
  start_time: string;
  end_time: string;
  canceled: boolean;
  comments?: string;
}

interface ReservationListProps {
  dataUpdated: boolean;
}

export const ReservationList = ({ dataUpdated }: ReservationListProps) => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<ReservationData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
  // Filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: addDays(new Date(), 30)
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [partySize, setPartySize] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('reservations')
          .select('*')
          .order('start_time', { ascending: false });
        
        // Apply date range filter if set
        if (dateRange?.from) {
          const startDate = startOfDay(dateRange.from);
          query = query.gte('start_time', startDate.toISOString());
        }
        
        if (dateRange?.to) {
          const endDate = endOfDay(dateRange.to);
          query = query.lte('start_time', endDate.toISOString());
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setReservations(data || []);
        applyFilters(data || [], searchTerm, partySize, status);
      } catch (error) {
        console.error('Error fetching reservations:', error);
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
  }, [dateRange, dataUpdated, toast]);
  
  useEffect(() => {
    applyFilters(reservations, searchTerm, partySize, status);
  }, [searchTerm, partySize, status, reservations]);
  
  const applyFilters = (data: ReservationData[], search: string, size: string, statusFilter: string) => {
    let filtered = [...data];
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(r => 
        r.customer_name.toLowerCase().includes(searchLower) || 
        r.customer_email.toLowerCase().includes(searchLower)
      );
    }
    
    // Party size filter
    if (size) {
      filtered = filtered.filter(r => {
        if (size === "1-2") return r.party_size <= 2;
        if (size === "3-4") return r.party_size >= 3 && r.party_size <= 4;
        if (size === "5-6") return r.party_size >= 5 && r.party_size <= 6;
        if (size === "7+") return r.party_size >= 7;
        return true;
      });
    }
    
    // Status filter
    if (statusFilter) {
      if (statusFilter === "confirmed") {
        filtered = filtered.filter(r => !r.canceled);
      } else if (statusFilter === "canceled") {
        filtered = filtered.filter(r => r.canceled);
      } else if (statusFilter === "upcoming") {
        filtered = filtered.filter(r => 
          !r.canceled && 
          isToday(new Date(r.start_time)) && 
          isBefore(new Date(), new Date(r.start_time))
        );
      } else if (statusFilter === "past") {
        filtered = filtered.filter(r => 
          !r.canceled && 
          isBefore(new Date(r.start_time), new Date())
        );
      }
    }
    
    setFilteredReservations(filtered);
  };
  
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
      const updatedReservations = reservations.map(res => 
        res.id === selectedReservation.id ? { ...res, canceled: true } : res
      );
      
      setReservations(updatedReservations);
      applyFilters(updatedReservations, searchTerm, partySize, status);
      
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
  
  const exportToCsv = () => {
    // CSV Header
    let csvContent = "Nom,Email,Date,Heure,Personnes,Statut\n";
    
    // CSV Rows
    filteredReservations.forEach((reservation) => {
      const date = formatDate(new Date(reservation.start_time));
      const time = formatTime(reservation.start_time);
      const status = reservation.canceled ? "Annulée" : "Confirmée";
      
      const row = [
        `"${reservation.customer_name}"`,
        `"${reservation.customer_email}"`,
        `"${date}"`,
        `"${time}"`,
        `${reservation.party_size}`,
        `"${status}"`
      ].join(",");
      
      csvContent += row + "\n";
    });
    
    // Create CSV file and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reservations-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getStatusBadge = (reservation: ReservationData) => {
    if (reservation.canceled) {
      return <Badge variant="outline" className="border-red-300 text-red-600">Annulée</Badge>;
    }
    
    const startTime = new Date(reservation.start_time);
    const now = new Date();
    
    if (isBefore(startTime, now)) {
      return <Badge variant="outline" className="border-gray-300 text-gray-600">Passée</Badge>;
    }
    
    if (isToday(startTime)) {
      return <Badge variant="outline" className="border-green-300 text-green-600">Aujourd'hui</Badge>;
    }
    
    return <Badge variant="outline" className="border-blue-300 text-blue-600">À venir</Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Liste des réservations</CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-green-700 border-green-200 hover:bg-green-50"
            onClick={exportToCsv}
          >
            <Download className="h-4 w-4 mr-2" /> Exporter en CSV
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-1 gap-2 items-start">
                <div className="w-full max-w-sm">
                  <Label htmlFor="search" className="sr-only">Recherche</Label>
                  <Input 
                    id="search" 
                    placeholder="Rechercher par nom ou email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px]">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "d LLL", { locale: fr })} - {" "}
                            {format(dateRange.to, "d LLL", { locale: fr })}
                          </>
                        ) : (
                          format(dateRange.from, "d MMMM yyyy", { locale: fr })
                        )
                      ) : (
                        "Choisir les dates"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range) => setDateRange(range)}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex gap-2">
                <div className="w-full max-w-[150px]">
                  <Select value={partySize} onValueChange={setPartySize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Couverts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous</SelectItem>
                      <SelectItem value="1-2">1-2 personnes</SelectItem>
                      <SelectItem value="3-4">3-4 personnes</SelectItem>
                      <SelectItem value="5-6">5-6 personnes</SelectItem>
                      <SelectItem value="7+">7+ personnes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full max-w-[150px]">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous</SelectItem>
                      <SelectItem value="confirmed">Confirmées</SelectItem>
                      <SelectItem value="canceled">Annulées</SelectItem>
                      <SelectItem value="upcoming">À venir</SelectItem>
                      <SelectItem value="past">Passées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead className="hidden sm:table-cell">Pers.</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredReservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Aucune réservation trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.customer_name}</TableCell>
                        <TableCell className="hidden md:table-cell">{reservation.customer_email}</TableCell>
                        <TableCell>{formatDate(new Date(reservation.start_time))}</TableCell>
                        <TableCell>{formatTime(reservation.start_time)}</TableCell>
                        <TableCell className="hidden sm:table-cell">{reservation.party_size}</TableCell>
                        <TableCell>
                          {getStatusBadge(reservation)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setDialogOpen(true);
                            }}
                          >
                            <span className="sr-only">Détails</span>
                            {reservation.canceled ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
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
                
                {selectedReservation.comments && (
                  <div>
                    <div className="text-sm text-muted-foreground">Commentaires et demandes spéciales</div>
                    <div className="p-3 bg-gray-50 rounded-md mt-1 border text-gray-700">
                      {selectedReservation.comments}
                    </div>
                  </div>
                )}
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
