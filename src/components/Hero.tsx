
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: 'url(https://media.gqmagazine.fr/photos/66549cea3c069b5df3caa1eb/16:9/w_2560%2Cc_limit/Digital%2520BD-Tables-MaisonRusse-Jardin-220526-009.jpg)',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="container-custom relative z-10 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="heading-xl mb-4 text-white animate-fade-in">
            Brasserie de Jean
          </h1>
          <div className="gold-divider"></div>
          <p className="text-lg md:text-xl mt-6 opacity-90 mb-8 font-light">
            Une cuisine française authentique au cœur de Paris, mettant en valeur 
            des produits locaux et des saveurs traditionnelles revisitées.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-brasserie-gold hover:bg-brasserie-gold/90 border-none">
              <Link to="/reservation">Réserver une table</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-black bg-white hover:bg-white hover:text-black">
              <Link to="/menu">Découvrir notre menu</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
