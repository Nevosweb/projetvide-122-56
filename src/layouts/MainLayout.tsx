
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ReservationBanner } from "@/components/ReservationBanner";

interface MainLayoutProps {
  children: React.ReactNode;
  showBanner?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children,
  showBanner = true 
}) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {showBanner && <ReservationBanner />}
      <Footer />
    </div>
  );
};
