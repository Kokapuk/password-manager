import { create } from 'zustand';

export interface NavigationState {
  navigatingTo?: string;
  setNavigatingTo(navigatingTo: string | undefined): void;
}

const useNavigationStore = create<NavigationState>()((set) => ({
  setNavigatingTo(navigatingTo) {
    set({ navigatingTo });
  },
}));

export default useNavigationStore;
