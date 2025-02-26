// project-imports
import type { Metadata } from "next";

// ==============================|| DASHBOARD LAYOUT ||============================== //

export const metadata: Metadata = {
  title: 'Fiyatlar',
  description:
      "Klinik yazılımı için fiyat listemize bu sayfa üzerinden ulaşabilirsiniz.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   <>{children}</>
  );
}
