import useEditorStore from '@/store/editor';
import { Password } from '@/utils/types';
import { useRouter } from 'next/navigation';
import Modal from '../Modal';

interface Props {
  passwordToOpen?: Password;
  isOpen: boolean;
  onCloseRequest(): void;
}

const UnsavedChangesModal = ({ passwordToOpen, ...props }: Props) => {
  const { selectedPassword } = useEditorStore();
  const router = useRouter();

  const handleOpenPassword = () => {
    if (passwordToOpen) {
      router.push(`/passwords/${passwordToOpen._id}`);
      props.onCloseRequest();
    }
  };

  return (
    <Modal
      {...props}
      buttons={[
        { title: 'Yes', onClick: handleOpenPassword, secondary: true },
        { title: 'No', onClick: props.onCloseRequest },
      ]}
      title="Hold on!"
    >
      <p>
        You are currently editing <b>{selectedPassword?.name}</b>.
      </p>
      <p>
        Are you sure you want to open <b>{passwordToOpen?.name}</b> password?
      </p>
      <p>All unsaved changes will be lost.</p>
    </Modal>
  );
};

export default UnsavedChangesModal;
