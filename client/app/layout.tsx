import '@/styles/globals.scss';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';

const AppProtocolCaller = dynamic(() => import('@/utils/AppProtocolCaller'), { ssr: false });
const TitleBar = dynamic(() => import('@/components/TitleBar'), { ssr: false });

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
        <AppProtocolCaller />
        <div id="titleBar">
          <TitleBar />
        </div>
        <div id="root">
          <div id="routeRoot">{children}</div>
          <div id="modalPortal"></div>
          <div id="tooltipPortal"></div>
        </div>
      </body>
    </html>
  );
}
