"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Loader2, Copy, Check } from "lucide-react";

interface QRCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: string;
  familyName: string;
}

export function QRCodeDialog({ isOpen, onClose, familyId, familyName }: QRCodeDialogProps) {
  const [qrData, setQRData] = useState<{
    qrCode: string;
    rsvpURL: string;
    inviteCode: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && familyId) {
      fetchQRCode();
    } else {
      setQRData(null);
      setCopied(false);
    }
  }, [isOpen, familyId]);

  const fetchQRCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rsvp/qrcode?familyId=${familyId}`);
      if (!response.ok) throw new Error("Error al generar QR");
      
      const data = await response.json();
      setQRData(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrData) return;

    const link = document.createElement("a");
    link.href = qrData.qrCode;
    link.download = `QR-${familyName.replace(/\s+/g, "-")}-${qrData.inviteCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyURL = async () => {
    if (!qrData) return;

    try {
      await navigator.clipboard.writeText(qrData.rsvpURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copiando URL:", error);
    }
  };

  const handleCopyCode = async () => {
    if (!qrData) return;

    try {
      await navigator.clipboard.writeText(qrData.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copiando código:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            Código QR de Invitación
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Comparte este código QR o enlace con {familyName} para que confirmen su asistencia
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-4">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 animate-spin" />
            <p className="text-sm sm:text-base text-gray-600">Generando código QR...</p>
          </div>
        ) : qrData ? (
          <div className="space-y-4 sm:space-y-6">
            {/* QR Code Display */}
            <div className="flex justify-center p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
              <img 
                src={qrData.qrCode} 
                alt="QR Code" 
                className="w-48 h-48 sm:w-64 sm:h-64 shadow-xl rounded-lg"
              />
            </div>

            {/* Invite Code */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Código de Invitación</label>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 rounded-lg font-mono text-base sm:text-lg font-bold text-center text-purple-700 break-all">
                  {qrData.inviteCode}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  className="shrink-0 h-auto"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* URL */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700">Enlace Directo</label>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 rounded-lg text-xs sm:text-sm break-all">
                  {qrData.rsvpURL}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyURL}
                  className="shrink-0 h-auto"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-sm sm:text-base"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar QR
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 text-sm sm:text-base"
              >
                Cerrar
              </Button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> Puedes imprimir este QR en las invitaciones físicas o enviarlo por WhatsApp. 
                Los invitados solo necesitan escanearlo con su cámara para acceder al formulario de confirmación.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
            No se pudo generar el código QR
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
