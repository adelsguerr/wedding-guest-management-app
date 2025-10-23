import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las familias
export async function GET() {
  try {
    const families = await prisma.familyHead.findMany({
      where: {
        isDeleted: false, // Solo familias no eliminadas
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
        _count: {
          select: { 
            guests: {
              where: {
                isDeleted: false, // Contar solo invitados no eliminados
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(families);
  } catch (error) {
    console.error('Error fetching families:', error);
    return NextResponse.json(
      { error: 'Error al obtener las familias' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva familia
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, allowedGuests } = body;

    // Crear la familia Y automáticamente crear un Guest para el cabeza de familia
    // El cabeza de familia cuenta como 1 invitado dentro del límite
    const family = await prisma.familyHead.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        allowedGuests: allowedGuests || 1,
        guests: {
          create: {
            firstName,
            lastName,
            guestType: 'ADULT', // El cabeza de familia siempre es adulto
            confirmed: false,
          },
        },
      },
      include: {
        guests: true,
        _count: {
          select: { guests: true },
        },
      },
    });

    return NextResponse.json(family, { status: 201 });
  } catch (error) {
    console.error('Error creating family:', error);
    return NextResponse.json(
      { error: 'Error al crear la familia' },
      { status: 500 }
    );
  }
}
