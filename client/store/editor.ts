import { findOne, update } from '@/utils/api';
import { Password } from '@/utils/types';
import { create } from 'zustand';
import usePasswordsStore from './passwords';

export interface EditorState {
  selectedPassword: Password | null;
  isEditing: boolean;
  isLoading: boolean;
  draftPassword?: Password;
  isIntegrationModalOpen: boolean;
  isExposedPasswordModalOpen: boolean;
  setSelectedPassword(selectedPassword: Password | null): void;
  setEditing(isEditing: boolean): void;
  setLoading(isLoading: boolean): void;
  setDraftPassword(draftPassword: Password | ((prev: Password | undefined) => Password | undefined)): void;
  savePassword(): Promise<void>;
  setIntegrationModalOpen(isIntegrationModalOpen: boolean): void;
  setExposedPasswordModalOpen(isExposedPasswordModalOpen: boolean): void;
}

export const getDefaultEditorState = (): Omit<
  EditorState,
  | 'setSelectedPassword'
  | 'setEditing'
  | 'setLoading'
  | 'setDraftPassword'
  | 'savePassword'
  | 'setIntegrationModalOpen'
  | 'setExposedPasswordModalOpen'
> => ({
  selectedPassword: null,
  isEditing: false,
  isLoading: false,
  isIntegrationModalOpen: false,
  isExposedPasswordModalOpen: false,
});

const useEditorStore = create<EditorState>((set, get) => ({
  ...getDefaultEditorState(),
  setSelectedPassword(selectedPassword) {
    set({
      selectedPassword,
      isEditing: false,
      draftPassword: JSON.parse(JSON.stringify(selectedPassword)) || undefined,
    });
  },
  setEditing(isEditing) {
    set({ isEditing });
  },
  setLoading(isLoading) {
    set({ isLoading });
  },
  setDraftPassword(draftPassword) {
    if (typeof draftPassword === 'function') {
      set((prev) => ({ ...prev, draftPassword: draftPassword(prev.draftPassword) }));
    } else if (typeof draftPassword === 'object') {
      set((prev) => ({
        ...prev,
        draftPassword,
      }));
    }
  },
  async savePassword() {
    const draftPassword = get().draftPassword;

    if (!draftPassword) {
      return;
    }

    if (JSON.stringify(draftPassword) === JSON.stringify(get().selectedPassword)) {
      set({ isEditing: false });
      return;
    }

    set({ isLoading: true });

    try {
      await update(draftPassword._id, {
        name: draftPassword.name,
        credentials: draftPassword.credentials,
        website: draftPassword.website,
      });
      usePasswordsStore.getState().fetch(usePasswordsStore.getState().query);
    } finally {
      try {
        const fetchedPassword = await findOne(draftPassword._id);
        set({ isLoading: false, isEditing: false, selectedPassword: fetchedPassword });
      } catch (e) {}
    }
  },
  setIntegrationModalOpen(isIntegrationModalOpen) {
    set({ isIntegrationModalOpen });
  },
  setExposedPasswordModalOpen(isExposedPasswordModalOpen) {
    set({ isExposedPasswordModalOpen });
  },
}));

export default useEditorStore;
