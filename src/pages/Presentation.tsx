import { MainLayout } from '@/layouts/MainLayout';
import { useState, useEffect } from 'react';
import { ChefHat, Award, Users, Clock, Star, Heart, Utensils } from 'lucide-react';

const Presentation = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    histoire: false,
    philosophie: false,
    equipe: false,
    galerie: false
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setIsVisible(prev => ({ ...prev, [sectionId]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observer les sections
    const sections = ['hero', 'histoire', 'philosophie', 'equipe', 'galerie'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Users, number: "10000+", label: "Clients satisfaits", delay: "0ms" },
    { icon: Award, number: "8", label: "Années d'expérience", delay: "200ms" },
    { icon: ChefHat, number: "15", label: "Plats signature", delay: "400ms" },
    { icon: Star, number: "4.8", label: "Note moyenne", delay: "600ms" }
  ];

  return <MainLayout>
      {/* Hero Section avec parallaxe */}
      <section className="relative py-32 bg-gradient-to-br from-brasserie-beige via-brasserie-lightbeige to-brasserie-ivory overflow-hidden">
        {/* Éléments décoratifs animés */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-20 left-10 w-64 h-64 bg-brasserie-gold rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div 
            className="absolute bottom-20 right-20 w-48 h-48 bg-brasserie-darkgreen rounded-full blur-2xl animate-pulse"
            style={{ transform: `translateY(${scrollY * -0.2}px)`, animationDelay: "2s" }}
          ></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-brasserie-gold/30">
              <Heart className="w-5 h-5 text-brasserie-gold animate-pulse" />
              <span className="text-brasserie-darkgreen font-medium">Depuis 2015</span>
            </div>
            <h1 className="heading-xl text-brasserie-darkgreen mb-6 transform transition-all duration-1000 hover:scale-105">
              Notre Histoire
            </h1>
            <div className="gold-divider mx-auto transform transition-all duration-700 hover:w-32"></div>
            <p className="mt-8 text-xl text-brasserie-darkgreen/80 max-w-3xl mx-auto leading-relaxed">
              Une passion culinaire qui se transmet depuis des générations dans le cœur de Paris
            </p>
          </div>
        </div>
      </section>
      
      {/* Section Histoire avec animations */}
      <section id="histoire" className="py-20 relative">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible.histoire ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="group">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-brasserie-gold/10 rounded-full">
                  <Utensils className="w-4 h-4 text-brasserie-gold" />
                  <span className="text-sm font-medium text-brasserie-darkgreen">Notre fondation</span>
                </div>
                <h2 className="heading-lg text-brasserie-darkgreen mb-6 group-hover:text-brasserie-gold transition-colors duration-300">
                  La Brasserie de Jean
                </h2>
                <div className="gold-divider !ml-0 group-hover:w-24 transition-all duration-500"></div>
                <div className="mt-8 space-y-6">
                  <p className="text-gray-700 leading-relaxed text-lg hover:text-gray-900 transition-colors duration-300">
                    Fondée en 2015 par Jean Mercier, la Brasserie de Jean s'est rapidement imposée comme une adresse incontournable dans le 8ème arrondissement de Paris. Dans ce lieu chaleureux au décor inspiré des grandes brasseries parisiennes d'antan, nous vous proposons une cuisine française authentique qui met à l'honneur les producteurs locaux.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg hover:text-gray-900 transition-colors duration-300">
                    Chaque jour, notre chef Théo et sa brigade s'appliquent à sublimer des produits frais et de saison pour vous offrir une expérience gustative mémorable, dans un cadre élégant et convivial.
                  </p>
                </div>
                
                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {stats.slice(0, 2).map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div 
                        key={index}
                        className="group/stat p-4 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-brasserie-gold/30 transition-all duration-300 hover:-translate-y-1"
                        style={{ transitionDelay: stat.delay }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brasserie-gold/10 rounded-lg group-hover/stat:bg-brasserie-gold/20 transition-colors duration-300">
                            <IconComponent className="w-5 h-5 text-brasserie-gold group-hover/stat:scale-110 transition-transform duration-300" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-brasserie-darkgreen group-hover/stat:text-brasserie-gold transition-colors duration-300">
                              {stat.number}
                            </div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={`hidden md:block transform transition-all duration-1000 delay-300 ${isVisible.histoire ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-brasserie-gold/20 to-brasserie-darkgreen/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    alt="Équipe de la Brasserie de Jean" 
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110" 
                    src="/lovable-uploads/7f130c86-3649-4b42-85b4-9e0384dd5952.png" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-xl font-playfair font-semibold mb-2">Notre équipe passionnée</h3>
                    <p className="text-sm text-white/90">Des professionnels dévoués à votre service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Philosophie avec design moderne */}
      <section id="philosophie" className="py-20 bg-gradient-to-br from-brasserie-darkgreen via-slate-800 to-brasserie-darkgreen text-white relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brasserie-gold rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: "3s" }}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className={`hidden md:block transform transition-all duration-1000 ${isVisible.philosophie ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-brasserie-gold/30 to-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1170&auto=format&fit=crop" 
                    alt="Intérieur de la Brasserie de Jean" 
                    className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brasserie-darkgreen/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-xl font-playfair font-semibold mb-2">Un cadre d'exception</h3>
                    <p className="text-sm text-white/90">L'élégance parisienne au service de votre plaisir</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible.philosophie ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="group">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-brasserie-gold/20 backdrop-blur-sm rounded-full border border-brasserie-gold/30">
                  <Heart className="w-4 h-4 text-brasserie-gold" />
                  <span className="text-sm font-medium text-brasserie-gold">Nos valeurs</span>
                </div>
                <h2 className="heading-lg mb-6 group-hover:text-brasserie-gold transition-colors duration-300">
                  Notre Philosophie
                </h2>
                <div className="gold-divider !ml-0 group-hover:w-24 transition-all duration-500"></div>
                <div className="mt-8 space-y-6">
                  <p className="text-white/90 leading-relaxed text-lg hover:text-white transition-colors duration-300">
                    Chez Brasserie de Jean, nous croyons fermement que la cuisine doit être un hommage aux producteurs et à leur savoir-faire. C'est pourquoi nous travaillons exclusivement avec des fournisseurs qui partagent nos valeurs : qualité, respect du produit et développement durable.
                  </p>
                  <p className="text-white/90 leading-relaxed text-lg hover:text-white transition-colors duration-300">
                    Nous privilégions les circuits courts et mettons un point d'honneur à connaître l'origine de chacun de nos produits. De la Maison Millas pour nos viandes d'exception aux légumes cultivés par Michaël Vial, chaque ingrédient est sélectionné avec soin pour vous garantir une expérience gustative authentique.
                  </p>
                </div>
                
                {/* Valeurs clés */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {stats.slice(2, 4).map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div 
                        key={index}
                        className="group/stat p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-brasserie-gold/50 transition-all duration-300 hover:-translate-y-1"
                        style={{ transitionDelay: stat.delay }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brasserie-gold/20 rounded-lg group-hover/stat:bg-brasserie-gold/30 transition-colors duration-300">
                            <IconComponent className="w-5 h-5 text-brasserie-gold group-hover/stat:scale-110 transition-transform duration-300" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-white group-hover/stat:text-brasserie-gold transition-colors duration-300">
                              {stat.number}
                            </div>
                            <div className="text-sm text-white/70">{stat.label}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Équipe avec cartes interactives */}
      <section id="equipe" className="py-20 bg-gradient-to-br from-brasserie-lightbeige to-white relative">
        <div className="container-custom">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.equipe ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-brasserie-gold/10 rounded-full">
              <Users className="w-4 h-4 text-brasserie-gold" />
              <span className="text-sm font-medium text-brasserie-darkgreen">Nos talents</span>
            </div>
            <h2 className="heading-lg text-brasserie-darkgreen mb-4">Notre Équipe</h2>
            <div className="gold-divider mx-auto"></div>
            <p className="mt-6 text-xl text-brasserie-darkgreen/80 max-w-2xl mx-auto">
              Des professionnels passionnés au service de votre plaisir culinaire
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                name: "Théo Martin",
                role: "Chef de Cuisine",
                image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=1000&auto=format&fit=crop",
                description: "Passionné par la cuisine depuis son plus jeune âge, Théo a travaillé dans plusieurs restaurants étoilés avant de rejoindre la Brasserie de Jean.",
                icon: ChefHat,
                delay: "0ms"
              },
              {
                name: "Marie Dubois",
                role: "Directrice de Salle",
                image: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?q=80&w=1000&auto=format&fit=crop",
                description: "Avec son expérience dans l'hôtellerie de luxe, Marie veille à ce que chaque client vive une expérience inoubliable à la Brasserie de Jean.",
                icon: Users,
                delay: "200ms"
              },
              {
                name: "Philippe Leroux",
                role: "Sommelier",
                image: "/lovable-uploads/fe971eb5-22ce-4bf2-a267-e80e8146d4c4.jpg",
                description: "Expert en vins et spiritueux, Philippe saura vous conseiller le meilleur accord mets-vins pour sublimer votre repas.",
                icon: Award,
                delay: "400ms"
              }
            ].map((member, index) => {
              const IconComponent = member.icon;
              return (
                <div 
                  key={index}
                  className={`group transform transition-all duration-1000 hover:-translate-y-2 ${isVisible.equipe ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: member.delay }}
                >
                  <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-brasserie-gold/30">
                    {/* Effet de fond au survol */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brasserie-gold/5 to-brasserie-darkgreen/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative p-8">
                      {/* Photo avec animations */}
                      <div className="relative mb-6 mx-auto w-32 h-32 overflow-hidden rounded-full border-4 border-brasserie-gold/20 group-hover:border-brasserie-gold transition-all duration-500">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-brasserie-darkgreen/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Informations */}
                      <div className="text-center">
                        <h3 className="font-playfair text-xl font-bold mb-2 text-brasserie-darkgreen group-hover:text-brasserie-gold transition-colors duration-300">
                          {member.name}
                        </h3>
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-brasserie-gold/10 rounded-full group-hover:bg-brasserie-gold/20 transition-colors duration-300">
                          <IconComponent className="w-4 h-4 text-brasserie-gold" />
                          <p className="text-sm font-medium text-brasserie-gold">{member.role}</p>
                        </div>
                        <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                          {member.description}
                        </p>
                      </div>
                      
                      {/* Décoration */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-brasserie-gold/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                        <Star className="w-4 h-4 text-brasserie-gold" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Section Galerie avec grille moderne */}
      <section id="galerie" className="py-20 bg-gradient-to-br from-brasserie-beige via-brasserie-lightbeige to-brasserie-ivory relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-brasserie-gold rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-brasserie-darkgreen rounded-full blur-2xl animate-pulse" style={{ animationDelay: "4s" }}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible.galerie ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-brasserie-gold/10 rounded-full">
              <Clock className="w-4 h-4 text-brasserie-gold" />
              <span className="text-sm font-medium text-brasserie-darkgreen">Notre univers</span>
            </div>
            <h2 className="heading-lg text-brasserie-darkgreen mb-4">Notre Salle</h2>
            <div className="gold-divider mx-auto"></div>
            <p className="mt-6 text-xl text-brasserie-darkgreen/80 max-w-3xl mx-auto leading-relaxed">
              Découvrez notre espace chaleureux et élégant, conçu pour vous offrir une expérience culinaire inoubliable dans un cadre raffiné.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                src: "/lovable-uploads/223d3797-eb16-4657-aa9e-f7d51246aed2.png",
                alt: "Salle principale",
                title: "Salle principale",
                description: "Un espace convivial et élégant",
                delay: "0ms",
                size: "normal"
              },
              {
                src: "/lovable-uploads/f5f76986-a7d6-4de4-9231-ac0f4138829e.jpg",
                alt: "Espace bar",
                title: "Espace bar",
                description: "Pour vos apéritifs et moments détente",
                delay: "100ms",
                size: "normal"
              },
              {
                src: "/lovable-uploads/799a8ec1-5b79-498c-9b4f-b508b74400a2.png",
                alt: "Table dressée",
                title: "Art de la table",
                description: "Un dressage soigné pour chaque service",
                delay: "200ms",
                size: "large"
              },
              {
                src: "/lovable-uploads/a767eeb3-8c1b-4f4c-82ac-0abb4657cff2.png",
                alt: "Cuisine ouverte",
                title: "Cuisine ouverte",
                description: "Observez nos chefs à l'œuvre",
                delay: "300ms",
                size: "normal"
              },
              {
                src: "/lovable-uploads/9c3a8fd3-0670-437d-a2fd-1b02262028eb.jpg",
                alt: "Espace privé",
                title: "Salon privé",
                description: "Pour vos événements intimes",
                delay: "400ms",
                size: "normal"
              },
              {
                src: "/lovable-uploads/8304ff5a-6c5f-4362-afe7-714cd0624f6a.png",
                alt: "Détail de décoration",
                title: "Décoration raffinée",
                description: "Chaque détail compte",
                delay: "500ms",
                size: "normal"
              }
            ].map((image, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 ${
                  image.size === 'large' ? 'md:col-span-2 lg:col-span-1' : ''
                } ${isVisible.galerie ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: image.delay }}
              >
                {/* Image avec overlay */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img 
                    alt={image.alt} 
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" 
                    src={image.src} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Contenu au survol */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-xl font-playfair font-semibold mb-2">{image.title}</h3>
                    <p className="text-sm text-white/90">{image.description}</p>
                  </div>
                  
                  {/* Icône décorative */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                {/* Bordure animée */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-brasserie-gold/50 rounded-2xl transition-all duration-500"></div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </MainLayout>;
};
export default Presentation;