import { cookies } from 'next/headers';
import AdminPanel from './Admin';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const token = cookieStore.get('token')?.value;

  const API_BASE = 'http://127.0.0.1:8000/api';

  if (!token) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Ошибка: Токен не найден!</h1>
        <p>В твоих куках есть только: {allCookies.map(c => c.name).join(', ')}</p>
        <p>Если твоего токена тут нет, значит кука называется по-другому или не сохранилась.</p>
      </div>
    );
  }

  try {
    const res = await fetch(`${API_BASE}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return (
        <div style={{ padding: '20px' }}>
          <h1>Бэкенд вернул ошибку {res.status}</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <p>Если тут написано "Unauthenticated", значит Laravel не принял твой токен.</p>
        </div>
      );
    }

    const role = Number(data.role);

    if (![1, 2, 3].includes(role)) {
      return (
        <div style={{ padding: '20px', color: 'orange' }}>
          <h1>Доступ запрещен по роли!</h1>
          <p>Твоя роль: <b>{role}</b> (Тип: {typeof data.role})</p>
          <p>А нам нужны: 1, 2 или 3. Иди в базу данных (таблица users) и исправь!</p>
          <pre>Данные юзера: {JSON.stringify(data, null, 2)}</pre>
        </div>
      );
    }

    const dataRes = await fetch(`${API_BASE}/admin/data`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        cache: 'no-store',
    });
    const adminData = await dataRes.json();

    return <AdminPanel initialUsers={adminData.users} initialProducts={adminData.products} currentUser={data} />;

  } catch (err) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Ошибка соединения!</h1>
        <p>{err.message}</p>
        <p>Убедись, что Laravel запущен на <b>{API_BASE}</b></p>
      </div>
    );
  }
}