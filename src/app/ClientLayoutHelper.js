'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/utils/api';

export default function ClientLayoutHelper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [auth, setAuth] = useState({ mounted: false, loggedIn: false, role: null });
  const isPublic = ['/', '/login'].includes(pathname);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAuth({ mounted: true, loggedIn: false, role: null });
      if (!isPublic) router.push('/login');
      return;
    }

    api.get('/profile')
      .then(res => {
        setAuth({ mounted: true, loggedIn: true, role: Number(res.data.role) });
        if (isPublic) router.push('/shop');
      })
      .catch(() => {
        localStorage.removeItem('token');
        setAuth({ mounted: true, loggedIn: false, role: null });
        router.push('/login');
      });
  }, [pathname, router, isPublic]);

  if (!auth.mounted) return null;

  return (
    <div className="layout">
      {auth.loggedIn && !isPublic && (
        <header className="header">
          <div className="logo" onClick={() => router.push('/shop')}>My Shop</div>
          <nav className="nav">
            <button onClick={() => router.push('/shop')}>Shop</button>
            <button onClick={() => router.push('/profile')}>Account</button>
            <button onClick={() => router.push('/addProducts')}>New Product</button>
            
            {auth.role >= 1 && (
              <button className="admin-btn" onClick={() => router.push('/admin')}>Settings</button>
            )}
          </nav>
        </header>
      )}

      <main className={isPublic ? '' : 'main-content'}>
        {children}
      </main>
      
      <style jsx global>{`
        body { margin: 0; font-family: 'Inter', sans-serif; background: #fff; color: #333; }
        .layout { min-height: 100vh; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 0 5%; height: 70px; background: #191919; position: sticky; top: 0; z-index: 1000; }
        .logo { font-size: 24px; font-weight: bold; color: #fff; cursor: pointer; }
        .nav { display: flex; gap: 15px; }
        button { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 600; background: #4caf50; color: white; transition: 0.2s; }
        button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .admin-btn { background: #2196f3; }
        .main-content { padding: 40px 5%; max-width: 1600px; margin: 0 auto; width: 100%; box-sizing: border-box; }
      `}</style>
    </div>
  );
}