"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Users, Plus, Baby, User, Trash2, Search, Filter, Pencil, X, Loader2 } from "lucide-react";
import { useGuests, useCreateGuest, useUpdateGuest, useDeleteGuest, type Guest } from "@/lib/hooks/use-guests";
import { useFamilies } from "@/lib/hooks/use-families";
import { useModalStore, useFilterStore, useUIStore } from "@/lib/stores";
import { WeddingLoader } from "@/components/wedding-loader";
import { useEventConfig } from "@/lib/hooks/use-event-config";

export default function GuestsPage() {
  // React Query Hooks
  const { data: guests = [], isLoading: loadingGuests } = useGuests();
  const { data: families = [], isLoading: loadingFamilies } = useFamilies();
  const { data: eventConfig } = useEventConfig();
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();

  // Zustand Stores
  const { 
    isGuestModalOpen, 
    guestModalMode,
    selectedGuestId,
    openGuestModal, 
    closeGuestModal 
  } = useModalStore();
  
  const {
    guestTypeFilter,
    guestSearchQuery,
    setGuestTypeFilter,
    setGuestSearchQuery,
    clearGuestFilters
  } = useFilterStore();
  
  const { showToast, openConfirmDialog } = useUIStore();

  // Cargar datos cuando se abre en modo edición
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    guestType: "ADULT" as "ADULT" | "CHILD",
    familyHeadId: "",
    dietaryRestrictions: "",
    specialNeeds: "",
  });

  // Validation State
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    familyHeadId: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    familyHeadId: "",
  });

  // Cargar datos cuando se abre en modo edición
  useEffect(() => {
    if (isGuestModalOpen && guestModalMode === 'edit' && selectedGuestId) {
      const guest = guests?.find((g) => g.id === selectedGuestId);
      if (guest) {
        setFormData({
          firstName: guest.firstName,
          lastName: guest.lastName,
          guestType: guest.guestType,
          familyHeadId: guest.familyHeadId,
          dietaryRestrictions: guest.dietaryRestrictions || "",
          specialNeeds: guest.specialNeeds || "",
        });
      }
    }
  }, [isGuestModalOpen, guestModalMode, selectedGuestId, guests]);

  // Helper function to reset form
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      guestType: "ADULT",
      familyHeadId: "",
      dietaryRestrictions: "",
      specialNeeds: "",
    });
    setTouched({ firstName: false, lastName: false, familyHeadId: false });
    setErrors({ firstName: "", lastName: "", familyHeadId: "" });
  };

  const handleCloseModal = () => {
    resetForm();
    closeGuestModal();
  };

  // Validation Logic
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "El nombre es obligatorio";
        if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
        return "";
      case "lastName":
        if (!value.trim()) return "El apellido es obligatorio";
        if (value.trim().length < 2) return "El apellido debe tener al menos 2 caracteres";
        return "";
      case "familyHeadId":
        if (!value) return "Debe seleccionar una familia";
        return "";
      default:
        return "";
    }
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });

    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleFieldBlur = (name: string) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, formData[name as keyof typeof formData] as string);
    setErrors({ ...errors, [name]: error });
  };

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ firstName: true, lastName: true, familyHeadId: true });

    const firstNameError = validateField("firstName", formData.firstName);
    const lastNameError = validateField("lastName", formData.lastName);
    const familyHeadIdError = validateField("familyHeadId", formData.familyHeadId);

    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      familyHeadId: familyHeadIdError,
    });

    if (firstNameError || lastNameError || familyHeadIdError) return;

    try {
      if (guestModalMode === 'edit' && selectedGuestId) {
        // Update
        await updateGuest.mutateAsync({
          id: selectedGuestId,
          data: formData,
        });
        
        showToast('success', 'Invitado actualizado', `${formData.firstName} ${formData.lastName} ha sido actualizado`);
      } else {
        // Create
        await createGuest.mutateAsync(formData);
        
        showToast('success', 'Invitado creado', `${formData.firstName} ${formData.lastName} ha sido agregado exitosamente`);
      }

      resetForm();
      closeGuestModal();
    } catch (error) {
      showToast(
        'error',
        'Error',
        guestModalMode === 'edit' 
          ? 'No se pudo actualizar el invitado' 
          : 'No se pudo crear el invitado'
      );
    }
  };

  const handleEdit = (guest: Guest) => {
    openGuestModal('edit', guest.id);
  };

  const handleDeleteClick = (guest: Guest) => {
    openConfirmDialog(
      '¿Eliminar invitado?',
      `¿Estás seguro de que deseas eliminar a ${guest.firstName} ${guest.lastName}? Esta acción no se puede deshacer.`,
      async () => {
        try {
          await deleteGuest.mutateAsync(guest.id);
          showToast('success', 'Invitado eliminado', `${guest.firstName} ${guest.lastName} ha sido eliminado`);
        } catch (error) {
          showToast('error', 'Error al eliminar', 'No se pudo eliminar el invitado. Intenta nuevamente.');
        }
      }
    );
  };

  // Filtering (ahora usa el store)
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.firstName.toLowerCase().includes(guestSearchQuery.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(guestSearchQuery.toLowerCase()) ||
      `${guest.familyHead.firstName} ${guest.familyHead.lastName}`
        .toLowerCase()
        .includes(guestSearchQuery.toLowerCase());

    const matchesType = guestTypeFilter === "ALL" || guest.guestType === guestTypeFilter;

    return matchesSearch && matchesType;
  });

  // Stats
  const stats = {
    total: guests.length,
    adults: guests.filter((g) => g.guestType === "ADULT").length,
    children: guests.filter((g) => g.guestType === "CHILD").length,
    confirmed: guests.filter((g) => g.confirmed).length,
  };

  // Check if family can add more guests
  const canAddToFamily = (familyId: string) => {
    const family = families.find((f) => f.id === familyId);
    if (!family) return false;
    return family._count.guests < family.allowedGuests;
  };

  // Loading State
  if (loadingGuests || loadingFamilies) {
    return <WeddingLoader message="Cargando invitados..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Gestión de Invitados
            </h2>
            <p className="text-gray-600 mt-2">Administra todos los invitados de la boda</p>
          </div>
          <Button
            onClick={() => openGuestModal('create')}
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Invitado
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invitados</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-12 h-12 text-pink-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Adultos</p>
                  <p className="text-3xl font-bold">{stats.adults}</p>
                </div>
                <User className="w-12 h-12 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Niños</p>
                  <p className="text-3xl font-bold">{stats.children}</p>
                </div>
                <Baby className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmados</p>
                  <p className="text-3xl font-bold">{stats.confirmed}</p>
                </div>
                <Users className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o familia..."
                  value={guestSearchQuery}
                  onChange={(e) => setGuestSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {guestSearchQuery && (
                  <button
                    onClick={() => setGuestSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                variant="ghost"
                onClick={clearGuestFilters}
                className={`text-gray-500 transition-opacity ${
                  guestSearchQuery || guestTypeFilter !== 'ALL' 
                    ? 'opacity-100' 
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <X className="w-4 h-4 mr-2" />
                Limpiar filtros
              </Button>
              <div className="flex gap-2">
                <Button
                  variant={guestTypeFilter === "ALL" ? "default" : "outline"}
                  onClick={() => setGuestTypeFilter("ALL")}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Todos ({guests.length})
                </Button>
                <Button
                  variant={guestTypeFilter === "ADULT" ? "default" : "outline"}
                  onClick={() => setGuestTypeFilter("ADULT")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Adultos ({stats.adults})
                </Button>
                <Button
                  variant={guestTypeFilter === "CHILD" ? "default" : "outline"}
                  onClick={() => setGuestTypeFilter("CHILD")}
                >
                  <Baby className="w-4 h-4 mr-2" />
                  Niños ({stats.children})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuests.map((guest) => (
            <Card key={guest.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {guest.guestType === "ADULT" ? (
                      <User className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Baby className="w-5 h-5 text-purple-600" />
                    )}
                    {guest.firstName} {guest.lastName}
                  </span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(guest)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(guest)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Familia:</span>{" "}
                    <Link
                      href={`/families/${guest.familyHead.id}`}
                      className="text-pink-600 hover:underline font-medium"
                    >
                      {guest.familyHead.firstName} {guest.familyHead.lastName}
                    </Link>
                  </div>
                  {guest.seat ? (
                    <div>
                      <span className="text-gray-600">Mesa:</span>{" "}
                      <span className="font-medium">
                        {guest.seat.table.name} - Asiento #{guest.seat.seatNumber}
                      </span>
                    </div>
                  ) : (
                    <div className="text-amber-600">Sin asiento asignado</div>
                  )}
                  {eventConfig?.enableDietaryRestrictions && guest.dietaryRestrictions && (
                    <div>
                      <span className="text-gray-600">Dieta:</span>{" "}
                      <span className="text-xs">{guest.dietaryRestrictions}</span>
                    </div>
                  )}
                  {eventConfig?.enableSpecialNeeds && guest.specialNeeds && (
                    <div>
                      <span className="text-gray-600">Necesidades:</span>{" "}
                      <span className="text-xs">{guest.specialNeeds}</span>
                    </div>
                  )}
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        guest.confirmed
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {guest.confirmed ? "✅ Confirmado" : "⏳ Pendiente"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredGuests.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="pt-6 text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">No se encontraron invitados</p>
                <Button onClick={clearGuestFilters}>
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create/Edit Form Modal */}
        <Dialog open={isGuestModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {guestModalMode === 'edit' ? "Editar Invitado" : "Agregar Nuevo Invitado"}
              </DialogTitle>
              <DialogDescription>
                {guestModalMode === 'edit'
                  ? "Modifica los datos del invitado"
                  : "Completa los datos del nuevo invitado. Será asignado a una familia existente."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className={errors.firstName && touched.firstName ? "text-red-600" : ""}>
                    Nombre *
                  </Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      placeholder="Ej: María"
                      value={formData.firstName}
                      onChange={(e) => handleFieldChange("firstName", e.target.value)}
                      onBlur={() => handleFieldBlur("firstName")}
                      className={
                        touched.firstName && errors.firstName
                          ? "border-red-500 focus-visible:ring-red-500 pr-10"
                          : touched.firstName && !errors.firstName
                          ? "border-green-500 focus-visible:ring-green-500 pr-10"
                          : ""
                      }
                    />
                    {touched.firstName && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {errors.firstName ? (
                          <span className="text-red-500 text-xl">⚠️</span>
                        ) : (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                  {touched.firstName && errors.firstName && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName" className={errors.lastName && touched.lastName ? "text-red-600" : ""}>
                    Apellido *
                  </Label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      placeholder="Ej: González"
                      value={formData.lastName}
                      onChange={(e) => handleFieldChange("lastName", e.target.value)}
                      onBlur={() => handleFieldBlur("lastName")}
                      className={
                        touched.lastName && errors.lastName
                          ? "border-red-500 focus-visible:ring-red-500 pr-10"
                          : touched.lastName && !errors.lastName
                          ? "border-green-500 focus-visible:ring-green-500 pr-10"
                          : ""
                      }
                    />
                    {touched.lastName && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {errors.lastName ? (
                          <span className="text-red-500 text-xl">⚠️</span>
                        ) : (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                  {touched.lastName && errors.lastName && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="familyHeadId" className={errors.familyHeadId && touched.familyHeadId ? "text-red-600" : ""}>
                  Familia *
                </Label>
                <Select
                  value={formData.familyHeadId}
                  onValueChange={(value) => handleFieldChange("familyHeadId", value)}
                >
                  <SelectTrigger
                    className={
                      touched.familyHeadId && errors.familyHeadId
                        ? "border-red-500"
                        : touched.familyHeadId && !errors.familyHeadId
                        ? "border-green-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Selecciona una familia" />
                  </SelectTrigger>
                  <SelectContent>
                    {families.map((family) => {
                      const hasSpace = canAddToFamily(family.id);
                      return (
                        <SelectItem
                          key={family.id}
                          value={family.id}
                          disabled={!hasSpace && guestModalMode !== 'edit'}
                        >
                          {family.firstName} {family.lastName} ({family._count.guests}/{family.allowedGuests})
                          {!hasSpace && guestModalMode !== 'edit' && " - Completo"}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {touched.familyHeadId && errors.familyHeadId && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.familyHeadId}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="guestType">Tipo de Invitado *</Label>
                <Select
                  value={formData.guestType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, guestType: value as "ADULT" | "CHILD" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADULT">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Adulto
                      </div>
                    </SelectItem>
                    <SelectItem value="CHILD">
                      <div className="flex items-center gap-2">
                        <Baby className="w-4 h-4" />
                        Niño
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Restricciones Dietéticas - Condicional */}
              {eventConfig?.enableDietaryRestrictions && (
                <div>
                  <Label htmlFor="dietaryRestrictions">Restricciones Alimentarias (opcional)</Label>
                  <Input
                    id="dietaryRestrictions"
                    placeholder="Ej: Vegetariano, celíaco, alérgico a..."
                    value={formData.dietaryRestrictions}
                    onChange={(e) =>
                      setFormData({ ...formData, dietaryRestrictions: e.target.value })
                    }
                  />
                </div>
              )}

              {/* Necesidades Especiales - Condicional */}
              {eventConfig?.enableSpecialNeeds && (
                <div>
                  <Label htmlFor="specialNeeds">Necesidades Especiales (opcional)</Label>
                  <Input
                    id="specialNeeds"
                    placeholder="Ej: Silla de ruedas, asiento especial..."
                    value={formData.specialNeeds}
                    onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                  />
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-600 to-purple-600"
                  disabled={createGuest.isPending || updateGuest.isPending}
                >
                  {createGuest.isPending || updateGuest.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {guestModalMode === 'edit' ? "Actualizar" : "Guardar"} Invitado
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  );
}
