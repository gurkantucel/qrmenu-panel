// project-imports
import type { Metadata } from "next";
import AuthGuard from 'utils/route-guard/AuthGuard';
import ReduxWrapper from "reduxt/ReduxWrapper";
import ProviderWrapper from "app/ProviderWrapper";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ==============================|| DASHBOARD LAYOUT ||============================== //

export const metadata: Metadata = {
  title: {
    default: "Klinik Ease - Dijital Klinik Çözümleri",
    template: "%s | Klinik Ease"
  },
  description: "Klinik işleriniz için dijital çözüm.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {

  const token = cookies().get("token")?.value;

  // Eğer token yoksa login'e yönlendir
  if (!token) {
    redirect("/auth/login");
  }

  return (
    <ReduxWrapper>
      <ProviderWrapper>
        <>{children}</>
      </ProviderWrapper>
    </ReduxWrapper>
  );
}
