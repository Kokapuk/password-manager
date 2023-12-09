import dynamic from 'next/dynamic';
import styles from './Buttons.module.scss';

const CreateFieldModal = dynamic(() => import('../../CreateFieldModal'), { ssr: false });
const IntegrationModal = dynamic(() => import('../../IntegrationModal'), { ssr: false });

const Buttons = () => {
  return (
    <div className={styles.container}>
      <IntegrationModal triggerClass={styles.button} />
      <CreateFieldModal triggerClass={styles.button} />
    </div>
  );
};

export default Buttons;
