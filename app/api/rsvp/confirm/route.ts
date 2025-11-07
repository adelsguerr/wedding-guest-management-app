import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface GuestConfirmation {
  id: string;
  confirmed: boolean;
  dietaryRestrictions: string;
  specialNeeds: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { familyHeadId, guests } = body as {
      familyHeadId: string;
      guests: GuestConfirmation[];
    };

    if (!familyHeadId || !guests || guests.length === 0) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // Verificar que la familia existe
    const familyHead = await prisma.familyHead.findUnique({
      where: { id: familyHeadId, isDeleted: false },
      include: { guests: { where: { isDeleted: false } } },
    });

    if (!familyHead) {
      return NextResponse.json(
        { error: "Familia no encontrada" },
        { status: 404 }
      );
    }

    // Validar que no se exceda el número de invitados permitidos
    const confirmedCount = guests.filter((g) => g.confirmed).length;
    if (confirmedCount > familyHead.allowedGuests) {
      return NextResponse.json(
        { error: `Solo puedes confirmar hasta ${familyHead.allowedGuests} invitados` },
        { status: 400 }
      );
    }

    // Actualizar cada invitado
    const updatePromises = guests.map((guestData) =>
      prisma.guest.update({
        where: { id: guestData.id },
        data: {
          confirmed: guestData.confirmed,
          dietaryRestrictions: guestData.dietaryRestrictions || null,
          specialNeeds: guestData.specialNeeds || null,
        },
      })
    );

    await Promise.all(updatePromises);

    // Actualizar el estado de confirmación de la familia
    const allGuests = await prisma.guest.findMany({
      where: { familyHeadId, isDeleted: false },
    });

    const totalConfirmed = allGuests.filter((g) => g.confirmed).length;
    const allDeclined = allGuests.every((g) => !g.confirmed);
    const someConfirmed = allGuests.some((g) => g.confirmed);

    let confirmationStatus: "CONFIRMED" | "DECLINED" | "PENDING" | "NO_RESPONSE" = "PENDING";
    
    if (allDeclined) {
      confirmationStatus = "DECLINED";
    } else if (someConfirmed) {
      confirmationStatus = "CONFIRMED";
    }

    // Actualizar familia
    await prisma.familyHead.update({
      where: { id: familyHeadId },
      data: {
        confirmedGuests: totalConfirmed,
        confirmationStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Confirmación guardada exitosamente",
      confirmedGuests: totalConfirmed,
      confirmationStatus,
    });
  } catch (error) {
    console.error("Error en /api/rsvp/confirm:", error);
    return NextResponse.json(
      { error: "Error al guardar la confirmación" },
      { status: 500 }
    );
  }
}
