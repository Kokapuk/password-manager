import { Toast as IToast } from '@/store/toasts';
import cn from 'classnames';
import { Ref } from 'react';
import styles from './Toast.module.scss';

interface Props {
  ref?: Ref<HTMLDivElement>;
  toast: IToast;
}

const Toast = ({ ref, toast }: Props) => {
  return (
    <div
      ref={ref}
      className={cn(styles.toast, styles[toast.type])}
      dangerouslySetInnerHTML={{ __html: toast.content }}
    />
  );
};

export default Toast;
