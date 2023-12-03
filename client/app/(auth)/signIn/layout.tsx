import { Metadata } from 'next';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Secure access to your world awaits! Log in to your account effortlessly and experience seamless connectivity.',
};

const SignInLayout = ({ children }: Props) => {
  return children;
};

export default SignInLayout;
