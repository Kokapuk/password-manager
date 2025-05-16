import Modal from '@/components/Modal';
import useEditorStore from '@/store/editor';
import isExposedPasswordField from '@/utils/isExposedPasswordField';

const ExposedPasswordModal = () => {
  const { isExposedPasswordModalOpen, savePassword, setDraftPassword, setExposedPasswordModalOpen } = useEditorStore();

  const handleSave = () => {
    savePassword();
    setExposedPasswordModalOpen(false);
  };

  const handleHideAndSave = () => {
    setDraftPassword((prev) => {
      if (!prev) {
        return undefined;
      }

      const prevState = { ...prev };

      while (prevState.credentials.fields?.some((item) => isExposedPasswordField(item))) {
        const foundField = prevState.credentials?.fields?.find((item) => isExposedPasswordField(item));

        if (foundField) {
          foundField.isPassword = true;
          continue;
        }

        break;
      }

      return prevState;
    });
    savePassword();
    setExposedPasswordModalOpen(false);
  };

  return (
    <Modal
      open={isExposedPasswordModalOpen}
      onClose={() => setExposedPasswordModalOpen(false)}
      title="Hold on!"
      buttons={[
        { title: 'Cancel', onClick: () => setExposedPasswordModalOpen(false), secondary: true },
        { title: 'Save as is', onClick: handleSave, secondary: true },
        { title: 'Hide and Save', onClick: handleHideAndSave },
      ]}
    >
      We detected that you have the <b>Password</b> field(s) exposed.
      <br />
      What do you want to do about that?
    </Modal>
  );
};

export default ExposedPasswordModal;
