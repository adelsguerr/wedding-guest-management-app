import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  guestType: "ADULT" | "CHILD";
  confirmationStatus: "PENDING" | "CONFIRMED" | "DECLINED";
  dietaryRestrictions?: string | null;
  specialNeeds?: string | null;
  confirmed: boolean;
  familyHeadId: string;
  seatId?: string | null;
  createdAt: string;
  updatedAt: string;
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
      id: string;
      name: string;
    };
  } | null;
}

// GET todos los invitados
export function useGuests() {
  return useQuery({
    queryKey: ["guests"],
    queryFn: async (): Promise<Guest[]> => {
      const res = await fetch("/api/guests");
      if (!res.ok) throw new Error("Error al cargar invitados");
      return res.json();
    },
  });
}

// GET un invitado por ID
export function useGuest(id: string) {
  return useQuery({
    queryKey: ["guests", id],
    queryFn: async () => {
      const res = await fetch(`/api/guests/${id}`);
      if (!res.ok) throw new Error("Error al cargar invitado");
      return res.json();
    },
    enabled: !!id,
  });
}

// CREATE invitado
export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Guest>) => {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear invitado");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });
}

// UPDATE invitado
export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Guest> }) => {
      const res = await fetch(`/api/guests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al actualizar invitado");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      queryClient.invalidateQueries({ queryKey: ["guests", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });
}

// DELETE invitado
export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/guests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al eliminar invitado");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });
}
