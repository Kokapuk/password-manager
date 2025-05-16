'use client';

import SignIn from '@/routes/Auth';
import useAuthStore from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SignInPage = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    useAuthStore.persist.rehydrate();

    if (useAuthStore.getState().token) {
      router.push('/passwords');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return <SignIn />;
};

export default SignInPage;
