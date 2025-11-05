import { create } from 'zustand';

interface ModalState {
  // Family modals
  isFamilyModalOpen: boolean;
  familyModalMode: 'create' | 'edit' | null;
  selectedFamilyId: string | null;
  
  // Guest modals
  isGuestModalOpen: boolean;
  guestModalMode: 'create' | 'edit' | null;
  selectedGuestId: string | null;
  
  // Table modals
  isTableModalOpen: boolean;
  tableModalMode: 'create' | 'edit' | null;
  selectedTableId: string | null;
  
  // Seat assignment modal
  isSeatAssignmentModalOpen: boolean;
  selectedSeatData: { seat: any; table: any } | null;
  
  // Notification modal
  isNotificationModalOpen: boolean;
  selectedNotificationFamilyId: string | null;
  
  // Actions
  openFamilyModal: (mode: 'create' | 'edit', familyId?: string) => void;
  closeFamilyModal: () => void;
  
  openGuestModal: (mode: 'create' | 'edit', guestId?: string) => void;
  closeGuestModal: () => void;
  
  openTableModal: (mode: 'create' | 'edit', tableId?: string) => void;
  closeTableModal: () => void;
  
  openSeatAssignmentModal: (seat: any, table: any) => void;
  closeSeatAssignmentModal: () => void;
  
  openNotificationModal: (familyId?: string) => void;
  closeNotificationModal: () => void;
  
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  // Initial state
  isFamilyModalOpen: false,
  familyModalMode: null,
  selectedFamilyId: null,
  
  isGuestModalOpen: false,
  guestModalMode: null,
  selectedGuestId: null,
  
  isTableModalOpen: false,
  tableModalMode: null,
  selectedTableId: null,
  
  isSeatAssignmentModalOpen: false,
  selectedSeatData: null,
  
  isNotificationModalOpen: false,
  selectedNotificationFamilyId: null,
  
  // Family modal actions
  openFamilyModal: (mode, familyId) => set({
    isFamilyModalOpen: true,
    familyModalMode: mode,
    selectedFamilyId: familyId || null,
  }),
  closeFamilyModal: () => set({
    isFamilyModalOpen: false,
    familyModalMode: null,
    selectedFamilyId: null,
  }),
  
  // Guest modal actions
  openGuestModal: (mode, guestId) => set({
    isGuestModalOpen: true,
    guestModalMode: mode,
    selectedGuestId: guestId || null,
  }),
  closeGuestModal: () => set({
    isGuestModalOpen: false,
    guestModalMode: null,
    selectedGuestId: null,
  }),
  
  // Table modal actions
  openTableModal: (mode, tableId) => set({
    isTableModalOpen: true,
    tableModalMode: mode,
    selectedTableId: tableId || null,
  }),
  closeTableModal: () => set({
    isTableModalOpen: false,
    tableModalMode: null,
    selectedTableId: null,
  }),
  
  // Seat assignment modal actions
  openSeatAssignmentModal: (seat: any, table: any) => set({
    isSeatAssignmentModalOpen: true,
    selectedSeatData: { seat, table },
  }),
  closeSeatAssignmentModal: () => set({
    isSeatAssignmentModalOpen: false,
    selectedSeatData: null,
  }),
  
  // Notification modal actions
  openNotificationModal: (familyId) => set({
    isNotificationModalOpen: true,
    selectedNotificationFamilyId: familyId || null,
  }),
  closeNotificationModal: () => set({
    isNotificationModalOpen: false,
    selectedNotificationFamilyId: null,
  }),
  
  // Close all modals
  closeAllModals: () => set({
    isFamilyModalOpen: false,
    familyModalMode: null,
    selectedFamilyId: null,
    isGuestModalOpen: false,
    guestModalMode: null,
    selectedGuestId: null,
    isTableModalOpen: false,
    tableModalMode: null,
    selectedTableId: null,
    isSeatAssignmentModalOpen: false,
    selectedSeatData: null,
    isNotificationModalOpen: false,
    selectedNotificationFamilyId: null,
  }),
}));
