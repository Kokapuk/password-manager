'use client';

// import ChromeClose from '@/icons/ChromeClose';
// import ChromeMaximize from '@/icons/ChromeMaximize';
// import ChromeMinimize from '@/icons/ChromeMinimize';
// import ChromeRestore from '@/icons/ChromeRestore';
import isDesktopApp from '@/utils/isDesktopApp';
import { useEffect, useState } from 'react';
import styles from './TitleBar.module.scss';

const TitleBar = () => {
  // const [isMaximized, setMaximized] = useState(false);

  // useEffect(() => {
  //   if (!isDesktopApp()) {
  //     return;
  //   }

  //   (async () => {
  //     const initialMaximized: boolean = await window.electron.ipcRenderer.invoke('getMaximized');
  //     setMaximized(initialMaximized);
  //   })();

  //   window.electron.ipcRenderer.on('toggleMaximized', (_event: unknown, isMaximized: boolean) => {
  //     setMaximized(isMaximized);
  //   });
  // }, []);

  if (!isDesktopApp()) {
    return null;
  }

  return (
    <div className={styles.bar}>
      {/* <button onClick={() => window.electron.ipcRenderer.send('minimize')} className={styles.controlButton}>
        <ChromeMinimize />
      </button>
      <button onClick={() => window.electron.ipcRenderer.send('toggleMaximized')} className={styles.controlButton}>
        {isMaximized ? <ChromeRestore /> : <ChromeMaximize />}
      </button>
      <button
        onClick={() => window.electron.ipcRenderer.send('close')}
        className={classNames(styles.controlButton, styles.close)}
      >
        <ChromeClose />
      </button> */}
    </div>
  );
};

export default TitleBar;
