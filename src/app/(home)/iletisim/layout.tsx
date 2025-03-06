// project-imports
import ProviderWrapper from 'app/ProviderWrapper';
import SimpleLayout from 'layout/SimpleLayout';
import { Metadata } from 'next';

// ================================|| SIMPLE LAYOUT ||================================ //

export const metadata: Metadata = {
    title: 'İletişim',
    description:
        "Klinik Ease ile iletişime geçmekte kolay. Bize e-posta adresimizden ulaşabilirsiniz.",
  };

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProviderWrapper>
            <SimpleLayout>
                {children}
            </SimpleLayout>
        </ProviderWrapper>
    );
}