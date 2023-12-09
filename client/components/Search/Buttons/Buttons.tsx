import Button from '@/components/Button';
import isDesktopApp from '@/utils/isDesktopApp';
import dynamic from 'next/dynamic';
import { IconContext } from 'react-icons';
import { HiMiniArrowDownTray } from 'react-icons/hi2';
import styles from './Buttons.module.scss';

const Tooltip = dynamic(() => import('@/components/Tooltip'), { ssr: false });
const CreatePasswordModal = dynamic(() => import('../CreatePasswordModal'), { ssr: false });

const Buttons = () => {
  return (
    <IconContext.Provider value={{ className: styles.icon }}>
      <CreatePasswordModal triggerClass={styles.button} />
      {!isDesktopApp() && navigator.userAgent.toLowerCase().includes('windows') && (
        <Tooltip content="Download for Windows" placement="bottom">
          <a href={process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS_URL} target="_blank" style={{ display: 'flex' }}>
            <Button className={styles.button}>
              <HiMiniArrowDownTray />
            </Button>
          </a>
        </Tooltip>
      )}
    </IconContext.Provider>
  );
};

export default Buttons;
