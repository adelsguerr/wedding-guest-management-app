import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface FamilyHead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  allowedGuests: number;
  confirmedGuests: number;
  confirmationStatus: "PENDING" | "CONFIRMED" | "DECLINED" | "NO_RESPONSE";
  createdAt: string;
  updatedAt: string;
  _count: {
    guests: number;
  };
}

// GET todas las familias
export function useFamilies() {
  return useQuery({
    queryKey: ["families"],
    queryFn: async (): Promise<FamilyHead[]> => {
      const res = await fetch("/api/families");
      if (!res.ok) throw new Error("Error al cargar familias");
      return res.json();
    },
  });
}

// GET una familia por ID
export function useFamily(id: string) {
  return useQuery({
    queryKey: ["families", id],
    queryFn: async () => {
      const res = await fetch(`/api/families/${id}`);
      if (!res.ok) throw new Error("Error al cargar familia");
      return res.json();
    },
    enabled: !!id,
  });
}

// CREATE familia
export function useCreateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<FamilyHead>) => {
      const res = await fetch("/api/families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear familia");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });
}

// UPDATE familia
export function useUpdateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FamilyHead> }) => {
      const res = await fetch(`/api/families/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al actualizar familia");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
      queryClient.invalidateQueries({ queryKey: ["families", variables.id] });
    },
  });
}

// DELETE familia
export function useDeleteFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/families/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al eliminar familia");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["families"] });
    },
  });
}
