"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Home, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-green-100">
        <CardHeader className="text-center bg-gradient-to-br from-green-50 to-emerald-50 pb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce shadow-xl">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            ¡Gracias por Confirmar!
          </CardTitle>
          <CardDescription className="text-lg mt-3 text-gray-700">
            ✨ Tu confirmación ha sido recibida exitosamente ✨
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
              <Heart className="w-12 h-12 mx-auto mb-4 text-pink-500" />
              <p className="text-lg font-medium text-gray-800 mb-2">
                ¡Nos emociona contar con tu presencia!
              </p>
              <p className="text-gray-600">
                Hemos guardado tu confirmación y preferencias alimentarias.
                Te enviaremos más detalles sobre el evento próximamente.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <h3 className="font-semibold text-blue-900 mb-2">
                📅 Próximos pasos
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Recibirás un mensaje de confirmación</li>
                <li>• Te enviaremos los detalles del evento</li>
                <li>• Te asignaremos una mesa antes del evento</li>
                <li>• Puedes modificar tu confirmación contactándonos</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-left">
              <h3 className="font-semibold text-purple-900 mb-2">
                💝 Información adicional
              </h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Guarda tu código de invitación para futuras consultas</li>
                <li>• Si tienes alguna pregunta, no dudes en contactarnos</li>
                <li>• ¡Esperamos celebrar este día especial contigo!</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Link href="/rsvp">
              <Button
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-500">
              Con amor,
            </p>
            <p className="text-lg font-script bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Los Novios
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
