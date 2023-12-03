import { Metadata } from 'next';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    "Join us on a journey of possibilities! Sign up for a new account and unlock a realm of personalized experiences. It's quick, easy, and the gateway to a world tailored just for you. Begin your adventure by creating your account today.",
};

const SignUpLayout = ({ children }: Props) => {
  return children;
};

export default SignUpLayout;
