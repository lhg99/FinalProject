import create from "zustand";

// 각 모달의 상태를 관리하기 위한 타입
interface ModalState {
  modals: {
    [key: string]: { isOpen: boolean };
  };
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  isAnyModalOpen: () => boolean;
}

// Zustand 스토어 생성
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
