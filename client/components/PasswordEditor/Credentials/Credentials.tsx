import Field from '@/components/PasswordEditor/Field';
import SortableList from '@/components/SortableList';
import useEditorStore from '@/store/editor';
import { Field as FieldType, Password } from '@/utils/types';
import Integration from '../Integration';
import styles from './Credentials.module.scss';

const Credentials = () => {
  const { isEditing, draftPassword, setDraftPassword } = useEditorStore();

  if (!draftPassword) {
    return null;
  }

  const handleSort = (fields: FieldType[]) => {
    setDraftPassword((prev) => {
      const prevState: Password = JSON.parse(JSON.stringify(prev));
      prevState.credentials.fields = fields;

      return prevState;
    });
  };

  return (
    <div className={styles.container}>
      {draftPassword.credentials.fields && (
        <SortableList
          sortable={isEditing}
          data={draftPassword.credentials.fields}
          getListItem={(item) => <Field field={item} />}
          getItemKey={(item) => item._id}
          onSort={handleSort}
        />
      )}
      {!!draftPassword.credentials.integration && <Integration />}
      <Field isWebsite field={{ _id: '', title: 'Website', value: draftPassword.website, isPassword: false }} />
    </div>
  );
};

export default Credentials;
