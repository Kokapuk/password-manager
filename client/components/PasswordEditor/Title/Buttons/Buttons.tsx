import { Ref } from 'react';
import CreateFieldModal from '../../CreateFieldModal';
import IntegrationModal from '../../IntegrationModal';
import styles from './Buttons.module.scss';

interface Props {
  ref?: Ref<HTMLDivElement>;
}

const Buttons = ({ ref }: Props) => {
  // const buttonsTag = useId();

  // useEffect(() => {
  //   startTransition([buttonsTag]);
  // }, []);

  // useLayoutEffect(() => {
  //   return () => {
  //     startTransition([buttonsTag]);
  //   };
  // }, []);

  return (
    <div ref={ref} className={styles.container}>
      <IntegrationModal triggerClass={styles.button} />
      <CreateFieldModal triggerClass={styles.button} />
    </div>
  );
};

export default Buttons;
