'use client';

import useToastsStore from '@/store/toasts';
import { useRef } from 'react';
import { Binder, startTransition, usePreCommitEffect } from 'react-smooth-flow';
import Toast from './Toast';
import styles from './Toasts.module.scss';

const Toasts = () => {
  const toasts = useToastsStore((st) => st.toasts);
  const prevToastIds = useRef<number[]>(toasts.map((i) => i.id));

  usePreCommitEffect(
    (isInitialRender) => {
      if (!isInitialRender) {
        const removedToastIds = prevToastIds.current.filter((i) => !toasts.map((i) => i.id).includes(i));
        const addedToastIds = toasts.map((i) => i.id).filter((i) => !prevToastIds.current.includes(i));

        startTransition([...removedToastIds, ...addedToastIds].map((i) => `toast-${i}`));
        prevToastIds.current = toasts.map((i) => i.id);
      }
    },
    [toasts]
  );

  return (
    <div className={styles.wrapper}>
      {toasts.map((i) => (
        <Binder
          key={i.id}
          transitions={{
            [`toast-${i.id}`]: {
              duration: 300,
              transitionLayout: true,
              useLayoutProxyAsRoot: true,
              positionAnchor: 'bottomLeft',
              enterKeyframes: { transform: ['translateX(50px)', 'translateX(0)'], opacity: [0, 1] },
              exitKeyframes: 'reversedEnter',
            },
          }}
        >
          <Toast toast={i} />
        </Binder>
      ))}
    </div>
  );
};

export default Toasts;
