// project-imports
import type { Metadata } from "next";
import AuthGuard from 'utils/route-guard/AuthGuard';
import ReduxWrapper from "reduxt/ReduxWrapper";
import ProviderWrapper from "app/ProviderWrapper";

// ==============================|| DASHBOARD LAYOUT ||============================== //

export const metadata: Metadata = {
  title: {
    default: "Klinik Ease - Dijital Klinik Çözümleri",
    template: "%s | Klinik Ease"
  },
  description: "Klinik işleriniz için dijital çözüm.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxWrapper>
      <ProviderWrapper>
        <AuthGuard>
          {children}
        </AuthGuard>
      </ProviderWrapper>
    </ReduxWrapper>
  );
}
