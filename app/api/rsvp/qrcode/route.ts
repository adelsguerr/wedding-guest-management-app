import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const familyId = searchParams.get("familyId");
    const inviteCode = searchParams.get("inviteCode");

    if (!familyId && !inviteCode) {
      return NextResponse.json(
        { error: "Se requiere familyId o inviteCode" },
        { status: 400 }
      );
    }

    let family;

    if (inviteCode) {
      family = await prisma.familyHead.findUnique({
        where: { inviteCode, isDeleted: false },
      });
    } else if (familyId) {
      family = await prisma.familyHead.findUnique({
        where: { id: familyId, isDeleted: false },
      });
    }

    if (!family || !family.inviteCode) {
      return NextResponse.json(
        { error: "Familia no encontrada o sin código de invitación" },
        { status: 404 }
      );
    }

    // Generar URL del RSVP
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const rsvpURL = `${baseURL}/rsvp?code=${family.inviteCode}`;

    // Generar QR code como Data URL
    const qrCodeDataURL = await QRCode.toDataURL(rsvpURL, {
      width: 400,
      margin: 2,
      color: {
        dark: "#7c3aed", // Purple-600
        light: "#ffffff",
      },
    });

    return NextResponse.json({
      familyId: family.id,
      familyName: `${family.firstName} ${family.lastName}`,
      inviteCode: family.inviteCode,
      rsvpURL,
      qrCode: qrCodeDataURL,
    });
  } catch (error) {
    console.error("Error generando QR code:", error);
    return NextResponse.json(
      { error: "Error al generar el código QR" },
      { status: 500 }
    );
  }
}
