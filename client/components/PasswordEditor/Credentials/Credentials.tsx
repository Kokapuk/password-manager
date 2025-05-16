import Field from '@/components/PasswordEditor/Field';
import SortableList from '@/components/SortableList';
import useEditorStore from '@/store/editor';
import { Field as FieldType, Password } from '@/utils/types';
import { Binder, startTransition, usePreCommitEffect } from 'react-smooth-flow';
import Integration from '../Integration';
import styles from './Credentials.module.scss';

const Credentials = () => {
  const { isEditing, draftPassword, setDraftPassword } = useEditorStore();

  usePreCommitEffect(
    (isInitialRender) => {
      if (!isInitialRender && !isEditing && draftPassword?.credentials.fields) {
        startTransition(draftPassword.credentials.fields.map((i) => `field-${i._id}`));
      }
    },
    [isEditing]
  );

  usePreCommitEffect(
    (isInitialRender) => {
      if (!isInitialRender) {
        startTransition(['credentials_integration']);
      }
    },
    [draftPassword?.credentials.integration?._id]
  );

  if (!draftPassword) {
    return null;
  }

  const handleSort = (fields: FieldType[]) => {
    startTransition(
      fields.map((i) => `field-${i._id}`),
      () =>
        setDraftPassword((prev) => {
          const prevState: Password = JSON.parse(JSON.stringify(prev));
          prevState.credentials.fields = fields;

          return prevState;
        })
    );
  };

  return (
    <Binder root="credentials">
      <div className={styles.container}>
        {draftPassword.credentials.fields && (
          <SortableList
            sortable={isEditing}
            data={draftPassword.credentials.fields}
            getListItem={(item) => <Field field={item} />}
            getItemKey={(item) => item._id}
            getWrapper={(children, item) => (
              <Binder
                transitions={{
                  [`field-${item._id}`]: {
                    duration: 300,
                    transitionLayout: true,
                    enterKeyframes: { transform: ['translateX(100px)', 'translateX(0)'], opacity: [0, 1] },
                    exitKeyframes: 'reversedEnter',
                    root: 'credentials',
                  },
                }}
              >
                {children}
              </Binder>
            )}
            onSort={handleSort}
          />
        )}
        {!!draftPassword.credentials.integration && (
          <Binder
            transitions={{
              credentials_integration: {
                duration: 300,
                transitionLayout: true,
                enterKeyframes: { transform: ['translateX(100px)', 'translateX(0)'], opacity: [0, 1] },
                exitKeyframes: 'reversedEnter',
                root: 'credentials',
                forcePresenceTransition: true,
              },
            }}
          >
            <Integration />
          </Binder>
        )}
        <Field isWebsite field={{ _id: '', title: 'Website', value: draftPassword.website, isPassword: false }} />
      </div>
    </Binder>
  );
};

export default Credentials;
