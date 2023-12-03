import Modal from '@/components/Modal';
import useEditorStore from '@/store/editor';
import usePasswordsStore from '@/store/passwords';
import { remove } from '@/utils/api';
import { useRouter } from 'next/navigation';

const DeleteModal = () => {
  const {
    selectedPassword,
    draftPassword,
    isDeleteModalOpen,
    setEditing,
    setLoading,
    setDeleteModalOpen,
  } = useEditorStore();
  const { query, fetch: fetchPasswords } = usePasswordsStore();
  const router = useRouter();

  if (!selectedPassword || !draftPassword) {
    return null;
  }

  const removePassword = async () => {
    setDeleteModalOpen(false);
    setLoading(true);

    try {
      router.push('/passwords');
      await remove(draftPassword._id);
      fetchPasswords(query);
    } finally {
      setEditing(false);
      setLoading(false);
    }
  };

  return (
    <Modal
      onCloseRequest={() => setDeleteModalOpen(false)}
      isOpen={isDeleteModalOpen}
      title="Confirm action"
      buttons={[
        { title: 'Yes', onClick: removePassword, secondary: true },
        { title: 'No', onClick: () => setDeleteModalOpen(false) },
      ]}
    >
      <p>
        Are you sure you want to delete <b>{selectedPassword.name}</b>?
      </p>
    </Modal>
  );
};

export default DeleteModal;
