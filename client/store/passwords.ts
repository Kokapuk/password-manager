import { findAll } from '@/utils/api';
import { Password } from '@/utils/types';
import { create } from 'zustand';
import useAuthStore from './auth';

export interface PasswordsState {
  passwords: Password[];
  isFetching: boolean;
  isFetchFailed: boolean;
  page: number;
  totalCount?: number;
  query: string;
  fetch(query?: string, initialFetch?: boolean): Promise<void>;
  paginate(): void;
}

export const getDefaultPasswordsState = (): Omit<PasswordsState, 'fetch' | 'paginate'> => ({
  passwords: [],
  isFetching: true,
  isFetchFailed: false,
  page: 1,
  totalCount: undefined,
  query: '',
});

export const limitPerPage = 30;

const usePasswordsStore = create<PasswordsState>((set, get) => ({
  ...getDefaultPasswordsState(),
  async fetch(query = '', initialFetch = false) {
    if (get().isFetchFailed || (!initialFetch && get().isFetching) || !useAuthStore.getState().token) {
      return;
    }

    set({ isFetching: true, passwords: [] });

    try {
      const [totalCount, newPasswords] = await findAll(query, limitPerPage, 1);
      set((state) => ({
        ...state,
        passwords: newPasswords,
        totalCount,
        query,
      }));
    } catch {
      set({ isFetchFailed: true });
    } finally {
      set({ isFetching: false, page: 1 });
    }
  },
  async paginate() {
    if (
      get().isFetchFailed ||
      get().isFetching ||
      !useAuthStore.getState().token ||
      get().passwords.length >= (get().totalCount as number)
    ) {
      return;
    }

    set({ isFetching: true });

    try {
      const [totalCount, newPasswords] = await findAll(get().query, limitPerPage, get().page + 1);
      set((state) => ({
        ...state,
        passwords: [...state.passwords, ...newPasswords],
        totalCount,
        page: get().page + 1,
      }));
    } catch {
      set({ passwords: [], isFetchFailed: true });
    } finally {
      set({ isFetching: false });
    }
  },
}));

export default usePasswordsStore;
