'use client';

import { useEffect } from 'react';
import isDesktopApp from './isDesktopApp';

const TransparentBackgroundHandler = () => {
  useEffect(() => {
    if (isDesktopApp()) {
      document.body.style.backgroundColor = 'transparent';
    }
  }, []);

  return null;
};

export default TransparentBackgroundHandler;
