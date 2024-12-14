import type { Metadata } from 'next';

import './globals.css';

// project-imports
import ProviderWrapper from './ProviderWrapper';
import ReduxWrapper from '../reduxt/ReduxWrapper';

export const metadata: Metadata = {
  title: 'Klinik Ease',
  description: 'Klinik Ease'
};

export default function RootLayout({ children }: { children: React.ReactElement }) {
  return (
    <html lang="en">
      <body>
        <ReduxWrapper>
          <ProviderWrapper>{children}</ProviderWrapper>
        </ReduxWrapper>
      </body>
    </html>
  );
}
