'use client';

import { useState } from 'react';
import api from '@/utils/api'; // Твой axios конфиг
import styles from './Admin.module.css';

export default function AdminPanel({ initialUsers, initialProducts, currentUser }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [products, setProducts] = useState(initialProducts || []);

  const isSuperAdmin = Number(currentUser?.role) === 2;
  const isModerator = Number(currentUser?.role) === 3;

  const handleRoleChange = async (userId, role) => {
    const labels = { 1: 'ADMIN', 2: 'SUPER ADMIN', 3: 'MODERATOR' };
    if (!window.confirm(`Назначить роль ${labels[role]}?`)) return;

    try {
      const endpoints = { 1: 'make-admin', 2: 'make-super-admin', 3: 'make-moderator' };
      await api.post(`/admin/users/${userId}/${endpoints[role]}`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка обновления');
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser.id) return alert('Нельзя удалить себя');
    if (!window.confirm(`Удалить пользователя ${user.name}?`)) return;

    try {
      await api.delete(`/admin/users/${user.id}`);
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Панель управления {isSuperAdmin && '★'}</h1>
      <p>Админ: <b>{currentUser?.name}</b> (Роль: {currentUser?.role})</p>

      {/* Список пользователей (скрыт для модераторов, если нужно) */}
      {!isModerator && (
        <section className={styles.section}>
          <h2>Пользователи</h2>
          {users.map(user => (
            <div key={user.id} className={styles.userCard}>
              <span>{user.name} ({user.email}) - Роль: {user.role}</span>
              <div className={styles.actions}>
                <button onClick={() => handleRoleChange(user.id, 1)}>Admin</button>
                <button onClick={() => handleRoleChange(user.id, 3)}>Mod</button>
                {isSuperAdmin && <button onClick={() => handleRoleChange(user.id, 2)}>Super</button>}
                <button onClick={() => handleDeleteUser(user)}>Удалить</button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}