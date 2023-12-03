import styles from './LoadingSpinner.module.scss';

interface Props {
  loading?: boolean;
  size?: number;
  lineWidth?: number;
}

const LoadingSpinner = ({ loading = true, size, lineWidth }: Props) => {
  if (!loading) {
    return null;
  }

  return <div className={styles.spinner} style={{ height: size, borderWidth: lineWidth }} />;
};

export default LoadingSpinner;
