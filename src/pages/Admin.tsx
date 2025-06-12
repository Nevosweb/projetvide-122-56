
import { MainLayout } from "@/layouts/MainLayout";
import { useState } from "react";
import { AdminCalendar } from "@/components/admin/AdminCalendar";
import { TableTypesManager } from "@/components/admin/TableTypesManager";
import { ReservationDetailsDialog } from "@/components/admin/ReservationDetailsDialog";
import { DailyReservationsList } from "@/components/admin/DailyReservationsList";

const Admin = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <MainLayout showBanner={false}>
      <section className="py-20 bg-brasserie-beige">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="heading-xl text-brasserie-darkgreen">Administration</h1>
            <div className="gold-divider"></div>
            <p className="mt-6 max-w-2xl mx-auto text-gray-700">
              Gérez les paramètres du restaurant et consultez les réservations.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          {/* Calendar section */}
          <AdminCalendar 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          
          {/* Daily Reservations List - Moved above TableTypesManager */}
          <DailyReservationsList selectedDate={selectedDate} />
          
          {/* Adding margin-top to create space between the sections */}
          <div className="mt-8">
            {/* Table Types Manager - Moved below DailyReservationsList */}
            <TableTypesManager />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Admin;
