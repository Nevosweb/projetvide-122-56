
import { useState, useEffect } from "react";

interface Photo {
  id: number;
  url: string;
  alt: string;
}

const photos: Photo[] = [
  {
    id: 1,
    url: "https://i.pinimg.com/736x/6f/79/00/6f7900aeca9f5f7ecf58be5e6ed33439.jpg",
    alt: "Plat gastronomique"
  },
  {
    id: 2,
    url: "https://www.redie.nl/images/content/projects/33/fotos_red1207224730_normal.jpg",
    alt: "Intérieur de la brasserie"
  },
  {
    id: 3,
    url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhJiylwmh2Jtp_rxyC1qSsC7hUpBW1x6gbMnNAUK3SdNRZVf6MdrIkd8Yv2_M78HhnnFr1AEDMlcIJfodZTklWLBC7C6vzwL6LRwe2K9cTp6K_7lmjUkxR5z0hSPpcv9RFBx1k3D7SfN1s5EKheQYmLMtqlSrCuaq3O-6xancC1HVy8NBslp6aSNqeapSAV/s16000-rw/parmesan-crusted-sea-bass.webp",
    alt: "Service à table"
  },
  {
    id: 4,
    url: "https://www.recettesrapide.com/wp-content/uploads/2024/11/Leonardo_Kino_XL_A_hyperrealistic_presentation_of_a_gourmet_di_3.webp",
    alt: "Dessert signature"
  },
  {
    id: 5,
    url: "https://img.freepik.com/free-photo/side-view-mushroom-frying-with-gas-stove-fire-human-hand-pan_176474-3145.jpg?t=st=1746005370~exp=1746008970~hmac=0423419e54cf4b3ab3a6ca35874c176f2aecc4fd327464d93ae615a09614954d&w=826",
    alt: "Préparation en cuisine"
  }
];

export const PhotoGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-brasserie-beige">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-brasserie-darkgreen">Notre Brasserie en Images</h2>
          <div className="gold-divider"></div>
        </div>
        
        <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-brasserie-gold w-4" : "bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
