import Field from '@/components/PasswordEditor/Field';
import useEditorStore from '@/store/editor';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Integration from '../Integration';
import styles from './Credentials.module.scss';

const Credentials = () => {
  const draftPassword = useEditorStore((state) => state.draftPassword);

  if (!draftPassword) {
    return null;
  }

  return (
    <div className={styles.container}>
      <TransitionGroup className={styles.fieldList}>
        {draftPassword.credentials.fields?.map((field) => (
          <CSSTransition
            key={field._id}
            timeout={200}
            classNames={{
              enter: styles.fieldEnter,
              enterActive: styles.fieldEnterActive,
              exit: styles.fieldExit,
              exitActive: styles.fieldExitActive,
            }}
          >
            <>
              <Field field={field} />
            </>
          </CSSTransition>
        ))}
      </TransitionGroup>
      <CSSTransition
        in={!!draftPassword.credentials.integration}
        classNames={{
          enter: styles.integrationEnter,
          enterActive: styles.integrationEnterActive,
          exit: styles.integrationExit,
          exitActive: styles.integrationExitActive,
        }}
        timeout={200}
        unmountOnExit
      >
        <Integration />
      </CSSTransition>
      <Field isWebsite field={{ _id: '', title: 'Website', value: draftPassword.website, isPassword: false }} />
    </div>
  );
};

export default Credentials;
