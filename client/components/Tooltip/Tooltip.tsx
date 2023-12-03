import cn from 'classnames';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import styles from './Tooltip.module.scss';

interface Props {
  content: string;
  children: ReactNode;
  placement: 'top' | 'right' | 'bottom' | 'left';
  containerClass?: string;
}

export interface Position {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

const Tooltip = ({ content, children, placement, containerClass }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<Position>({});
  const [isVisible, setVisible] = useState(false);

  const updateLocation = useCallback(
    (container: HTMLDivElement) => {
      if (!tooltip.current) {
        return;
      }

      const boundingClientRect = container.getBoundingClientRect();

      switch (placement) {
        case 'top':
          setPosition({
            top: boundingClientRect.top - boundingClientRect.height,
            left: boundingClientRect.left + boundingClientRect.width / 2 - tooltip.current.clientWidth / 2 - 1,
          });
          break;
        case 'right':
          setPosition({
            top: boundingClientRect.top + boundingClientRect.height / 2 - tooltip.current.clientHeight / 2 - 1,
            left: boundingClientRect.left + boundingClientRect.width,
          });
          break;
        case 'bottom':
          setPosition({
            top: boundingClientRect.bottom,
            left: boundingClientRect.left + boundingClientRect.width / 2 - tooltip.current.clientWidth / 2 - 1,
          });
          break;
        case 'left':
          setPosition({
            top: boundingClientRect.top + boundingClientRect.height / 2 - tooltip.current.clientHeight / 2 - 1,
            left: boundingClientRect.left - tooltip.current.clientWidth,
          });
          break;
      }
    },
    [placement]
  );

  useEffect(() => {
    if (!isVisible || !container.current) {
      return;
    }

    updateLocation(container.current);
  }, [isVisible, updateLocation, content, children]);

  useEffect(() => {
    const handleScroll = () => {
      if (!container.current) {
        return;
      }

      updateLocation(container.current);
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [updateLocation]);

  return (
    <div
      ref={container}
      className={cn(styles.container, containerClass)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {createPortal(
        <CSSTransition
          in={isVisible}
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            exit: styles.exit,
            exitActive: styles.exitActive,
          }}
          timeout={200}
          unmountOnExit
        >
          <span
            ref={tooltip}
            style={{ ...position }}
            className={cn(styles.tooltip, styles[placement], isVisible && styles.visible)}
          >
            <p className={styles.content}>{content}</p>
          </span>
        </CSSTransition>,
        document.getElementById('tooltipPortal') as HTMLElement
      )}
    </div>
  );
};

export default Tooltip;
