import Button from '@/components/Button';
import isDesktopApp from '@/utils/isDesktopApp';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { IconContext } from 'react-icons';
import { HiMiniArrowDownTray, HiMiniPlus } from 'react-icons/hi2';
import styles from './Buttons.module.scss';

const Tooltip = dynamic(() => import('@/components/Tooltip'), { ssr: false });
const CreatePasswordModal = dynamic(() => import('../CreatePasswordModal'), { ssr: false });

const Buttons = () => {
  const [isCreatePasswordModalOpen, setCreatePasswordModalOpen] = useState(false);

  return (
    <>
      <IconContext.Provider value={{ className: styles.icon }}>
        <Tooltip content="Create password" placement="bottom">
          <Button onClick={() => setCreatePasswordModalOpen(true)} className={styles.button}>
            <HiMiniPlus />
          </Button>
        </Tooltip>
        {!isDesktopApp() && navigator.userAgent.toLowerCase().includes('windows') && (
          <Tooltip content="Download for Windows" placement="bottom">
            <a
              href={process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS_URL}
              target="_blank"
              style={{ display: 'flex' }}
            >
              <Button className={styles.button}>
                <HiMiniArrowDownTray />
              </Button>
            </a>
          </Tooltip>
        )}
        {/* {isDesktopApp() && (
          <Button className={styles.button}>
            <HiMiniCog8Tooth />
          </Button>
        )} */}
      </IconContext.Provider>

      <CreatePasswordModal
        isOpen={isCreatePasswordModalOpen}
        onCloseRequest={() => setCreatePasswordModalOpen(false)}
      />
    </>
  );
};

export default Buttons;
