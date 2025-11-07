import { PrismaClient } from "@prisma/client";
import { auth } from "../lib/auth";

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = "admin@wedding.com";
  const password = "admin123";
  const name = "Administrador";

  try {
    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("❌ El usuario admin ya existe");
      console.log("📧 Email:", email);
      console.log("👤 ID:", existingUser.id);
      console.log("🎭 Rol:", existingUser.role);
      
      // Si existe pero no es admin, actualizar el rol
      if (existingUser.role !== "admin") {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { role: "admin" },
        });
        console.log("✅ Rol actualizado a admin");
      }
      return;
    }

    // Usar fetch para crear usuario a través de Better Auth API
    const response = await fetch("http://localhost:3000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear usuario");
    }

    const result = await response.json();
    
    // Actualizar el rol a admin
    const user = await prisma.user.update({
      where: { email },
      data: { 
        role: "admin",
        emailVerified: true 
      },
    });

    console.log("✅ Usuario admin creado exitosamente");
    console.log("📧 Email:", email);
    console.log("🔑 Contraseña:", password);
    console.log("👤 ID:", user.id);
    console.log("🎭 Rol:", user.role);
    console.log("\n💡 Puedes iniciar sesión en http://localhost:3000/login");
  } catch (error: any) {
    console.error("❌ Error al crear usuario admin:", error.message);
    console.log("\n⚠️  Asegúrate de que el servidor esté corriendo (npm run dev)");
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
