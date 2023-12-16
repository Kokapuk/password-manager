import Button from '@/components/Button';
import useEditorStore from '@/store/editor';
import isExposedPasswordField from '@/utils/isExposedPasswordField';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { IconContext } from 'react-icons';
import { HiMiniCheckCircle, HiMiniPencil, HiMiniXMark } from 'react-icons/hi2';
import CancelModal from '../CancelModal';
import styles from './Header.module.scss';

const DeleteModal = dynamic(() => import('../DeleteModal'), { ssr: false });

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
        {isEditing ? (
          <Button key="save" loading={isLoading} onClick={handleSavePassword} className={styles.button}>
            <HiMiniCheckCircle /> Save
          </Button>
        ) : (
          <Button key="edit" loading={isLoading} onClick={() => setEditing(true)} className={styles.button}>
            <HiMiniPencil /> Edit
          </Button>
        )}
        <DeleteModal triggerClass={styles.button} />
        {isEditing ? (
          <CancelModal triggerClass={styles.button} />
        ) : (
          <Button key="close" onClick={handleClose} className={styles.button}>
            <HiMiniXMark /> Close
          </Button>
        )}
      </div>
    </IconContext.Provider>
  );
};

export default Header;
