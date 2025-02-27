// project-imports
import type { Metadata } from "next";

// ==============================|| DASHBOARD LAYOUT ||============================== //

export const metadata: Metadata = {
  title: 'Blog',
  description:
      "Sağlık bilgilendirme makalelerini ve klinik yazılımları üzerine blog yazılarını içerir.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   <>{children}</>
  );
}
