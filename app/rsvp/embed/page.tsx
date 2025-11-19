"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Loader2, Check, X, UtensilsCrossed, Baby } from "lucide-react";
import { toast } from "sonner";
import { useEventConfig } from "@/lib/hooks/use-event-config";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  guestType: "ADULT" | "CHILD";
  confirmed: boolean;
  dietaryRestrictions: string | null;
  specialNeeds: string | null;
}

interface FamilyData {
  id: string;
  firstName: string;
  lastName: string;
  inviteCode: string | null;
  allowedGuests: number;
  confirmedGuests: number;
  confirmationStatus: string;
  guests: Guest[];
}

interface GuestConfirmation {
  id: string;
  confirmed: boolean;
  dietaryRestrictions: string;
  specialNeeds: string;
}

export default function RSVPEmbedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { data: eventConfig } = useEventConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFamily, setLoadingFamily] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [guestConfirmations, setGuestConfirmations] = useState<Record<string, GuestConfirmation>>({});

  // Buscar familia por código
  useEffect(() => {
    if (!code) {
      toast.error("Código de invitación no válido");
      setLoadingFamily(false);
      return;
    }

    const fetchFamily = async () => {
      try {
        const response = await fetch(`/api/rsvp/search?code=${code}`);
        if (!response.ok) throw new Error("Familia no encontrada");

        const data = await response.json();
        setFamilyData(data);

        // Inicializar confirmaciones con datos existentes
        const initialConfirmations: Record<string, GuestConfirmation> = {};
        data.guests.forEach((guest: Guest) => {
          initialConfirmations[guest.id] = {
            id: guest.id,
            confirmed: guest.confirmed,
            dietaryRestrictions: guest.dietaryRestrictions || "",
            specialNeeds: guest.specialNeeds || "",
          };
        });
        setGuestConfirmations(initialConfirmations);
      } catch (error) {
        toast.error("No se encontró la familia con ese código");
      } finally {
        setLoadingFamily(false);
      }
    };

    fetchFamily();
  }, [code]);

  const toggleGuestConfirmation = (guestId: string) => {
    setGuestConfirmations((prev) => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        confirmed: !prev[guestId].confirmed,
      },
    }));
  };

  const updateGuestField = (guestId: string, field: keyof GuestConfirmation, value: string) => {
    setGuestConfirmations((prev) => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!familyData) return;

    const confirmedGuests = Object.values(guestConfirmations).filter((g) => g.confirmed);
    if (confirmedGuests.length === 0) {
      toast.error("Debes seleccionar al menos un invitado");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/rsvp/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId: familyData.id,
          confirmations: Object.values(guestConfirmations),
        }),
      });

      if (!response.ok) throw new Error("Error al confirmar");

      toast.success("¡Confirmación exitosa!");
      router.push("/rsvp/embed/thank-you");
    } catch (error) {
      toast.error("Error al procesar la confirmación");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingFamily) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (!familyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md border-2 border-red-200">
          <CardHeader className="text-center">
            <X className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <CardTitle className="text-red-900">Invitación no encontrada</CardTitle>
            <CardDescription>El código proporcionado no es válido</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const confirmedGuests = familyData.guests.filter((g) => guestConfirmations[g.id]?.confirmed);
  const declinedGuests = familyData.guests.filter((g) => !guestConfirmations[g.id]?.confirmed);
  const confirmedCount = confirmedGuests.length;

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-pink-200 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-br from-pink-50 to-purple-50">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                  <Heart className="w-10 h-10 text-white fill-white" />
                </div>
              </div>
              <CardTitle className="text-3xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Confirma tu Asistencia
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Por favor revisa los detalles antes de confirmar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-lg mb-2 text-purple-900">
                  👨‍👩‍👧‍👦 Familia {familyData.firstName} {familyData.lastName}
                </h3>
                <p className="text-sm text-purple-700">
                  {confirmedCount} de {familyData.allowedGuests} invitados confirmados
                </p>
              </div>

              {confirmedGuests.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    Confirman Asistencia ({confirmedGuests.length})
                  </h3>
                  <div className="space-y-3">
                    {confirmedGuests.map((guest) => {
                      const confirmation = guestConfirmations[guest.id];
                      return (
                        <div key={guest.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-green-900">
                              {guest.firstName} {guest.lastName}
                            </p>
                            {guest.guestType === "CHILD" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                <Baby className="w-3 h-3" />
                                Niño
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                <UtensilsCrossed className="w-3 h-3" />
                                Adulto
                              </span>
                            )}
                          </div>
                          {eventConfig?.enableDietaryRestrictions && confirmation.dietaryRestrictions && (
                            <p className="text-sm text-green-700">
                              🥗 Restricciones: {confirmation.dietaryRestrictions}
                            </p>
                          )}
                          {eventConfig?.enableSpecialNeeds && confirmation.specialNeeds && (
                            <p className="text-sm text-green-700">
                              ♿ Necesidades: {confirmation.specialNeeds}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {declinedGuests.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-600">
                    <X className="w-5 h-5" />
                    No Asistirán ({declinedGuests.length})
                  </h3>
                  <div className="space-y-2">
                    {declinedGuests.map((guest) => (
                      <div key={guest.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {guest.firstName} {guest.lastName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  ← Editar
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    "Confirmar Asistencia"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-pink-200 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ¡Estás Invitado! 💕
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Familia {familyData.firstName} {familyData.lastName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-900">
                <strong>Invitados permitidos:</strong> {familyData.allowedGuests}
              </p>
              <p className="text-sm text-purple-700 mt-1">
                Por favor selecciona quién(es) asistirá(n)
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Selecciona invitados:</h3>
              {familyData.guests.map((guest) => {
                const confirmation = guestConfirmations[guest.id];
                return (
                  <div
                    key={guest.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      confirmation.confirmed
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleGuestConfirmation(guest.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${
                          confirmation.confirmed
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 hover:border-pink-500"
                        }`}
                      >
                        {confirmation.confirmed && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div className="flex-1">
                        <div className={`flex items-center gap-2 ${
                          confirmation.confirmed && (eventConfig?.enableDietaryRestrictions || eventConfig?.enableSpecialNeeds) 
                            ? 'mb-3' 
                            : ''
                        }`}>
                          <p className="font-medium">
                            {guest.firstName} {guest.lastName}
                          </p>
                          {guest.guestType === "CHILD" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              <Baby className="w-3 h-3" />
                              Niño
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                              <UtensilsCrossed className="w-3 h-3" />
                              Adulto
                            </span>
                          )}
                        </div>

                        {confirmation.confirmed && (
                          <div className="space-y-3">
                            {eventConfig?.enableDietaryRestrictions && (
                              <div>
                                <Label htmlFor={`dietary-${guest.id}`} className="text-xs">
                                  Restricciones dietéticas
                                </Label>
                                <Input
                                  id={`dietary-${guest.id}`}
                                  placeholder="Ej: Vegetariano, sin gluten, etc."
                                  value={confirmation.dietaryRestrictions}
                                  onChange={(e) => updateGuestField(guest.id, "dietaryRestrictions", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            )}
                            
                            {eventConfig?.enableSpecialNeeds && (
                              <div>
                                <Label htmlFor={`special-${guest.id}`} className="text-xs">
                                  Necesidades especiales
                                </Label>
                                <Input
                                  id={`special-${guest.id}`}
                                  placeholder="Ej: Silla de ruedas, alta silla, etc."
                                  value={confirmation.specialNeeds}
                                  onChange={(e) => updateGuestField(guest.id, "specialNeeds", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => setShowPreview(true)}
              disabled={confirmedCount === 0}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              size="lg"
            >
              Continuar →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
