import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener configuración del evento
export async function GET() {
  try {
    let config = await prisma.eventConfig.findFirst();
    
    // Si no existe, crear una por defecto
    if (!config) {
      config = await prisma.eventConfig.create({
        data: {
          eventName: "Nuestra Boda",
          // Fecha límite por defecto: 30 días desde ahora
          rsvpDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error obteniendo configuración:", error);
    return NextResponse.json(
      { error: "Error al obtener la configuración del evento" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar configuración del evento
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convertir fechas a formato ISO-8601 completo si existen
    const data: any = { ...body };
    if (data.weddingDate) {
      data.weddingDate = new Date(data.weddingDate).toISOString();
    }
    if (data.rsvpDeadline) {
      data.rsvpDeadline = new Date(data.rsvpDeadline).toISOString();
    }
    
    // Buscar configuración existente
    let config = await prisma.eventConfig.findFirst();
    
    if (!config) {
      // Crear si no existe
      config = await prisma.eventConfig.create({
        data,
      });
    } else {
      // Actualizar (remover campos que no se deben actualizar)
      delete data.id;
      delete data.createdAt;
      delete data.updatedAt;
      
      config = await prisma.eventConfig.update({
        where: { id: config.id },
        data,
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error actualizando configuración:", error);
    return NextResponse.json(
      { error: "Error al actualizar la configuración del evento" },
      { status: 500 }
    );
  }
}
