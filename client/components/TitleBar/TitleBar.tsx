'use client';

import isDesktopApp from '@/utils/isDesktopApp';
import styles from './TitleBar.module.scss';

const TitleBar = () => {
  if (!isDesktopApp()) {
    return null;
  }

  return <div className={styles.bar} />;
};

export default TitleBar;
