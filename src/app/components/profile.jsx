'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    api.get('/profile')
      .then(res => setUser(res.data))
      .catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.warn('Server logout failed, clearing local data anyway.');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; 
    }
  };

  if (!user) return <p style={{ color: '#333', padding: '20px' }}>Loading...</p>;

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <h1 style={{ color: '#222' }}>My Profile</h1>
      
      <img
        style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '15px', border: '3px solid #eee' }}
        src="https://cdn-icons-png.freepik.com/512/6522/6522516.png"
        alt="User Avatar"
      />
      
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#555', fontSize: '18px', margin: '5px 0' }}><b>Name:</b> {user.name}</p>
        <p style={{ color: '#555', fontSize: '16px', margin: '5px 0' }}><b>Email:</b> {user.email}</p>
      </div>

      <button 
        onClick={handleLogout}
        style={{ 
          padding: '10px 25px', 
          cursor: 'pointer', 
          backgroundColor: '#ff4d4d', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          fontWeight: '600',
          transition: '0.3s'
        }}
        onMouseOver={(e) => e.target.style.opacity = '0.8'}
        onMouseOut={(e) => e.target.style.opacity = '1'}
      >
        Logout
      </button>
    </div>
  );
}