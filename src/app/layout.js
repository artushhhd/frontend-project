import { AuthProvider } from '@/app/context/AuthContext'; 
import ClientLayoutHelper from './ClientLayoutHelper';
import './globals.css';

export const metadata = {
  title: 'My Shop',
  description: 'Next.js + Laravel integration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ fontFamily: 'sans-serif', margin: 0 }}>
        <AuthProvider>
          <ClientLayoutHelper>
            {children}
          </ClientLayoutHelper>
        </AuthProvider>
      </body>
    </html>
  );
}