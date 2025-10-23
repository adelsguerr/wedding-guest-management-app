import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener un invitado específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const guest = await prisma.guest.findUnique({
      where: { id: params.id },
      include: {
        familyHead: true,
        seat: {
          include: {
            table: true,
          },
        },
      },
    });

    if (!guest || guest.isDeleted) {
      return NextResponse.json(
        { error: 'Invitado no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(guest);
  } catch (error) {
    console.error('Error fetching guest:', error);
    return NextResponse.json(
      { error: 'Error al obtener el invitado' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar un invitado
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const guest = await prisma.guest.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el invitado' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un invitado (borrado lógico)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Borrado lógico: marcar como eliminado en lugar de borrar físicamente
    await prisma.guest.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el invitado' },
      { status: 500 }
    );
  }
}
