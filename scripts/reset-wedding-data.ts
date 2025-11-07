import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetWeddingData() {
  try {
    console.log("🗑️  Eliminando datos de la boda...\n");

    // Eliminar en orden correcto por las relaciones
    const deletedNotifications = await prisma.notification.deleteMany({});
    console.log(`✅ ${deletedNotifications.count} notificaciones eliminadas`);

    const deletedSeats = await prisma.seat.deleteMany({});
    console.log(`✅ ${deletedSeats.count} asientos eliminados`);

    const deletedGuests = await prisma.guest.deleteMany({});
    console.log(`✅ ${deletedGuests.count} invitados eliminados`);

    const deletedTables = await prisma.table.deleteMany({});
    console.log(`✅ ${deletedTables.count} mesas eliminadas`);

    const deletedFamilyHeads = await prisma.familyHead.deleteMany({});
    console.log(`✅ ${deletedFamilyHeads.count} representantes de familia eliminados`);

    console.log("\n✨ Datos de la boda reseteados correctamente");
    console.log("👤 Usuario admin conservado");
    console.log("🎯 Listo para empezar la Fase 8 - Portal RSVP\n");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetWeddingData();
