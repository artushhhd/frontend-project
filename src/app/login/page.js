import Login from './login';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'login in | My Store',
  description: 'login and buy products',
};

export default async function LoginPage() {
  const cookieStore = await cookies();

  return (
    <main style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <Login />
    </main>
  );
}