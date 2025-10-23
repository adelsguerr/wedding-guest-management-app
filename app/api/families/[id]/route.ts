import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener una familia específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const family = await prisma.familyHead.findUnique({
      where: { 
        id: params.id,
      },
      include: {
        guests: {
          where: {
            isDeleted: false, // Solo invitados no eliminados
          },
          include: {
            seat: {
              include: {
                table: true,
              },
            },
          },
        },
        notifications: {
          where: {
            isDeleted: false, // Solo notificaciones no eliminadas
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!family || family.isDeleted) {
      return NextResponse.json(
        { error: 'Familia no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(family);
  } catch (error) {
    console.error('Error fetching family:', error);
    return NextResponse.json(
      { error: 'Error al obtener la familia' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar una familia
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const family = await prisma.familyHead.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(family);
  } catch (error) {
    console.error('Error updating family:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la familia' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una familia (borrado lógico)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Borrado lógico: marcar como eliminado en lugar de borrar físicamente
    await prisma.familyHead.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting family:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la familia' },
      { status: 500 }
    );
  }
}
