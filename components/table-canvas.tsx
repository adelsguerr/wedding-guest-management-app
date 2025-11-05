"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  UserPlus, 
  Circle, 
  Square, 
  Crown, 
  Baby, 
  Upload, 
  X,
  ZoomIn,
  ZoomOut,
  Maximize,
  Save
} from "lucide-react";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  guestType: string;
}

interface Seat {
  id: string;
  seatNumber: number;
  isOccupied: boolean;
  guest?: Guest | null;
}

interface Table {
  id: string;
  name: string;
  tableType: string;
  capacity: number;
  location?: string | null;
  positionX?: number | null;
  positionY?: number | null;
  seats: Seat[];
}

interface TableCanvasProps {
  tables: Table[];
  onTableUpdate: () => void;
}

interface CanvasTable extends Table {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function TableCanvas({ tables, onTableUpdate }: TableCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [canvasTables, setCanvasTables] = useState<CanvasTable[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string>("");
  const [scale, setScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 1400, height: 800 });
  
  const [draggedTable, setDraggedTable] = useState<CanvasTable | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredTable, setHoveredTable] = useState<CanvasTable | null>(null);
  
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [availableGuests, setAvailableGuests] = useState<Guest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    // Cargar imagen de fondo guardada
    const savedBg = localStorage.getItem("salon-background");
    if (savedBg) {
      setBackgroundUrl(savedBg);
      loadBackgroundImage(savedBg);
    }
  }, []);

  useEffect(() => {
    // Convertir tables a CanvasTables con posiciones
    const converted = tables.map((table, index) => {
      const size = getTableSize(table);
      
      // Verificar si tiene posición guardada (0 es válido, null/undefined no)
      const hasPosition = 
        typeof table.positionX === 'number' && 
        typeof table.positionY === 'number';
      
      let x: number;
      let y: number;
      
      if (hasPosition) {
        // Usar posición guardada
        x = table.positionX!;
        y = table.positionY!;
      } else {
        // Generar posición en grid automático para nuevas mesas
        const cols = 5;
        const spacing = 200;
        const offsetX = 100;
        const offsetY = 100;
        
        x = offsetX + (index % cols) * spacing;
        y = offsetY + Math.floor(index / cols) * spacing;
        
        // Guardar esta posición inicial en la BD (sin await para no bloquear)
        if (table.id) {
          fetch(`/api/tables/${table.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ positionX: x, positionY: y }),
          }).catch((error) => {
            console.error("Error saving initial position:", error);
          });
        }
      }
      
      return {
        ...table,
        x,
        y,
        width: size.width,
        height: size.height,
      };
    });
    setCanvasTables(converted);
  }, [tables]);

  useEffect(() => {
    if (mounted) {
      drawCanvas();
    }
  }, [canvasTables, backgroundImage, scale, hoveredTable, mounted]);

  useEffect(() => {
    if (showAssignDialog) {
      fetchAvailableGuests();
    }
  }, [showAssignDialog]);

  const fetchAvailableGuests = async () => {
    try {
      const response = await fetch("/api/guests");
      const data = await response.json();
      const unassigned = data.filter((guest: Guest & { seatId?: string }) => !guest.seatId);
      setAvailableGuests(unassigned);
    } catch (error) {
      console.error("Error fetching guests:", error);
      toast.error("Error al cargar invitados");
    }
  };

  const handleSeatClick = (table: Table, seat: Seat) => {
    setSelectedTable(table);
    setSelectedSeat(seat);
    setShowAssignDialog(true);
  };

  const loadBackgroundImage = (url: string) => {
    const img = new Image();
    img.onload = () => {
      setBackgroundImage(img);
    };
    img.src = url;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setBackgroundUrl(url);
        localStorage.setItem("salon-background", url);
        loadBackgroundImage(url);
        toast.success("Imagen de fondo cargada");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = () => {
    setBackgroundImage(null);
    setBackgroundUrl("");
    localStorage.removeItem("salon-background");
    toast.success("Imagen de fondo eliminada");
  };

  const getTableSize = (table: Table) => {
    const isRound = table.tableType === "ROUND" || table.tableType === "VIP";
    if (isRound) {
      return { width: 120, height: 120 };
    }
    return { width: 160, height: 100 };
  };

  const getTableIcon = (type: string): string => {
    switch (type) {
      case "VIP":
        return "👑";
      case "KIDS":
        return "🧸";
      case "ROUND":
        return "●";
      case "RECTANGULAR":
        return "▬";
      default:
        return "●";
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Dibujar imagen de fondo si existe
    if (backgroundImage) {
      ctx.globalAlpha = 0.6;
      ctx.drawImage(backgroundImage, 0, 0, canvasSize.width, canvasSize.height);
      ctx.globalAlpha = 1;
    } else {
      // Fondo degradado
      const gradient = ctx.createLinearGradient(0, 0, canvasSize.width, canvasSize.height);
      gradient.addColorStop(0, "#fdf2f8");
      gradient.addColorStop(0.5, "#faf5ff");
      gradient.addColorStop(1, "#eff6ff");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    }

    // Grid de referencia (opcional)
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvasSize.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvasSize.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }

    // Dibujar mesas
    canvasTables.forEach((table) => {
      const isHovered = hoveredTable?.id === table.id;
      const isDragging = draggedTable?.id === table.id;
      const occupiedCount = table.seats.filter(s => s.isOccupied).length;
      
      // Color según ocupación
      let fillColor = "#f3f4f6"; // gris
      if (occupiedCount === table.capacity) fillColor = "#86efac"; // verde
      else if (occupiedCount > 0) fillColor = "#fde047"; // amarillo

      ctx.save();
      
      // Efecto hover/drag
      if (isHovered || isDragging) {
        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      // Dibujar mesa
      const isRound = table.tableType.includes("ROUND");
      if (isRound) {
        ctx.beginPath();
        ctx.arc(table.x, table.y, table.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = isHovered ? "#9333ea" : "#6b7280";
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = fillColor;
        ctx.fillRect(table.x - table.width / 2, table.y - table.height / 2, table.width, table.height);
        ctx.strokeStyle = isHovered ? "#9333ea" : "#6b7280";
        ctx.lineWidth = isHovered ? 3 : 2;
        ctx.strokeRect(table.x - table.width / 2, table.y - table.height / 2, table.width, table.height);
      }

      // Texto
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Ícono
      ctx.font = "20px Arial";
      ctx.fillText(getTableIcon(table.tableType), table.x, table.y - 15);
      
      // Nombre
      ctx.font = "bold 12px Arial";
      ctx.fillText(table.name, table.x, table.y + 5);
      
      // Ocupación
      ctx.font = "11px Arial";
      ctx.fillStyle = "#6b7280";
      ctx.fillText(`${occupiedCount}/${table.capacity}`, table.x, table.y + 20);

      ctx.restore();
    });
  };

  const getTableAtPosition = (x: number, y: number): CanvasTable | null => {
    for (let i = canvasTables.length - 1; i >= 0; i--) {
      const table = canvasTables[i];
      const isRound = table.tableType.includes("ROUND");
      
      if (isRound) {
        const distance = Math.sqrt(Math.pow(x - table.x, 2) + Math.pow(y - table.y, 2));
        if (distance <= table.width / 2) {
          return table;
        }
      } else {
        if (
          x >= table.x - table.width / 2 &&
          x <= table.x + table.width / 2 &&
          y >= table.y - table.height / 2 &&
          y <= table.y + table.height / 2
        ) {
          return table;
        }
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const table = getTableAtPosition(x, y);
    if (table) {
      setDraggedTable(table);
      setDragOffset({ x: x - table.x, y: y - table.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    if (draggedTable) {
      // Mover mesa
      const newX = x - dragOffset.x;
      const newY = y - dragOffset.y;

      setCanvasTables(prev =>
        prev.map(t =>
          t.id === draggedTable.id ? { ...t, x: newX, y: newY } : t
        )
      );
    } else {
      // Hover
      const hoveredTable = getTableAtPosition(x, y);
      setHoveredTable(hoveredTable);
      canvas.style.cursor = hoveredTable ? "move" : "default";
    }
  };

  const handleMouseUp = async () => {
    if (draggedTable) {
      const table = canvasTables.find(t => t.id === draggedTable.id);
      if (table) {
        // Guardar posición en DB
        try {
          await fetch(`/api/tables/${table.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ positionX: table.x, positionY: table.y }),
          });
          toast.success("Posición guardada");
          // Recargar las mesas para que la próxima vez use la posición actualizada
          onTableUpdate();
        } catch (error) {
          toast.error("Error al guardar posición");
        }
      }
    }
    setDraggedTable(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedTable) return; // Si estaba arrastrando, no abrir modal

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const table = getTableAtPosition(x, y);
    if (table) {
      // Mostrar menú de asientos (simplificado por ahora)
      toast.info(`Mesa: ${table.name}`, {
        description: `Click en vista Lista para asignar asientos`,
      });
    }
  };

  const handleAssignGuest = async () => {
    if (!selectedSeat || !selectedGuestId) return;

    try {
      const response = await fetch(`/api/seats/${selectedSeat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: selectedGuestId }),
      });

      if (response.ok) {
        toast.success("Invitado asignado al asiento", {
          description: `Asiento ${selectedSeat.seatNumber} en ${selectedTable?.name}`,
        });
        setShowAssignDialog(false);
        setSelectedGuestId("");
        onTableUpdate();
      } else {
        const error = await response.json();
        toast.error("Error al asignar invitado", {
          description: error.error || "Intenta de nuevo",
        });
      }
    } catch (error) {
      toast.error("Error al asignar invitado");
    }
  };

  const handleUnassignGuest = async () => {
    if (!selectedSeat || !selectedSeat.guest) return;

    try {
      const response = await fetch(`/api/seats/${selectedSeat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: null }),
      });

      if (response.ok) {
        toast.success("Invitado removido del asiento");
        setShowAssignDialog(false);
        onTableUpdate();
      } else {
        toast.error("Error al remover invitado");
      }
    } catch (error) {
      toast.error("Error al remover invitado");
    }
  };

  const getTableColor = (table: Table) => {
    const occupiedCount = table.seats.filter(s => s.isOccupied).length;
    if (occupiedCount === 0) return "bg-gray-50 border-gray-300";
    if (occupiedCount === table.capacity) return "bg-green-50 border-green-400";
    return "bg-yellow-50 border-yellow-400";
  };

  if (!mounted) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Cargando salón...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controles superiores */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(Math.min(2, scale + 0.1))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(1)}
          >
            <Maximize className="w-4 h-4 mr-1" />
            100%
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {backgroundUrl ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={removeBackground}
            >
              <X className="w-4 h-4 mr-1" />
              Quitar Fondo
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              Cargar Mapa del Salón
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-900">
          <strong>💡 Instrucciones:</strong> 
          {backgroundUrl 
            ? " Arrastra las mesas libremente sobre el mapa del salón para organizarlas."
            : " Carga una imagen del salón (opcional) y arrastra las mesas para organizarlas."
          } Las posiciones se guardan automáticamente.
        </p>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="border-4 border-purple-300 rounded-xl overflow-auto bg-white shadow-2xl"
        style={{ maxHeight: "600px" }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="cursor-move"
          style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        />
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200 border-2 border-gray-400" />
          <span>Vacía</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-300 border-2 border-yellow-500" />
          <span>Parcial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-300 border-2 border-green-500" />
          <span>Completa</span>
        </div>
        <div className="flex items-center gap-2">
          <span>👑 VIP</span>
          <span>🧸 Infantil</span>
          <span>● Redonda</span>
          <span>▬ Rectangular</span>
        </div>
      </div>

      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSeat?.isOccupied ? "Asiento Ocupado" : "Asignar Invitado"}
            </DialogTitle>
            <DialogDescription>
              {selectedTable?.name} - Asiento #{selectedSeat?.seatNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedSeat?.isOccupied && selectedSeat.guest ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-900">
                  {selectedSeat.guest.firstName} {selectedSeat.guest.lastName}
                </p>
                <p className="text-sm text-green-700">
                  {selectedSeat.guest.guestType === "ADULT" ? "Adulto" : "Niño"}
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleUnassignGuest}
                className="w-full"
              >
                Remover de este asiento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Select value={selectedGuestId} onValueChange={setSelectedGuestId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige un invitado..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGuests.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No hay invitados disponibles
                      </SelectItem>
                    ) : (
                      availableGuests.map((guest) => (
                        <SelectItem key={guest.id} value={guest.id}>
                          {guest.firstName} {guest.lastName} ({guest.guestType === "ADULT" ? "Adulto" : "Niño"})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  Solo se muestran invitados sin asiento asignado
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAssignDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAssignGuest}
                  disabled={!selectedGuestId}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Asignar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
