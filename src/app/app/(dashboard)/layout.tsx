// project-imports
import type { Metadata } from "next";
import DashboardLayout from 'layout/DashboardLayout';

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
    <DashboardLayout>{children}</DashboardLayout>
  );
}
