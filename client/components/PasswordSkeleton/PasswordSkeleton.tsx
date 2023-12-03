import cn from 'classnames';
import styles from './PasswordSkeleton.module.scss';

const PasswordSkeleton = () => {
  return (
    <div className={cn(styles.bone, styles.background)}>
      <div className={cn(styles.bone, styles.image)}></div>
      <div className={styles.details}>
        <div className={cn(styles.bone, styles.title)}></div>
        <div className={cn(styles.bone, styles.subtitle)}></div>
      </div>
    </div>
  );
};

export default PasswordSkeleton;
