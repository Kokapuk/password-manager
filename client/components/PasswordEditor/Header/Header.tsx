import Button from '@/components/Button';
import useEditorStore from '@/store/editor';
import isExposedPasswordField from '@/utils/isExposedPasswordField';
import { IconContext } from 'react-icons';
import { HiMiniCheckCircle, HiMiniPencil, HiMiniTrash, HiMiniXMark } from 'react-icons/hi2';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import styles from './Header.module.scss';
import { useRouter } from 'next/navigation';

interface Props {
  validate(): boolean;
}

const Header = ({validate}: Props) => {
  const {
    selectedPassword,
    isEditing,
    isLoading,
    draftPassword,
    setEditing,
    setDraftPassword,
    savePassword,
    setDeleteModalOpen,
    setExposedPasswordModalOpen,
  } = useEditorStore();
  const router = useRouter();

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

  const handleCancel = () => {
    setDraftPassword(JSON.parse(JSON.stringify(selectedPassword)));
    setEditing(false);
  };

  const handleClose = () => {
    router.push('/passwords');
  }

  return (
    <IconContext.Provider value={{ className: styles.icon }}>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={isEditing ? 'editing' : 'notEditing'}
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            exit: styles.exit,
            exitActive: styles.exitActive,
          }}
          timeout={200}
        >
          <div className={styles.header}>
            {isEditing ? (
              <Button loading={isLoading} onClick={handleSavePassword} className={styles.button}>
                <HiMiniCheckCircle /> Save
              </Button>
            ) : (
              <Button loading={isLoading} onClick={() => setEditing(true)} className={styles.button}>
                <HiMiniPencil /> Edit
              </Button>
            )}
            <Button loading={isLoading} onClick={() => setDeleteModalOpen(true)} className={styles.button}>
              <HiMiniTrash /> Delete
            </Button>
            {isEditing ? (
              <Button onClick={handleCancel} className={styles.button}>
                <HiMiniXMark /> Cancel
              </Button>
            ) : (
              <Button onClick={handleClose} className={styles.button}>
                <HiMiniXMark /> Close
              </Button>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </IconContext.Provider>
  );
};

export default Header;
