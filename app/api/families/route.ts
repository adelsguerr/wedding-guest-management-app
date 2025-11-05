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

    // Validar campos requeridos
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'firstName, lastName y phone son obligatorios' },
        { status: 400 }
      );
    }

    // Crear la familia Y automáticamente crear un Guest para el representante de familia
    // El representante de familia cuenta como 1 invitado dentro del límite
    const family = await prisma.familyHead.create({
      data: {
        firstName,
        lastName,
        phone,
        email: email && email.trim() !== '' ? email : null, // Convertir string vacío a null
        allowedGuests: allowedGuests || 1,
        guests: {
          create: {
            firstName,
            lastName,
            guestType: 'ADULT', // El representante de familia siempre es adulto
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
  } catch (error: any) {
    console.error('Error creating family:', error);
    
    // Manejo de errores específicos de Prisma
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'campo';
      return NextResponse.json(
        { error: `Ya existe una familia con ese ${field}` },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Error al crear la familia',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
