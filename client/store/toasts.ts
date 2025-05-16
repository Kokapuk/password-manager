import { create } from 'zustand';

export type ToastType = 'success' | 'failure' | 'warning' | 'info';

export interface Toast {
  type: ToastType;
  content: string;
}

export interface ToastWithId extends Toast {
  id: number;
}

export interface ToastsState {
  toasts: ToastWithId[];
  addToast(toast: Toast, lifetime: number): void;
}

export const getDefaultToastsState = (): Omit<ToastsState, 'addToast'> => ({
  toasts: [],
});

const useToastsStore = create<ToastsState>()((set, get) => ({
  ...getDefaultToastsState(),
  addToast(toast, lifetime) {
    const currentToasts = get().toasts;
    const newToastId = currentToasts.length ? Math.max(...currentToasts.map((i) => i.id)) + 1 : 0;
    const newToast: ToastWithId = { id: newToastId, ...toast };

    set((prev) => ({ ...prev, toasts: [...prev.toasts, newToast] }));

    setTimeout(() => set((prev) => ({ ...prev, toasts: prev.toasts.filter((i) => i !== newToast) })), lifetime);
  },
}));

export default useToastsStore;
