"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Loader2, Search, User } from "lucide-react";
import { toast } from "sonner";
import { CountdownTimer } from "@/components/CountdownTimer";

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

interface SearchResult {
  id: string;
  firstName: string;
  lastName: string;
  inviteCode: string | null;
  allowedGuests: number;
}

export default function RSVPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchMethod, setSearchMethod] = useState<"code" | "name">("code");
  const [rsvpDeadline, setRsvpDeadline] = useState<Date | null>(null);
  
  // Búsqueda por código
  const [inviteCode, setInviteCode] = useState("");
  
  // Búsqueda por nombre
  const [searchName, setSearchName] = useState("");
  const [multipleResults, setMultipleResults] = useState<SearchResult[]>([]);

  // Cargar fecha límite de confirmación
  useEffect(() => {
    const fetchDeadline = async () => {
      try {
        const response = await fetch("/api/event-config");
        const data = await response.json();
        if (data.rsvpDeadline) {
          setRsvpDeadline(new Date(data.rsvpDeadline));
        }
      } catch (error) {
        console.error("Error cargando fecha límite:", error);
      }
    };
    fetchDeadline();
  }, []);

  // Auto-buscar si viene código en la URL
  useEffect(() => {
    const codeFromURL = searchParams.get("code");
    if (codeFromURL) {
      setInviteCode(codeFromURL.toUpperCase());
      // Buscar automáticamente
      searchByCodeParam(codeFromURL);
    }
  }, [searchParams]);

  const searchByCodeParam = async (code: string) => {
    if (!code.trim()) return;

    setIsLoading(true);
    setMultipleResults([]);

    try {
      const response = await fetch(`/api/rsvp/search?code=${encodeURIComponent(code)}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "No se encontró la invitación");
        return;
      }

      // Guardar datos en sessionStorage y redirigir al formulario
      sessionStorage.setItem("rsvp_family", JSON.stringify(data));
      router.push("/rsvp/confirm");
    } catch (error) {
      toast.error("Error al buscar la invitación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast.error("Por favor ingresa tu código de invitación");
      return;
    }

    setIsLoading(true);
    setMultipleResults([]);

    try {
      const response = await fetch(`/api/rsvp/search?code=${encodeURIComponent(inviteCode)}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "No se encontró la invitación");
        return;
      }

      // Guardar datos en sessionStorage y redirigir al formulario
      sessionStorage.setItem("rsvp_family", JSON.stringify(data));
      router.push("/rsvp/confirm");
    } catch (error) {
      toast.error("Error al buscar la invitación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchName.trim()) {
      toast.error("Por favor ingresa un nombre o apellido");
      return;
    }

    setIsLoading(true);
    setMultipleResults([]);

    try {
      const response = await fetch(`/api/rsvp/search?name=${encodeURIComponent(searchName)}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "No se encontró ninguna invitación");
        return;
      }

      // Si hay múltiples resultados, mostrarlos
      if (data.multiple) {
        setMultipleResults(data.results);
        toast.info("Se encontraron varios resultados, selecciona tu invitación");
        return;
      }

      // Si solo hay un resultado, redirigir directamente
      sessionStorage.setItem("rsvp_family", JSON.stringify(data));
      router.push("/rsvp/confirm");
    } catch (error) {
      toast.error("Error al buscar la invitación");
    } finally {
      setIsLoading(false);
    }
  };

  const selectFamily = (family: SearchResult) => {
    setInviteCode(family.inviteCode || "");
    setMultipleResults([]);
    toast.success(`Familia ${family.firstName} ${family.lastName} seleccionada`);
    // Automáticamente buscar por código
    if (family.inviteCode) {
      setSearchMethod("code");
      setTimeout(() => {
        const form = document.getElementById("code-search-form") as HTMLFormElement;
        form?.requestSubmit();
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2 border-pink-100">
        <CardHeader className="text-center bg-gradient-to-br from-pink-50 to-purple-50 pb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                <Heart className="w-12 h-12 text-white fill-white animate-pulse" />
              </div>
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Confirma tu Asistencia
          </CardTitle>
          <CardDescription className="text-lg mt-3 text-gray-700">
            ✨ Nos encantaría contar con tu presencia en nuestro día especial ✨
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Countdown Timer */}
          {rsvpDeadline && (
            <div className="mb-6">
              <CountdownTimer deadline={rsvpDeadline} />
            </div>
          )}

          <Tabs value={searchMethod} onValueChange={(v) => setSearchMethod(v as "code" | "name")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">
                <Search className="w-4 h-4 mr-2" />
                Por Código
              </TabsTrigger>
              <TabsTrigger value="name">
                <User className="w-4 h-4 mr-2" />
                Por Nombre
              </TabsTrigger>
            </TabsList>

            {/* Búsqueda por código */}
            <TabsContent value="code">
              <form id="code-search-form" onSubmit={handleSearchByCode} className="space-y-4" suppressHydrationWarning>
                <div className="space-y-2" suppressHydrationWarning>
                  <Label htmlFor="invite-code">Código de Invitación</Label>
                  <Input
                    id="invite-code"
                    type="text"
                    placeholder="Ej: ABC123XYZ"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    disabled={isLoading}
                    className="text-center text-lg font-mono tracking-wider"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Ingresa el código que aparece en tu invitación
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Invitación
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Búsqueda por nombre */}
            <TabsContent value="name">
              <form onSubmit={handleSearchByName} className="space-y-4" suppressHydrationWarning>
                <div className="space-y-2" suppressHydrationWarning>
                  <Label htmlFor="search-name">Nombre o Apellido</Label>
                  <Input
                    id="search-name"
                    type="text"
                    placeholder="Ej: García o María"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    disabled={isLoading}
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Ingresa tu nombre o apellido como aparece en la invitación
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Invitación
                    </>
                  )}
                </Button>
              </form>

              {/* Resultados múltiples */}
              {multipleResults.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Selecciona tu invitación:
                  </p>
                  {multipleResults.map((family) => (
                    <button
                      key={family.id}
                      onClick={() => selectFamily(family)}
                      className="w-full p-4 text-left border rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
                    >
                      <p className="font-medium">
                        {family.firstName} {family.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {family.allowedGuests} {family.allowedGuests === 1 ? "invitado" : "invitados"}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>¿No encuentras tu invitación?</strong>
              <br />
              Contacta con los novios para obtener tu código de acceso
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
