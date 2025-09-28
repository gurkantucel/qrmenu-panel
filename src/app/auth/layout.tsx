// project-imports
import ProviderWrapper from 'app/ProviderWrapper';
import GoogleCaptchaWrapper from 'components/GoogleCaptchaWrapper';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ReduxWrapper from 'reduxt/ReduxWrapper';

// ==============================|| AUTH LAYOUT ||============================== //

export default function Layout({ children }: { children: React.ReactNode }) {

  const token = cookies().get("token")?.value;

  // Eğer zaten token varsa home'a yönlendir
  if (token) {
    redirect("/home");
  }

  return (
    <ReduxWrapper>
      <ProviderWrapper>
        <GoogleCaptchaWrapper>
          {children}
        </GoogleCaptchaWrapper>
      </ProviderWrapper>
    </ReduxWrapper>
  )
}
