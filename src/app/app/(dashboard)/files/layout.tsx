// project-imports
import type { Metadata } from "next";

// ==============================|| DASHBOARD LAYOUT ||============================== //

export const metadata: Metadata = {
  title: 'Dosyalar',
  description: "Dosyaları listeler.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   <>{children}</>
  );
}
