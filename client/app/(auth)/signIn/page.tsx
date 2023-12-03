'use client';

import useAuthStore from '@/store/auth';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const SignIn = dynamic(() => import('@/routes/Auth/SignIn'), { ssr: false });

const SignInPage = () => {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    useAuthStore.persist.rehydrate();

    if (useAuthStore.getState().token) {
      redirect('/passwords');
    }
  }, [token]);

  return <SignIn />;
};

export default SignInPage;
