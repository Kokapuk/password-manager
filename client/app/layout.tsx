import TitleBarWrapper from '@/components/TitleBar/TitleBarWrapper';
import '@/styles/globals.scss';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import 'react-smooth-flow/style.min.css';

const AppProtocolCaller = dynamic(() => import('@/utils/AppProtocolCaller'));
const TransparentBackgroundHandler = dynamic(() => import('@/utils/TransparentBackgroundHandler'));
const Toasts = dynamic(() => import('@/components/Toasts'));
const CloseUnsavedChangesModal = dynamic(() => import('@/components/CloseUnsavedChangesModal'));

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Password Manager',
  description: 'Free and simple password storage 💙',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <NextTopLoader color="#175ddc" height={3} showSpinner={false} />
        <AppProtocolCaller />
        <TransparentBackgroundHandler />
        <TitleBarWrapper />
        <div id="root">
          {children}
          <div id="modalPortal"></div>
          <div id="tooltipPortal"></div>
          <Toasts />
        </div>
        <CloseUnsavedChangesModal />
      </body>
    </html>
  );
}
