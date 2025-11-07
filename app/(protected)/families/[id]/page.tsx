"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Phone, Mail, Users, UserCheck, Baby, User, Pencil } from "lucide-react";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  guestType: "ADULT" | "CHILD";
  confirmed: boolean;
  dietaryRestrictions?: string;
  specialNeeds?: string;
  seat?: {
    id: string;
    seatNumber: number;
    table: {
      name: string;
    };
  };
}

interface FamilyHead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  allowedGuests: number;
  confirmedGuests: number;
  confirmationStatus: string;
  createdAt: string;
  guests: Guest[];
}

export default function FamilyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [family, setFamily] = useState<FamilyHead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    allowedGuests: 1,
    confirmationStatus: "PENDING",
  });

  useEffect(() => {
    fetchFamily();
  }, [params.id]);

  const fetchFamily = async () => {
    try {
      const response = await fetch(`/api/families/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFamily(data);
        // Inicializar formulario de edición
        setEditForm({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email || "",
          allowedGuests: data.allowedGuests,
          confirmationStatus: data.confirmationStatus,
        });
      } else {
        toast.error("Familia no encontrada");
        router.push("/families");
      }
    } catch (error) {
      console.error("Error fetching family:", error);
      toast.error("Error al cargar los datos de la familia");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      PENDING: { label: "⏳ Pendiente", color: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { label: "✅ Confirmado", color: "bg-green-100 text-green-800" },
      DECLINED: { label: "❌ Declinado", color: "bg-red-100 text-red-800" },
      NO_RESPONSE: { label: "🔇 Sin respuesta", color: "bg-gray-100 text-gray-800" },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.phone.trim()) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      const response = await fetch(`/api/families/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        toast.success("Familia actualizada correctamente");
        setShowEditModal(false);
        fetchFamily();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al actualizar la familia");
      }
    } catch (error) {
      console.error("Error updating family:", error);
      toast.error("Error al actualizar la familia");
    }
  };

  const handleToggleGuestConfirmation = async (guestId: string, currentConfirmed: boolean) => {
    try {
      // Actualizar el estado del invitado
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: !currentConfirmed }),
      });

      if (response.ok) {
        toast.success(
          !currentConfirmed ? "Invitado confirmado ✅" : "Confirmación removida"
        );
        
        // Recargar datos de la familia
        await fetchFamily();
        
        // Verificar si todos los invitados están confirmados
        const updatedFamily = await fetch(`/api/families/${params.id}`).then(res => res.json());
        
        if (updatedFamily.guests && updatedFamily.guests.length > 0) {
          const allConfirmed = updatedFamily.guests.every((guest: Guest) => guest.confirmed);
          const someConfirmed = updatedFamily.guests.some((guest: Guest) => guest.confirmed);
          
          let newFamilyStatus = updatedFamily.confirmationStatus;
          
          // Si todos están confirmados, confirmar la familia
          if (allConfirmed && updatedFamily.confirmationStatus !== "CONFIRMED") {
            newFamilyStatus = "CONFIRMED";
            await fetch(`/api/families/${params.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ confirmationStatus: "CONFIRMED" }),
            });
            toast.success("¡Toda la familia confirmada! 🎉");
          }
          // Si ninguno está confirmado, volver a pendiente
          else if (!someConfirmed && updatedFamily.confirmationStatus === "CONFIRMED") {
            newFamilyStatus = "PENDING";
            await fetch(`/api/families/${params.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ confirmationStatus: "PENDING" }),
            });
            toast.info("Familia marcada como pendiente");
          }
          
          // Recargar una última vez para mostrar el estado actualizado
          if (newFamilyStatus !== updatedFamily.confirmationStatus) {
            await fetchFamily();
          }
        }
      } else {
        toast.error("Error al actualizar el estado");
      }
    } catch (error) {
      console.error("Error updating guest confirmation:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!family) {
    return null;
  }

  const adults = family.guests.filter((g) => g.guestType === "ADULT");
  const children = family.guests.filter((g) => g.guestType === "CHILD");
  const confirmedCount = family.guests.filter((g) => g.confirmed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/families">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Detalles de Familia
            </h2>
            <p className="text-gray-600 mt-2">
              Información completa del grupo familiar
            </p>
          </div>
          <Button
            onClick={() => setShowEditModal(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Editar Familia
          </Button>
        </div>

        {/* Información del Representante */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Representante de Familia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre completo</p>
                <p className="text-lg font-semibold">
                  {family.firstName} {family.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                {getStatusBadge(family.confirmationStatus)}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{family.phone}</p>
                </div>
              </div>
              {family.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{family.email}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">Invitados permitidos</p>
                <p className="text-2xl font-bold text-purple-600">{family.allowedGuests}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Invitados registrados</p>
                <p className="text-2xl font-bold text-blue-600">{family.guests.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Confirmados</p>
                <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invitados Adultos */}
        {adults.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Invitados Adultos ({adults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adults.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-lg">
                          {guest.firstName} {guest.lastName}
                        </p>
                        {guest.seat && (
                          <p className="text-sm text-gray-600 mt-1">
                            📍 {guest.seat.table.name} - Asiento #{guest.seat.seatNumber}
                          </p>
                        )}
                        {guest.dietaryRestrictions && (
                          <p className="text-sm text-orange-600 mt-1">
                            🍽️ {guest.dietaryRestrictions}
                          </p>
                        )}
                        {guest.specialNeeds && (
                          <p className="text-sm text-blue-600 mt-1">
                            ℹ️ {guest.specialNeeds}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={guest.confirmed ? "outline" : "default"}
                          onClick={() => handleToggleGuestConfirmation(guest.id, guest.confirmed)}
                          className={guest.confirmed ? "" : "bg-green-600 hover:bg-green-700"}
                        >
                          {guest.confirmed ? "Remover confirmación" : "Confirmar"}
                        </Button>
                        {guest.confirmed ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            ✅ Confirmado
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            ⏳ Pendiente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invitados Niños */}
        {children.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-pink-600" />
                Invitados Niños ({children.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {children.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-lg">
                          {guest.firstName} {guest.lastName}
                        </p>
                        {guest.seat && (
                          <p className="text-sm text-gray-600 mt-1">
                            📍 {guest.seat.table.name} - Asiento #{guest.seat.seatNumber}
                          </p>
                        )}
                        {guest.specialNeeds && (
                          <p className="text-sm text-blue-600 mt-1">
                            ℹ️ {guest.specialNeeds}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={guest.confirmed ? "outline" : "default"}
                          onClick={() => handleToggleGuestConfirmation(guest.id, guest.confirmed)}
                          className={guest.confirmed ? "" : "bg-green-600 hover:bg-green-700"}
                        >
                          {guest.confirmed ? "Remover confirmación" : "Confirmar"}
                        </Button>
                        {guest.confirmed ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            ✅ Confirmado
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            ⏳ Pendiente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sin Invitados */}
        {family.guests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay invitados registrados aún</p>
              <p className="text-gray-400 text-sm mt-2">
                Ve a la sección de Invitados para agregar miembros a esta familia
              </p>
              <Link href="/guests">
                <Button className="mt-4">
                  Agregar Invitados
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Edición */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Familia</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="allowedGuests">Invitados Permitidos *</Label>
              <Input
                id="allowedGuests"
                type="number"
                min="1"
                max="20"
                value={editForm.allowedGuests}
                onChange={(e) => setEditForm({ ...editForm, allowedGuests: parseInt(e.target.value) })}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Actualmente hay {family?.guests.length || 0} invitados registrados
              </p>
            </div>

            <div>
              <Label htmlFor="confirmationStatus">Estado de Confirmación</Label>
              <Select
                value={editForm.confirmationStatus}
                onValueChange={(value) => setEditForm({ ...editForm, confirmationStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">⏳ Pendiente</SelectItem>
                  <SelectItem value="CONFIRMED">✅ Confirmado</SelectItem>
                  <SelectItem value="DECLINED">❌ Declinado</SelectItem>
                  <SelectItem value="NO_RESPONSE">🔇 Sin respuesta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600"
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
