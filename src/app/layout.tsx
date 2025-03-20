import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google'

import './globals.css';

export const metadata: Metadata = {
  title: 'Klinik Ease',
  description: 'Klinik Ease',
};

export default function RootLayout({ children }: { children: React.ReactElement }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
      <GoogleAnalytics gaId="G-NKB6VMEPME" />
    </html>
  );
}
