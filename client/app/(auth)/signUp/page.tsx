'use client';

import SignUp from '@/routes/Auth/SignUp';
import useAuthStore from '@/store/auth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const SignUpPage = () => {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    useAuthStore.persist.rehydrate();

    if (useAuthStore.getState().token) {
      redirect('/passwords');
    }
  }, [token]);

  return <SignUp />;
};

export default SignUpPage;
