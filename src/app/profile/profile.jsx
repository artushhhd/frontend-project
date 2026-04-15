'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import styles from './Profile.module.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    api.get('/profile')
      .then(res => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    if (!confirm('Վստա՞հ եք, որ ուզում եք դուրս գալ։')) return;

    try {
      await api.post('/logout');
    } catch (err) {
      console.warn('Server logout failed, clearing local data.');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      window.location.href = '/login';
    }
  };

  if (!user) return <div className={styles.loader}>loading ...</div>;

  return (
    <div className={styles.container}>
      <h1>profile</h1>
      
      <img
        className={styles.avatar}
        src="https://cdn-icons-png.freepik.com/512/6522/6522516.png"
        alt="User Avatar"
      />
      
      <div className={styles.info}>
        <p><strong>name:</strong> {user.name}</p>
        <p><strong>email:</strong> {user.email}</p>
      </div>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        logout 
      </button>
    </div>
  );
}