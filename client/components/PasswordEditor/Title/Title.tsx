import Favicon from '@/components/Favicon';
import useEditorStore from '@/store/editor';
import { useId } from 'react';
import { Binder, startTransition, usePreCommitEffect } from 'react-smooth-flow';
import Buttons from './Buttons';
import styles from './Title.module.scss';

const Title = () => {
  const { isEditing, draftPassword, setDraftPassword } = useEditorStore();
  const buttonsTag = useId();

  usePreCommitEffect(
    (isInitialRendering) => {
      if (!isInitialRendering) {
        startTransition([buttonsTag]);
      }
    },
    [isEditing]
  );

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
      {isEditing && (
        <Binder
          transitions={{
            [buttonsTag]: {
              duration: 250,
              enterKeyframes: { transform: ['translateX(25px)', 'translateX(0)'], opacity: [0, 1] },
              exitKeyframes: 'reversedEnter',
              transitionLayout: true,
            },
          }}
        >
          <Buttons />
        </Binder>
      )}
    </div>
  );
};

export default Title;
