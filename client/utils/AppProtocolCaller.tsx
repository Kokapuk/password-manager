'use client';

import isDesktopApp from '@/utils/isDesktopApp';
import { useEffect } from 'react';

const AppProtocolCaller = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_PROTOCOL && !isDesktopApp()) {
      window.location.href = `${process.env.NEXT_PUBLIC_APP_PROTOCOL}://`;
    }
  }, []);

  return null;
};

export default AppProtocolCaller;
