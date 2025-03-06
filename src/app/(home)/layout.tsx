// project-imports
import { Metadata } from 'next';

// ================================|| SIMPLE LAYOUT ||================================ //

export const metadata: Metadata = {
  title: {
      default: "Klinik Ease - Dijital Klinik Çözümleri",
      template: "%s | Klinik Ease"
    },
  description: "Klinik işlerinizi kolaylaştırmak için dijital çözüm.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
