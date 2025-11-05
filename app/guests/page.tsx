"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Users, Plus, Baby, User, Trash2, Search, Filter, Pencil } from "lucide-react";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  guestType: "ADULT" | "CHILD";
  dietaryRestrictions?: string;
  specialNeeds?: string;
  confirmed: boolean;
  familyHead: {
    id: string;
    firstName: string;
    lastName: string;
    allowedGuests: number;
  };
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
  allowedGuests: number;
  _count: {
    guests: number;
  };
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [families, setFamilies] = useState<FamilyHead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "ADULT" | "CHILD">("ALL");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    guestId: string | null;
    guestName: string;
  }>({
    open: false,
    guestId: null,
    guestName: "",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    guestType: "ADULT" as "ADULT" | "CHILD",
    familyHeadId: "",
    dietaryRestrictions: "",
    specialNeeds: "",
  });
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

  useEffect(() => {
    fetchGuests();
    fetchFamilies();
  }, []);

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
        if (!value) return "Debes seleccionar una familia";
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

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/guests");
      const data = await response.json();
      // Asegurar que siempre sea un array
      setGuests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching guests:", error);
      setGuests([]); // Establecer array vacío en caso de error
      toast.error("Error al cargar los invitados");
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilies = async () => {
    try {
      const response = await fetch("/api/families");
      const data = await response.json();
      // Asegurar que siempre sea un array
      setFamilies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching families:", error);
      setFamilies([]); // Establecer array vacío en caso de error
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    setTouched({
      firstName: true,
      lastName: true,
      familyHeadId: true,
    });

    // Validar todos los campos
    const firstNameError = validateField("firstName", formData.firstName);
    const lastNameError = validateField("lastName", formData.lastName);
    const familyHeadIdError = validateField("familyHeadId", formData.familyHeadId);

    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      familyHeadId: familyHeadIdError,
    });

    // Si hay errores, no enviar
    if (firstNameError || lastNameError || familyHeadIdError) {
      toast.error("Formulario incompleto", {
        description: "Por favor completa todos los campos obligatorios correctamente",
      });
      return;
    }

    try {
      const url = editingGuest ? `/api/guests/${editingGuest.id}` : "/api/guests";
      const method = editingGuest ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          firstName: "",
          lastName: "",
          guestType: "ADULT",
          familyHeadId: "",
          dietaryRestrictions: "",
          specialNeeds: "",
        });
        setTouched({
          firstName: false,
          lastName: false,
          familyHeadId: false,
        });
        setErrors({
          firstName: "",
          lastName: "",
          familyHeadId: "",
        });
        setShowForm(false);
        setEditingGuest(null);
        fetchGuests();
        fetchFamilies(); // Actualizar el contador de invitados
        toast.success(
          editingGuest ? "Invitado actualizado exitosamente" : "Invitado agregado exitosamente",
          {
            description: editingGuest 
              ? "Los cambios han sido guardados" 
              : "El invitado ha sido registrado correctamente",
          }
        );
      } else {
        const error = await response.json();
        toast.error(
          editingGuest ? "Error al actualizar el invitado" : "Error al crear el invitado",
          {
            description: error.error || "No se pudo completar la operación",
          }
        );
      }
    } catch (error) {
      console.error("Error saving guest:", error);
      toast.error("Error inesperado", {
        description: "No se pudo conectar con el servidor",
      });
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      firstName: guest.firstName,
      lastName: guest.lastName,
      guestType: guest.guestType,
      familyHeadId: guest.familyHead.id,
      dietaryRestrictions: guest.dietaryRestrictions || "",
      specialNeeds: guest.specialNeeds || "",
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGuest(null);
    setFormData({
      firstName: "",
      lastName: "",
      guestType: "ADULT",
      familyHeadId: "",
      dietaryRestrictions: "",
      specialNeeds: "",
    });
    setTouched({
      firstName: false,
      lastName: false,
      familyHeadId: false,
    });
    setErrors({
      firstName: "",
      lastName: "",
      familyHeadId: "",
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.guestId) return;

    try {
      const response = await fetch(`/api/guests/${deleteDialog.guestId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchGuests();
        fetchFamilies(); // Actualizar el contador
        toast.success("Invitado eliminado", {
          description: "El invitado ha sido eliminado correctamente",
        });
      } else {
        toast.error("Error al eliminar", {
          description: "No se pudo eliminar el invitado",
        });
      }
    } catch (error) {
      console.error("Error deleting guest:", error);
      toast.error("Error inesperado", {
        description: "No se pudo conectar con el servidor",
      });
    } finally {
      setDeleteDialog({ open: false, guestId: null, guestName: "" });
    }
  };

  const filteredGuests = Array.isArray(guests) ? guests.filter((guest) => {
    const matchesSearch =
      guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${guest.familyHead.firstName} ${guest.familyHead.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterType === "ALL" || guest.guestType === filterType;

    return matchesSearch && matchesFilter;
  }) : [];

  const totalAdults = Array.isArray(guests) ? guests.filter((g) => g.guestType === "ADULT").length : 0;
  const totalChildren = Array.isArray(guests) ? guests.filter((g) => g.guestType === "CHILD").length : 0;
  const totalConfirmed = Array.isArray(guests) ? guests.filter((g) => g.confirmed).length : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
              <Link href="/tables">
                <Button variant="outline">Mesas</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Gestión de Invitados
            </h2>
            <p className="text-gray-600 mt-2">
              Administra todos los invitados (adultos y niños)
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)} 
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
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
                  <p className="text-3xl font-bold">{guests.length}</p>
                </div>
                <Users className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Adultos</p>
                  <p className="text-3xl font-bold">{totalAdults}</p>
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
                  <p className="text-3xl font-bold">{totalChildren}</p>
                </div>
                <Baby className="w-12 h-12 text-pink-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmados</p>
                  <p className="text-3xl font-bold">{totalConfirmed}</p>
                </div>
                <Users className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nombre o familia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === "ALL" ? "default" : "outline"}
              onClick={() => setFilterType("ALL")}
            >
              Todos
            </Button>
            <Button
              variant={filterType === "ADULT" ? "default" : "outline"}
              onClick={() => setFilterType("ADULT")}
            >
              <User className="w-4 h-4 mr-2" />
              Adultos
            </Button>
            <Button
              variant={filterType === "CHILD" ? "default" : "outline"}
              onClick={() => setFilterType("CHILD")}
            >
              <Baby className="w-4 h-4 mr-2" />
              Niños
            </Button>
          </div>
        </div>

        {/* Form Modal */}
        <Dialog open={showForm} onOpenChange={handleCloseForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {editingGuest ? "Editar Invitado" : "Agregar Nuevo Invitado"}
              </DialogTitle>
              <DialogDescription>
                {editingGuest 
                  ? "Modifica los datos del invitado." 
                  : "Agrega acompañantes del representante de familia (adultos o niños). El representante ya está registrado."}
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
                      placeholder="Ej: García"
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
                <div className="md:col-span-2">
                  <Label htmlFor="familyHeadId" className={errors.familyHeadId && touched.familyHeadId ? "text-red-600" : ""}>
                    Familia *
                  </Label>
                  <div className="relative">
                    <select
                      id="familyHeadId"
                      value={formData.familyHeadId}
                      onChange={(e) => handleFieldChange("familyHeadId", e.target.value)}
                      onBlur={() => handleFieldBlur("familyHeadId")}
                      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 ${
                        touched.familyHeadId && errors.familyHeadId
                          ? "border-red-500 focus-visible:ring-red-500"
                          : touched.familyHeadId && !errors.familyHeadId
                          ? "border-green-500 focus-visible:ring-green-500"
                          : "border-input focus-visible:ring-ring"
                      }`}
                    >
                    <option value="">Seleccionar familia...</option>
                    {families.map((family) => (
                      <option key={family.id} value={family.id}>
                        {family.firstName} {family.lastName} ({family._count.guests}/
                        {family.allowedGuests} invitados)
                      </option>
                    ))}
                  </select>
                  </div>
                  {touched.familyHeadId && errors.familyHeadId ? (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.familyHeadId}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      ⚠️ El representante de familia ya cuenta como 1 invitado
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="guestType">Tipo de Invitado *</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="guestType"
                        value="ADULT"
                        checked={formData.guestType === "ADULT"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            guestType: e.target.value as "ADULT" | "CHILD",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Adulto</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="guestType"
                        value="CHILD"
                        checked={formData.guestType === "CHILD"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            guestType: e.target.value as "ADULT" | "CHILD",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <Baby className="w-5 h-5 text-pink-600" />
                      <span>Niño/a</span>
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="dietaryRestrictions">
                    Restricciones Alimentarias (opcional)
                  </Label>
                  <Input
                    id="dietaryRestrictions"
                    placeholder="Ej: Vegetariano, sin gluten, alérgico a mariscos"
                    value={formData.dietaryRestrictions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dietaryRestrictions: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="specialNeeds">
                    Necesidades Especiales (opcional)
                  </Label>
                  <Input
                    id="specialNeeds"
                    placeholder="Ej: Silla de ruedas, asiento especial"
                    value={formData.specialNeeds}
                    onChange={(e) =>
                      setFormData({ ...formData, specialNeeds: e.target.value })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-600 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Guardar Invitado
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Guest List */}
        <div className="grid gap-4">
          {filteredGuests.map((guest) => (
            <Card
              key={guest.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {guest.guestType === "ADULT" ? (
                        <User className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Baby className="w-6 h-6 text-pink-600" />
                      )}
                      <h3 className="text-xl font-bold">
                        {guest.firstName} {guest.lastName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          guest.guestType === "ADULT"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {guest.guestType === "ADULT" ? "Adulto" : "Niño/a"}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm mt-4">
                      <div>
                        <p className="text-gray-600">Familia:</p>
                        <p className="font-medium">
                          {guest.familyHead.firstName} {guest.familyHead.lastName}
                        </p>
                      </div>
                      {guest.seat && (
                        <div>
                          <p className="text-gray-600">Mesa asignada:</p>
                          <p className="font-medium">
                            {guest.seat.table.name} - Asiento {guest.seat.seatNumber}
                          </p>
                        </div>
                      )}
                      {guest.dietaryRestrictions && (
                        <div>
                          <p className="text-gray-600">Restricciones:</p>
                          <p className="font-medium">{guest.dietaryRestrictions}</p>
                        </div>
                      )}
                      {guest.specialNeeds && (
                        <div>
                          <p className="text-gray-600">Necesidades especiales:</p>
                          <p className="font-medium">{guest.specialNeeds}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(guest)}
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          guestId: guest.id,
                          guestName: `${guest.firstName} ${guest.lastName}`,
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredGuests.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterType !== "ALL"
                    ? "No se encontraron invitados con esos filtros"
                    : "No hay invitados registrados aún"}
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Invitado
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            setDeleteDialog({ ...deleteDialog, open })
          }
          onConfirm={handleDelete}
          title="¿Eliminar invitado?"
          description={`¿Estás seguro de eliminar a "${deleteDialog.guestName}"? Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          variant="danger"
        />
      </div>
    </div>
  );
}
