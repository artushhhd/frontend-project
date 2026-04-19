import { cookies } from 'next/headers';
import AdminPanel from './Admin';

async function getAdminData(token, API_BASE) {
  try {
    const res = await fetch(`${API_BASE}/admin/data`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const API_BASE = 'http://127.0.0.1:8000/api';

  if (!token) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Доступ ограничен</h1>
        <p>Пожалуйста, войдите в систему для доступа к панели.</p>
      </div>
    );
  }

  try {
    const userRes = await fetch(`${API_BASE}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!userRes.ok) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1>Ошибка авторизации</h1>
          <p>Ваша сессия истекла. Попробуйте перезайти.</p>
        </div>
      );
    }

    const userData = await userRes.json();
    const allowedRoles = ['admin', 'superadmin', 'moderator'];
    if (!allowedRoles.includes(userData.role)) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1>Недостаточно прав</h1>
          <p>Доступ к этой секции разрешен только для администрации.</p>
        </div>
      );
    }

    const adminData = await getAdminData(token, API_BASE);

    if (!adminData) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1>Ошибка загрузки данных</h1>
          <p>Не удалось получить список пользователей и товаров с сервера.</p>
        </div>
      );
    }

    return (
      <AdminPanel 
        initialUsers={adminData.users || []} 
        initialProducts={adminData.products || []} 
        currentUser={userData} 
      />
    );

  } catch (err) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ff4d4f' }}>
        <h1>Ошибка подключения</h1>
        <p>Не удалось установить связь с сервером (API). Убедитесь, что бэкенд запущен.</p>
      </div>
    );
  }
}