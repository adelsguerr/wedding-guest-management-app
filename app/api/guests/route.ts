import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todos los invitados
export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      where: {
        isDeleted: false, // Solo invitados no eliminados
      },
      include: {
        familyHead: true,
        seat: {
          include: {
            table: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Error al obtener los invitados' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo invitado
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, guestType, familyHeadId, dietaryRestrictions, specialNeeds } = body;

    // Verificar que la familia no exceda el límite de invitados
    const familyHead = await prisma.familyHead.findUnique({
      where: { id: familyHeadId },
      include: {
        _count: {
          select: { 
            guests: {
              where: {
                isDeleted: false, // Solo contar invitados no eliminados
              },
            },
          },
        },
      },
    });

    if (!familyHead) {
      return NextResponse.json(
        { error: 'Familia no encontrada' },
        { status: 404 }
      );
    }

    if (familyHead._count.guests >= familyHead.allowedGuests) {
      return NextResponse.json(
        { error: `Esta familia ya tiene el máximo de ${familyHead.allowedGuests} invitados` },
        { status: 400 }
      );
    }

    const guest = await prisma.guest.create({
      data: {
        firstName,
        lastName,
        guestType,
        familyHeadId,
        dietaryRestrictions,
        specialNeeds,
      },
      include: {
        familyHead: true,
      },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json(
      { error: 'Error al crear el invitado' },
      { status: 500 }
    );
  }
}
