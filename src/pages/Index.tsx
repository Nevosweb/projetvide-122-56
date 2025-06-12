
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Hero } from "@/components/Hero";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Sparkles, ChefHat, Utensils, Award, Heart } from "lucide-react";

const Index = () => {
  const [isVisible, setIsVisible] = useState({
    about: false,
    specialties: false,
    testimonials: false
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
            const sectionName = entry.target.getAttribute('data-section');
            if (sectionName) {
              setIsVisible(prev => ({ ...prev, [sectionName]: true }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <MainLayout>
      <Hero />
      
      {/* About Section with Enhanced Design */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-white via-brasserie-beige/20 to-white relative overflow-hidden" data-section="about">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute top-20 left-10 text-brasserie-gold animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <ChefHat size={40} />
          </div>
          <div 
            className="absolute top-40 right-20 text-brasserie-gold animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.15}px)`, animationDelay: '1s' }}
          >
            <Utensils size={36} />
          </div>
          <div 
            className="absolute bottom-20 left-1/4 text-brasserie-gold animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.08}px)`, animationDelay: '2s' }}
          >
            <Star size={32} />
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <Star className="text-brasserie-gold" size={24} />
                  <h2 className="font-playfair text-4xl md:text-5xl font-bold text-brasserie-darkgreen">Une cuisine française authentique</h2>
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-brasserie-gold via-yellow-400 to-brasserie-gold rounded-full"></div>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Au cœur du <span className="font-semibold text-brasserie-darkgreen">8ème arrondissement de Paris</span>, la Brasserie de Jean vous propose une cuisine française traditionnelle revisitée, mettant à l'honneur des <span className="font-semibold text-brasserie-darkgreen">produits locaux</span> sélectionnés avec soin.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-semibold text-brasserie-darkgreen">Théo et sa brigade</span> vous invitent à découvrir leurs créations culinaires dans une ambiance conviviale et élégante, où chaque plat est préparé avec <span className="font-semibold text-brasserie-darkgreen">passion et authenticité</span>.
                </p>
              </div>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild className="bg-brasserie-darkgreen hover:bg-brasserie-darkgreen/90 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/presentation" onClick={scrollToTop}>
                    <Award className="mr-2" size={18} />
                    En savoir plus
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-brasserie-gold text-brasserie-darkgreen hover:bg-brasserie-gold hover:text-white px-8 py-3 rounded-xl transition-all duration-300">
                  <Link to="/menu" onClick={scrollToTop}>
                    <Utensils className="mr-2" size={18} />
                    Notre menu
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-brasserie-gold/20 to-brasserie-darkgreen/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <img 
                  alt="Chef préparant un plat" 
                  className="relative rounded-2xl shadow-2xl object-cover h-[500px] w-full group-hover:scale-105 transition-transform duration-500" 
                  src="/lovable-uploads/36db3628-0f12-40f3-8ebd-053549afd711.jpg" 
                />
                
                {/* Enhanced Badge */}
                <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-brasserie-gold to-yellow-500 text-white p-8 rounded-2xl shadow-2xl hover:shadow-brasserie-gold/30 transition-all duration-300 group-hover:scale-110">
                  <div className="flex items-center gap-3 mb-2">
                    <ChefHat className="text-white" size={24} />
                    <p className="font-playfair font-bold text-xl">Cuisine ouverte</p>
                  </div>
                  <p className="text-white/90 font-medium">Du frais, du fait maison</p>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={12} className="fill-white text-white" />
                    ))}
                  </div>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-brasserie-gold/20">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brasserie-darkgreen">15+</p>
                    <p className="text-sm text-gray-600 font-medium">Années d'expérience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Specialties Section with Enhanced Design */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-brasserie-darkgreen via-brasserie-darkgreen/95 to-brasserie-darkgreen text-white relative overflow-hidden" data-section="specialties">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-10 right-10 text-brasserie-gold animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            <Sparkles size={48} />
          </div>
          <div 
            className="absolute bottom-20 left-20 text-brasserie-gold animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.08}px)`, animationDelay: '1.5s' }}
          >
            <Award size={40} />
          </div>
          <div 
            className="absolute top-1/2 left-10 text-brasserie-gold animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.06}px)`, animationDelay: '3s' }}
          >
            <Heart size={36} />
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible.specialties ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-brasserie-gold to-transparent"></div>
              <ChefHat className="text-brasserie-gold" size={40} />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-brasserie-gold to-transparent"></div>
            </div>
            
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">Nos Spécialités</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-brasserie-gold via-yellow-400 to-brasserie-gold mx-auto rounded-full mb-8"></div>
            
            <p className="text-xl max-w-3xl mx-auto text-white/90 leading-relaxed">
              Découvrez nos <span className="font-semibold text-brasserie-gold">plats signatures</span> qui ont fait la réputation de la Brasserie de Jean, élaborés à partir des <span className="font-semibold text-brasserie-gold">meilleurs produits du terroir français</span>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className={`group transition-all duration-1000 delay-200 ${isVisible.specialties ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative bg-gradient-to-br from-brasserie-darkgreen/80 to-brasserie-darkgreen/60 p-8 rounded-2xl border border-brasserie-gold/40 hover:border-brasserie-gold/70 transition-all duration-300 hover:shadow-2xl hover:shadow-brasserie-gold/20 group-hover:scale-105">
                <div className="absolute top-4 right-4 text-brasserie-gold/30 group-hover:text-brasserie-gold/60 transition-colors">
                  <Utensils size={32} />
                </div>
                
                <div className="mb-4">
                  <div className="w-12 h-12 bg-brasserie-gold/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-brasserie-gold/30 transition-colors">
                    <ChefHat className="text-brasserie-gold" size={24} />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold mb-4 text-white group-hover:text-brasserie-gold transition-colors">Viandes Françaises</h3>
                </div>
                
                <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors">
                  Des viandes sélectionnées auprès des <span className="font-semibold text-brasserie-gold">meilleurs éleveurs français</span>, cuites à la perfection selon vos préférences.
                </p>
                
                <div className="mt-6 flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={14} className="fill-brasserie-gold text-brasserie-gold" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`group transition-all duration-1000 delay-400 ${isVisible.specialties ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative bg-gradient-to-br from-brasserie-darkgreen/80 to-brasserie-darkgreen/60 p-8 rounded-2xl border border-brasserie-gold/40 hover:border-brasserie-gold/70 transition-all duration-300 hover:shadow-2xl hover:shadow-brasserie-gold/20 group-hover:scale-105">
                <div className="absolute top-4 right-4 text-brasserie-gold/30 group-hover:text-brasserie-gold/60 transition-colors">
                  <Sparkles size={32} />
                </div>
                
                <div className="mb-4">
                  <div className="w-12 h-12 bg-brasserie-gold/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-brasserie-gold/30 transition-colors">
                    <Star className="text-brasserie-gold" size={24} />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold mb-4 text-white group-hover:text-brasserie-gold transition-colors">Poissons de Saison</h3>
                </div>
                
                <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors">
                  Des poissons frais en fonction des arrivages, préparés avec <span className="font-semibold text-brasserie-gold">délicatesse</span> pour en préserver toutes les saveurs.
                </p>
                
                <div className="mt-6 flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={14} className="fill-brasserie-gold text-brasserie-gold" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`group transition-all duration-1000 delay-600 ${isVisible.specialties ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative bg-gradient-to-br from-brasserie-darkgreen/80 to-brasserie-darkgreen/60 p-8 rounded-2xl border border-brasserie-gold/40 hover:border-brasserie-gold/70 transition-all duration-300 hover:shadow-2xl hover:shadow-brasserie-gold/20 group-hover:scale-105">
                <div className="absolute top-4 right-4 text-brasserie-gold/30 group-hover:text-brasserie-gold/60 transition-colors">
                  <Heart size={32} />
                </div>
                
                <div className="mb-4">
                  <div className="w-12 h-12 bg-brasserie-gold/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-brasserie-gold/30 transition-colors">
                    <Award className="text-brasserie-gold" size={24} />
                  </div>
                  <h3 className="font-playfair text-2xl font-bold mb-4 text-white group-hover:text-brasserie-gold transition-colors">Desserts Maison</h3>
                </div>
                
                <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors">
                  Des créations sucrées élaborées sur place par notre <span className="font-semibold text-brasserie-gold">chef pâtissier</span>, alliant tradition et créativité.
                </p>
                
                <div className="mt-6 flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={14} className="fill-brasserie-gold text-brasserie-gold" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className={`text-center mt-16 transition-all duration-1000 delay-800 ${isVisible.specialties ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button asChild size="lg" className="bg-gradient-to-r from-brasserie-gold to-yellow-500 hover:from-brasserie-gold/90 hover:to-yellow-500/90 border-none px-10 py-4 rounded-xl shadow-2xl hover:shadow-brasserie-gold/30 transition-all duration-300 text-lg font-semibold">
              <Link to="/menu" onClick={scrollToTop}>
                <Utensils className="mr-3" size={20} />
                Découvrir notre menu
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <PhotoGallery />
      
      {/* Testimonials Section with Enhanced Design */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden" data-section="testimonials">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute top-20 right-20 text-brasserie-gold animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.04}px)` }}
          >
            <Heart size={60} />
          </div>
          <div 
            className="absolute bottom-32 left-16 text-brasserie-gold animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.07}px)`, animationDelay: '2s' }}
          >
            <Star size={48} />
          </div>
          <div 
            className="absolute top-1/3 right-1/4 text-brasserie-gold animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.05}px)`, animationDelay: '4s' }}
          >
            <Sparkles size={40} />
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-brasserie-gold to-transparent"></div>
              <Heart className="text-brasserie-gold" size={40} />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-brasserie-gold to-transparent"></div>
            </div>
            
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-brasserie-darkgreen">Témoignages</h2>
            <div className="w-32 h-1 bg-gradient-to-r from-brasserie-gold via-yellow-400 to-brasserie-gold mx-auto rounded-full mb-8"></div>
            
            <p className="text-xl max-w-3xl mx-auto text-gray-700 leading-relaxed">
              Découvrez ce que nos clients pensent de leur <span className="font-semibold text-brasserie-gold">expérience exceptionnelle</span> à la Brasserie de Jean.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className={`group transition-all duration-1000 delay-200 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brasserie-gold/30 group-hover:scale-105">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-brasserie-gold to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star size={20} className="text-white fill-white" />
                </div>
                
                <div className="flex mb-6 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={20} className="fill-brasserie-gold text-brasserie-gold mx-0.5" />
                  ))}
                </div>
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brasserie-gold/20 to-yellow-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="text-brasserie-gold" size={28} />
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 text-center leading-relaxed italic text-lg">
                  "Une <span className="font-semibold text-brasserie-gold">soirée exceptionnelle</span> ! La côte de bœuf était parfaitement cuite et le service impeccable. Une valeur sûre dans le quartier."
                </p>
                
                <div className="text-center">
                  <div className="font-bold text-brasserie-darkgreen text-lg">Michel R.</div>
                  <div className="text-sm text-gray-500 mt-1">Client fidèle</div>
                </div>
              </div>
            </div>
            
            <div className={`group transition-all duration-1000 delay-400 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brasserie-gold/30 group-hover:scale-105">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-brasserie-gold to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Award size={20} className="text-white" />
                </div>
                
                <div className="flex mb-6 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={20} className="fill-brasserie-gold text-brasserie-gold mx-0.5" />
                  ))}
                </div>
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brasserie-gold/20 to-yellow-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="text-brasserie-gold" size={28} />
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 text-center leading-relaxed italic text-lg">
                  "J'ai découvert cet endroit la semaine dernière et j'y suis déjà retournée ! Les produits sont <span className="font-semibold text-brasserie-gold">frais</span> et la carte des vins excellente."
                </p>
                
                <div className="text-center">
                  <div className="font-bold text-brasserie-darkgreen text-lg">Sophie L.</div>
                  <div className="text-sm text-gray-500 mt-1">Amatrice de cuisine</div>
                </div>
              </div>
            </div>
            
            <div className={`group transition-all duration-1000 delay-600 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-brasserie-gold/30 group-hover:scale-105">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-brasserie-gold to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Heart size={20} className="text-white fill-white" />
                </div>
                
                <div className="flex mb-6 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={20} className="fill-brasserie-gold text-brasserie-gold mx-0.5" />
                  ))}
                </div>
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brasserie-gold/20 to-yellow-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Award className="text-brasserie-gold" size={28} />
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 text-center leading-relaxed italic text-lg">
                  "L'ambiance bistrot chic est parfaite pour un dîner d'affaires ou un repas entre amis. Le <span className="font-semibold text-brasserie-gold">poisson du jour</span> était délicieux !"
                </p>
                
                <div className="text-center">
                  <div className="font-bold text-brasserie-darkgreen text-lg">Thomas B.</div>
                  <div className="text-sm text-gray-500 mt-1">Homme d'affaires</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>;
};
export default Index;
