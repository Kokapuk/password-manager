import Button from '@/components/Button';
import Modal from '@/components/Modal';
import useEditorStore from '@/store/editor';
import usePasswordsStore from '@/store/passwords';
import { remove } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HiMiniTrash } from 'react-icons/hi2';

interface Props {
  triggerClass: string;
}

const DeleteModal = ({ triggerClass }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const { selectedPassword, draftPassword, isLoading, setEditing, setLoading } = useEditorStore();
  const { query, fetch: fetchPasswords } = usePasswordsStore();
  const router = useRouter();

  if (!selectedPassword || !draftPassword) {
    return null;
  }

  const removePassword = async () => {
    setOpen(false);
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
    <>
      <Button loading={isLoading} onClick={() => setOpen(true)} className={triggerClass}>
        <HiMiniTrash /> Delete
      </Button>
      <Modal
        onCloseRequest={() => setOpen(false)}
        isOpen={isOpen}
        title="Confirm action"
        buttons={[
          { title: 'Yes', onClick: removePassword, secondary: true },
          { title: 'No', onClick: () => setOpen(false) },
        ]}
      >
        <p>
          Are you sure you want to delete <b>{selectedPassword.name}</b>?
        </p>
      </Modal>
    </>
  );
};

export default DeleteModal;
