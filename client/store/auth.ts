import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface AuthState {
  token: string | null;
  setToken(token: string | null): void;
}

export const getDefaultAuthState = (): Omit<AuthState, 'setToken'> => ({
  token: null,
});

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...getDefaultAuthState(),
      setToken(token) {
        set({ token });
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    }
  )
);

export default useAuthStore;
