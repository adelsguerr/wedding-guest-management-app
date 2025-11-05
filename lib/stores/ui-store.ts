import { create } from 'zustand';
import { toast } from 'sonner';

interface UIState {
  // Global loading
  isGlobalLoading: boolean;
  loadingMessage: string | null;
  
  // Confirm dialog
  isConfirmDialogOpen: boolean;
  confirmDialogTitle: string;
  confirmDialogMessage: string;
  confirmDialogAction: (() => void) | null;
  
  // Breadcrumbs
  breadcrumbs: Array<{ label: string; href?: string }>;
  
  // Page title
  pageTitle: string;
  
  // Actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
  
  showToast: (type: 'success' | 'error' | 'warning' | 'info', message: string, description?: string) => void;
  
  openConfirmDialog: (
    title: string,
    message: string,
    action: () => void
  ) => void;
  closeConfirmDialog: () => void;
  confirmAction: () => void;
  
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void;
  setPageTitle: (title: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isGlobalLoading: false,
  loadingMessage: null,
  
  isConfirmDialogOpen: false,
  confirmDialogTitle: '',
  confirmDialogMessage: '',
  confirmDialogAction: null,
  
  breadcrumbs: [],
  pageTitle: 'Wedding Manager',
  
  // Global loading
  setGlobalLoading: (loading, message) => set({
    isGlobalLoading: loading,
    loadingMessage: message || null,
  }),
  
  // Toast actions using Sonner
  showToast: (type, message, description) => {
    switch (type) {
      case 'success':
        toast.success(message, { description });
        break;
      case 'error':
        toast.error(message, { description });
        break;
      case 'warning':
        toast.warning(message, { description });
        break;
      case 'info':
        toast.info(message, { description });
        break;
    }
  },
  
  // Confirm dialog
  openConfirmDialog: (title, message, action) => set({
    isConfirmDialogOpen: true,
    confirmDialogTitle: title,
    confirmDialogMessage: message,
    confirmDialogAction: action,
  }),
  
  closeConfirmDialog: () => set({
    isConfirmDialogOpen: false,
    confirmDialogTitle: '',
    confirmDialogMessage: '',
    confirmDialogAction: null,
  }),
  
  confirmAction: () => {
    const { confirmDialogAction, closeConfirmDialog } = get();
    if (confirmDialogAction) {
      confirmDialogAction();
    }
    closeConfirmDialog();
  },
  
  // Navigation
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  setPageTitle: (title) => set({ pageTitle: title }),
}));
