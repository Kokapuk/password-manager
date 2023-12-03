import Modal from '@/components/Modal';
import PasswordList from '@/components/PasswordList';
import Search from '@/components/Search';
import useAuthStore from '@/store/auth';
import useEditorStore from '@/store/editor';
import { limitPerPage } from '@/store/passwords';
import { findAll } from '@/utils/api';
import { Password } from '@/utils/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './IntegrationModal.module.scss';

const IntegrationModal = () => {
  const { selectedPassword, draftPassword, isIntegrationModalOpen, setDraftPassword, setIntegrationModalOpen } =
    useEditorStore();
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [isFetching, setFetching] = useState(true);
  const [isFetchFailed, setFetchFailed] = useState(false);
  const [query, setQuery] = useState('');
  const page = useRef(1);

  const fetchPasswords = useCallback(
    async (query = '') => {
      if (isFetchFailed || !useAuthStore.getState().token) {
        return;
      }

      setFetching(true);
      setPasswords([]);

      try {
        const [totalCount, newPasswords] = await findAll(query, limitPerPage, 1);
        setPasswords(newPasswords);
        setTotalCount(totalCount);
        setQuery(query);
      } catch {
        setFetchFailed(true);
      } finally {
        setFetching(false);
        page.current = 1;
      }
    },
    [isFetchFailed]
  );

  useEffect(() => {
    if (!isIntegrationModalOpen || passwords.length) {
      return;
    }

    fetchPasswords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPasswords, isIntegrationModalOpen]);

  const paginatePasswords = useCallback(async () => {
    if (isFetchFailed || isFetching || !useAuthStore.getState().token || passwords.length >= (totalCount as number)) {
      return;
    }

    setFetching(true);

    try {
      const [totalCount, newPasswords] = await findAll(query, limitPerPage, page.current + 1);
      setPasswords((prev) => [...prev, ...newPasswords]);
      setTotalCount(totalCount);
      page.current++;
    } catch {
      setPasswords([]);
      setFetchFailed(true);
    } finally {
      setFetching(false);
    }
  }, [isFetchFailed, isFetching, passwords.length, query, totalCount]);

  if (!selectedPassword) {
    return null;
  }

  const handleIntegrationSelect = (integration: Password | undefined) => {
    setDraftPassword((prev) => {
      const prevState: Password = JSON.parse(JSON.stringify(prev));

      prevState.credentials.integration = integration;
      return prevState;
    });

    setIntegrationModalOpen(false);
  };

  return (
    <Modal
      onCloseRequest={() => setIntegrationModalOpen(false)}
      isOpen={isIntegrationModalOpen}
      title="Select integration"
      fullHeight
      containerClass={styles.modal}
    >
      <div className={styles.container}>
        <Search totalCount={totalCount ? totalCount - 1 : totalCount} noButtons onQueryUpdate={fetchPasswords} />
        <PasswordList
          selectedPasswordId={draftPassword?.credentials.integration?._id}
          passwords={passwords.filter((item) => item._id !== selectedPassword._id)}
          isFetching={isFetching}
          isFetchFailed={isFetchFailed}
          query={query}
          onPasswordSelect={handleIntegrationSelect}
          onPaginationTriggerReached={paginatePasswords}
        />
      </div>
    </Modal>
  );
};

export default IntegrationModal;
