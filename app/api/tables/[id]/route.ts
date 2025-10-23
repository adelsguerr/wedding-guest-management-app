import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener una mesa específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const table = await prisma.table.findUnique({
      where: { id: params.id },
      include: {
        seats: {
          where: {
            isDeleted: false,
          },
          include: {
            guest: {
              where: {
                isDeleted: false,
              },
              include: {
                familyHead: true,
              },
            },
          },
          orderBy: {
            seatNumber: 'asc',
          },
        },
      },
    });

    if (!table || table.isDeleted) {
      return NextResponse.json(
        { error: 'Mesa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(table);
  } catch (error) {
    console.error('Error fetching table:', error);
    return NextResponse.json(
      { error: 'Error al obtener la mesa' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar una mesa
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const table = await prisma.table.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(table);
  } catch (error) {
    console.error('Error updating table:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la mesa' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una mesa (borrado lógico)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Borrado lógico: marcar como eliminado en lugar de borrar físicamente
    await prisma.table.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la mesa' },
      { status: 500 }
    );
  }
}
