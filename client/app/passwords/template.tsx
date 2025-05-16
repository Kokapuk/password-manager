'use client';

import cn from 'classnames';
import { ReactNode, useLayoutEffect } from 'react';
import { Binder, startTransition, TransitionOptions } from 'react-smooth-flow';
import styles from './PasswordsLayout.module.scss';
import { useParams, usePathname } from 'next/navigation';

interface Props {
  children: ReactNode;
}

const transitionOptions: TransitionOptions = {
  duration: 400,
  forcePresenceTransition: true,
  captureDynamicStates: true,
};

const getPathnameLevel = (pathname: string) => pathname.split('/').filter(Boolean).length;

const HomeTemplate = ({ children }: Props) => {
  const params = useParams();
  const pathname = usePathname();

  useLayoutEffect(() => {
    return () => {
      startTransition([
        getPathnameLevel(window.location.pathname) < getPathnameLevel(pathname)
          ? 'passwordsPageBack'
          : 'passwordsPageForth',
      ]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Binder
      transitions={{
        passwordsPageForth: {
          ...transitionOptions,
          enterKeyframes: { transform: ['translateX(-150px)', 'translateX(0)'], opacity: [0, 0, 1] },
          exitKeyframes: { transform: ['transform(0)', 'translateX(150px)'], opacity: [1, 0, 0] },
        },
        passwordsPageBack: {
          ...transitionOptions,
          enterKeyframes: { transform: ['translateX(150px)', 'translateX(0)'], opacity: [0, 0, 1] },
          exitKeyframes: { transform: ['transform(0)', 'translateX(-150px)'], opacity: [1, 0, 0] },
        },
      }}
    >
      <div className={cn(styles.passwordEditorContainer, !!params['editing'] && styles.active)}>{children}</div>
    </Binder>
  );
};

export default HomeTemplate;
