"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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

export default function RSVPConfirmPage() {
  const router = useRouter();
  const { data: eventConfig } = useEventConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [guestConfirmations, setGuestConfirmations] = useState<Record<string, GuestConfirmation>>({});

  useEffect(() => {
    // Cargar datos de sessionStorage
    const data = sessionStorage.getItem("rsvp_family");
    if (!data) {
      toast.error("No se encontraron datos de la invitación");
      router.push("/rsvp");
      return;
    }

    const family: FamilyData = JSON.parse(data);
    setFamilyData(family);

    // Inicializar confirmaciones
    const initialConfirmations: Record<string, GuestConfirmation> = {};
    family.guests.forEach((guest) => {
      initialConfirmations[guest.id] = {
        id: guest.id,
        confirmed: guest.confirmed,
        dietaryRestrictions: guest.dietaryRestrictions || "",
        specialNeeds: guest.specialNeeds || "",
      };
    });
    setGuestConfirmations(initialConfirmations);
  }, [router]);

  const toggleGuestConfirmation = (guestId: string) => {
    setGuestConfirmations((prev) => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        confirmed: !prev[guestId].confirmed,
      },
    }));
  };

  const updateGuestField = (guestId: string, field: "dietaryRestrictions" | "specialNeeds", value: string) => {
    setGuestConfirmations((prev) => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!familyData) return;

    const confirmedCount = Object.values(guestConfirmations).filter((g) => g.confirmed).length;

    if (confirmedCount === 0) {
      toast.error("Debes confirmar al menos un invitado o declinar la invitación");
      return;
    }

    if (confirmedCount > familyData.allowedGuests) {
      toast.error(`Solo puedes confirmar hasta ${familyData.allowedGuests} ${familyData.allowedGuests === 1 ? "invitado" : "invitados"}`);
      return;
    }

    // Mostrar vista previa antes de confirmar
    if (!showPreview) {
      setShowPreview(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/rsvp/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          familyHeadId: familyData.id,
          guests: Object.values(guestConfirmations),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Error al confirmar asistencia");
        return;
      }

      toast.success("¡Confirmación enviada exitosamente!");
      sessionStorage.removeItem("rsvp_family");
      router.push("/rsvp/thank-you");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al enviar la confirmación");
    } finally {
      setIsLoading(false);
    }
  };

  if (!familyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  const confirmedCount = Object.values(guestConfirmations).filter((g) => g.confirmed).length;
  const confirmedGuests = familyData.guests.filter(g => guestConfirmations[g.id]?.confirmed);
  const declinedGuests = familyData.guests.filter(g => !guestConfirmations[g.id]?.confirmed);

  // Vista previa de confirmación
  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
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
              {/* Resumen de familia */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-lg mb-2 text-purple-900">
                  👨‍👩‍👧‍👦 Familia {familyData.firstName} {familyData.lastName}
                </h3>
                <p className="text-sm text-purple-700">
                  {confirmedCount} de {familyData.allowedGuests} invitados confirmados
                </p>
              </div>

              {/* Invitados que asisten */}
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

              {/* Invitados que no asisten */}
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

              {/* Botones de acción */}
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
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmar Asistencia
                    </>
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Confirma tu Asistencia
            </CardTitle>
            <CardDescription>
              Familia {familyData.firstName} {familyData.lastName}
            </CardDescription>
            <div className="mt-2 text-sm text-gray-600">
              <p>Invitados permitidos: <strong>{familyData.allowedGuests}</strong></p>
              <p>Confirmados: <strong className={confirmedCount > familyData.allowedGuests ? "text-red-600" : "text-green-600"}>
                {confirmedCount}
              </strong></p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
              {/* Lista de invitados */}
              <div className="space-y-4"  suppressHydrationWarning>
                <h3 className="font-semibold text-lg">Invitados</h3>
                {familyData.guests.map((guest) => {
                  const confirmation = guestConfirmations[guest.id];
                  if (!confirmation) return null;

                  return (
                    <div
                      key={guest.id}
                      className={`p-4 border-2 rounded-lg transition-colors ${
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
                              {/* Restricciones Dietéticas - Condicional */}
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
                              
                              {/* Necesidades Especiales - Condicional */}
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

              {/* Advertencia si excede el límite */}
              {confirmedCount > familyData.allowedGuests && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    ⚠️ Has confirmado más invitados de los permitidos. Por favor, ajusta tu selección.
                  </p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/rsvp")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  disabled={isLoading || confirmedCount > familyData.allowedGuests}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Continuar →
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
