
import { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { ReservationForm } from "@/components/ReservationForm";
import { Calendar, Clock, Users, Phone, Info, Star, ChefHat, MapPin, Mail, Utensils } from "lucide-react";

const Reservation = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    form: false,
    info: false,
    contact: false
  });

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

    const sections = ['hero', 'form', 'info', 'contact'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <MainLayout showBanner={false}>
      {/* Section Hero */}
      <section 
        id="hero"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brasserie-beige via-white to-brasserie-gold/10 overflow-hidden"
      >
        {/* Éléments décoratifs de fond */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brasserie-gold rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brasserie-darkgreen rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-brasserie-gold rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center transform transition-all duration-1000 ${
            isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* Icône principale avec animation */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brasserie-gold to-brasserie-gold/80 rounded-full mb-8 shadow-2xl transform hover:scale-110 transition-all duration-300">
              <Calendar className="w-12 h-12 text-brasserie-darkgreen" />
            </div>
            
            <h1 className="text-5xl md:text-7xl text-brasserie-darkgreen mb-8 font-playfair font-bold tracking-tight">
              Réservation
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-brasserie-gold to-transparent mx-auto mb-8 rounded-full"></div>
            
            <p className="max-w-3xl mx-auto text-xl text-gray-700 leading-relaxed mb-16 font-light">
              Réservez votre table à la Brasserie de Jean et découvrez notre cuisine française authentique 
              dans un cadre élégant et raffiné. Une expérience gastronomique inoubliable vous attend.
            </p>
            
            {/* Statistiques avec design moderne */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Clock, number: "2h", text: "Réservation minimum à l'avance", color: "from-blue-500 to-blue-600" },
                { icon: Users, number: "50", text: "Places disponibles chaque service", color: "from-green-500 to-green-600" },
                { icon: Utensils, number: "7j/7", text: "Ouvert toute la semaine", color: "from-purple-500 to-purple-600" }
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-brasserie-gold/20 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-brasserie-darkgreen font-playfair mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flèche de défilement */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-brasserie-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-brasserie-gold rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
      
      {/* Section Formulaire */}
      <section id="form" className="py-20 bg-white relative">
        {/* Motif de fond subtil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className={`transform transition-all duration-1000 ${
            isVisible.form ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* En-tête de section */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-brasserie-gold"></div>
                <ChefHat className="w-8 h-8 text-brasserie-gold" />
                <h2 className="text-4xl font-bold text-brasserie-darkgreen font-playfair">Formulaire de réservation</h2>
                <ChefHat className="w-8 h-8 text-brasserie-gold" />
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-brasserie-gold"></div>
              </div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <Star className="w-5 h-5 text-brasserie-gold" />
                <Star className="w-6 h-6 text-brasserie-gold" />
                <Star className="w-5 h-5 text-brasserie-gold" />
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Remplissez le formulaire ci-dessous pour réserver votre table. 
                Notre équipe vous confirmera votre réservation dans les plus brefs délais.
              </p>
            </div>
            
            {/* Formulaire de réservation */}
            <ReservationForm />
          </div>
          
          {/* Section contact téléphonique */}
          <div className={`mt-16 transform transition-all duration-700 ${
            isVisible.form ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <div className="bg-gradient-to-r from-brasserie-darkgreen via-brasserie-darkgreen/95 to-brasserie-darkgreen p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              {/* Motif décoratif */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brasserie-gold/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Phone className="w-8 h-8 text-brasserie-gold" />
                  <h3 className="text-3xl font-playfair font-bold text-white">Réservation par téléphone</h3>
                </div>
                <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
                  Vous préférez parler à notre équipe ? Appelez-nous directement pour une réservation personnalisée
                </p>
                <a 
                  href="tel:0142252800" 
                  className="inline-flex items-center gap-3 bg-brasserie-gold hover:bg-brasserie-gold/90 text-brasserie-darkgreen font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl text-xl"
                >
                  <Phone className="w-6 h-6" />
                  <span className="font-playfair">01 42 25 28 00</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Informations importantes */}
      <section id="info" className="py-20 bg-gradient-to-br from-brasserie-darkgreen to-brasserie-darkgreen/90 relative">
        {/* Motif de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brasserie-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`transform transition-all duration-1000 ${
            isVisible.info ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Info className="w-8 h-8 text-brasserie-gold" />
                <h3 className="text-4xl font-playfair font-bold text-white">Informations importantes</h3>
                <Info className="w-8 h-8 text-brasserie-gold" />
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-20 h-px bg-gradient-to-r from-transparent to-brasserie-gold"></div>
                <Star className="w-6 h-6 text-brasserie-gold" />
                <div className="w-20 h-px bg-gradient-to-l from-transparent to-brasserie-gold"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Clock,
                  title: "Réservation en ligne",
                  description: "Les réservations en ligne sont possibles uniquement jusqu'à 2 heures avant l'heure souhaitée. Pour les réservations de dernière minute, veuillez nous appeler directement au 01 42 25 28 00.",
                  highlight: true,
                  color: "from-amber-500 to-orange-500"
                },
                {
                  icon: Users,
                  title: "Groupes importants",
                  description: "Pour les groupes de plus de 8 personnes, nous vous recommandons de nous contacter par téléphone pour organiser une prise en charge personnalisée et adaptée à vos besoins.",
                  color: "from-blue-500 to-indigo-500"
                },
                {
                  icon: Calendar,
                  title: "Maintien de réservation",
                  description: "Vos réservations sont maintenues pendant 15 minutes après l'heure prévue. Au-delà de ce délai, votre table pourra être attribuée à d'autres clients en attente.",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: Phone,
                  title: "Politique d'annulation",
                  description: "En cas d'annulation ou de modification, merci de nous prévenir au moins 24 heures à l'avance par téléphone ou par email pour permettre à d'autres clients de profiter de votre créneau.",
                  color: "from-purple-500 to-violet-500"
                }
              ].map((item, index) => (
                <div 
                  key={item.title}
                  className={`group relative bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 hover:bg-white/15 hover:border-brasserie-gold/50 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl ${
                    item.highlight ? 'ring-2 ring-brasserie-gold/40 bg-white/15' : ''
                  }`}
                >
                  {/* Gradient de fond pour les cartes importantes */}
                  {item.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-br from-brasserie-gold/10 to-transparent rounded-3xl"></div>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-playfair text-2xl font-bold mb-4 group-hover:text-brasserie-gold transition-colors duration-300 ${
                          item.highlight ? 'text-brasserie-gold' : 'text-white'
                        }`}>
                          {item.title}
                        </h4>
                        <p className={`text-lg leading-relaxed group-hover:text-white transition-colors duration-300 ${
                          item.highlight ? 'text-white font-medium' : 'text-white/85'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Ligne décorative */}
                    <div className="mt-6 w-full h-px bg-gradient-to-r from-transparent via-brasserie-gold/40 to-transparent group-hover:via-brasserie-gold/70 transition-all duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-16 bg-gradient-to-br from-brasserie-beige/40 via-white to-brasserie-gold/10">
        <div className="container mx-auto px-4">
          <div className={`transform transition-all duration-1000 ${
            isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-playfair font-bold text-brasserie-darkgreen mb-12">Nous contacter</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: MapPin,
                    title: "Notre adresse",
                    content: "123 Rue de la Brasserie\n75001 Paris, France",
                    link: "https://maps.google.com",
                    color: "from-red-500 to-pink-500"
                  },
                  {
                    icon: Phone,
                    title: "Téléphone",
                    content: "01 42 25 28 00",
                    link: "tel:0142252800",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: Mail,
                    title: "Email",
                    content: "contact@brasserie-jean.fr",
                    link: "mailto:contact@brasserie-jean.fr",
                    color: "from-blue-500 to-indigo-500"
                  }
                ].map((contact, index) => (
                  <div key={index} className="group">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-brasserie-gold/20 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${contact.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <contact.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-playfair text-xl font-bold text-brasserie-darkgreen mb-4">{contact.title}</h4>
                      <a 
                        href={contact.link} 
                        className="text-gray-600 hover:text-brasserie-gold transition-colors duration-300 font-medium whitespace-pre-line"
                      >
                        {contact.content}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Horaires d'ouverture */}
              <div className="mt-12 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-brasserie-gold/20">
                <h4 className="text-2xl font-playfair font-bold text-brasserie-darkgreen mb-6">Horaires d'ouverture</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium">Lundi - Vendredi</span>
                    <span>12h00 - 14h30 • 19h00 - 23h00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-medium">Samedi - Dimanche</span>
                    <span>12h00 - 15h00 • 19h00 - 23h30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Reservation;
