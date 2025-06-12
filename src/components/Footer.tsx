
import { MapPin, Phone, Mail, Clock, ArrowUp, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const contactInfo = [
    { icon: MapPin, text: "155 rue Faubourg Saint-Honoré, 75008 Paris", delay: "0ms" },
    { icon: Phone, text: "01 42 25 28 00", delay: "100ms" },
    { icon: Mail, text: "Jdeo.unity@gmail.com", delay: "200ms" },
    { icon: Clock, text: "Tous les jours : 12h - 15h / 19h - 23h", delay: "300ms" }
  ];

  const navigationLinks = [
    { name: "Accueil", path: "/" },
    { name: "Présentation", path: "/presentation" },
    { name: "Menu", path: "/menu" },
    { name: "Contact", path: "/contact" },
    { name: "Réservation", path: "/reservation" }
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" }
  ];

  return (
    <footer className="bg-gradient-to-br from-brasserie-darkgreen via-brasserie-darkgreen to-slate-800 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-brasserie-gold rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-brasserie-gold rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Section Contact */}
          <div 
            className="md:col-span-2 transform transition-all duration-500 hover:scale-105"
            onMouseEnter={() => setHoveredSection('contact')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="group">
              <h3 className="text-2xl font-playfair font-bold mb-6 text-brasserie-gold relative">
                Brasserie de Jean
                <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brasserie-gold transition-all duration-500 group-hover:w-full"></div>
              </h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div 
                      key={index}
                      className="flex items-start gap-3 group/item transform transition-all duration-300 hover:translate-x-2"
                      style={{ animationDelay: item.delay }}
                    >
                      <div className="p-2 rounded-lg bg-brasserie-gold/10 group-hover/item:bg-brasserie-gold/20 transition-all duration-300">
                        <IconComponent size={18} className="text-brasserie-gold group-hover/item:scale-110 transition-transform duration-300"/>
                      </div>
                      <span className="text-gray-200 group-hover/item:text-white transition-colors duration-300 leading-relaxed">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Section Navigation */}
          <div 
            className="transform transition-all duration-500 hover:scale-105"
            onMouseEnter={() => setHoveredSection('navigation')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="group">
              <h3 className="text-xl font-playfair font-semibold mb-6 text-brasserie-gold relative">
                Navigation
                <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brasserie-gold transition-all duration-500 group-hover:w-full"></div>
              </h3>
              <ul className="space-y-3">
                {navigationLinks.map((link, index) => (
                  <li key={link.path} className="transform transition-all duration-300" style={{ transitionDelay: `${index * 50}ms` }}>
                    <Link 
                      to={link.path} 
                      className="group/link flex items-center gap-2 hover:text-brasserie-gold transition-all duration-300 hover:translate-x-2 py-1" 
                      onClick={scrollToTop}
                    >
                      <div className="w-0 h-0.5 bg-brasserie-gold transition-all duration-300 group-hover/link:w-4"></div>
                      <span className="relative">
                        {link.name}
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brasserie-gold transition-all duration-300 group-hover/link:w-full"></div>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Section Horaires */}
          <div 
            className="transform transition-all duration-500 hover:scale-105"
            onMouseEnter={() => setHoveredSection('hours')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="group">
              <h3 className="text-xl font-playfair font-semibold mb-6 text-brasserie-gold relative">
                Horaires
                <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brasserie-gold transition-all duration-500 group-hover:w-full"></div>
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-brasserie-gold/30 transition-all duration-300">
                  <p className="font-semibold text-brasserie-gold">Lundi - Dimanche</p>
                  <p className="text-sm text-gray-300 mt-1">Déjeuner : 12h - 15h</p>
                  <p className="text-sm text-gray-300">Dîner : 19h - 23h</p>
                </div>
                <div className="p-3 rounded-lg bg-brasserie-gold/10 border border-brasserie-gold/20 hover:bg-brasserie-gold/20 transition-all duration-300">
                  <p className="text-brasserie-gold font-medium">✨ Service continu le weekend</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section Réseaux sociaux */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <span className="text-gray-300 font-medium">Suivez-nous :</span>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="group p-3 rounded-full bg-white/5 hover:bg-brasserie-gold/20 border border-white/10 hover:border-brasserie-gold/50 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <IconComponent size={20} className="text-gray-300 group-hover:text-brasserie-gold transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
            
            {/* Bouton scroll to top */}
            {isVisible && (
              <button
                onClick={scrollToTop}
                className="group p-3 rounded-full bg-brasserie-gold hover:bg-brasserie-gold/90 text-brasserie-darkgreen shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                aria-label="Retour en haut"
              >
                <ArrowUp size={20} className="group-hover:scale-110 transition-transform duration-300" />
              </button>
            )}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-300">
            © {new Date().getFullYear()} Brasserie de Jean. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
