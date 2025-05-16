import Button from '@/components/Button';
import Modal from '@/components/Modal';
import useEditorStore from '@/store/editor';
import { Ref, useState } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';

interface Props {
  ref?: Ref<HTMLButtonElement>;
  triggerClass: string;
}

const CancelModal = ({ ref, triggerClass }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const { selectedPassword, draftPassword, setEditing, setDraftPassword } = useEditorStore();

  if (!selectedPassword || !draftPassword) {
    return null;
  }

  const handleCancel = () => {
    setDraftPassword(JSON.parse(JSON.stringify(selectedPassword)));
    setEditing(false);
  };

  return (
    <>
      <Button ref={ref} onClick={() => setOpen(true)} className={triggerClass}>
        <HiMiniXMark /> Cancel
      </Button>
      <Modal
        open={isOpen}
        onClose={() => setOpen(false)}
        title="Confirm action"
        buttons={[
          { title: 'Yes', onClick: handleCancel, secondary: true },
          { title: 'No', onClick: () => setOpen(false) },
        ]}
      >
        <p>
          Are you sure you want to cancel editing <b>{selectedPassword.name}</b>?
        </p>
        <p>All unsaved changes will be lost.</p>
      </Modal>
    </>
  );
};

export default CancelModal;
