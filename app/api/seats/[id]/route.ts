import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/seats/[id] - Asignar/desasignar invitado a un asiento
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { guestId } = body;

    // Verificar que el asiento existe
    const seat = await prisma.seat.findUnique({
      where: { id },
      include: { 
        guest: true,
      },
    });

    if (!seat) {
      return NextResponse.json(
        { error: "Asiento no encontrado" },
        { status: 404 }
      );
    }

    // Si se está asignando un invitado
    if (guestId) {
      // Verificar que el invitado existe
      const guest = await prisma.guest.findUnique({
        where: { id: guestId, isDeleted: false },
      });

      if (!guest) {
        return NextResponse.json(
          { error: "Invitado no encontrado" },
          { status: 404 }
        );
      }

      // Verificar que el invitado no tenga otro asiento asignado
      if (guest.seatId && guest.seatId !== id) {
        return NextResponse.json(
          { error: "El invitado ya tiene un asiento asignado" },
          { status: 400 }
        );
      }

      // Si el asiento ya tiene un invitado, primero desasignarlo
      if (seat.guest) {
        await prisma.guest.update({
          where: { id: seat.guest.id },
          data: { seatId: null },
        });
      }

      // Asignar el invitado al asiento actualizando el Guest
      await prisma.guest.update({
        where: { id: guestId },
        data: { seatId: id },
      });

      // Actualizar el estado del asiento
      const updatedSeat = await prisma.seat.update({
        where: { id },
        data: { isOccupied: true },
        include: {
          guest: {
            include: {
              familyHead: true,
            },
          },
          table: true,
        },
      });

      return NextResponse.json(updatedSeat);
    } else {
      // Desasignar invitado del asiento
      if (seat.guest) {
        await prisma.guest.update({
          where: { id: seat.guest.id },
          data: { seatId: null },
        });
      }

      const updatedSeat = await prisma.seat.update({
        where: { id },
        data: { isOccupied: false },
        include: {
          guest: true,
          table: true,
        },
      });

      return NextResponse.json(updatedSeat);
    }
  } catch (error) {
    console.error("Error updating seat:", error);
    return NextResponse.json(
      { error: "Error al actualizar el asiento" },
      { status: 500 }
    );
  }
}

// GET /api/seats/[id] - Obtener información de un asiento
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const seat = await prisma.seat.findUnique({
      where: { id },
      include: {
        guest: {
          include: {
            familyHead: true,
          },
        },
        table: true,
      },
    });

    if (!seat) {
      return NextResponse.json(
        { error: "Asiento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(seat);
  } catch (error) {
    console.error("Error fetching seat:", error);
    return NextResponse.json(
      { error: "Error al obtener el asiento" },
      { status: 500 }
    );
  }
}
