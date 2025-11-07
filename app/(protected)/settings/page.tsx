"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Loader2, Save, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

interface EventConfig {
  id: string;
  weddingDate: string | null;
  rsvpDeadline: string | null;
  eventName: string;
  eventLocation: string | null;
  ceremonyTime: string | null;
  receptionTime: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState<EventConfig | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/event-config");
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      toast.error("Error al cargar la configuración");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/event-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error("Error al guardar");

      toast.success("Configuración guardada exitosamente");
    } catch (error) {
      toast.error("Error al guardar la configuración");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">💒</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Wedding Manager
              </h1>
            </Link>
            <nav className="flex gap-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/families">
                <Button variant="outline">Familias</Button>
              </Link>
              <Link href="/guests">
                <Button variant="outline">Invitados</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Configuración del Evento
            </h2>
          </div>
          <p className="text-gray-600">
            Configura los detalles de tu boda y las fechas importantes
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 max-w-4xl">
            {/* Información del Evento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Información del Evento
                </CardTitle>
                <CardDescription>
                  Detalles básicos de la boda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="eventName">Nombre del Evento</Label>
                  <Input
                    id="eventName"
                    value={config?.eventName || ""}
                    onChange={(e) => setConfig({ ...config!, eventName: e.target.value })}
                    placeholder="Ej: Boda de María y Juan"
                  />
                </div>

                <div>
                  <Label htmlFor="eventLocation">Lugar del Evento</Label>
                  <Input
                    id="eventLocation"
                    value={config?.eventLocation || ""}
                    onChange={(e) => setConfig({ ...config!, eventLocation: e.target.value })}
                    placeholder="Ej: Jardín Los Rosales, Ciudad de México"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ceremonyTime">Hora de la Ceremonia</Label>
                    <Input
                      id="ceremonyTime"
                      type="time"
                      value={config?.ceremonyTime || ""}
                      onChange={(e) => setConfig({ ...config!, ceremonyTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="receptionTime">Hora de la Recepción</Label>
                    <Input
                      id="receptionTime"
                      type="time"
                      value={config?.receptionTime || ""}
                      onChange={(e) => setConfig({ ...config!, receptionTime: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fechas Importantes */}
            <Card className="border-2 border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-600">
                  <Calendar className="w-5 h-5" />
                  Fechas Importantes
                </CardTitle>
                <CardDescription>
                  Configura la fecha de la boda y la fecha límite para confirmar asistencia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="weddingDate" className="text-base font-semibold">
                    📅 Fecha de la Boda
                  </Label>
                  <Input
                    id="weddingDate"
                    type="datetime-local"
                    value={config?.weddingDate?.slice(0, 16) || ""}
                    onChange={(e) => setConfig({ ...config!, weddingDate: e.target.value })}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Selecciona la fecha y hora exacta de la boda
                  </p>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <Label htmlFor="rsvpDeadline" className="text-base font-semibold text-yellow-800">
                    ⏰ Fecha Límite para Confirmar (RSVP)
                  </Label>
                  <Input
                    id="rsvpDeadline"
                    type="datetime-local"
                    value={config?.rsvpDeadline?.slice(0, 16) || ""}
                    onChange={(e) => setConfig({ ...config!, rsvpDeadline: e.target.value })}
                    className="mt-2 border-yellow-300 focus-visible:ring-yellow-500"
                  />
                  <p className="text-xs text-yellow-700 mt-2">
                    ⚠️ <strong>Importante:</strong> Esta fecha se mostrará en el portal RSVP con un contador regresivo.
                    Los invitados verán cuánto tiempo les queda para confirmar su asistencia.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Configuración
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
