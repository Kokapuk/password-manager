import cn from 'classnames';
import { ReactNode, useEffect, useId, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiMiniXMark } from 'react-icons/hi2';
import { Binder, startTransition, usePreCommitEffect } from 'react-smooth-flow';
import Button, { ButtonProps } from '../Button';
import styles from './Modal.module.scss';

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  buttons?: ({ title: string; secondary?: boolean } & ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>)[];
  fullHeight?: boolean;
  containerClass?: string;
  onClose?(): void;
}

const Modal = ({ open, title, children, buttons, fullHeight, containerClass, onClose }: Props) => {
  const modalBackdropTag = useId();
  const modalTag = useId();

  usePreCommitEffect(
    (isInitialRender) => {
      if (!isInitialRender) {
        startTransition([modalBackdropTag, modalTag]);
      }
    },
    [open]
  );

  useLayoutEffect(() => {
    return () => {
      startTransition([modalBackdropTag, modalTag]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open || !onClose) {
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      onClose();
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <Binder transitions={{ [modalBackdropTag]: { duration: 300 } }}>
      <div className={styles.background}>
        <Binder
          transitions={{
            [modalTag]: {
              duration: 300,
              enterKeyframes: { transform: ['scale(0.9)', 'scale(1)'], opacity: [0, 1] },
              exitKeyframes: 'reversedEnter',
              captureDynamicStatesDepth: -1,
            },
          }}
        >
          <div className={cn(styles.container, fullHeight && styles.fullHeight, containerClass)}>
            <header className={styles.header}>
              <h2>{title}</h2>
              {onClose && (
                <Button onClick={onClose} className={styles.button}>
                  <HiMiniXMark />
                </Button>
              )}
            </header>
            <main className={styles.main}>{children}</main>
            {buttons && buttons.length && (
              <footer className={styles.footer}>
                {buttons.map(({ title, secondary, ...props }) => (
                  <Button {...props} key={title} className={cn(styles.button, secondary && styles.secondary)}>
                    {title}
                  </Button>
                ))}
              </footer>
            )}
          </div>
        </Binder>
      </div>
    </Binder>,
    document.getElementById('modalPortal') as HTMLElement
  );
};

export default Modal;
