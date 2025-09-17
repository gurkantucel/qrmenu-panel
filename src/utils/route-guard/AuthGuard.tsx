// types
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }: any) {

  const token = cookies().get('token')?.value

  console.log(token);
  
  if (!token) {
    redirect('/auth/login')
  }

  return <>{children}</>;
}
