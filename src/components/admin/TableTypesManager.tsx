
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2, PlusCircle, Trash2, Plus, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TableType {
  id: string;
  capacity: number;
  count: number;
}

export const TableTypesManager = () => {
  const { toast } = useToast();
  const [tableTypes, setTableTypes] = useState<TableType[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newTableType, setNewTableType] = useState({ capacity: 2, count: 1 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchTableTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('table_types')
          .select('*')
          .order('capacity', { ascending: true });
        
        if (error) throw error;
        
        setTableTypes(data || []);
      } catch (error) {
        console.error("Error fetching table types:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les types de tables du restaurant.",
          variant: "destructive"
        });
      }
    };

    fetchTableTypes();
  }, [toast]);

  const updateTableType = async (id: string, field: 'count' | 'capacity', value: number) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('table_types')
        .update({ [field]: value })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setTableTypes(tableTypes.map(type => 
        type.id === id ? { ...type, [field]: value } : type
      ));
      
      toast({
        title: "Succès",
        description: "Le type de table a été mis à jour.",
      });
    } catch (error) {
      console.error("Error updating table type:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le type de table.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const incrementTableCount = async (id: string, currentCount: number) => {
    await updateTableType(id, 'count', currentCount + 1);
  };

  const decrementTableCount = async (id: string, currentCount: number) => {
    if (currentCount > 0) {
      await updateTableType(id, 'count', currentCount - 1);
    }
  };

  const addTableType = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from('table_types')
        .insert({
          capacity: newTableType.capacity,
          count: newTableType.count
        })
        .select();
      
      if (error) throw error;
      
      // Add new table type to local state
      if (data && data.length > 0) {
        setTableTypes([...tableTypes, data[0]]);
      }
      
      toast({
        title: "Succès",
        description: "Le nouveau type de table a été ajouté.",
      });

      // Reset form and close dialog
      setNewTableType({ capacity: 2, count: 1 });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding table type:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le nouveau type de table.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteTableType = async (id: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('table_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from local state
      setTableTypes(tableTypes.filter(type => type.id !== id));
      
      toast({
        title: "Succès",
        description: "Le type de table a été supprimé.",
      });
    } catch (error) {
      console.error("Error deleting table type:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le type de table.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate total capacity and table count
  const totalCapacity = tableTypes.reduce((sum, type) => sum + (type.capacity * type.count), 0);
  const totalTables = tableTypes.reduce((sum, type) => sum + type.count, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100 mb-12">
      <h2 className="heading-md text-brasserie-darkgreen mb-6">Paramètres du restaurant</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-brasserie-darkgreen">Configuration des tables</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brasserie-gold hover:bg-brasserie-gold/90 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un type de table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau type de table</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-capacity">Capacité (nombre de couverts)</Label>
                  <Input
                    id="new-capacity"
                    type="number"
                    min="1"
                    value={newTableType.capacity}
                    onChange={(e) => setNewTableType({...newTableType, capacity: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-count">Nombre de tables</Label>
                  <Input
                    id="new-count"
                    type="number"
                    min="1"
                    value={newTableType.count}
                    onChange={(e) => setNewTableType({...newTableType, count: parseInt(e.target.value) || 1})}
                  />
                </div>
                <Button 
                  onClick={addTableType}
                  disabled={isUpdating}
                  className="bg-brasserie-gold hover:bg-brasserie-gold/90 text-white mt-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ajout en cours...
                    </>
                  ) : (
                    "Ajouter"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Capacité</TableHead>
                <TableHead>Nombre de tables</TableHead>
                <TableHead>Couverts totaux</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    Aucun type de table configuré
                  </TableCell>
                </TableRow>
              ) : (
                tableTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          min="1"
                          className="w-20 mr-2"
                          value={type.capacity}
                          onChange={(e) => updateTableType(type.id, 'capacity', parseInt(e.target.value) || 1)}
                        />
                        <span>couverts</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          min="0"
                          className="w-20 mr-2"
                          value={type.count}
                          onChange={(e) => updateTableType(type.id, 'count', parseInt(e.target.value) || 0)}
                        />
                        <span>tables</span>
                      </div>
                    </TableCell>
                    <TableCell>{type.capacity * type.count} couverts</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="bg-brasserie-gold hover:bg-brasserie-gold/90 text-white"
                          onClick={() => incrementTableCount(type.id, type.count)}
                          disabled={isUpdating}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-brasserie-gold hover:bg-brasserie-gold/90 text-white"
                          onClick={() => decrementTableCount(type.id, type.count)}
                          disabled={isUpdating || type.count <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteTableType(type.id)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              <TableRow className="bg-gray-50 font-medium">
                <TableCell colSpan={1}>Total</TableCell>
                <TableCell>{totalTables} tables</TableCell>
                <TableCell colSpan={2}>{totalCapacity} couverts</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Cette configuration définit les tables disponibles pour les réservations.
        </p>
      </div>
    </div>
  );
};
