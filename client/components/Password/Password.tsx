import { Password as PasswordType } from '@/utils/types';
import cn from 'classnames';
import { HTMLAttributes } from 'react';
import Button from '../Button';
import Favicon from '../Favicon';
import styles from './Password.module.scss';

interface Props {
  password: PasswordType;
  isSelected?: boolean;
  className?: string;
  onClick: HTMLAttributes<HTMLButtonElement>['onClick'];
}

const Password = ({ password, isSelected, className, onClick }: Props) => {
  const firstFieldValue = password.credentials.fields?.find((item) => !item.isPassword)?.value;
  const caption = firstFieldValue
    ? firstFieldValue.substring(0, Math.floor(firstFieldValue.length / 2)) +
      '*'.repeat(firstFieldValue.length - Math.floor(firstFieldValue.length / 2))
    : password.website;

  return (
    <Button onClick={onClick} className={cn(styles.button, isSelected && styles.selected, className)}>
      <Favicon website={password.website} />
      <div className={styles.details}>
        <h2 className={styles.title}>{password.name}</h2>
        <p className={styles.caption}>{caption}</p>
      </div>
    </Button>
  );
};

export default Password;
