import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener estadísticas del dashboard
export async function GET() {
  try {
    const [
      totalFamilies,
      totalGuests,
      totalAdults,
      totalChildren,
      confirmedFamilies,
      totalTables,
      occupiedSeats,
      totalSeats,
    ] = await Promise.all([
      prisma.familyHead.count(),
      prisma.guest.count(),
      prisma.guest.count({ where: { guestType: 'ADULT' } }),
      prisma.guest.count({ where: { guestType: 'CHILD' } }),
      prisma.familyHead.count({ where: { confirmationStatus: 'CONFIRMED' } }),
      prisma.table.count(),
      prisma.seat.count({ where: { isOccupied: true } }),
      prisma.seat.count(),
    ]);

    const confirmationStats = await prisma.familyHead.groupBy({
      by: ['confirmationStatus'],
      _count: true,
    });

    const tableStats = await prisma.table.groupBy({
      by: ['tableType'],
      _count: true,
    });

    const recentNotifications = await prisma.notification.findMany({
      include: {
        familyHead: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    return NextResponse.json({
      totals: {
        families: totalFamilies,
        guests: totalGuests,
        adults: totalAdults,
        children: totalChildren,
        confirmedFamilies,
        tables: totalTables,
        occupiedSeats,
        totalSeats,
        availableSeats: totalSeats - occupiedSeats,
      },
      confirmationStats,
      tableStats,
      recentNotifications,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener las estadísticas' },
      { status: 500 }
    );
  }
}
