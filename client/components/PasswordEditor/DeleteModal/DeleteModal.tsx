import Button from '@/components/Button';
import Modal from '@/components/Modal';
import useEditorStore from '@/store/editor';
import usePasswordsStore from '@/store/passwords';
import { remove } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { Ref, useState } from 'react';
import { HiMiniTrash } from 'react-icons/hi2';

interface Props {
  ref?: Ref<HTMLButtonElement>;
  triggerClass: string;
}

const DeleteModal = ({ ref, triggerClass }: Props) => {
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
      <Button ref={ref} disabled={isLoading} onClick={() => setOpen(true)} className={triggerClass}>
        <HiMiniTrash /> Delete
      </Button>
      <Modal
        onClose={() => setOpen(false)}
        open={isOpen}
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
