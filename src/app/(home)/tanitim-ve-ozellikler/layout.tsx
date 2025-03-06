// project-imports
import ProviderWrapper from 'app/ProviderWrapper';
import SimpleLayout from 'layout/SimpleLayout';
import { Metadata } from 'next';

// ================================|| SIMPLE LAYOUT ||================================ //

export const metadata: Metadata = {
    title: 'Tanıtım ve Özellikler',
    description:
        "Klinik yazılımı olan Klinik Ease için tanıtım ve özelliklerini içerir.",
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