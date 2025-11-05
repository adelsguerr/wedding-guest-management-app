"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Users, 
  ArrowLeft, 
  Trash2,
  Circle,
  Square,
  Crown,
  Baby,
  CheckCircle,
  XCircle,
  Edit,
  LayoutGrid,
  List,
  Loader2,
  X
} from "lucide-react";
import { useTables, useCreateTable, useUpdateTable, useDeleteTable, type Table } from "@/lib/hooks/use-tables";
import { useGuests } from "@/lib/hooks/use-guests";
import TableCanvas from "@/components/table-canvas";
import { useModalStore } from "@/lib/stores/modal-store";
import { useFilterStore } from "@/lib/stores/filter-store";
import { usePreferencesStore } from "@/lib/stores/preferences-store";
import { useUIStore } from "@/lib/stores/ui-store";

interface Seat {
  id: string;
  seatNumber: number;
  isOccupied: boolean;
  guest?: {
    id: string;
    firstName: string;
    lastName: string;
    guestType: string;
  } | null;
}

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  guestType: string;
  confirmed: boolean;
  seatId?: string | null;
  familyHead: {
    firstName: string;
    lastName: string;
  };
}

const TABLE_TYPES = [
  { value: "ROUND", label: "Mesa Redonda", icon: Circle },
  { value: "RECTANGULAR", label: "Mesa Rectangular", icon: Square },
  { value: "VIP", label: "Mesa VIP", icon: Crown },
  { value: "KIDS", label: "Mesa Infantil", icon: Baby },
];

