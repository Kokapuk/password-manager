import Button from '@/components/Button';
import Modal from '@/components/Modal';
import useEditorStore from '@/store/editor';
import { useState } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';

interface Props {
  triggerClass: string;
}

const CancelModal = ({ triggerClass }: Props) => {
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
      <Button onClick={() => setOpen(true)} className={triggerClass}>
        <HiMiniXMark /> Cancel
      </Button>
      <Modal
        isOpen={isOpen}
        onCloseRequest={() => setOpen(false)}
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
