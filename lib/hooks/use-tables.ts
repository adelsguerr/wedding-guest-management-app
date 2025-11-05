import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Table {
  id: string;
  name: string;
  tableType: string;
  capacity: number;
  location?: string | null;
  positionX?: number | null;
  positionY?: number | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    seats: number;
  };
  seats: Array<{
    id: string;
    seatNumber: number;
    isOccupied: boolean;
    guest?: {
      id: string;
      firstName: string;
      lastName: string;
      guestType: string;
    } | null;
  }>;
}

// GET todas las mesas
export function useTables() {
  return useQuery({
    queryKey: ["tables"],
    queryFn: async (): Promise<Table[]> => {
      const res = await fetch("/api/tables");
      if (!res.ok) throw new Error("Error al cargar mesas");
      return res.json();
    },
  });
}

// GET una mesa por ID
export function useTable(id: string) {
  return useQuery({
    queryKey: ["tables", id],
    queryFn: async () => {
      const res = await fetch(`/api/tables/${id}`);
      if (!res.ok) throw new Error("Error al cargar mesa");
      return res.json();
    },
    enabled: !!id,
  });
}

// CREATE mesa
export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Table>) => {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear mesa");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}

// UPDATE mesa
export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Table> }) => {
      const res = await fetch(`/api/tables/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al actualizar mesa");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      queryClient.invalidateQueries({ queryKey: ["tables", variables.id] });
    },
  });
}

// DELETE mesa
export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tables/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al eliminar mesa");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}
