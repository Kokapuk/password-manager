'use client';

import PasswordList from '@/components/PasswordList';
import Search from '@/components/Search';
import useAuthStore from '@/store/auth';
import useEditorStore from '@/store/editor';
import useNavigationStore from '@/store/navigation';
import usePasswordsStore from '@/store/passwords';
import { Password } from '@/utils/types';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import { useParams, usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { ReactNode, useEffect, useState } from 'react';
import styles from './PasswordsLayout.module.scss';

const NavigateUnsavedChangesModal = dynamic(() => import('@/components/NavigateUnsavedChangesModal'), { ssr: false });

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
  const { navigatingTo, setNavigatingTo } = useNavigationStore();
  const pathname = usePathname();

  useEffect(() => {
    useAuthStore.persist.rehydrate();

    if (!useAuthStore.getState().token) {
      router.push('/signIn');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPasswords(undefined, true);
    }
  }, [fetchPasswords, token]);

  useEffect(() => {
    setNavigatingTo(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handlePasswordSelect = (password: Password) => {
    if (isEditing) {
      setPasswordToOpen(password);
      setUnsavedChangesModalOpen(true);
      return;
    }

    setNavigatingTo(`/passwords/${password._id}`);
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
            totalCount={totalCount}
            onPasswordSelect={handlePasswordSelect}
            onPaginationTriggerReached={paginatePasswords}
          />
        </div>
        {/* <div className={cn(styles.passwordEditorContainer, !!params['editing'] && styles.active)}>
          {navigatingTo ? <Loading /> : children}
        </div> */}
        {/* {navigatingTo ? <Loading /> : children} */}
        {children}
      </div>
      <NavigateUnsavedChangesModal
        open={isUnsavedChangesModalOpen}
        onClose={() => setUnsavedChangesModalOpen(false)}
        passwordToOpen={passwordToOpen ?? undefined}
      />
    </>
  );
};

export default PasswordsLayout;
