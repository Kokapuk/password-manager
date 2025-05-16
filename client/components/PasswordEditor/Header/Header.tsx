import Button from '@/components/Button';
import useEditorStore from '@/store/editor';
import isExposedPasswordField from '@/utils/isExposedPasswordField';
import { useRouter } from 'next/navigation';
import { useId } from 'react';
import { IconContext } from 'react-icons';
import { HiMiniCheckCircle, HiMiniPencil, HiMiniXMark } from 'react-icons/hi2';
import { Binder, startTransition, usePreCommitEffect } from 'react-smooth-flow';
import CancelModal from '../CancelModal';
import DeleteModal from '../DeleteModal';
import styles from './Header.module.scss';

interface Props {
  validate(): boolean;
}

const Header = ({ validate }: Props) => {
  const {
    selectedPassword,
    isEditing,
    isLoading,
    draftPassword,
    setEditing,
    savePassword,
    setExposedPasswordModalOpen,
  } = useEditorStore();
  const router = useRouter();
  const editSavedButtonTag = useId();
  const deleteButtonTag = useId();
  const closeCancelButtonTag = useId();

  usePreCommitEffect(
    (isInitialRender) => {
      if (!isInitialRender) {
        startTransition([editSavedButtonTag, deleteButtonTag, closeCancelButtonTag]);
      }
    },
    [isEditing]
  );

  if (!selectedPassword || !draftPassword) {
    return null;
  }

  const handleSavePassword = () => {
    if (!validate()) {
      return;
    }

    const hasExposedPasswordField = draftPassword.credentials.fields?.some((item) => isExposedPasswordField(item));

    if (hasExposedPasswordField) {
      return setExposedPasswordModalOpen(true);
    }

    savePassword();
  };

  const handleClose = () => {
    router.push('/passwords');
  };

  return (
    <IconContext.Provider value={{ className: styles.icon }}>
      <div className={styles.header}>
        <Binder transitions={{ [editSavedButtonTag]: { duration: 250 } }}>
          {isEditing ? (
            <Button key="save" loading={isLoading} onClick={handleSavePassword} className={styles.button}>
              <HiMiniCheckCircle /> Save
            </Button>
          ) : (
            <Button key="edit" loading={isLoading} onClick={() => setEditing(true)} className={styles.button}>
              <HiMiniPencil /> Edit
            </Button>
          )}
        </Binder>
        <Binder transitions={{ [deleteButtonTag]: { duration: 250 } }}>
          <DeleteModal triggerClass={styles.button} />
        </Binder>
        <Binder transitions={{ [closeCancelButtonTag]: { duration: 250 } }}>
          {isEditing ? (
            <CancelModal triggerClass={styles.button} />
          ) : (
            <Button onClick={handleClose} className={styles.button}>
              <HiMiniXMark /> Close
            </Button>
          )}
        </Binder>
      </div>
    </IconContext.Provider>
  );
};

export default Header;
