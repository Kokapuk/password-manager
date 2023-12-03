import useEditorStore from '@/store/editor';
import dynamic from 'next/dynamic';
import { HiMiniLink, HiMiniPlus } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import styles from './Buttons.module.scss';

const Tooltip = dynamic(() => import('@/components/Tooltip'), { ssr: false });
const Button = dynamic(() => import('@/components/Button'), { ssr: false });

const Buttons = () => {
  const { isEditing, setCreateFieldModalOpen, setIntegrationModalOpen } = useEditorStore();

  return (
    <CSSTransition
      in={isEditing}
      classNames={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        exit: styles.exit,
        exitActive: styles.exitActive,
      }}
      timeout={200}
      unmountOnExit
    >
      <div className={styles.container}>
        <Tooltip content="Select integration" placement="bottom">
          <Button onClick={() => setIntegrationModalOpen(true)} className={styles.button} type='button'>
            <HiMiniLink />
          </Button>
        </Tooltip>
        <Tooltip content="Add field" placement="bottom">
          <Button onClick={() => setCreateFieldModalOpen(true)} className={styles.button} type='button'>
            <HiMiniPlus />
          </Button>
        </Tooltip>
      </div>
    </CSSTransition>
  );
};

export default Buttons;
