'use client';

import { ReactNode, useLayoutEffect } from 'react';
import { Binder, startTransition } from 'react-smooth-flow';

interface Props {
  children: ReactNode;
}

const HomeTemplate = ({ children }: Props) => {
  useLayoutEffect(() => {
    return () => {
      startTransition(['page']);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Binder
      transitions={{
        page: {
          duration: 500,
          forcePresenceTransition: true,
          enterKeyframes: { transform: ['scale(.8)', 'scale(1)'], opacity: [0, 0, 1] },
          exitKeyframes: { transform: ['scale(1)', 'scale(1.2)'], opacity: [1, 0, 0] },
          relevantStyleProperties: ['padding'],
        },
      }}
    >
      <div id="routeRoot">{children}</div>
    </Binder>
  );
};

export default HomeTemplate;
