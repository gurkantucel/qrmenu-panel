// project-imports
import type { Metadata } from "next";

// ==============================|| DASHBOARD LAYOUT ||============================== //

export const metadata: Metadata = {
  title: 'İletişim',
  description:
      "Klinik Ease ile iletişime geçmekte kolay. Bize e-posta adresimizden ulaşabilirsiniz.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   <>{children}</>
  );
}
