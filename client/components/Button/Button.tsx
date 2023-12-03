'use client';

import cn from 'classnames';
import { MouseEvent, ReactNode, useRef, useState } from 'react';
import { Ripple } from '.';
import LoadingSpinner from '../LoadingSpinner';
import styles from './Button.module.scss';

export interface ButtonProps {
  loading?: boolean;
  children?: ReactNode;
}

const Button = ({
  loading = false,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) => {
  const lastRippleId = useRef<number>(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    props.onMouseDown?.(event);
    const boundingClientRect = event.currentTarget.getBoundingClientRect();
    const rippleId = lastRippleId.current;

    if (!boundingClientRect) {
      return;
    }

    setRipples((prev) => [
      ...prev,
      {
        id: rippleId,
        top: event.clientY - boundingClientRect.top,
        left: event.clientX - boundingClientRect.left,
      },
    ]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((item) => item.id !== rippleId));
    }, 350);

    lastRippleId.current++;
  };

  return (
    <button
      {...props}
      onMouseDown={handleMouseDown}
      className={cn(styles.button, loading && styles.loading, props.className)}
      disabled={loading || props.disabled}
      data-loading={loading}
    >
      {children}
      <div className={styles.spinnerContainer}>
        <LoadingSpinner loading={loading} />
      </div>
      {ripples.map((item) => (
        <div className={styles.ripple} key={item.id} style={{ left: item.left, top: item.top }} />
      ))}
    </button>
  );
};

export default Button;
