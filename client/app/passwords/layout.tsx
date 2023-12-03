'use client';

import PasswordList from '@/components/PasswordList';
import Search from '@/components/Search';
import useAuthStore from '@/store/auth';
import useEditorStore from '@/store/editor';
import usePasswordsStore from '@/store/passwords';
import { Password } from '@/utils/types';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import { redirect, useParams, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import styles from './PasswordsLayout.module.scss';

const UnsavedChangesModal = dynamic(() => import('@/components/UnsavedChangesModal'), { ssr: false });

interface Props {
  children: ReactNode;
}

const PasswordsLayout = ({ children }: Props) => {
  const isEditing = useEditorStore((state) => state.isEditing);
  const {
    passwords,
    isFetching,
    isFetchFailed,
    totalCount,
    query,
    fetch: fetchPasswords,
    paginate: paginatePasswords,
  } = usePasswordsStore();
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const params = useParams();
  const [isUnsavedChangesModalOpen, setUnsavedChangesModalOpen] = useState(false);
  const [passwordToOpen, setPasswordToOpen] = useState<Password | null>(null);

  useEffect(() => {
    useAuthStore.persist.rehydrate();

    if (!useAuthStore.getState().token) {
      redirect('/signIn');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPasswords(undefined, true);
    }
  }, [fetchPasswords, token]);

  const handlePasswordSelect = (password: Password) => {
    if (isEditing) {
      setPasswordToOpen(password);
      setUnsavedChangesModalOpen(true);
      return;
    }

    router.push(`/passwords/${password._id}`);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={cn(styles.passwordList, !params['editing'] && styles.active)}>
          <Search totalCount={totalCount} onQueryUpdate={fetchPasswords} />
          <PasswordList
            passwords={passwords}
            isFetching={isFetching}
            isFetchFailed={isFetchFailed}
            query={query}
            selectedPasswordId={params['editing'] as string | undefined}
            onPasswordSelect={handlePasswordSelect}
            onPaginationTriggerReached={paginatePasswords}
          />
        </div>
        <div className={cn(styles.passwordEditorContainer, !!params['editing'] && styles.active)}>{children}</div>
      </div>
      <UnsavedChangesModal
        isOpen={isUnsavedChangesModalOpen}
        onCloseRequest={() => setUnsavedChangesModalOpen(false)}
        passwordToOpen={passwordToOpen ?? undefined}
      />
    </>
  );
};

export default PasswordsLayout;
