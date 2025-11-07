import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const name = searchParams.get("name");

    if (!code && !name) {
      return NextResponse.json(
        { error: "Debes proporcionar un código de invitación o un nombre" },
        { status: 400 }
      );
    }

    let familyHead;

    // Búsqueda por código de invitación
    if (code) {
      familyHead = await prisma.familyHead.findUnique({
        where: {
          inviteCode: code,
          isDeleted: false,
        },
        include: {
          guests: {
            where: {
              isDeleted: false,
            },
            orderBy: {
              guestType: "desc", // ADULT primero, luego CHILD
            },
          },
        },
      });
    }
    // Búsqueda por nombre (apellido)
    else if (name) {
      const familyHeads = await prisma.familyHead.findMany({
        where: {
          OR: [
            { firstName: { contains: name, mode: "insensitive" } },
            { lastName: { contains: name, mode: "insensitive" } },
          ],
          isDeleted: false,
        },
        include: {
          guests: {
            where: {
              isDeleted: false,
            },
            orderBy: {
              guestType: "desc",
            },
          },
        },
        take: 5, // Máximo 5 resultados
      });

      // Si solo hay un resultado, devolverlo directamente
      if (familyHeads.length === 1) {
        familyHead = familyHeads[0];
      }
      // Si hay múltiples, devolver la lista para que el usuario elija
      else if (familyHeads.length > 1) {
        return NextResponse.json({
          multiple: true,
          results: familyHeads.map((fh) => ({
            id: fh.id,
            firstName: fh.firstName,
            lastName: fh.lastName,
            inviteCode: fh.inviteCode,
            allowedGuests: fh.allowedGuests,
          })),
        });
      }
    }

    if (!familyHead) {
      return NextResponse.json(
        { error: "No se encontró ninguna invitación con esos datos" },
        { status: 404 }
      );
    }

    // Devolver los datos de la familia
    return NextResponse.json({
      id: familyHead.id,
      firstName: familyHead.firstName,
      lastName: familyHead.lastName,
      inviteCode: familyHead.inviteCode,
      allowedGuests: familyHead.allowedGuests,
      confirmedGuests: familyHead.confirmedGuests,
      confirmationStatus: familyHead.confirmationStatus,
      guests: familyHead.guests.map((guest) => ({
        id: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        guestType: guest.guestType,
        confirmed: guest.confirmed,
        dietaryRestrictions: guest.dietaryRestrictions,
        specialNeeds: guest.specialNeeds,
      })),
    });
  } catch (error) {
    console.error("Error en /api/rsvp/search:", error);
    return NextResponse.json(
      { error: "Error al buscar la invitación" },
      { status: 500 }
    );
  }
}
