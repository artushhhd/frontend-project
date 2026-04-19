'use client';

import { useState } from 'react';
import api from '@/utils/api'; 
import styles from './Admin.module.css';

export default function AdminPanel({ initialUsers = [], initialProducts = [], currentUser }) {
  const [users, setUsers] = useState(initialUsers);
  const [products, setProducts] = useState(initialProducts);

  const userRole = currentUser?.role;
  const isSuperAdmin = userRole === 'superadmin';
  const isAdmin = userRole === 'admin';

  const changeRole = async (userId, newRole) => {
    const roleLabels = {
      admin: 'Администратор',
      superadmin: 'Супер-администратор',
      moderator: 'Модератор'
    };

    if (!window.confirm(`Изменить роль пользователя на "${roleLabels[newRole]}"?`)) return;

    const endpoints = {
      admin: 'make-admin',
      superadmin: 'make-super-admin',
      moderator: 'make-moderator'
    };

    try {
      await api.post(`/admin/users/${userId}/${endpoints[newRole]}`);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка при обновлении роли');
    }
  };

  const removeUser = async (user) => {
    if (user.id === currentUser?.id) {
      return alert('Нельзя удалить собственный аккаунт');
    }
    if (user.role === 'superadmin' && !isSuperAdmin) {
      return alert('Недостаточно прав для удаления супер-администратора');
    }

    if (!window.confirm(`Вы уверены, что хотите удалить пользователя ${user.name}?`)) return;

    try {
      await api.delete(`/admin/users/${user.id}`);
      setUsers(users.filter(u => u.id !== user.id));
    } catch (err) {
      alert('Ошибка при удалении пользователя');
    }
  };

  const removeProduct = async (id, name) => {
    if (!window.confirm(`Удалить товар "${name}"?`)) return;
    
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка при удалении товара');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Панель управления {isSuperAdmin && '👑'}</h1>
        <p>Авторизован: <b>{currentUser?.name}</b> <small>({userRole})</small></p>
      </header>

      <hr className={styles.divider} />

      {(isSuperAdmin || isAdmin) && (
        <section className={styles.section}>
          <h2>Управление пользователями ({users.length})</h2>
          <div className={styles.grid}>
            {users.map(user => {
              const isMe = user.id === currentUser?.id;
              
              const canModify = !isMe && (isSuperAdmin || user.role !== 'superadmin');

              return (
                <div key={user.id} className={styles.userCard}>
                  <div className={styles.info}>
                    <strong>{user.name} {isMe && '(Вы)'}</strong>
                    <p>{user.email}</p>
                    <span>Роль: <b>{user.role}</b></span>
                  </div>
                  
                  <div className={styles.actions}>
                    {canModify && (
                      <>
                        <button onClick={() => changeRole(user.id, 'admin')}>Admin</button>
                        <button onClick={() => changeRole(user.id, 'moderator')}>Mod</button>
                        {isSuperAdmin && (
                          <button onClick={() => changeRole(user.id, 'superadmin')}>Super</button>
                        )}
                        <button 
                          className={styles.btnDelete} 
                          onClick={() => removeUser(user)}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      
      <section className={styles.section}>
        <h2>Список товаров ({products.length})</h2>
        <div className={styles.productGrid}>
          {products.map(product => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productInfo}>
                <strong>{product.name}</strong>
                <span>{product.price} ₽</span>
              </div>
              <div className={styles.actions}>
                <button 
                  className={styles.btnDelete} 
                  onClick={() => removeProduct(product.id, product.name)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}