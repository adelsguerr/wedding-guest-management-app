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
    
    // Si se está cambiando la capacidad, validar que no haya asientos ocupados fuera del nuevo rango
    if ('capacity' in body) {
      const newCapacity = body.capacity;
      
      // Obtener asientos ocupados de esta mesa
      const occupiedSeats = await prisma.seat.findMany({
        where: {
          tableId: params.id,
          isDeleted: false,
          guest: {
            isNot: null, // Asientos que tienen un invitado asignado
          },
        },
        include: {
          guest: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          seatNumber: 'desc',
        },
      });

      // Verificar si hay asientos ocupados con número mayor a la nueva capacidad
      const seatsOutOfRange = occupiedSeats.filter(seat => seat.seatNumber > newCapacity);
      
      if (seatsOutOfRange.length > 0) {
        const guestNames = seatsOutOfRange
          .map(seat => `${seat.guest?.firstName} ${seat.guest?.lastName} (Asiento #${seat.seatNumber})`)
          .join(', ');
        
        return NextResponse.json(
          { 
            error: 'No se puede reducir la capacidad',
            details: `Los siguientes asientos están ocupados y quedarían fuera del rango: ${guestNames}. Por favor, libera estos asientos antes de reducir la capacidad.`,
            occupiedSeats: seatsOutOfRange.map(s => ({
              seatNumber: s.seatNumber,
              guestName: `${s.guest?.firstName} ${s.guest?.lastName}`,
            })),
          },
          { status: 400 }
        );
      }

      // Si la nueva capacidad es diferente, ajustar los asientos
      const currentTable = await prisma.table.findUnique({
        where: { id: params.id },
        include: {
          seats: {
            where: { isDeleted: false },
          },
        },
      });

      if (currentTable) {
        const currentCapacity = currentTable.seats.length;
        
        // Si aumentamos la capacidad, crear nuevos asientos
        if (newCapacity > currentCapacity) {
          const seatsToCreate = [];
          for (let i = currentCapacity + 1; i <= newCapacity; i++) {
            seatsToCreate.push({
              tableId: params.id,
              seatNumber: i,
              isOccupied: false,
            });
          }
          await prisma.seat.createMany({
            data: seatsToCreate,
          });
        }
        // Si reducimos la capacidad, marcar asientos extras como eliminados
        else if (newCapacity < currentCapacity) {
          await prisma.seat.updateMany({
            where: {
              tableId: params.id,
              seatNumber: {
                gt: newCapacity,
              },
            },
            data: {
              isDeleted: true,
              deletedAt: new Date(),
            },
          });
        }
      }
    }
    
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
