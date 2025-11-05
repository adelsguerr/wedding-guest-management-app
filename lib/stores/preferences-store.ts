import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewMode = 'list' | 'grid' | 'canvas';
type Theme = 'light' | 'dark' | 'wedding';
type SortBy = 'name' | 'date' | 'status' | 'table';
type SortOrder = 'asc' | 'desc';

interface PreferencesState {
  // View preferences
  tablesViewMode: ViewMode;
  guestsViewMode: 'list' | 'grid';
  familiesViewMode: 'list' | 'grid';
  
  // Theme
  theme: Theme;
  
  // Sorting
  guestsSortBy: SortBy;
  guestsSortOrder: SortOrder;
  familiesSortBy: SortBy;
  familiesSortOrder: SortOrder;
  tablesSortBy: SortBy;
  tablesSortOrder: SortOrder;
  
  // Display options
  showDeletedItems: boolean;
  itemsPerPage: number;
  showEmptyStates: boolean;
  enableAnimations: boolean;
  
  // Sidebar
  isSidebarCollapsed: boolean;
  
  // Actions
  setTablesViewMode: (mode: ViewMode) => void;
  setGuestsViewMode: (mode: 'list' | 'grid') => void;
  setFamiliesViewMode: (mode: 'list' | 'grid') => void;
  
  setTheme: (theme: Theme) => void;
  
  setGuestsSort: (sortBy: SortBy, sortOrder: SortOrder) => void;
  setFamiliesSort: (sortBy: SortBy, sortOrder: SortOrder) => void;
  setTablesSort: (sortBy: SortBy, sortOrder: SortOrder) => void;
  
  toggleShowDeletedItems: () => void;
  setItemsPerPage: (count: number) => void;
  toggleShowEmptyStates: () => void;
  toggleAnimations: () => void;
  
  toggleSidebar: () => void;
  
  resetPreferences: () => void;
}

const defaultPreferences = {
  tablesViewMode: 'list' as ViewMode,
  guestsViewMode: 'list' as 'list' | 'grid',
  familiesViewMode: 'list' as 'list' | 'grid',
  theme: 'wedding' as Theme,
  guestsSortBy: 'name' as SortBy,
  guestsSortOrder: 'asc' as SortOrder,
  familiesSortBy: 'name' as SortBy,
  familiesSortOrder: 'asc' as SortOrder,
  tablesSortBy: 'name' as SortBy,
  tablesSortOrder: 'asc' as SortOrder,
  showDeletedItems: false,
  itemsPerPage: 25,
  showEmptyStates: true,
  enableAnimations: true,
  isSidebarCollapsed: false,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      
      // View mode actions
      setTablesViewMode: (mode) => set({ tablesViewMode: mode }),
      setGuestsViewMode: (mode) => set({ guestsViewMode: mode }),
      setFamiliesViewMode: (mode) => set({ familiesViewMode: mode }),
      
      // Theme action
      setTheme: (theme) => set({ theme }),
      
      // Sorting actions
      setGuestsSort: (sortBy, sortOrder) => set({ 
        guestsSortBy: sortBy, 
        guestsSortOrder: sortOrder 
      }),
      setFamiliesSort: (sortBy, sortOrder) => set({ 
        familiesSortBy: sortBy, 
        familiesSortOrder: sortOrder 
      }),
      setTablesSort: (sortBy, sortOrder) => set({ 
        tablesSortBy: sortBy, 
        tablesSortOrder: sortOrder 
      }),
      
      // Display options
      toggleShowDeletedItems: () => set((state) => ({ 
        showDeletedItems: !state.showDeletedItems 
      })),
      setItemsPerPage: (count) => set({ itemsPerPage: count }),
      toggleShowEmptyStates: () => set((state) => ({ 
        showEmptyStates: !state.showEmptyStates 
      })),
      toggleAnimations: () => set((state) => ({ 
        enableAnimations: !state.enableAnimations 
      })),
      
      // Sidebar
      toggleSidebar: () => set((state) => ({ 
        isSidebarCollapsed: !state.isSidebarCollapsed 
      })),
      
      // Reset
      resetPreferences: () => set(defaultPreferences),
    }),
    {
      name: 'wedding-preferences-storage', // LocalStorage key
    }
  )
);
