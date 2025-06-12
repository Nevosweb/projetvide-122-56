
export const Map = () => {
  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.1285459921137!2d2.3039791!3d48.8726933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc3ff4f191d%3A0xfadbb1ea16068597!2s155%20Rue%20du%20Faubourg%20Saint-Honor%C3%A9%2C%2075008%20Paris!5e0!3m2!1sfr!2sfr!4v1703787656912!5m2!1sfr!2sfr" 
        className="w-full h-full border-0" 
        style={{border: 0}} 
        allowFullScreen={false} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Brasserie de Jean sur la carte"
      ></iframe>
    </div>
  );
};
