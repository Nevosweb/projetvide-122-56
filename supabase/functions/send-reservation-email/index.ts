
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'
import { Resend } from 'npm:resend@1.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  customerName: string;
  customerEmail: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY in environment variables');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing API key configuration' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }
    
    console.log('RESEND_API_KEY is configured');
    
    const resend = new Resend(resendApiKey);
    const requestData: EmailRequest = await req.json();
    
    const { customerName, customerEmail, reservationDate, reservationTime, partySize } = requestData;
    
    console.log('Email request received for:', customerEmail);
    console.log('Reservation details:', { customerName, reservationDate, reservationTime, partySize });
    
    // Get first name only
    const firstName = customerName.split(' ')[0];
    
    // Format date as DD/MM/YYYY
    const date = new Date(reservationDate);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    // Construct email HTML
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <p>Bonjour ${firstName},</p>
        
        <p>Votre réservation a bien été prise en compte :</p>
        
        <ul style="list-style-type: none; padding-left: 20px;">
          <li><strong>Date :</strong> ${formattedDate}</li>
          <li><strong>Heure :</strong> ${reservationTime}</li>
          <li><strong>Nombre de couverts :</strong> ${partySize}</li>
        </ul>
        
        <p>Nous vous accueillerons avec plaisir au 155 rue du Faubourg Saint-Honoré, 75008 Paris.</p>
        
        <p>En cas de besoin (modification, question…), n'hésitez pas à nous contacter par retour de mail ou au 01 23 45 67 89.</p>
        
        <p>Au plaisir de vous recevoir,</p>
        
        <p style="margin-bottom: 5px;">L'équipe de la Brasserie de Jean</p>
        <p style="margin-top: 0; color: #666;">155 rue du Faubourg Saint-Honoré • Paris 8ᵉ</p>
        <p style="margin-top: 0; color: #666;">www.brasseriedejean.fr • Jdeo.unity@gmail.com</p>
      </div>
    `;
    
    console.log("Attempting to send email to:", customerEmail);
    
    // Try using onboarding@resend.dev as a fallback if needed
    const senderEmail = 'Brasserie de Jean <onboarding@resend.dev>';
    console.log("Using sender:", senderEmail);
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [customerEmail],
      subject: 'Confirmation de votre réservation - Brasserie de Jean',
      html: emailHtml,
    });
    
    if (error) {
      console.error('Error sending email:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to send email', details: error }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }
    
    console.log('Email sent successfully:', data);
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Unhandled error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error', details: String(error) }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});
