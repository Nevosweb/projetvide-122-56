
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Utensils } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogoClick = () => {
    const now = Date.now();

    // Reset counter if more than 2 seconds since last click
    if (now - lastClickTime > 2000) {
      setLogoClickCount(1);
    } else {
      setLogoClickCount(logoClickCount + 1);
    }
    setLastClickTime(now);

    // Navigate to admin after 5 clicks
    if (logoClickCount + 1 >= 5) {
      navigate('/bord-jean');
      setLogoClickCount(0);
    }
  };

  // Function to scroll to top when navigating
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const links = [{
    name: 'Accueil',
    href: '/'
  }, {
    name: 'Présentation',
    href: '/presentation'
  }, {
    name: 'Menu',
    href: '/menu'
  }, {
    name: 'Contact',
    href: '/contact'
  }];

  return (
    <header className={cn(
      'fixed w-full top-0 left-0 z-50 transition-all duration-500 h-20 backdrop-blur-md border-b',
      isScrolled || isMobileMenuOpen 
        ? 'bg-brasserie-ivory/95 shadow-xl border-brasserie-gold/20' 
        : isHomePage ? 'bg-transparent border-transparent' : 'bg-brasserie-ivory/95 border-brasserie-gold/20'
    )}>

      
      <div className="container-custom h-full flex items-center justify-between relative">
        {/* Background decoration */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-brasserie-gold/5 via-transparent to-brasserie-gold/5 transition-opacity duration-500",
          isScrolled || isMobileMenuOpen ? "opacity-50" : isHomePage ? "opacity-0" : "opacity-50"
        )}></div>
        
        <Link 
          to="/" 
          onClick={(e) => { handleLogoClick(); scrollToTop(); }} 
          className={cn(
            "relative z-10 group flex items-center space-x-3 transition-all duration-300",
            isScrolled || isMobileMenuOpen 
              ? "text-brasserie-darkgreen hover:text-brasserie-gold" 
              : isHomePage ? "text-white hover:text-brasserie-gold" : "text-brasserie-darkgreen hover:text-brasserie-gold"
          )}
        >
          <div className="relative">
            <Utensils className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 bg-brasserie-gold/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
          </div>
          <div className="flex flex-col">
             <span className="text-2xl font-playfair font-bold leading-tight group-hover:scale-105 transition-transform duration-300">
               Brasserie de Jean
             </span>
             <span className={cn(
                "text-xs font-light tracking-wider uppercase transition-all duration-300",
                isScrolled || isMobileMenuOpen 
                  ? "text-brasserie-gold opacity-80" 
                  : isHomePage ? "text-brasserie-gold/80 opacity-60" : "text-brasserie-gold opacity-80"
              )}>
               Tradition & Saveurs
             </span>
           </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center relative z-10">
          <nav className="flex items-center space-x-8 mr-6">
            {links.map((link, index) => (
              <Link 
                key={link.href} 
                to={link.href} 
                onClick={scrollToTop}
                className={cn(
                   'relative text-sm font-medium transition-all duration-300 py-2 px-3 rounded-lg group',
                   location.pathname === link.href 
                     ? 'text-brasserie-gold font-semibold bg-brasserie-gold/10' 
                     : isScrolled || isMobileMenuOpen
                       ? 'text-brasserie-darkgreen hover:text-brasserie-gold hover:bg-brasserie-gold/5'
                       : isHomePage ? 'text-white hover:text-brasserie-gold hover:bg-white/10' : 'text-brasserie-darkgreen hover:text-brasserie-gold hover:bg-brasserie-gold/5'
                 )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-200">
                  {link.name}
                </span>
                <div className={cn(
                  'absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-brasserie-gold transition-all duration-300',
                  location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                )}></div>
                {/* Hover background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brasserie-gold/10 to-brasserie-gold/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100"></div>
              </Link>
            ))}
          </nav>
          
          <Link to="/reservation" onClick={scrollToTop} className="group">
             <Button className={cn(
               "rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden",
               isScrolled || isMobileMenuOpen
                 ? "bg-gradient-to-r from-brasserie-gold to-brasserie-gold/90 hover:from-brasserie-gold/90 hover:to-brasserie-gold text-white"
                 : isHomePage ? "bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 backdrop-blur-sm" : "bg-gradient-to-r from-brasserie-gold to-brasserie-gold/90 hover:from-brasserie-gold/90 hover:to-brasserie-gold text-white"
             )}>
              <span className="relative z-10 flex items-center space-x-2">
                <span>Réserver</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className={cn(
             "lg:hidden relative z-10 p-4 min-h-[52px] min-w-[52px] flex items-center justify-center transition-all duration-500 ease-out hover:scale-110 rounded-2xl hover:shadow-2xl active:scale-95 border-2 backdrop-blur-md group overflow-hidden",
             isMobileMenuOpen 
               ? "bg-gradient-to-br from-brasserie-gold/30 to-brasserie-gold/20 border-brasserie-gold/50 shadow-2xl text-white" 
               : isScrolled
                 ? "text-brasserie-darkgreen hover:bg-gradient-to-br hover:from-brasserie-gold/20 hover:to-brasserie-gold/10 border-brasserie-gold/30 hover:border-brasserie-gold/50"
                 : isHomePage ? "text-white hover:bg-white/20 border-white/30 hover:border-white/50" : "text-brasserie-darkgreen hover:bg-gradient-to-br hover:from-brasserie-gold/20 hover:to-brasserie-gold/10 border-brasserie-gold/30 hover:border-brasserie-gold/50"
           )} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brasserie-gold/20 via-brasserie-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100 rounded-2xl"></div>
          
          {/* Pulse effect */}
          <div className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-1000",
            isMobileMenuOpen ? "animate-pulse bg-brasserie-gold/10" : ""
          )}></div>
          
          <div className="relative z-10 flex items-center justify-center">
            {isMobileMenuOpen ? (
              <X size={26} className="transform rotate-0 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Menu size={26} className="transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500" />
            )}
          </div>
        </button>

        {/* Mobile Navigation Menu */}
        <div className={cn(
          "lg:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-brasserie-ivory via-brasserie-beige to-brasserie-ivory shadow-2xl border-b-2 border-brasserie-gold/30 transition-all duration-700 ease-out transform",
          isMobileMenuOpen 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 -translate-y-8 scale-95 pointer-events-none"
        )}>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brasserie-gold to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-brasserie-gold/5 via-transparent to-brasserie-gold/10 opacity-50"></div>
          <div className="container-custom py-6 px-4 flex flex-col space-y-3">
            
            {links.map((link, index) => (
              <button 
                key={link.href}
                onClick={() => {
                  navigate(link.href);
                  setTimeout(() => {
                    setIsMobileMenuOpen(false);
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                  }, 150);
                }}
                className={cn(
                  "font-medium px-5 py-4 min-h-[52px] text-left flex items-center rounded-2xl transition-all duration-300 border backdrop-blur-sm group relative overflow-hidden transform",
                  isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
                  location.pathname === link.href 
                    ? "bg-gradient-to-r from-brasserie-gold/40 to-brasserie-gold/30 text-brasserie-darkgreen border-brasserie-gold/40 shadow-lg font-semibold" 
                    : "hover:bg-gradient-to-r hover:from-brasserie-gold/25 hover:to-brasserie-gold/15 text-brasserie-darkgreen hover:text-brasserie-darkgreen border-brasserie-darkgreen/15 hover:border-brasserie-gold/30"
                )}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
              </button>
            ))}
            
            {/* Bouton Réserver avec animation */}
            <button 
              onClick={() => {
                navigate('/reservation');
                setTimeout(() => {
                  setIsMobileMenuOpen(false);
                  window.scrollTo(0, 0);
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                }, 150);
              }}
              className={cn(
                "font-semibold px-6 py-4 min-h-[52px] rounded-2xl transition-all duration-300 border backdrop-blur-sm group relative overflow-hidden transform bg-gradient-to-r from-brasserie-gold to-brasserie-gold/90 text-white border-brasserie-gold/50 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
                isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              )}
              style={{ 
                transitionDelay: `${links.length * 100 + 200}ms`,
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">Réserver</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
