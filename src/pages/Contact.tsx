
import React from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Map } from "@/components/Map";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";

const Contact = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-24 bg-brasserie-beige">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="heading-xl mb-4 text-brasserie-darkgreen">Contact</h1>
            <div className="gold-divider"></div>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Nous vous accueillons dans notre brasserie parisienne au cœur du 8ème arrondissement
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white p-8 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Mail className="text-brasserie-gold" size={20} />
                  <h2 className="text-xl font-semibold text-brasserie-darkgreen">Envoyez-nous un message</h2>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brasserie-gold focus:border-transparent"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brasserie-gold focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brasserie-gold focus:border-transparent"
                      placeholder="Votre numéro de téléphone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea 
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brasserie-gold focus:border-transparent resize-none"
                      placeholder="Votre message..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-brasserie-gold text-white py-3 px-4 rounded-md hover:bg-brasserie-gold/90 transition-colors font-medium"
                  >
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
            
            {/* Practical Information */}
            <div>
              <h2 className="text-xl font-semibold text-brasserie-darkgreen mb-6">Informations Pratiques</h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brasserie-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                     <MapPin className="text-brasserie-gold" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brasserie-darkgreen mb-1">Notre adresse</h3>
                    <p className="text-gray-600">155 rue Faubourg Saint-Honoré</p>
                    <p className="text-gray-600">75008 Paris, France</p>
                  </div>
                </div>
                
                {/* Opening Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brasserie-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                     <Clock className="text-brasserie-gold" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brasserie-darkgreen mb-1">Horaires d'ouverture</h3>
                    <p className="text-gray-600">Lundi - Dimanche : 12h00 - 23h00</p>
                    <p className="text-gray-600">Service continu</p>
                    <p className="text-gray-600">Ouvert 7j/7</p>
                  </div>
                </div>
                
                {/* Contact */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brasserie-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                     <Phone className="text-brasserie-gold" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-brasserie-darkgreen mb-1">Nous joindre</h3>
                    <p className="text-gray-600">
                      <a href="tel:0142252800" className="hover:text-brasserie-gold transition-colors">
                        01 42 25 28 00
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <a href="mailto:contact@brasserie.fr" className="hover:text-brasserie-gold transition-colors">
                        contact@brasserie.fr
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Map */}
              <div className="mt-8">
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <Map />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
