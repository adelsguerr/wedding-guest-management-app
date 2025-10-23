import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las mesas
export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      where: {
        isDeleted: false, // Solo mesas no eliminadas
      },
      include: {
        seats: {
          where: {
            isDeleted: false, // Solo asientos no eliminados
          },
          include: {
            guest: {
              where: {
                isDeleted: false, // Solo invitados no eliminados
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
        _count: {
          select: { 
            seats: {
              where: {
                isDeleted: false, // Solo contar asientos no eliminados
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { error: 'Error al obtener las mesas' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva mesa
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, tableType, capacity, location, positionX, positionY } = body;

    const table = await prisma.table.create({
      data: {
        name,
        tableType,
        capacity,
        location,
        positionX,
        positionY,
        seats: {
          create: Array.from({ length: capacity }, (_, i) => ({
            seatNumber: i + 1,
            isOccupied: false,
          })),
        },
      },
      include: {
        seats: true,
      },
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    console.error('Error creating table:', error);
    return NextResponse.json(
      { error: 'Error al crear la mesa' },
      { status: 500 }
    );
  }
}
