'use client';

import { useEffect, useState } from 'react';

// next
import { useRouter } from 'next/navigation';

// project-imports
import Loader from 'components/Loader';

// types
import { GuardProps } from 'types/auth';
import { getCookie } from 'cookies-next';

// ==============================|| GUEST GUARD ||============================== //

enum AUTHGUARD { AUTH, UNAUTH }

export default function GuestGuard({ children }: GuardProps) {
  const router = useRouter();
  const [token, setToken] = useState<AUTHGUARD | undefined>(undefined);

  useEffect(() => {
    const value = getCookie("token");
    setTimeout(() => {
      if (value != undefined) {
        setToken(AUTHGUARD.AUTH);
        router.push('/app/home')
      }else{
        setToken(AUTHGUARD.UNAUTH)
      }
    }, 2000);
    // eslint-disable-next-line
  }, []);

  if (token == undefined) return <Loader />;

  return <>{children}</>;
}
