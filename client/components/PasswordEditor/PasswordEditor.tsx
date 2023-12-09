import Loading from '@/routes/Loading';
import useEditorStore from '@/store/editor';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import Credentials from './Credentials';
import Header from './Header';
import styles from './PasswordEditor.module.scss';
import Title from './Title';

const ExposedPasswordModal = dynamic(() => import('./ExposedPasswordModal'), { ssr: false });

const PasswordEditor = () => {
  const form = useRef<HTMLFormElement>(null);
  const { selectedPassword, draftPassword } = useEditorStore();

  if (!selectedPassword || !draftPassword) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Header validate={() => form.current?.reportValidity?.() ?? false} />
      <form className={styles.form} ref={form} onSubmit={(e) => e.preventDefault()}>
        <Title />
        <Credentials />
      </form>
      <ExposedPasswordModal />
    </div>
  );
};

export default PasswordEditor;
