import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

export interface SendWhatsAppMessageParams {
  to: string; // Formato: +521234567890
  message: string;
}

export async function sendWhatsAppMessage({ to, message }: SendWhatsAppMessageParams) {
  try {
    // Formatear número para WhatsApp
    const formattedNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    
    const result = await client.messages.create({
      body: message,
      from: whatsappNumber,
      to: formattedNumber,
    });

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Plantillas de mensajes
export const messageTemplates = {
  saveTheDate: (familyName: string, weddingDate: string, venue: string) => `
¡Hola ${familyName}! 👰🤵

¡Tenemos noticias emocionantes! 

Nos complace invitarte a nuestra boda:
📅 Fecha: ${weddingDate}
📍 Lugar: ${venue}

Pronto te enviaremos más detalles.

¡Los esperamos!
[Nombres de novios]
  `.trim(),

  rsvpRequest: (familyName: string, allowedGuests: number, inviteCode: string, wordpressUrl?: string) => `
¡Hola ${familyName}! 💒✨

Es momento de confirmar tu asistencia a nuestra boda.

👥 Tu familia tiene ${allowedGuests} ${allowedGuests === 1 ? 'invitación' : 'invitaciones'}.

Por favor confirma aquí:
${wordpressUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/rsvp`}?code=${inviteCode}

¡Esperamos contar contigo! 💕

Rebeca & Adelso
  `.trim(),

  reminder1Month: (familyName: string, weddingDate: string) => `
¡Hola ${familyName}! 🎉

¡Falta solo 1 mes para nuestra boda!

📅 Fecha: ${weddingDate}

Confirma que tienes guardada la fecha.

¡Nos vemos pronto!
  `.trim(),

  reminder1Week: (familyName: string, weddingDate: string, venue: string, time: string) => `
¡Hola ${familyName}! ⏰

¡Falta solo 1 semana!

📅 Fecha: ${weddingDate}
🕐 Hora: ${time}
📍 Lugar: ${venue}

¿Listo para celebrar con nosotros?

¡Te esperamos!
  `.trim(),

  reminder1Day: (familyName: string, time: string, venue: string, tableNumber: string) => `
¡Hola ${familyName}! 🎊

¡Es mañana! ¡Nuestra boda es mañana!

🕐 Hora: ${time}
📍 Lugar: ${venue}
🪑 Tu mesa: ${tableNumber}

¡Nos vemos mañana!
👰🤵
  `.trim(),

  tableAssignment: (familyName: string, tableNumber: string, tableType: string) => `
¡Hola ${familyName}! 🪑

Ya tenemos tu mesa asignada:

🎯 Mesa: ${tableNumber}
📋 Tipo: ${tableType}

¡Nos vemos pronto!
  `.trim(),

  thankYou: (familyName: string, photosUrl?: string) => `
¡Hola ${familyName}! 💕

¡Muchas gracias por acompañarnos en nuestro día especial!

Fue maravilloso celebrar con ustedes.

${photosUrl ? `📸 Fotos del evento: ${photosUrl}` : '📸 Pronto compartiremos las fotos.'}

Con cariño,
[Nombres de novios]
  `.trim(),
};

// Función para enviar mensajes masivos
export async function sendBulkWhatsAppMessages(
  recipients: Array<{ phone: string; message: string; familyHeadId: string }>,
  onProgress?: (sent: number, total: number) => void
) {
  const results = [];
  
  for (let i = 0; i < recipients.length; i++) {
    const { phone, message, familyHeadId } = recipients[i];
    
    const result = await sendWhatsAppMessage({ to: phone, message });
    
    results.push({
      familyHeadId,
      ...result,
    });

    // Pequeña pausa para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (onProgress) {
      onProgress(i + 1, recipients.length);
    }
  }

  return results;
}
