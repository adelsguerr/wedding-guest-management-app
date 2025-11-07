"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Users, Plus, Phone, Mail, UserCheck, Trash2, Pencil, Loader2, X, QrCode } from "lucide-react";
import { useFamilies, useCreateFamily, useUpdateFamily, useDeleteFamily, type FamilyHead } from "@/lib/hooks/use-families";
import { QRCodeDialog } from "@/components/QRCodeDialog";
import { useModalStore } from "@/lib/stores/modal-store";
import { useFilterStore } from "@/lib/stores/filter-store";
import { useUIStore } from "@/lib/stores/ui-store";

export default function FamiliesPage() {
  // React Query Hooks
  const { data: families = [], isLoading } = useFamilies();
  const createFamily = useCreateFamily();
  const updateFamily = useUpdateFamily();
  const deleteFamily = useDeleteFamily();

  // Zustand Stores
  const { isFamilyModalOpen, familyModalMode, selectedFamilyId, openFamilyModal, closeFamilyModal } = useModalStore();
  const { familySearchQuery, setFamilySearchQuery, clearFamilyFilters } = useFilterStore();
  const { showToast, openConfirmDialog } = useUIStore();

  // Form Data (local state para el formulario solamente)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    allowedGuests: 1,
  });

  const [editFormData, setEditFormData] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    allowedGuests: number;
    confirmationStatus: "PENDING" | "CONFIRMED" | "DECLINED" | "NO_RESPONSE";
  }>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    allowedGuests: 1,
    confirmationStatus: "PENDING",
  });

  // QR Code Dialog State
  const [qrDialogOpen, setQRDialogOpen] = useState(false);
  const [selectedQRFamily, setSelectedQRFamily] = useState<{ id: string; name: string } | null>(null);

  // Cargar datos cuando se abre en modo edición
  useEffect(() => {
    if (isFamilyModalOpen && familyModalMode === 'edit' && selectedFamilyId) {
      const family = families?.find((f) => f.id === selectedFamilyId);
      if (family) {
        setEditFormData({
          firstName: family.firstName,
          lastName: family.lastName,
          phone: family.phone,
          email: family.email || "",
          allowedGuests: family.allowedGuests,
          confirmationStatus: family.confirmationStatus,
        });
      }
    } else if (!isFamilyModalOpen) {
      // Reset cuando se cierra el modal
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        allowedGuests: 1,
      });
      setEditFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        allowedGuests: 1,
        confirmationStatus: "PENDING",
      });
      setTouched({ firstName: false, lastName: false, phone: false });
      setErrors({ firstName: "", lastName: "", phone: "" });
    }
  }, [isFamilyModalOpen, familyModalMode, selectedFamilyId, families]);

  // Validation State
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    phone: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

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
      case "phone":
        if (!value.trim()) return "El teléfono es obligatorio";
        if (!/^\+?[1-9]\d{1,14}$/.test(value.replace(/\s/g, ""))) {
          return "Formato inválido. Usa formato internacional (ej: +521234567890)";
        }
        return "";
      default:
        return "";
    }
  };

  const handleFieldChange = (name: string, value: string | number) => {
    setFormData({ ...formData, [name]: value });
    
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, String(value));
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
    
    setTouched({ firstName: true, lastName: true, phone: true });

    const firstNameError = validateField("firstName", formData.firstName);
    const lastNameError = validateField("lastName", formData.lastName);
    const phoneError = validateField("phone", formData.phone);

    setErrors({ firstName: firstNameError, lastName: lastNameError, phone: phoneError });

    if (firstNameError || lastNameError || phoneError) return;

    try {
      await createFamily.mutateAsync(formData);
      
      showToast('success', 'Familia creada', `${formData.firstName} ${formData.lastName} ha sido agregado exitosamente`);

      closeFamilyModal();
    } catch (error) {
      showToast('error', 'Error', 'No se pudo crear la familia');
    }
  };

  const handleOpenEdit = (family: FamilyHead) => {
    openFamilyModal('edit', family.id);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFamilyId) return;

    try {
      await updateFamily.mutateAsync({
        id: selectedFamilyId,
        data: editFormData,
      });

      showToast('success', 'Familia actualizada', `${editFormData.firstName} ${editFormData.lastName} ha sido actualizado`);

      closeFamilyModal();
    } catch (error) {
      showToast('error', 'Error', 'No se pudo actualizar la familia');
    }
  };

  const handleDeleteClick = (family: FamilyHead) => {
    openConfirmDialog(
      '¿Eliminar familia?',
      `¿Estás seguro de eliminar la familia "${family.firstName} ${family.lastName}"? Esta acción no se puede deshacer y eliminará todos los invitados asociados.`,
      async () => {
        try {
          await deleteFamily.mutateAsync(family.id);
          showToast('success', 'Familia eliminada', `${family.firstName} ${family.lastName} ha sido eliminado`);
          showToast('success', 'Familia eliminada', `${family.firstName} ${family.lastName} ha sido eliminado`);
        } catch (error) {
          showToast('error', 'Error al eliminar', 'No se pudo eliminar la familia. Intenta nuevamente.');
        }
      }
    );
  };

  const handleOpenQRDialog = (family: FamilyHead) => {
    if (!family.inviteCode) {
      showToast('error', 'Sin código de invitación', 'Esta familia no tiene un código de invitación generado');
      return;
    }
    setSelectedQRFamily({
      id: family.id,
      name: `${family.firstName} ${family.lastName}`
    });
    setQRDialogOpen(true);
  };

  // Loading State
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
              <Link href="/guests">
                <Button variant="outline">Invitados</Button>
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
              Gestión de Familias
            </h2>
            <p className="text-gray-600 mt-2">
              Administra los representantes de familia y sus invitados
            </p>
          </div>
          <Button onClick={() => openFamilyModal('create')} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Nueva Familia
          </Button>
        </div>

        {/* Create Form Modal */}
        <Dialog open={isFamilyModalOpen && familyModalMode === 'create'} onOpenChange={closeFamilyModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Agregar Nueva Familia
              </DialogTitle>
              <DialogDescription>
                Ingresa los datos del representante de familia. Se creará automáticamente como invitado adulto y contará en el límite.
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
                      placeholder="Ej: Juan"
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
                      placeholder="Ej: Pérez"
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
                
                <div>
                  <Label htmlFor="phone" className={errors.phone && touched.phone ? "text-red-600" : ""}>
                    Teléfono (WhatsApp) *
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+521234567890"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      onBlur={() => handleFieldBlur("phone")}
                      className={
                        touched.phone && errors.phone
                          ? "border-red-500 focus-visible:ring-red-500 pr-10"
                          : touched.phone && !errors.phone
                          ? "border-green-500 focus-visible:ring-green-500 pr-10"
                          : ""
                      }
                    />
                    {touched.phone && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {errors.phone ? (
                          <span className="text-red-500 text-xl">⚠️</span>
                        ) : (
                          <span className="text-green-500 text-xl">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                  {touched.phone && errors.phone ? (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span> {errors.phone}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Formato internacional: +1 para Estados Unidos, +503 para El Salvador
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Email (opcional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="allowedGuests">Número de Invitados Permitidos *</Label>
                  <Input
                    id="allowedGuests"
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.allowedGuests}
                    onChange={(e) => setFormData({ ...formData, allowedGuests: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ El representante de familia cuenta como 1 invitado. Ej: Si permites 3, puedes agregar 2 más.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeFamilyModal}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-pink-600 to-purple-600"
                  disabled={createFamily.isPending}
                >
                  {createFamily.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Guardar Familia
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Familias</p>
                  <p className="text-3xl font-bold">{families.length}</p>
                </div>
                <Users className="w-12 h-12 text-pink-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmadas</p>
                  <p className="text-3xl font-bold">
                    {families.filter((f) => f.confirmationStatus === "CONFIRMED").length}
                  </p>
                </div>
                <UserCheck className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invitados</p>
                  <p className="text-3xl font-bold">
                    {families.reduce((acc, f) => acc + f._count.guests, 0)}
                  </p>
                </div>
                <Users className="w-12 h-12 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <div className="grid gap-4">
          {families.map((family) => (
            <Card key={family.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {family._count.guests >= 2 && "Familia "}
                      {family.firstName} {family.lastName}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        {family.phone}
                      </div>
                      {family.email && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {family.email}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {family._count.guests} / {family.allowedGuests} invitados
                        </span>
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            family.confirmationStatus === "CONFIRMED"
                              ? "bg-green-100 text-green-700"
                              : family.confirmationStatus === "DECLINED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {family.confirmationStatus === "CONFIRMED" && "✅ Confirmado"}
                          {family.confirmationStatus === "DECLINED" && "❌ Declinado"}
                          {family.confirmationStatus === "PENDING" && "⏳ Pendiente"}
                          {family.confirmationStatus === "NO_RESPONSE" && "🔇 Sin respuesta"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {family.inviteCode && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOpenQRDialog(family)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                    )}
                    <Link href={`/families/${family.id}`}>
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOpenEdit(family)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(family)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {families.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">
                  No hay familias registradas aún
                </p>
                <Button onClick={() => openFamilyModal('create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primera Familia
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit Modal */}
        <Dialog open={isFamilyModalOpen && familyModalMode === 'edit'} onOpenChange={closeFamilyModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Familia</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-firstName">Nombre *</Label>
                  <Input
                    id="edit-firstName"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lastName">Apellido *</Label>
                  <Input
                    id="edit-lastName"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-phone">Teléfono *</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-allowedGuests">Invitados Permitidos *</Label>
                <Input
                  id="edit-allowedGuests"
                  type="number"
                  min="1"
                  max="20"
                  value={editFormData.allowedGuests}
                  onChange={(e) => setEditFormData({ ...editFormData, allowedGuests: parseInt(e.target.value) })}
                  required
                />
                {selectedFamilyId && families.find(f => f.id === selectedFamilyId) && (
                  <p className="text-sm text-gray-500 mt-1">
                    Actualmente hay {families.find(f => f.id === selectedFamilyId)!._count.guests} invitados registrados
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-confirmationStatus">Estado de Confirmación</Label>
                <Select
                  value={editFormData.confirmationStatus}
                  onValueChange={(value) => setEditFormData({ ...editFormData, confirmationStatus: value as "PENDING" | "CONFIRMED" | "DECLINED" | "NO_RESPONSE" })}
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
                  onClick={closeFamilyModal}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                  disabled={updateFamily.isPending}
                >
                  {updateFamily.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* QR Code Dialog */}
        {selectedQRFamily && (
          <QRCodeDialog
            isOpen={qrDialogOpen}
            onClose={() => setQRDialogOpen(false)}
            familyId={selectedQRFamily.id}
            familyName={selectedQRFamily.name}
          />
        )}
      </div>
    </div>
  );
}
