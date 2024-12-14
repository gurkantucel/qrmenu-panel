'use client';

import { ReactElement } from 'react';

// project-imports
import ThemeCustomization from 'themes';
import { ConfigProvider } from 'contexts/ConfigContext';
import RTLLayout from 'components/RTLLayout';
import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';

import Notistack from 'components/third-party/Notistack';
import Snackbar from 'components/@extended/Snackbar';

// ==============================|| PROVIDER WRAPPER  ||============================== //

export default function ProviderWrapper({ children }: { children: ReactElement }) {
  return (
    <ConfigProvider>
      <ThemeCustomization>
        <RTLLayout>
          <Locales>
            <ScrollTop>
              <Notistack>
                <Snackbar />
                {children}
              </Notistack>
            </ScrollTop>
          </Locales>
        </RTLLayout>
      </ThemeCustomization>
    </ConfigProvider>
  );
}
