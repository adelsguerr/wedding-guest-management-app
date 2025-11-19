import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { familyIds, invitationUrl, messageTemplate } = body;

    // Validar parámetros
    if (!invitationUrl || !messageTemplate) {
      return NextResponse.json(
        { error: "Se requiere invitationUrl y messageTemplate" },
        { status: 400 }
      );
    }

    // Si no se especifican IDs, enviar a todas las familias activas
    const families = await prisma.familyHead.findMany({
      where: {
        isDeleted: false,
        ...(familyIds && familyIds.length > 0 ? { id: { in: familyIds } } : {}),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        allowedGuests: true,
        inviteCode: true,
      },
    });

    if (families.length === 0) {
      return NextResponse.json(
        { error: "No se encontraron familias para enviar invitaciones" },
        { status: 404 }
      );
    }

    const results = [];
    let successCount = 0;
    let failedCount = 0;

    for (const family of families) {
      // Validar que tenga código de invitación
      if (!family.inviteCode) {
        results.push({
          familyId: family.id,
          familyName: `${family.firstName} ${family.lastName}`,
          success: false,
          error: "Familia sin código de invitación",
        });
        failedCount++;
        continue;
      }

      // Generar mensaje personalizado
      const familyName = `${family.firstName} ${family.lastName}`;
      const invitationLink = `${invitationUrl}/rsvp?code=${family.inviteCode}`;
      const invitationsText = family.allowedGuests === 1 ? "invitación" : "invitaciones";
      
      const message = messageTemplate
        .replace(/\{familia\}/g, familyName)
        .replace(/\{cupos\}/g, family.allowedGuests.toString())
        .replace(/\{invitaciones\}/g, invitationsText)
        .replace(/\{enlace\}/g, invitationLink);

      // Enviar WhatsApp
      const result = await sendWhatsAppMessage({
        to: family.phone,
        message,
      });

      // Guardar notificación en la base de datos
      await prisma.notification.create({
        data: {
          familyHeadId: family.id,
          notificationType: "RSVP_REQUEST",
          message,
          status: result.success ? "SENT" : "FAILED",
          sentAt: result.success ? new Date() : null,
          errorMessage: result.success ? null : result.error,
        },
      });

      results.push({
        familyId: family.id,
        familyName: `${family.firstName} ${family.lastName}`,
        success: result.success,
        messageId: result.messageId,
        error: result.error,
      });

      if (result.success) {
        successCount++;
      } else {
        failedCount++;
      }

      // Pausa entre mensajes para no saturar la API
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    return NextResponse.json({
      message: "Proceso de envío completado",
      total: families.length,
      successful: successCount,
      failed: failedCount,
      results,
    });
  } catch (error) {
    console.error("Error sending invitations:", error);
    return NextResponse.json(
      { error: "Error al enviar las invitaciones" },
      { status: 500 }
    );
  }
}
