import { useQuery } from "@tanstack/react-query";

interface EventConfig {
  id: string;
  weddingDate: string | null;
  rsvpDeadline: string | null;
  eventName: string;
  eventLocation: string | null;
  ceremonyTime: string | null;
  receptionTime: string | null;
  enableDietaryRestrictions: boolean;
  enableSpecialNeeds: boolean;
  wordpressUrl: string | null;
  embedEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useEventConfig() {
  return useQuery<EventConfig>({
    queryKey: ["eventConfig"],
    queryFn: async () => {
      const response = await fetch("/api/event-config");
      if (!response.ok) {
        throw new Error("Error al cargar la configuración");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
