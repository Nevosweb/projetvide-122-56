
import { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChefHat, Leaf, Star, Award } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  tag: string | null;
  display_order: number;
}

interface MenuSection {
  id: string;
  title: string;
  display_order: number;
  items: MenuItem[];
}

const Menu = () => {
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    menu: false,
    producers: false
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setIsVisible(prev => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = ['hero', 'menu', 'producers'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
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
          const items = itemData.filter(item => item.section_id === section.id);
          return {
            ...section,
            items,
          };
        });
        
        setMenuSections(sections);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setError("Impossible de charger les données du menu. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();

    // Set up real-time subscription to update menu when prices change
    const channel = supabase
      .channel('menu-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'menu_items' },
        (payload) => {
          console.log('Menu item updated:', payload);
          // Update the specific item in state without refetching everything
          if (payload.new && payload.new.id) {
            setMenuSections(currentSections => 
              currentSections.map(section => ({
                ...section,
                items: section.items.map(item => 
                  item.id === payload.new.id ? { ...item, ...payload.new } : item
                )
              }))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
      <MainLayout>
      {/* Hero Section avec parallax */}
      <section 
        id="hero"
        className="relative py-16 md:py-32 bg-gradient-to-br from-brasserie-beige via-brasserie-beige/90 to-brasserie-gold/20 overflow-hidden"
      >
        {/* Éléments décoratifs animés */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-10 md:top-20 left-5 md:left-10 w-24 md:w-32 h-24 md:h-32 bg-brasserie-gold rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div 
            className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-32 md:w-48 h-32 md:h-48 bg-brasserie-darkgreen rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          ></div>
        </div>

        <div className="container-custom relative z-10 px-4">
          <div className={`text-center transform transition-all duration-1000 ${
            isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* Icône chef animée */}
            <div className="inline-flex items-center justify-center w-16 md:w-20 h-16 md:h-20 bg-brasserie-gold rounded-full mb-6 md:mb-8 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <ChefHat className="w-8 md:w-10 h-8 md:h-10 text-brasserie-darkgreen" />
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl text-brasserie-darkgreen mb-4 md:mb-6 font-playfair font-bold">
              <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Notre</span>
              <span className="inline-block ml-2 md:ml-4 animate-fade-in-up text-brasserie-gold" style={{ animationDelay: '0.4s' }}>Menu</span>
            </h1>
            
            <div className="gold-divider animate-fade-in-up" style={{ animationDelay: '0.6s' }}></div>
            
            <p className="mt-6 md:mt-8 max-w-3xl mx-auto text-base md:text-lg text-gray-700 leading-relaxed animate-fade-in-up px-4" style={{ animationDelay: '0.8s' }}>
              Découvrez notre sélection de plats préparés avec des produits frais et de saison par notre Chef Théo et sa brigade. 
              Une cuisine française authentique qui célèbre les saveurs et les traditions.
            </p>
            
            {/* Statistiques animées */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12 max-w-2xl mx-auto px-4">
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
                <div className="text-2xl md:text-3xl font-bold text-brasserie-darkgreen font-playfair">15+</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Années d'expérience</div>
              </div>
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                <div className="text-2xl md:text-3xl font-bold text-brasserie-darkgreen font-playfair">100%</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Produits frais</div>
              </div>
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
                <div className="text-2xl md:text-3xl font-bold text-brasserie-darkgreen font-playfair">6</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Producteurs locaux</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Menu */}
      <section id="menu" className="py-12 md:py-20 bg-white">
        <div className="container-custom max-w-5xl px-4">
          <div className={`bg-gradient-to-br from-white to-brasserie-beige/30 p-6 md:p-12 rounded-3xl shadow-2xl border border-brasserie-gold/20 backdrop-blur-sm transform transition-all duration-1000 ${
            isVisible.menu ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* En-tête de la carte */}
            <div className="text-center mb-8 md:mb-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brasserie-gold/10 to-transparent rounded-2xl"></div>
              <div className="relative z-10 py-6 md:py-8">
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-brasserie-darkgreen mb-3 md:mb-4">Carte</h2>
                <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-12 md:w-16 h-px bg-brasserie-gold"></div>
                  <Star className="w-5 md:w-6 h-5 md:h-6 text-brasserie-gold" />
                  <div className="w-12 md:w-16 h-px bg-brasserie-gold"></div>
                </div>
                <p className="text-gray-600 italic text-base md:text-lg">Prix nets - Service compris</p>
                <p className="text-xs md:text-sm text-gray-500 mt-2">Cuisine française authentique • Produits de saison</p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col justify-center items-center p-20">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-brasserie-darkgreen" />
                  <div className="absolute inset-0 h-12 w-12 border-2 border-brasserie-gold/30 rounded-full animate-ping"></div>
                </div>
                <p className="mt-4 text-gray-600 animate-pulse">Chargement de notre carte...</p>
              </div>
            ) : error ? (
              <div className="text-center p-10 bg-red-50 rounded-2xl border border-red-200">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-500 text-2xl">⚠</span>
                </div>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : (
              <div className="space-y-16">
                {menuSections.map((section, sectionIndex) => (
                  <div 
                    key={section.id} 
                    className={`transform transition-all duration-700 ${
                      isVisible.menu ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: `${sectionIndex * 200}ms` }}
                  >
                    {/* En-tête de section */}
                    <div className="text-center mb-8 md:mb-12 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-brasserie-darkgreen/5 via-brasserie-gold/10 to-brasserie-darkgreen/5 rounded-xl"></div>
                      <div className="relative z-10 py-4 md:py-6">
                        <h3 className="font-playfair text-2xl md:text-3xl font-bold text-brasserie-darkgreen mb-3 md:mb-4">{section.title}</h3>
                        <div className="flex items-center justify-center gap-2 md:gap-3">
                          <div className="w-8 md:w-12 h-px bg-brasserie-gold"></div>
                          <ChefHat className="w-4 md:w-5 h-4 md:h-5 text-brasserie-gold" />
                          <div className="w-8 md:w-12 h-px bg-brasserie-gold"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Items de menu */}
                    <div className="grid gap-4 md:gap-6">
                      {section.items.map((item, itemIndex) => (
                        <div 
                          key={item.id}
                          className={`group bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-gray-100 hover:border-brasserie-gold/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                            isVisible.menu ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                          }`}
                          style={{ transitionDelay: `${(sectionIndex * 200) + (itemIndex * 100)}ms` }}
                        >
                          {/* Layout mobile : vertical, desktop : horizontal */}
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                            <div className="flex-1 mb-3 md:mb-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                <h4 className="font-playfair text-lg md:text-xl font-semibold text-brasserie-darkgreen group-hover:text-brasserie-gold transition-colors duration-300 leading-tight">
                                  {item.name}
                                </h4>
                                {item.tag && (
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium self-start ${
                                    item.tag === 'Végétarien' 
                                      ? 'bg-green-100 text-green-700 border border-green-200' 
                                      : item.tag === 'Signature' 
                                        ? 'bg-brasserie-gold/20 text-brasserie-darkgreen border border-brasserie-gold/30' 
                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                                  }`}>
                                    {item.tag === 'Végétarien' && <Leaf className="w-3 h-3" />}
                                    {item.tag === 'Signature' && <Award className="w-3 h-3" />}
                                    {item.tag}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 leading-relaxed text-sm md:text-base pr-0 md:pr-4">{item.description}</p>
                            </div>
                            <div className="md:ml-6 text-left md:text-right flex-shrink-0">
                              <p className="font-playfair text-xl md:text-2xl font-bold text-brasserie-darkgreen group-hover:text-brasserie-gold transition-colors duration-300">
                                {item.price}
                              </p>
                            </div>
                          </div>
                          
                          {/* Ligne décorative */}
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-brasserie-gold/30 to-transparent group-hover:via-brasserie-gold/60 transition-all duration-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <p className="text-sm text-gray-500 italic">
                Allergènes : Nos équipes sont à votre disposition pour vous informer sur la présence d'allergènes dans nos plats.
              </p>
              <p className="text-sm text-gray-500 italic mt-1">
                Tous nos plats sont préparés sur place à partir de produits bruts.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="producers" className="py-12 md:py-16 bg-brasserie-darkgreen text-white">
        <div className="container-custom px-4">
          <div className={`text-center mb-8 md:mb-12 transform transition-all duration-1000 ${
            isVisible.producers ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
              <Leaf className="w-5 md:w-6 h-5 md:h-6 text-green-400" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-playfair">Nos Producteurs</h2>
              <Leaf className="w-5 md:w-6 h-5 md:h-6 text-green-400" />
            </div>
            <div className="gold-divider"></div>
            <p className="mt-4 md:mt-6 max-w-2xl mx-auto text-white/80 text-sm md:text-base px-4">
              Nous travaillons en étroite collaboration avec des producteurs locaux et passionnés qui nous fournissent des produits d'exception.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Maison Millas",
                type: "Viandes d'exception",
                description: "La Maison Millas sélectionne pour nous les meilleures pièces de viande issues d'élevages français respectueux du bien-être animal.",
                icon: "🥩"
              },
              {
                name: "Michaël Vial",
                type: "Maraîcher",
                description: "Installé en Île-de-France, Michaël nous fournit des légumes de saison cultivés sans pesticides et cueillis à maturité.",
                icon: "🌱"
              },
              {
                name: "Fromagerie Quatrehomme",
                type: "Fromages affinés",
                description: "Marie Quatrehomme, MOF, sélectionne pour nous des fromages fermiers provenant de petits producteurs passionnés.",
                icon: "🧀"
              },
              {
                name: "Pêcherie Morin",
                type: "Poissons et fruits de mer",
                description: "Pêche durable et de saison pour garantir la fraîcheur et préserver les ressources marines.",
                icon: "🐟"
              },
              {
                name: "Boulangerie Landemaine",
                type: "Pains artisanaux",
                description: "Des pains au levain naturel, pétris à la main et cuits au feu de bois, livrés frais chaque jour.",
                icon: "🍞"
              },
              {
                name: "Domaine de Bellevue",
                type: "Vins naturels",
                description: "Des vins issus de l'agriculture biologique et biodynamique, produits dans le respect du terroir et de la tradition.",
                icon: "🍷"
              }
            ].map((producer, index) => (
              <div 
                key={producer.name}
                className={`group bg-white/5 p-4 md:p-6 rounded-lg border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-brasserie-gold/30 transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible.producers ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xl md:text-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                    {producer.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-playfair text-lg md:text-xl font-semibold mb-1 group-hover:text-brasserie-gold transition-colors duration-300 leading-tight">
                      {producer.name}
                    </h3>
                    <p className="text-white/80 mb-2 text-xs md:text-sm font-medium">{producer.type}</p>
                  </div>
                </div>
                <p className="text-white/70 text-xs md:text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {producer.description}
                </p>
                <div className="mt-3 md:mt-4 w-full h-px bg-gradient-to-r from-transparent via-brasserie-gold/30 to-transparent group-hover:via-brasserie-gold/60 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
    </div>
  );
};

export default Menu;
