import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@wedding.com";
  const password = "admin123";
  const name = "Administrador";

  try {
    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("‚úÖ Usuario admin ya existe");
      console.log("Ì≥ß Email:", email);
      console.log("Ì¥ë Password: admin123");
      
      // Actualizar rol si no es admin
      if (existingUser.role !== "admin") {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: "admin" },
        });
        console.log("‚úÖ Rol actualizado a admin");
      }
      return;
    }

    // Hash de la contrase√±a
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: "admin",
        emailVerified: true,
      },
    });

    // Crear account con la contrase√±a
    await prisma.account.create({
      data: {
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
      },
    });

    console.log("‚úÖ Usuario admin creado exitosamente");
    console.log("Ì≥ß Email:", email);
    console.log("Ì¥ë Password:", password);
    console.log("Ì±§ ID:", user.id);
  } catch (error) {
    console.error("‚ùå Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
