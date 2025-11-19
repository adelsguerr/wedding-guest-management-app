"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, CheckCircle, XCircle, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

interface SendResult {
  familyId: string;
  familyName: string;
  success: boolean;
  error?: string;
}

export default function NotificationsPage() {
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<SendResult[]>([]);
  const [stats, setStats] = useState({ total: 0, successful: 0, failed: 0 });
  const [showPreview, setShowPreview] = useState(false);
  
  // Configuración del mensaje
  const [invitationUrl, setInvitationUrl] = useState(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  );
  const [messageTemplate, setMessageTemplate] = useState(
    `¡Hola {familia}! 💒✨

Es momento de confirmar tu asistencia a nuestra boda.

👥 Tu familia tiene {cupos} {invitaciones}.

Por favor confirma aquí:
{enlace}

¡Esperamos contar contigo! 💕

Rebeca & Adelso`
  );

  const handleSendInvitations = async () => {
    if (!invitationUrl.trim()) {
      toast.error("Debes especificar la URL de invitación");
      return;
    }

    if (!messageTemplate.trim()) {
      toast.error("Debes escribir un mensaje");
      return;
    }

    if (!confirm("¿Estás seguro de enviar invitaciones a TODAS las familias registradas?")) {
      return;
    }

    setIsSending(true);
    setResults([]);
    
    try {
      const response = await fetch("/api/notifications/send-invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationUrl,
          messageTemplate,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar invitaciones");
      }

      const data = await response.json();
      
      setStats({
        total: data.total,
        successful: data.successful,
        failed: data.failed,
      });
      
      setResults(data.results);

      toast.success(
        `Invitaciones enviadas: ${data.successful} exitosas, ${data.failed} fallidas`
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar las invitaciones");
    } finally {
      setIsSending(false);
    }
  };

  // Generar vista previa con datos de ejemplo
  const getPreviewMessage = () => {
    return messageTemplate
      .replace("{familia}", "García Rodríguez")
      .replace("{cupos}", "4")
      .replace("{invitaciones}", "invitaciones")
      .replace("{enlace}", `${invitationUrl}/rsvp?code=ABC12345`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Notificaciones WhatsApp
        </h1>
        <p className="text-gray-600">
          Envía invitaciones personalizadas por WhatsApp a tus invitados
        </p>
      </div>

      {/* Card de configuración */}
      <Card className="border-2 border-pink-200 mb-8">
        <CardHeader className="bg-gradient-to-br from-pink-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-pink-600" />
            Configurar Invitación WhatsApp
          </CardTitle>
          <CardDescription>
            Personaliza el mensaje y el enlace de invitación
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* URL de Invitación */}
          <div>
            <Label htmlFor="invitationUrl" className="text-base font-semibold">
              URL de Invitación
            </Label>
            <p className="text-sm text-gray-500 mb-2">
              Esta será la base del enlace que recibirán los invitados
            </p>
            <Input
              id="invitationUrl"
              type="url"
              placeholder="https://invitacion.tuboda.com"
              value={invitationUrl}
              onChange={(e) => setInvitationUrl(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-gray-400 mt-1">
              Ejemplo final: {invitationUrl}/rsvp?code=ABC12345
            </p>
          </div>

          {/* Plantilla de Mensaje */}
          <div>
            <Label htmlFor="messageTemplate" className="text-base font-semibold">
              Mensaje Personalizado
            </Label>
            <p className="text-sm text-gray-500 mb-2">
              Usa las siguientes variables: <code className="bg-gray-100 px-1 rounded">{"{familia}"}</code>,{" "}
              <code className="bg-gray-100 px-1 rounded">{"{cupos}"}</code>,{" "}
              <code className="bg-gray-100 px-1 rounded">{"{invitaciones}"}</code>,{" "}
              <code className="bg-gray-100 px-1 rounded">{"{enlace}"}</code>
            </p>
            <Textarea
              id="messageTemplate"
              rows={10}
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {/* Botón de Vista Previa */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full"
          >
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? "Ocultar Vista Previa" : "Ver Vista Previa"}
          </Button>

          {/* Vista Previa */}
          {showPreview && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-900 mb-2">
                📱 Vista Previa (Ejemplo con familia "García Rodríguez", 4 invitaciones):
              </p>
              <div className="bg-white p-3 rounded border border-green-300 whitespace-pre-wrap text-sm">
                {getPreviewMessage()}
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>� Cómo funciona:</strong>
              <br />
              • <code className="bg-blue-100 px-1 rounded">{"{familia}"}</code> se reemplaza con el nombre de cada familia
              <br />
              • <code className="bg-blue-100 px-1 rounded">{"{cupos}"}</code> se reemplaza con el número de invitaciones permitidas
              <br />
              • <code className="bg-blue-100 px-1 rounded">{"{invitaciones}"}</code> se ajusta automáticamente (invitación/invitaciones)
              <br />
              • <code className="bg-blue-100 px-1 rounded">{"{enlace}"}</code> se genera automáticamente con el código único
            </p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              <strong>⚠️ Importante:</strong>
              <br />
              • Asegúrate de tener configuradas tus credenciales de Twilio
              <br />
              • Verifica que todos los números de teléfono estén correctos
              <br />
              • El envío puede tardar varios minutos
            </p>
          </div>

          <Button
            onClick={handleSendInvitations}
            disabled={isSending}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            size="lg"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enviando invitaciones...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Enviar Invitaciones a Todas las Familias
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {results.length > 0 && (
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardTitle>Resultados del Envío</CardTitle>
            <CardDescription>
              Total: {stats.total} | Exitosos: {stats.successful} | Fallidos: {stats.failed}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">{result.familyName}</span>
                  </div>
                  {!result.success && result.error && (
                    <span className="text-sm text-red-600">{result.error}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
