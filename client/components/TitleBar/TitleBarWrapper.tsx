'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const TitleBar = dynamic(() => import('./TitleBar'), { ssr: false });

const TitleBarWrapper = () => {
  return (
    <div id="titleBar">
      <TitleBar />
    </div>
  );
};

export default TitleBarWrapper;
