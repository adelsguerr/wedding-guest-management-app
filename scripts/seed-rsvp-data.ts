import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function seed() {
  try {
    console.log("🌱 Creando datos de prueba para RSVP...\n");

    // Familia 1: García (2 adultos confirmados)
    const family1 = await prisma.familyHead.create({
      data: {
        firstName: "Juan",
        lastName: "García",
        phone: "+34612345678",
        email: "juan.garcia@example.com",
        inviteCode: generateInviteCode(),
        allowedGuests: 2,
        confirmedGuests: 0,
        confirmationStatus: "PENDING",
        guests: {
          create: [
            {
              firstName: "Juan",
              lastName: "García",
              guestType: "ADULT",
              confirmed: false,
            },
            {
              firstName: "María",
              lastName: "García",
              guestType: "ADULT",
              confirmed: false,
            },
          ],
        },
      },
      include: { guests: true },
    });

    console.log(`✅ Familia García creada`);
    console.log(`   Código: ${family1.inviteCode}`);
    console.log(`   Invitados: ${family1.guests.length}`);

    // Familia 2: Rodríguez (3 adultos + 1 niño)
    const family2 = await prisma.familyHead.create({
      data: {
        firstName: "Carlos",
        lastName: "Rodríguez",
        phone: "+34612345679",
        email: "carlos.rodriguez@example.com",
        inviteCode: generateInviteCode(),
        allowedGuests: 4,
        confirmedGuests: 0,
        confirmationStatus: "PENDING",
        guests: {
          create: [
            {
              firstName: "Carlos",
              lastName: "Rodríguez",
              guestType: "ADULT",
              confirmed: false,
            },
            {
              firstName: "Ana",
              lastName: "Rodríguez",
              guestType: "ADULT",
              confirmed: false,
            },
            {
              firstName: "Luis",
              lastName: "Rodríguez",
              guestType: "ADULT",
              confirmed: false,
            },
            {
              firstName: "Sofía",
              lastName: "Rodríguez",
              guestType: "CHILD",
              confirmed: false,
            },
          ],
        },
      },
      include: { guests: true },
    });

    console.log(`✅ Familia Rodríguez creada`);
    console.log(`   Código: ${family2.inviteCode}`);
    console.log(`   Invitados: ${family2.guests.length}`);

    // Familia 3: Martínez (1 adulto individual)
    const family3 = await prisma.familyHead.create({
      data: {
        firstName: "Laura",
        lastName: "Martínez",
        phone: "+34612345680",
        email: "laura.martinez@example.com",
        inviteCode: generateInviteCode(),
        allowedGuests: 1,
        confirmedGuests: 0,
        confirmationStatus: "PENDING",
        guests: {
          create: [
            {
              firstName: "Laura",
              lastName: "Martínez",
              guestType: "ADULT",
              confirmed: false,
            },
          ],
        },
      },
      include: { guests: true },
    });

    console.log(`✅ Familia Martínez creada`);
    console.log(`   Código: ${family3.inviteCode}`);
    console.log(`   Invitados: ${family3.guests.length}`);

    console.log("\n✨ Datos de prueba creados exitosamente\n");
    console.log("📋 Códigos de invitación para pruebas:");
    console.log(`   García: ${family1.inviteCode}`);
    console.log(`   Rodríguez: ${family2.inviteCode}`);
    console.log(`   Martínez: ${family3.inviteCode}`);
    console.log("\n🎯 Puedes usar estos códigos en /rsvp para probar el flujo completo\n");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
