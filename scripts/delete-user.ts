import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteUser() {
  const email = "admin@wedding.com";

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true, sessions: true },
    });

    if (!user) {
      console.log("❌ Usuario no encontrado");
      return;
    }

    // Eliminar sessions
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    // Eliminar accounts
    await prisma.account.deleteMany({
      where: { userId: user.id },
    });

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log("✅ Usuario eliminado exitosamente");
    console.log("📧 Email:", email);
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();
