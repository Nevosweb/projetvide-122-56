
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Phone, Clock, Users } from "lucide-react";

export const ReservationBanner = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative bg-gradient-to-r from-brasserie-darkgreen to-brasserie-darkgreen/90 py-12 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-10 animate-pulse">
          <Users className="w-8 h-8 text-brasserie-gold" />
        </div>
        <div className="absolute top-8 right-16 animate-pulse delay-1000">
          <Clock className="w-6 h-6 text-brasserie-gold" />
        </div>
        <div className="absolute bottom-6 left-20 animate-pulse delay-500">
          <Calendar className="w-7 h-7 text-brasserie-gold" />
        </div>
        <div className="absolute bottom-4 right-12 animate-pulse delay-700">
          <Phone className="w-5 h-5 text-brasserie-gold" />
        </div>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brasserie-darkgreen/20"></div>
      
      <div className="container-custom text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Title with icon */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-brasserie-gold/20 rounded-full">
              <Calendar className="w-6 h-6 text-brasserie-gold" />
            </div>
            <h2 className="heading-md text-white">Réservez votre table</h2>
          </div>
          
          {/* Enhanced description */}
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
            Pour garantir votre table à la Brasserie de Jean, nous vous invitons à réserver en ligne ou par téléphone.
          </p>
          
          {/* Action buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-brasserie-gold hover:bg-brasserie-gold/90 border-none text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            >
              <Link to="/reservation" onClick={scrollToTop} className="flex items-center gap-2">
                <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Réserver en ligne
              </Link>
            </Button>
            
            <div className="flex items-center gap-2 text-white/60">
              <div className="h-px bg-white/30 w-8"></div>
              <span className="text-sm font-medium">ou</span>
              <div className="h-px bg-white/30 w-8"></div>
            </div>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/80 bg-transparent text-white hover:bg-white hover:text-brasserie-darkgreen font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            >
              <a href="tel:0142252800" className="flex items-center gap-2">
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                01 42 25 28 00
              </a>
            </Button>
          </div>
          
          {/* Additional info */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brasserie-gold" />
              <span>Service continu</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brasserie-gold" />
              <span>Groupes bienvenus</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brasserie-gold" />
              <span>Ouvert 7j/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
