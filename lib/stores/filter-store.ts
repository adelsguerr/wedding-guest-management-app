import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GuestType = 'ALL' | 'ADULT' | 'CHILD';
type ConfirmationStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'NO_RESPONSE';
type TableType = 'ALL' | 'ROUND' | 'RECTANGULAR' | 'VIP' | 'KIDS' | 'BUFFET';

interface FilterState {
  // Guest filters
  guestTypeFilter: GuestType;
  guestSearchQuery: string;
  guestConfirmationFilter: ConfirmationStatus;
  
  // Family filters
  familySearchQuery: string;
  familyConfirmationFilter: ConfirmationStatus;
  
  // Table filters
  tableTypeFilter: TableType;
  tableSearchQuery: string;
  tableLocationFilter: string | null;
  
  // Actions
  setGuestTypeFilter: (filter: GuestType) => void;
  setGuestSearchQuery: (query: string) => void;
  setGuestConfirmationFilter: (filter: ConfirmationStatus) => void;
  
  setFamilySearchQuery: (query: string) => void;
  setFamilyConfirmationFilter: (filter: ConfirmationStatus) => void;
  
  setTableTypeFilter: (filter: TableType) => void;
  setTableSearchQuery: (query: string) => void;
  setTableLocationFilter: (location: string | null) => void;
  
  clearGuestFilters: () => void;
  clearFamilyFilters: () => void;
  clearTableFilters: () => void;
  clearAllFilters: () => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      // Initial state
      guestTypeFilter: 'ALL',
      guestSearchQuery: '',
      guestConfirmationFilter: 'ALL',
      
      familySearchQuery: '',
      familyConfirmationFilter: 'ALL',
      
      tableTypeFilter: 'ALL',
      tableSearchQuery: '',
      tableLocationFilter: null,
      
      // Guest filter actions
      setGuestTypeFilter: (filter) => set({ guestTypeFilter: filter }),
      setGuestSearchQuery: (query) => set({ guestSearchQuery: query }),
      setGuestConfirmationFilter: (filter) => set({ guestConfirmationFilter: filter }),
      
      // Family filter actions
      setFamilySearchQuery: (query) => set({ familySearchQuery: query }),
      setFamilyConfirmationFilter: (filter) => set({ familyConfirmationFilter: filter }),
      
      // Table filter actions
      setTableTypeFilter: (filter) => set({ tableTypeFilter: filter }),
      setTableSearchQuery: (query) => set({ tableSearchQuery: query }),
      setTableLocationFilter: (location) => set({ tableLocationFilter: location }),
      
      // Clear filters
      clearGuestFilters: () => set({
        guestTypeFilter: 'ALL',
        guestSearchQuery: '',
        guestConfirmationFilter: 'ALL',
      }),
      clearFamilyFilters: () => set({
        familySearchQuery: '',
        familyConfirmationFilter: 'ALL',
      }),
      clearTableFilters: () => set({
        tableTypeFilter: 'ALL',
        tableSearchQuery: '',
        tableLocationFilter: null,
      }),
      clearAllFilters: () => set({
        guestTypeFilter: 'ALL',
        guestSearchQuery: '',
        guestConfirmationFilter: 'ALL',
        familySearchQuery: '',
        familyConfirmationFilter: 'ALL',
        tableTypeFilter: 'ALL',
        tableSearchQuery: '',
        tableLocationFilter: null,
      }),
    }),
    {
      name: 'wedding-filters-storage', // LocalStorage key
    }
  )
);
