
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TableType {
  capacity: number;
  count: number;
  id: string;
}

interface ReservationRequest {
  startTime: string;
  partySize: number;
  customerName?: string;
  customerEmail?: string;
  shouldReserve?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Parse request body
    const requestData: ReservationRequest = await req.json();
    const { startTime, partySize, shouldReserve, customerName, customerEmail } = requestData;

    // Validate input
    if (!startTime || !partySize) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: startTime, partySize' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      );
    }

    const startDate = new Date(startTime);
    
    // Vérifier si la réservation est au moins 2 heures dans le futur
    const currentTime = new Date();
    const minimumTimeGap = 2 * 60 * 60 * 1000; // 2 heures en millisecondes
    
    // Si la réservation est dans moins de 2 heures, elle n'est pas disponible
    if (startDate.getTime() - currentTime.getTime() < minimumTimeGap) {
      return new Response(
        JSON.stringify({ 
          available: false, 
          reason: "time_constraint",
          message: "Les réservations doivent être effectuées au moins 2 heures à l'avance."
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Si la réservation est pour une heure déjà passée aujourd'hui
    if (startDate < currentTime) {
      return new Response(
        JSON.stringify({ 
          available: false, 
          reason: "time_passed",
          message: "Il n'est pas possible de réserver pour un horaire déjà passé."
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Get table types information
    const { data: tableTypes, error: tableTypesError } = await supabaseClient
      .from('table_types')
      .select('*')
      .order('capacity', { ascending: true });
    
    if (tableTypesError) {
      console.error('Error fetching table types:', tableTypesError);
      return new Response(
        JSON.stringify({ error: 'Error fetching restaurant settings' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }
    
    // Calculate end time (90 minutes after start time)
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 90);
    
    console.log(`Checking availability for: ${startDate.toISOString()} - ${endDate.toISOString()}`);
    
    // Get existing reservations in the time slot
    const { data: overlappingReservations, error: reservationsError } = await supabaseClient
      .from('reservations')
      .select('*')
      .eq('canceled', false)
      .filter('start_time', 'lt', endDate.toISOString()) // Reservation starts before our end time
      .filter('end_time', 'gt', startDate.toISOString()); // Reservation ends after our start time
    
    if (reservationsError) {
      console.error('Error checking reservations:', reservationsError);
      return new Response(
        JSON.stringify({ error: 'Error checking availability' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    console.log(`Found ${overlappingReservations?.length || 0} overlapping reservations`);
    if (overlappingReservations && overlappingReservations.length > 0) {
      console.log('Overlapping reservations:', overlappingReservations.map(r => 
        `ID: ${r.id}, Time: ${new Date(r.start_time).toLocaleTimeString()} - ${new Date(r.end_time).toLocaleTimeString()}, Party: ${r.party_size}`
      ));
    }

    // Count how many tables of each type are currently occupied
    const occupiedTablesByType: Record<string, number> = {};
    tableTypes.forEach((tableType) => {
      occupiedTablesByType[tableType.id] = 0;
    });

    // Count booked tables from existing reservations
    overlappingReservations?.forEach(reservation => {
      // Find suitable table type for this reservation
      const suitableTable = findSuitableTable(tableTypes, reservation.party_size);
      if (suitableTable) {
        occupiedTablesByType[suitableTable.id] = (occupiedTablesByType[suitableTable.id] || 0) + 1;
      }
    });

    // Calculate available tables by type
    const availableTablesByType = tableTypes.map(tableType => ({
      id: tableType.id,
      capacity: tableType.capacity,
      totalCount: tableType.count,
      occupiedCount: occupiedTablesByType[tableType.id] || 0,
      availableCount: tableType.count - (occupiedTablesByType[tableType.id] || 0)
    }));

    // Find suitable table type for the current party
    const suitableTable = findSuitableTable(tableTypes, partySize);
    
    // Check if suitable table is available
    let isAvailable = false;
    let selectedTableTypeId: string | null = null;
    
    if (suitableTable) {
      const availableTable = availableTablesByType.find(t => t.id === suitableTable.id);
      isAvailable = availableTable ? availableTable.availableCount > 0 : false;
      if (isAvailable) {
        selectedTableTypeId = suitableTable.id;
      }
    }

    const totalTablesCount = tableTypes.reduce((sum, type) => sum + type.count, 0);
    const availableTablesCount = availableTablesByType.reduce((sum, type) => sum + type.availableCount, 0);

    // If shouldReserve is true and there's availability, create the reservation
    if (shouldReserve && isAvailable && customerName && customerEmail && selectedTableTypeId) {
      const { data: reservation, error: insertError } = await supabaseClient
        .from('reservations')
        .insert({
          customer_name: customerName,
          customer_email: customerEmail,
          party_size: partySize,
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString() // Set end time 90 minutes after start time
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating reservation:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to create reservation' }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
        );
      }

      console.log('Reservation created successfully:', reservation);

      // Send confirmation email
      try {
        // Extract time in format HH:MM
        const reservationTime = startDate.toTimeString().slice(0, 5);
        
        console.log('Sending confirmation email...');
        console.log('Email parameters:', {
          customerName,
          customerEmail,
          reservationDate: startDate.toISOString(),
          reservationTime,
          partySize
        });
        
        // Send the email via our email function
        const emailResponse = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-reservation-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': req.headers.get('Authorization') || '',
            },
            body: JSON.stringify({
              customerName,
              customerEmail,
              reservationDate: startDate.toISOString(),
              reservationTime,
              partySize
            })
          }
        );
        
        const emailResult = await emailResponse.json();
        
        if (!emailResponse.ok) {
          console.error('Failed to send email:', emailResult);
          
          // Don't fail the reservation, but include the email error in the response
          return new Response(
            JSON.stringify({ 
              available: true, 
              availableTables: availableTablesCount, 
              totalTables: totalTablesCount,
              tableTypes: availableTablesByType,
              reservation,
              emailSent: false,
              emailError: emailResult
            }),
            { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        } else {
          console.log('Email sent successfully:', emailResult);
        }
      } catch (emailError) {
        // Log the error but don't fail the reservation
        console.error('Error sending confirmation email:', emailError);
        
        return new Response(
          JSON.stringify({ 
            available: true, 
            availableTables: availableTablesCount, 
            totalTables: totalTablesCount,
            tableTypes: availableTablesByType,
            reservation,
            emailSent: false,
            emailError: String(emailError)
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      return new Response(
        JSON.stringify({ 
          available: true, 
          availableTables: availableTablesCount, 
          totalTables: totalTablesCount,
          tableTypes: availableTablesByType,
          reservation,
          emailSent: true
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // If only checking availability
    return new Response(
      JSON.stringify({ 
        available: isAvailable, 
        availableTables: availableTablesCount, 
        totalTables: totalTablesCount,
        tableTypes: availableTablesByType
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});

// Helper function to find a suitable table type based on party size
function findSuitableTable(tableTypes: TableType[], partySize: number): TableType | null {
  // First, check for exact matches or tables just larger than the party size
  for (const tableType of tableTypes) {
    if (tableType.capacity >= partySize && tableType.capacity <= partySize + 2) {
      return tableType;
    }
  }
  
  // If no close match, find the smallest table that can accommodate the party
  const sortedTypes = [...tableTypes].sort((a, b) => a.capacity - b.capacity);
  for (const tableType of sortedTypes) {
    if (tableType.capacity >= partySize) {
      return tableType;
    }
  }
  
  // If no table is big enough, return the largest available
  return sortedTypes.length > 0 ? sortedTypes[sortedTypes.length - 1] : null;
}
