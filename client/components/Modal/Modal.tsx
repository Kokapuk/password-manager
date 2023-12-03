import cn from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiMiniXMark } from 'react-icons/hi2';
import { CSSTransition } from 'react-transition-group';
import Button, { ButtonProps } from '../Button';
import styles from './Modal.module.scss';

interface Props {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  buttons?: ({ title: string; secondary?: boolean } & ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>)[];
  fullHeight?: boolean;
  containerClass?: string;
  onCloseRequest?(): void;
}

const Modal = ({ isOpen, title, children, buttons, fullHeight, containerClass, onCloseRequest }: Props) => {
  const [containerState, setContainerState] = useState<'shown' | 'hidden'>('hidden');

  useEffect(() => {
    if (!isOpen || !onCloseRequest) {
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      onCloseRequest();
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onCloseRequest]);

  return createPortal(
    <CSSTransition
      in={isOpen}
      unmountOnExit
      classNames={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        exit: styles.exit,
        exitActive: styles.exitActive,
      }}
      timeout={200}
      onEnter={() => setContainerState('shown')}
      onExit={() => setContainerState('hidden')}
    >
      <div className={styles.background}>
        <div className={cn(styles.container, styles[containerState], fullHeight && styles.fullHeight, containerClass)}>
          <header className={styles.header}>
            <h2>{title}</h2>
            {onCloseRequest && (
              <Button onClick={onCloseRequest} className={styles.button}>
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
      </div>
    </CSSTransition>,
    document.getElementById('modalPortal') as HTMLElement
  );
};

export default Modal;
