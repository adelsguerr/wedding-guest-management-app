import { useQuery } from '@tanstack/react-query';

export interface DashboardStats {
  totals: {
    families: number;
    guests: number;
    adults: number;
    children: number;
    confirmedFamilies: number;
    tables: number;
    occupiedSeats: number;
    totalSeats: number;
    availableSeats: number;
  };
  confirmationStats: Array<{
    confirmationStatus: string;
    _count: number;
  }>;
  tableStats: Array<{
    tableType: string;
    _count: number;
  }>;
  recentNotifications: Array<{
    id: string;
    notificationType: string;
    status: string;
    createdAt: string;
    familyHead: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
}

export function useDashboard() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }
      return response.json();
    },
    staleTime: 30000, // 30 segundos - más fresco para stats
    refetchInterval: 60000, // Auto-refetch cada minuto
  });
}
