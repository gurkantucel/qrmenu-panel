// project-imports
import type { Metadata } from "next";
import ReduxWrapper from "reduxt/ReduxWrapper";
import ProviderWrapper from "app/ProviderWrapper";
import DashboardLayout from 'layout/DashboardLayout';
// ==============================|| DASHBOARD LAYOUT ||============================== //

export const metadata: Metadata = {
  title: {
    default: "QRChefs - QR Menü",
    template: "%s | QRChefs"
  },
  description: "QR Menü için dijital çözüm.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxWrapper>
      <ProviderWrapper>
        <DashboardLayout>{children}</DashboardLayout>
      </ProviderWrapper>
    </ReduxWrapper>
  );
}
