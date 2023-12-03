import Favicon from '@/components/Favicon';
import useEditorStore from '@/store/editor';
import Buttons from './Buttons';
import styles from './Title.module.scss';

const Title = () => {
  const { isEditing, draftPassword, setDraftPassword } = useEditorStore();

  if (!draftPassword) {
    return null;
  }

  return (
    <div className={styles.title}>
      <Favicon website={draftPassword.website} />
      <input
        value={draftPassword.name}
        onChange={(e) => setDraftPassword((prev) => prev && { ...prev, name: e.target.value })}
        placeholder="Title"
        className={styles.input}
        readOnly={!isEditing}
        required
        minLength={1}
        maxLength={64}
      />
      <Buttons />
    </div>
  );
};

export default Title;
