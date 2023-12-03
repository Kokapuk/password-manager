'use client';

import PasswordEditor from '@/components/PasswordEditor';
import useAuthStore from '@/store/auth';
import useEditorStore from '@/store/editor';
import usePasswordsStore from '@/store/passwords';
import { findOne } from '@/utils/api';
import { useEffect } from 'react';

interface Props {
  params: { editing: string };
}

function EditingPage({ params }: Props) {
  const passwords = usePasswordsStore((state) => state.passwords);
  const { selectedPassword, setSelectedPassword } = useEditorStore();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    setSelectedPassword(null);

    if (!token) {
      return;
    }

    const foundPassword = passwords.find((item) => item._id === params.editing);

    if (foundPassword) {
      return setSelectedPassword(foundPassword);
    }

    (async () => {
      try {
        const fetchedPassword = await findOne(params.editing);
        setSelectedPassword(fetchedPassword);
      } catch (e) {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.editing, token]);

  return <PasswordEditor key={selectedPassword?._id} />;
}

export default EditingPage;
