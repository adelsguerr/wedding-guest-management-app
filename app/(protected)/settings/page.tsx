"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Save, Settings as SettingsIcon, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { WeddingLoader } from "@/components/wedding-loader";
import { Switch } from "@/components/ui/switch";

interface EventConfig {
  id: string;
  weddingDate: string | null;
  rsvpDeadline: string | null;
  eventName: string;
  eventLocation: string | null;
  ceremonyTime: string | null;
  receptionTime: string | null;
  enableDietaryRestrictions: boolean;
  enableSpecialNeeds: boolean;
  wordpressUrl: string | null;
  embedEnabled: boolean;
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
    return <WeddingLoader message="Cargando configuración..." />;
  }

  return (
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

            {/* Campos Opcionales de Invitados */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-600">
                  <Users className="w-5 h-5" />
                  Campos Opcionales para Invitados
                </CardTitle>
                <CardDescription>
                  Habilita o deshabilita campos adicionales para recopilar información de tus invitados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4 p-4 bg-purple-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="dietaryRestrictions" className="text-base font-semibold cursor-pointer">
                      🍽️ Restricciones Dietéticas
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Permite a los invitados indicar si son vegetarianos, veganos, celíacos, alérgicos, etc.
                    </p>
                  </div>
                  <Switch
                    id="dietaryRestrictions"
                    checked={config?.enableDietaryRestrictions || false}
                    onCheckedChange={(checked: boolean) => 
                      setConfig({ ...config!, enableDietaryRestrictions: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between space-x-4 p-4 bg-purple-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="specialNeeds" className="text-base font-semibold cursor-pointer">
                      ♿ Necesidades Especiales
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Permite a los invitados indicar si requieren acceso especial, silla de ruedas, o cualquier otra necesidad
                    </p>
                  </div>
                  <Switch
                    id="specialNeeds"
                    checked={config?.enableSpecialNeeds || false}
                    onCheckedChange={(checked: boolean) => 
                      setConfig({ ...config!, enableSpecialNeeds: checked })
                    }
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Tip:</strong> Estos campos aparecerán automáticamente en los formularios de invitados, 
                    tanto en el panel de administración como en el portal RSVP público cuando estén activados.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Integración WordPress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌐 Integración con WordPress
                </CardTitle>
                <CardDescription>
                  Configura el embed de tu invitación en WordPress/Hostinger
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="wordpressUrl">
                    URL de tu página de invitación en WordPress
                  </Label>
                  <Input
                    id="wordpressUrl"
                    type="url"
                    placeholder="https://rebeca-adelso.amatweddings.com"
                    value={config?.wordpressUrl || ""}
                    onChange={(e) => setConfig({ ...config!, wordpressUrl: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">
                    Esta será la URL que enviarás por WhatsApp. El código del invitado se agregará como parámetro.
                  </p>
                </div>

                <div className="flex items-center justify-between space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="embedEnabled" className="text-base font-semibold cursor-pointer">
                      🔗 Habilitar Modo Embed
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Permite que el RSVP sea embebido en tu página de WordPress usando iframe
                    </p>
                  </div>
                  <Switch
                    id="embedEnabled"
                    checked={config?.embedEnabled || false}
                    onCheckedChange={(checked: boolean) => 
                      setConfig({ ...config!, embedEnabled: checked })
                    }
                  />
                </div>

                {config?.embedEnabled && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-semibold text-purple-900">
                      📝 Código para WordPress (Elementor - Widget HTML):
                    </p>
                    <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
                      <pre>{`<div id="rsvp-container">
  <iframe 
    id="rsvp-frame"
    src="" 
    width="100%" 
    height="800px" 
    frameborder="0"
    style="border: none; border-radius: 12px;">
  </iframe>
</div>

<script>
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const iframe = document.getElementById('rsvp-frame');
  
  if (code) {
    iframe.src = 'https://amatweddings.com/rsvp/embed?code=' + code;
  } else {
    iframe.innerHTML = '<p>Código no válido</p>';
  }
</script>`}</pre>
                    </div>
                    <p className="text-xs text-purple-700">
                      💡 Copia este código y pégalo en un Widget HTML de Elementor en tu página de WordPress
                    </p>
                  </div>
                )}
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
  );
}
