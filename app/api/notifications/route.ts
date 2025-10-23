import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage, messageTemplates } from '@/lib/whatsapp';

// POST - Enviar notificación WhatsApp
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { familyHeadId, notificationType, customMessage, ...templateData } = body;

    const familyHead = await prisma.familyHead.findUnique({
      where: { id: familyHeadId },
    });

    if (!familyHead) {
      return NextResponse.json(
        { error: 'Familia no encontrada' },
        { status: 404 }
      );
    }

    // Generar mensaje según el tipo
    let message = customMessage;
    const familyName = `${familyHead.firstName} ${familyHead.lastName}`;

    if (!customMessage) {
      switch (notificationType) {
        case 'SAVE_THE_DATE':
          message = messageTemplates.saveTheDate(
            familyName,
            templateData.weddingDate,
            templateData.venue
          );
          break;
        case 'RSVP_REQUEST':
          message = messageTemplates.rsvpRequest(
            familyName,
            familyHead.allowedGuests,
            templateData.confirmationUrl
          );
          break;
        case 'REMINDER_1_MONTH':
          message = messageTemplates.reminder1Month(familyName, templateData.weddingDate);
          break;
        case 'REMINDER_1_WEEK':
          message = messageTemplates.reminder1Week(
            familyName,
            templateData.weddingDate,
            templateData.venue,
            templateData.time
          );
          break;
        case 'REMINDER_1_DAY':
          message = messageTemplates.reminder1Day(
            familyName,
            templateData.time,
            templateData.venue,
            templateData.tableNumber
          );
          break;
        case 'TABLE_ASSIGNMENT':
          message = messageTemplates.tableAssignment(
            familyName,
            templateData.tableNumber,
            templateData.tableType
          );
          break;
        case 'THANK_YOU':
          message = messageTemplates.thankYou(familyName, templateData.photosUrl);
          break;
        default:
          return NextResponse.json(
            { error: 'Tipo de notificación no válido' },
            { status: 400 }
          );
      }
    }

    // Enviar mensaje por WhatsApp
    const result = await sendWhatsAppMessage({
      to: familyHead.phone,
      message: message!,
    });

    // Guardar notificación en base de datos
    const notification = await prisma.notification.create({
      data: {
        familyHeadId,
        notificationType: notificationType || 'CUSTOM',
        message: message!,
        status: result.success ? 'SENT' : 'FAILED',
        sentAt: result.success ? new Date() : null,
        errorMessage: result.success ? null : result.error,
      },
    });

    return NextResponse.json({
      notification,
      whatsappResult: result,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Error al enviar la notificación' },
      { status: 500 }
    );
  }
}

// GET - Obtener todas las notificaciones
export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      include: {
        familyHead: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Error al obtener las notificaciones' },
      { status: 500 }
    );
  }
}
