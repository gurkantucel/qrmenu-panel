// project-imports
import type { Metadata } from "next";

// ==============================|| ORDER LAYOUT ||============================== //

export const metadata: Metadata = {
  title: 'Siparişler',
  description: "Siparişleri listeler.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
   <>{children}</>
  );
}
