import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.next();
  
  // Permitir que la página sea embebida en iframes desde cualquier origen
  // Para producción, reemplaza '*' con tu dominio específico de WordPress
  response.headers.set('X-Frame-Options', 'ALLOWALL');
  response.headers.set('Content-Security-Policy', "frame-ancestors 'self' *");
  
  return response;
}
