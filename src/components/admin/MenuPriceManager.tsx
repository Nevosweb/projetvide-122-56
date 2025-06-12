
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader2, PenLine, Check, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MenuSection {
  id: string;
  title: string;
  display_order: number;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  tag: string | null;
  display_order: number;
  section_id: string;
  editing?: boolean;
  newPrice?: string;
}

export const MenuPriceManager = () => {
  const { toast } = useToast();
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchMenuData();

    // Configure realtime subscription
    const channel = supabase
      .channel('menu-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        () => {
          console.log('Menu items changed, refreshing data');
          fetchMenuData();
          toast({
            description: "Les prix du menu ont été mis à jour.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const fetchMenuData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch sections
      const { data: sectionData, error: sectionError } = await supabase
        .from('menu_sections')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (sectionError) throw sectionError;
      
      // Fetch items
      const { data: itemData, error: itemError } = await supabase
        .from('menu_items')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (itemError) throw itemError;
      
      // Organize items by section
      const sections = sectionData.map(section => {
        const items = itemData
          .filter(item => item.section_id === section.id)
          .map(item => ({ ...item, editing: false }));
        
        return {
          ...section,
          items,
        };
      });
      
      setMenuSections(sections);

      // Initialize expanded state for new sections
      const newExpandedSections = { ...expandedSections };
      sections.forEach(section => {
        if (newExpandedSections[section.id] === undefined) {
          newExpandedSections[section.id] = false;
        }
      });
      setExpandedSections(newExpandedSections);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du menu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEditing = (sectionId: string, itemId: string) => {
    setMenuSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              items: section.items.map(item => 
                item.id === itemId 
                  ? { ...item, editing: !item.editing, newPrice: item.price } 
                  : item
              )
            }
          : section
      )
    );
  };

  const handlePriceChange = (sectionId: string, itemId: string, newPrice: string) => {
    setMenuSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              items: section.items.map(item => 
                item.id === itemId 
                  ? { ...item, newPrice } 
                  : item
              )
            }
          : section
      )
    );
  };

  const savePrice = async (sectionId: string, itemId: string) => {
    try {
      setIsSaving(true);
      
      const section = menuSections.find(s => s.id === sectionId);
      if (!section) return;
      
      const item = section.items.find(i => i.id === itemId);
      if (!item || !item.newPrice) return;
      
      const { error } = await supabase
        .from('menu_items')
        .update({ price: item.newPrice })
        .eq('id', itemId);
      
      if (error) throw error;
      
      // Update local state
      setMenuSections(prevSections => 
        prevSections.map(section => 
          section.id === sectionId 
            ? {
                ...section,
                items: section.items.map(item => 
                  item.id === itemId 
                    ? { ...item, price: item.newPrice || item.price, editing: false } 
                    : item
                )
              }
            : section
        )
      );
      
      toast({
        title: "Prix mis à jour",
        description: `Le prix de "${item.name}" a été mis à jour avec succès.`
      });
    } catch (error) {
      console.error("Error saving price:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le prix.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEditing = (sectionId: string, itemId: string) => {
    setMenuSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              items: section.items.map(item => 
                item.id === itemId 
                  ? { ...item, editing: false, newPrice: item.price } 
                  : item
              )
            }
          : section
      )
    );
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-brasserie-darkgreen" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100 mb-12">
      <h2 className="heading-md text-brasserie-darkgreen mb-6">Gestion des prix du menu</h2>
      
      <div className="space-y-6">
        {menuSections.map((section) => (
          <Collapsible 
            key={section.id}
            open={expandedSections[section.id]}
            onOpenChange={() => toggleSection(section.id)}
            className="border rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger asChild>
              <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-medium text-brasserie-darkgreen">{section.title}</h3>
                <div className="text-sm text-gray-500">
                  {section.items.length} articles
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Prix actuel</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                          {item.tag && (
                            <span className={`ml-2 inline-block text-xs px-2 py-1 rounded-full ${
                              item.tag === 'Végétarien' 
                                ? 'bg-green-100 text-green-800' 
                                : item.tag === 'Signature' 
                                  ? 'bg-brasserie-gold/20 text-brasserie-darkgreen' 
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.tag}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs text-sm text-gray-600 truncate">
                          {item.description}
                        </TableCell>
                        <TableCell>
                          {item.editing ? (
                            <Input
                              type="text"
                              value={item.newPrice ?? item.price}
                              onChange={(e) => handlePriceChange(section.id, item.id, e.target.value)}
                              className="w-20 text-right"
                            />
                          ) : (
                            <span className="font-semibold">{item.price}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.editing ? (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => savePrice(section.id, item.id)}
                                disabled={isSaving}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => cancelEditing(section.id, item.id)}
                                disabled={isSaving}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleEditing(section.id, item.id)}
                              className="text-brasserie-darkgreen border-brasserie-darkgreen hover:bg-brasserie-darkgreen/10"
                            >
                              <PenLine className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-center p-2 text-sm text-gray-500 italic">
                {section.items.length} articles dans la section {section.title}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Les modifications de prix sont immédiatement répliquées sur le site public.</p>
      </div>
    </div>
  );
};
