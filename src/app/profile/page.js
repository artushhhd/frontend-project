import ProfileClient from './profile';

export const metadata = {
  title: 'Իմ Պրոֆիլը | Shop App',
  description: 'Դիտեք և կառավարեք ձեր անձնական տվյալները',
};

export default function ProfilePage() {
  return (
    <main style={{ 
      backgroundColor: '#f4f7f6', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <ProfileClient />
    </main>
  );
}