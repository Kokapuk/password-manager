'use client';

import SignUp from '@/routes/Auth/SignUp';
import useAuthStore from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SignUpPage = () => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    useAuthStore.persist.rehydrate();

    if (useAuthStore.getState().token) {
      router.push('/passwords');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return <SignUp />;
};

export default SignUpPage;
