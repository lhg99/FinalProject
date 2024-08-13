import { create } from "zustand";

interface ModalState {
  modals: {
    [key: string]: { isOpen: boolean };
  };
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  isAnyModalOpen: () => boolean;
}

interface ToastState {
  toasts: {
    [key: string]: { isVisible: boolean; message: string };
  };
  showToast: (id: string, message: string) => void;
  hideToast: (id: string) => void;
  isAnyToastVisible: () => boolean;
}

export const ModalStore = create<ModalState>((set) => ({
  modals: {},

  openModal: (id: string) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { isOpen: true },
      },
    }));
  },

  closeModal: (id: string) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [id]: { isOpen: false },
      },
    }));
  },

  isAnyModalOpen: (): boolean => {
    const { modals } = ModalStore.getState();
    return Object.values(modals).some((modal) => modal.isOpen);
  },
}));

export const ToastStore = create<ToastState>((set) => ({
  toasts: {},

  showToast: (id: string, message: string) => {
    set((state) => ({
      toasts: {
        ...state.toasts,
        [id]: { isVisible: true, message },
      },
    }));
  },

  hideToast: (id: string) => {
    set((state) => ({
      toasts: {
        ...state.toasts,
        [id]: { isVisible: false, message: '' },
      },
    }));
  },

  isAnyToastVisible: (): boolean => {
    const { toasts } = ToastStore.getState();
    return Object.values(toasts).some((toast) => toast.isVisible);
  },
}));
