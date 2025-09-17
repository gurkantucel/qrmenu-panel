'use client';

import { useEffect, useState } from 'react';

// next
import { useRouter } from 'next/navigation';

// project-imports
import Loader from 'components/Loader';

// types
import { GuardProps } from 'types/auth';
import { getCookie } from 'cookies-next';

// ==============================|| AUTH GUARD ||============================== //
enum AUTHGUARD { AUTH, UNAUTH }

export default function AuthGuard({ children }: GuardProps) {

  const router = useRouter();
  const [token, setToken] = useState<AUTHGUARD | undefined>(undefined);

  useEffect(() => {
    const value = getCookie("token");
    setTimeout(() => {
      if (value == undefined) {
        setToken(AUTHGUARD.UNAUTH);
        router.push('/auth/login')
      } else {
        setToken(AUTHGUARD.AUTH);
      }
    }, 2000);
    // eslint-disable-next-line
  }, []);

  if (token == undefined) return <Loader />;

  return <>{children}</>;
}
