import cn from 'classnames';
import { ReactNode, Ref } from 'react';
import { IconContext } from 'react-icons';
import styles from './TextInput.module.scss';

interface Props {
  ref?: Ref<HTMLInputElement>;
  icon?: ReactNode;
  children?: ReactNode;
  fullHeight?: boolean;
}

const TextInput = ({ icon, children, fullHeight, ...props }: React.InputHTMLAttributes<HTMLInputElement> & Props) => {
  return (
    <div className={cn(styles.container, fullHeight && styles.fullHeight)}>
      {icon && <IconContext.Provider value={{ className: styles.icon }}>{icon}</IconContext.Provider>}
      <input {...props} className={styles.input} />
      {children}
    </div>
  );
};

export default TextInput;
