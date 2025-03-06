// project-imports
import ProviderWrapper from 'app/ProviderWrapper';
import SimpleLayout from 'layout/SimpleLayout';
import { Metadata } from 'next';

// ================================|| SIMPLE LAYOUT ||================================ //

export const metadata: Metadata = {
    title: 'Fiyatlar',
    description:
        "Klinik yazılımı için fiyat listemize bu sayfa üzerinden ulaşabilirsiniz.",
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