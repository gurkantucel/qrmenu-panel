// project-imports
import GoogleCaptchaWrapper from 'components/GoogleCaptchaWrapper';
import GuestGuard from 'utils/route-guard/GuestGuard';

// ==============================|| AUTH LAYOUT ||============================== //

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GuestGuard>
    <GoogleCaptchaWrapper>
      {children}
    </GoogleCaptchaWrapper>
  </GuestGuard>;
}
