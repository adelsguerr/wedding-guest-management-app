"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, CheckCircle } from "lucide-react";

export default function ThankYouEmbedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-green-200 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-br from-green-50 to-emerald-50 pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-4xl mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ¡Confirmación Exitosa!
            </CardTitle>
            <CardDescription className="text-lg text-green-800">
              Gracias por confirmar tu asistencia 💕
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-8 pb-8">
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700">
                Estamos muy emocionados de celebrar este día especial contigo
              </p>
              
              <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
                <p className="text-2xl mb-2">🎉 ¡Nos vemos pronto! 🎉</p>
                <p className="text-gray-600 text-sm">
                  Recibirás más detalles sobre el evento próximamente
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-white rounded-lg border border-pink-100">
                  <p className="text-3xl mb-1">💍</p>
                  <p className="text-xs text-gray-600">Amor</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-purple-100">
                  <p className="text-3xl mb-1">🎊</p>
                  <p className="text-xs text-gray-600">Celebración</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
                  <p className="text-3xl mb-1">🥂</p>
                  <p className="text-xs text-gray-600">Alegría</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 pt-6">
                Si necesitas hacer cambios a tu confirmación, por favor contáctanos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
