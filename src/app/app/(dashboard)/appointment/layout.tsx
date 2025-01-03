// project-imports
import type { Metadata } from "next";

// ==============================|| DASHBOARD LAYOUT ||============================== //

export const metadata: Metadata = {
  title: 'Randevular',
  description:
      "Randevuları listeler.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   <>{children}</>
  );
}
