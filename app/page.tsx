"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Table2,
  MessageSquare,
  BarChart3,
  Heart,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/header";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className={`fixed inset-0 z-50 bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Preloader elegante estilo Obsesd */}
        <div className="text-center space-y-12">
          {/* Anillo de compromiso con diamante */}
          <div className="relative w-40 h-40 mx-auto">
            {/* Anillo principal */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Aro dorado giratorio */}
                <div
                  className="w-28 h-28 rounded-full border-[4px] border-transparent bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400 shadow-2xl animate-[spin_5s_linear_infinite]"
                  style={{
                    boxShadow:
                      "0 0 40px rgba(251, 191, 36, 0.4), inset 0 3px 6px rgba(255, 255, 255, 0.6), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                ></div>
                {/* Hueco interior con gradiente suave */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-pink-50/80 via-white to-purple-50/80 backdrop-blur-sm"></div>

                {/* Pequeños diamantes decorativos */}
                <div className="absolute -top-1 right-6">
                  <div className="w-2 h-2 bg-blue-100 rounded-full animate-pulse shadow-[0_0_8px_rgba(191,219,254,0.8)]"></div>
                </div>
                <div className="absolute top-3 -right-1">
                  <div
                    className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.9)]"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Partículas de brillo flotantes */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-8 left-4 w-1 h-1 bg-amber-300/50 rounded-full animate-pulse"></div>
              <div
                className="absolute bottom-12 right-6 w-1.5 h-1.5 bg-pink-300/40 rounded-full animate-pulse"
                style={{ animationDelay: "0.7s" }}
              ></div>
              <div
                className="absolute top-16 right-8 w-1 h-1 bg-purple-300/50 rounded-full animate-pulse"
                style={{ animationDelay: "1.2s" }}
              ></div>
              <div
                className="absolute bottom-8 left-8 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>

          {/* Texto elegante */}
          <div className="space-y-4">
            <h1 className="text-3xl font-light tracking-[0.3em] text-gray-700 uppercase">
              Gestión de Boda
            </h1>
            <p className="text-sm text-gray-500 font-light tracking-widest uppercase">
              Organizando tu día especial
            </p>

            {/* Línea decorativa con detalle central */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-amber-300"></div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-amber-300/60 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-amber-300/60 rounded-full"></div>
              </div>
              <div className="w-12 h-[1px] bg-gradient-to-l from-transparent via-amber-300 to-amber-300"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header Unificado */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              La solución completa para tu día especial
            </span>
          </div>
          <h2 className="text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Organiza tu Boda <br />
            sin Estrés
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema profesional para gestionar invitados, mesas, confirmaciones
            y notificaciones. Todo en un solo lugar, simple y elegante.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Link href="/login">
              <Button
                size="lg"
                className="text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                <Heart className="w-5 h-5 mr-2" />
                Comenzar Gratis
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg">
                Ver Características
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-pink-600">100%</div>
              <div className="text-sm text-gray-600">Gratis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-600">Invitados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas
          </h3>
          <p className="text-gray-600">
            Herramientas profesionales diseñadas para facilitar la organización
            de tu boda
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-pink-600 mb-2" />
              <CardTitle>Gestión de Familias</CardTitle>
              <CardDescription>
                Organiza representantes de familia y sus invitados (adultos y
                niños)
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Table2 className="w-12 h-12 text-purple-600 mb-2" />
              <CardTitle>Asignación de Mesas</CardTitle>
              <CardDescription>
                Visualiza y organiza mesas interactivamente con drag & drop
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="w-12 h-12 text-blue-600 mb-2" />
              <CardTitle>Notificaciones WhatsApp</CardTitle>
              <CardDescription>
                Envía invitaciones, recordatorios y confirmaciones
                automáticamente
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-green-600 mb-2" />
              <CardTitle>Estadísticas</CardTitle>
              <CardDescription>
                Monitorea confirmaciones, asistencia y distribución de mesas
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Cómo Funciona</h3>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              1
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">
                Registra Representantes de Familia
              </h4>
              <p className="text-gray-600">
                Agrega los datos de contacto de cada representante de familia
                (solo adultos) y asigna el número de invitados permitidos por
                familia.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Gestiona Invitados</h4>
              <p className="text-gray-600">
                Registra todos los invitados asociados a cada familia,
                distinguiendo entre adultos y niños, con sus restricciones
                alimentarias.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              3
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Organiza las Mesas</h4>
              <p className="text-gray-600">
                Crea mesas de diferentes tipos (redondas, rectangulares, VIP,
                infantiles) y asigna invitados visualmente.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              4
            </div>
            <div>
              <h4 className="text-xl font-bold mb-2">Envía Notificaciones</h4>
              <p className="text-gray-600">
                Envía invitaciones, solicita confirmaciones y envía
                recordatorios automáticamente por WhatsApp a los cabezas de
                familia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 text-white">
          <h3 className="text-4xl font-bold mb-4">
            ¿Listo para organizar tu boda?
          </h3>
          <p className="text-xl mb-8 text-pink-100">
            Únete a cientos de parejas que ya están planificando su día especial
            con nosotros
          </p>
          <Link href="/login">
            <Button size="lg" variant="secondary" className="text-lg">
              <Heart className="w-5 h-5 mr-2" />
              Comenzar Ahora - Es Gratis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p className="font-semibold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Gestión de Boda
          </p>
          <p className="mt-2">El sistema profesional para tu día especial</p>
          <p className="mt-4 text-sm">
            © {new Date().getFullYear()} - Hecho con ❤️ para novios organizados
          </p>
        </div>
      </footer>
    </>
  );
}