export default function TablesPage() {
  // React Query Hooks
  const { data: tables = [], isLoading, refetch } = useTables();
  const { data: allGuests = [] } = useGuests();
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();

  // Zustand Stores
  const { isTableModalOpen, tableModalMode, selectedTableId, openTableModal, closeTableModal, isSeatAssignmentModalOpen, selectedSeatData, openSeatAssignmentModal, closeSeatAssignmentModal } = useModalStore();
  const { tableTypeFilter, setTableTypeFilter, clearTableFilters } = useFilterStore();
  const { tablesViewMode, setTablesViewMode } = usePreferencesStore();
  const { showToast, openConfirmDialog } = useUIStore();

  // Form Data (local state para el formulario solamente)
  const [selectedGuestId, setSelectedGuestId] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    tableType: "ROUND",
    capacity: 8,
    location: "",
  });

  // Cargar datos cuando se abre en modo edición
  useEffect(() => {
    if (isTableModalOpen && tableModalMode === 'edit' && selectedTableId) {
      const table = tables?.find((t) => t.id === selectedTableId);
      if (table) {
        setFormData({
          name: table.name,
          tableType: table.tableType,
          capacity: table.capacity,
          location: table.location || "",
        });
      }
    } else if (!isTableModalOpen) {
      // Reset cuando se cierra el modal
      setFormData({
        name: "",
        tableType: "ROUND",
        capacity: 8,
        location: "",
      });
    }
  }, [isTableModalOpen, tableModalMode, selectedTableId, tables]);

  // Available guests (sin asiento asignado)
  const availableGuests = allGuests.filter(g => !g.seatId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('error', 'Error', 'El nombre de la mesa es obligatorio');
      return;
    }

    try {
      if (tableModalMode === 'edit' && selectedTableId) {
        await updateTable.mutateAsync({
          id: selectedTableId,
          data: formData,
        });
        showToast('success', 'Mesa actualizada', `${formData.name} ha sido actualizada exitosamente`);
      } else {
        await createTable.mutateAsync(formData);
        showToast('success', 'Mesa creada', `${formData.name} ha sido creada exitosamente`);
      }

      closeTableModal();
    } catch (error: any) {
      showToast('error', 'Error', tableModalMode === 'edit' ? 'No se pudo actualizar la mesa' : 'No se pudo crear la mesa');
    }
  };

  const handleEdit = (table: Table) => {
    openTableModal('edit', table.id);
  };

  const handleDeleteClick = (table: Table) => {
    openConfirmDialog(
      '¿Eliminar mesa?',
      `¿Estás seguro de eliminar la mesa "${table.name}"? Esta acción liberará todos los asientos asignados.`,
      async () => {
        try {
          await deleteTable.mutateAsync(table.id);
          showToast('success', 'Mesa eliminada', `${table.name} ha sido eliminada`);
        } catch (error) {
          showToast('error', 'Error al eliminar', 'No se pudo eliminar la mesa. Intenta nuevamente.');
        }
      }
    );
  };

  // Funciones para asignación de asientos
  const handleSeatClick = async (seat: Seat, table: Table) => {
    openSeatAssignmentModal(seat, table);
    setSelectedGuestId(seat.guest?.id || "");
  };

  const handleAssignSeat = async () => {
    if (!selectedSeatData?.seat || !selectedGuestId) return;

    try {
      const response = await fetch(`/api/seats/${selectedSeatData.seat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: selectedGuestId }),
      });

      if (response.ok) {
        await refetch();
        closeSeatAssignmentModal();
        setSelectedGuestId("");
        showToast('success', 'Asiento asignado', 'El asiento ha sido asignado exitosamente');
      } else {
        const error = await response.json();
        showToast('error', 'Error al asignar', error.error || 'Intenta de nuevo');
      }
    } catch (error) {
      console.error("Error assigning seat:", error);
      showToast('error', 'Error', 'Error al asignar asiento');
    }
  };

  const handleReleaseSeat = async () => {
    if (!selectedSeatData?.seat) return;

    openConfirmDialog(
      '¿Liberar asiento?',
      `¿Estás seguro de liberar el asiento? El invitado quedará sin asiento asignado.`,
      async () => {
        try {
          const response = await fetch(`/api/seats/${selectedSeatData.seat.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guestId: null }),
          });
          
          if (response.ok) {
            // Refetch y obtener datos actualizados
            const result = await refetch();
            
            // Actualizar selectedSeatData con el asiento liberado usando los datos frescos
            if (result.data) {
              const updatedTable = result.data.find((t: any) => t.id === selectedSeatData.table.id);
              if (updatedTable) {
                const updatedSeat = updatedTable.seats.find((s: any) => s.id === selectedSeatData.seat.id);
                if (updatedSeat) {
                  openSeatAssignmentModal(updatedSeat, updatedTable);
                }
              }
            }
            
            setSelectedGuestId("");
            showToast('success', 'Asiento liberado', 'El asiento ha sido liberado - Puedes asignarlo a otra persona');
          } else {
            showToast('error', 'Error', 'Error al liberar asiento');
          }
        } catch (error) {
          showToast('error', 'Error', 'Error al liberar asiento');
        }
      }
    );
  };

  const handleTableTypeChange = (type: string) => {
    setFormData({ 
      ...formData, 
      tableType: type,
      // No cambiamos la capacidad automáticamente - el usuario la establece manualmente
    });
  };

  const getTableTypeIcon = (type: string) => {
    const tableType = TABLE_TYPES.find(t => t.value === type);
    return tableType?.icon || Circle;
  };

  const getTableTypeLabel = (type: string) => {
    const tableType = TABLE_TYPES.find(t => t.value === type);
    return tableType?.label || type;
  };

  const filteredTables = tables.filter(table => {
    if (tableTypeFilter === "ALL") return true;
    return table.tableType === tableTypeFilter;
  });

  const occupiedSeats = Array.isArray(tables) 
    ? tables.reduce((acc, table) => 
        acc + table.seats.filter(seat => seat.isOccupied).length, 0
      )
    : 0;
  const totalSeats = Array.isArray(tables)
    ? tables.reduce((acc, table) => acc + table.capacity, 0)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Gestión de Mesas
              </h2>
              <p className="text-gray-600 mt-2">
                Organiza mesas y asientos para el evento
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/families">
              <Button variant="outline">Familias</Button>
            </Link>
            <Link href="/guests">
              <Button variant="outline">Invitados</Button>
            </Link>
            <div className="flex border rounded-lg p-1">
              <Button
                variant={tablesViewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTablesViewMode("list")}
              >
                <List className="w-4 h-4 mr-1" />
                Lista
              </Button>
              <Button
                variant={tablesViewMode === "canvas" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTablesViewMode("canvas")}
              >
                <LayoutGrid className="w-4 h-4 mr-1" />
                Salón
              </Button>
            </div>
            <Button onClick={() => openTableModal('create')} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Nueva Mesa
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mesas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tables.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Asientos</CardTitle>
              <Circle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSeats}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asientos Ocupados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{occupiedSeats}</div>
              <p className="text-xs text-muted-foreground">
                {totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0}% ocupación
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asientos Disponibles</CardTitle>
              <XCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{totalSeats - occupiedSeats}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            variant={tableTypeFilter === "ALL" ? "default" : "outline"}
            onClick={() => setTableTypeFilter("ALL")}
            size="sm"
          >
            Todas ({tables.length})
          </Button>
          {TABLE_TYPES.map((type) => {
            const count = tables.filter(t => t.tableType === type.value).length;
            const Icon = type.icon;
            return (
              <Button
                key={type.value}
                variant={tableTypeFilter === type.value ? "default" : "outline"}
                onClick={() => setTableTypeFilter(type.value as any)}
                size="sm"
              >
                <Icon className="w-4 h-4 mr-1" />
                {type.label.split("(")[0].trim()} ({count})
              </Button>
            );
          })}
        </div>

        {/* Vista de Mesas */}
        {tablesViewMode === "canvas" ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <TableCanvas tables={filteredTables as any} onTableUpdate={refetch} />
          </div>
        ) : filteredTables.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay mesas registradas</h3>
            <p className="text-gray-600 mb-4">
              {tableTypeFilter === "ALL" 
                ? "Comienza agregando tu primera mesa" 
                : `No hay mesas del tipo seleccionado`}
            </p>
            {tableTypeFilter === "ALL" && (
              <Button onClick={() => openTableModal('create')}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Mesa
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTables.map((table) => {
              const Icon = getTableTypeIcon(table.tableType);
              const occupied = table.seats.filter(s => s.isOccupied).length;
              const occupancyPercent = Math.round((occupied / table.capacity) * 100);
              
              return (
                <Card key={table.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-6 h-6 text-purple-600" />
                        <div>
                          <CardTitle className="text-xl">{table.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            {getTableTypeLabel(table.tableType)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(table)}
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(table)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Capacidad:</span>
                        <span className="font-semibold">{table.capacity} personas</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ocupación:</span>
                        <span className="font-semibold">
                          {occupied}/{table.capacity} ({occupancyPercent}%)
                        </span>
                      </div>

                      {table.location && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Ubicación:</span>
                          <span className="text-sm">{table.location}</span>
                        </div>
                      )}

                      {/* Barra de progreso */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              occupancyPercent === 100
                                ? "bg-green-600"
                                : occupancyPercent > 50
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${occupancyPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Grid de asientos */}
                      <div className="mt-4 pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-2">Asientos:</p>
                        <div className="grid grid-cols-5 gap-1">
                          {table.seats.map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat, table)}
                              className={`
                                w-8 h-8 rounded flex items-center justify-center text-xs font-semibold
                                transition-all hover:scale-110 cursor-pointer
                                ${seat.isOccupied 
                                  ? "bg-green-500 text-white hover:bg-green-600" 
                                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"}
                              `}
                              title={
                                seat.isOccupied && seat.guest
                                  ? `${seat.guest.firstName} ${seat.guest.lastName} - Click para cambiar`
                                  : "Disponible - Click para asignar"
                              }
                            >
                              {seat.seatNumber}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal para Agregar/Editar Mesa */}
        <Dialog open={isTableModalOpen} onOpenChange={closeTableModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {tableModalMode === 'edit' ? "Editar Mesa" : "Agregar Nueva Mesa"}
              </DialogTitle>
              <DialogDescription>
                {tableModalMode === 'edit' 
                  ? "Modifica los datos de la mesa. Los cambios en capacidad afectarán los asientos."
                  : "Los asientos se crearán automáticamente según la capacidad."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la Mesa *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Mesa 1, Mesa Novios, Mesa VIP..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Tipo de Mesa *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {TABLE_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTableTypeChange(type.value)}
                        className={`
                          p-3 rounded-lg border-2 transition-all text-left
                          ${formData.tableType === type.value
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-5 h-5 ${
                            formData.tableType === type.value 
                              ? "text-purple-600" 
                              : "text-gray-400"
                          }`} />
                          <div>
                            <p className="font-semibold text-sm">{type.label.split("(")[0]}</p>
                            <p className="text-xs text-gray-500">{type.label.match(/\(([^)]+)\)/)?.[1]}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="capacity">Capacidad (Asientos) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
                  }
                  required
                />
                {tableModalMode === 'edit' && selectedTableId && tables.find(t => t.id === selectedTableId) ? (
                  <>
                    <p className="text-xs text-gray-500 mt-1">
                      Capacidad actual: {tables.find(t => t.id === selectedTableId)!.capacity} asientos
                    </p>
                    {formData.capacity < tables.find(t => t.id === selectedTableId)!.capacity && (
                      <p className="text-xs text-orange-600 mt-1 font-medium">
                        ⚠️ Asegúrate de que no haya invitados asignados a los asientos #{formData.capacity + 1} - #{tables.find(t => t.id === selectedTableId)!.capacity}
                      </p>
                    )}
                    {formData.capacity > tables.find(t => t.id === selectedTableId)!.capacity && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        ✅ Se agregarán {formData.capacity - tables.find(t => t.id === selectedTableId)!.capacity} asientos nuevos
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Se crearán {formData.capacity} asientos automáticamente
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Ubicación (Opcional)</Label>
                <Input
                  id="location"
                  placeholder="Ej: Centro del salón, Junto a ventana..."
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeTableModal}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {tableModalMode === 'edit' ? (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Actualizar Mesa
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Mesa
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de Asignación de Asientos */}
        <Dialog open={isSeatAssignmentModalOpen} onOpenChange={closeSeatAssignmentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Asignar Asiento
              </DialogTitle>
              <DialogDescription>
                {selectedSeatData && (
                  <span>
                    Mesa: <strong>{selectedSeatData.table.name}</strong> - Asiento{" "}
                    <strong>#{selectedSeatData.seat.seatNumber}</strong>
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {selectedSeatData?.seat.guest && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-blue-800">
                        <strong>Ocupado actualmente por:</strong>
                        <br />
                        {selectedSeatData.seat.guest.firstName} {selectedSeatData.seat.guest.lastName}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleReleaseSeat}
                    >
                      Liberar
                    </Button>
                  </div>
                </div>
              )}

              {/* Mostrar dropdown solo si el asiento está vacío */}
              {!selectedSeatData?.seat.guest && (
                <div className="space-y-2">
                  <Label htmlFor="guest-select">Seleccionar Invitado</Label>
                  <Select
                    value={selectedGuestId}
                    onValueChange={setSelectedGuestId}
                  >
                    <SelectTrigger id="guest-select">
                      <SelectValue placeholder="Selecciona un invitado..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGuests.map((guest) => (
                        <SelectItem key={guest.id} value={guest.id}>
                          {guest.guestType === "CHILD" && "👶 "}
                          {guest.firstName} {guest.lastName}
                          {" - "}
                          <span className="text-xs text-gray-500">
                            {guest.familyHead.firstName} {guest.familyHead.lastName}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {availableGuests.length} invitados disponibles
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={closeSeatAssignmentModal}
              >
                Cancelar
              </Button>
              {/* Mostrar botón Asignar solo si:
                  1. Hay un invitado seleccionado Y
                  2. Es diferente al invitado actual (si existe) */}
              {selectedGuestId && 
               selectedGuestId !== "unassign" && 
               selectedGuestId !== selectedSeatData?.seat.guest?.id && (
                <Button onClick={handleAssignSeat}>
                  Asignar Asiento
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
