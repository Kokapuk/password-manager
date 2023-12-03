import '@/styles/globals.scss';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Manager',
  description: 'Free and simple password storage 💙',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="titleBarPortal"></div>
        <div id="root">
          <div id="routeRoot">{children}</div>
          <div id="modalPortal"></div>
          <div id="tooltipPortal"></div>
        </div>
      </body>
    </html>
  );
}
