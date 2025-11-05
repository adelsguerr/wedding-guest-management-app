import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Table2, MessageSquare, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">💒</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Wedding Manager
              </h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/families">
                <Button>Comenzar</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl font-bold text-gray-900">
            Gestiona tu Boda sin Estrés
          </h2>
          <p className="text-xl text-gray-600">
            Sistema completo para organizar invitados, mesas y notificaciones
            por WhatsApp
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/families">
              <Button size="lg" className="text-lg">
                Empezar Ahora
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg">
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-pink-600 mb-2" />
              <CardTitle>Gestión de Familias</CardTitle>
              <CardDescription>
                Organiza representantes de familia y sus invitados (adultos y niños)
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
        <h3 className="text-3xl font-bold text-center mb-12">
          Cómo Funciona
        </h3>
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
                Agrega los datos de contacto de cada representante de familia (solo
                adultos) y asigna el número de invitados permitidos por familia.
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
              <h4 className="text-xl font-bold mb-2">
                Envía Notificaciones
              </h4>
              <p className="text-gray-600">
                Envía invitaciones, solicita confirmaciones y envía
                recordatorios automáticamente por WhatsApp a los cabezas de
                familia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>💒 Wedding Guest Management System - {new Date().getFullYear()}</p>
          <p className="mt-2">¡Felicidades por tu boda! 👰🤵</p>
        </div>
      </footer>
    </div>
  );
}
