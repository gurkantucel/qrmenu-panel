// project-imports
import SimpleLayout from 'layout/SimpleLayout';
import { Metadata } from 'next';

// ================================|| SIMPLE LAYOUT ||================================ //

export const metadata: Metadata = {
  title: {
      default: "Klinik Ease - Dijital Klinik Çözümleri",
      template: "%s | Klinik Ease"
    },
  description: "Klinik işleriniz için dijital çözüm.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SimpleLayout>{children}</SimpleLayout>;
}
