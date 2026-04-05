'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import styles from './Admin.module.css';

export default function AdminPanel() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data: profile } = await api.get('/profile');
        const role = Number(profile.role);

        // Теперь пускаем Админа (1), Супера (2) и Модератора (3)
        if (role !== 1 && role !== 2 && role !== 3) {
          return router.replace('/shop');
        }

        setCurrentUser(profile);

        const { data: adminData } = await api.get('/admin/data');
        setUsers(adminData?.users || []);
        setProducts(adminData?.products || []);
      } catch (err) {
        console.error('Access denied:', err);
        router.replace('/shop');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  const handleRoleChange = async (userId, role) => {
    // Названия для подтверждения
    const labels = { 1: 'ADMIN', 2: 'SUPER ADMIN', 3: 'MODERATOR' };
    if (!window.confirm(`Назначить роль ${labels[role]}?`)) return;

    try {
      // Динамический эндпоинт
      const endpoints = { 1: 'make-admin', 2: 'make-super-admin', 3: 'make-moderator' };
      await api.post(`/admin/users/${userId}/${endpoints[role]}`);

      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка обновления роли');
    }
  };

  const handleDeleteUser = async (user) => {
    if (user.id === currentUser.id) return alert('Нельзя удалить себя.');

    // Модератор (3) вообще не может удалять юзеров (защита на фронте)
    if (currentUser.role === 3) return alert('У модератора нет прав на это.');

    if (!window.confirm(`Удалить ${user.name}?`)) return;

    try {
      await api.delete(`/admin/users/${user.id}`);
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Удалить пост "${name}"?`)) return;

    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Ошибка при удалении товара');
    }
  };

  if (loading) return <div className={styles.container}>Загрузка...</div>;

  const isSuperAdmin = currentUser?.role === 2;
  const isModerator = currentUser?.role === 3;

  const canSeeUsers = !isModerator;

  const groupedUsers = {
    regular: users.filter(u => Number(u.role) === 0),
    team: users.filter(u => Number(u.role) > 0)
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.heading}>
          settings
          {isSuperAdmin && <span className={styles.superBadge}> ★</span>}
        </h1>
        <p>Welcome: <b>{currentUser?.name}</b> (role: {
          isSuperAdmin ? 'Super Admin' : (isModerator ? 'Moderator' : 'Admin')
        })</p>
      </header>

      {canSeeUsers && (
        <>
          <section className={styles.section}>
            <h2 className={styles.subHeading}>Users ({groupedUsers.regular.length})</h2>
            {groupedUsers.regular.map(user => (
              <div key={user.id} className={styles.userCard}>
                <div className={styles.userRow}>
                  <div className={styles.userInfo}>
                    <b>{user.name}</b>
                    <span className={styles.email}>{user.email}</span>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.btnAdmin} onClick={() => handleRoleChange(user.id, 1)}>Admin</button>
                    <button className={styles.btnMod} onClick={() => handleRoleChange(user.id, 3)}>Mod</button>
                    {isSuperAdmin && (
                      <button className={styles.btnSuper} onClick={() => handleRoleChange(user.id, 2)}>Super</button>
                    )}
                    <button className={styles.btnDelete} onClick={() => handleDeleteUser(user)}>Удалить</button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2 className={styles.subHeading}>Staff Management</h2>
            {groupedUsers.team.map(member => (
              <div key={member.id} className={`${styles.userCard} ${member.role === 2 ? styles.goldBorder : ''}`}>
                <div className={styles.userRow}>
                  <div className={styles.userInfo}>
                    <b>{member.name}</b>
                    <span>{member.role === 2 ? ' [SUPER]' : (member.role === 3 ? ' [MOD]' : ' [ADMIN]')}</span>
                  </div>
                  <div className={styles.actions}>
                    {isSuperAdmin && member.id !== currentUser.id && (
                      <>
                      <button className={styles.btnMod} onClick={() => handleRoleChange(member.id, 3)}>Lower to Moderator</button>
                      <button className={styles.btnDelete} onClick={() => handleDeleteUser(member)}>Удалить</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      <section className={styles.section}>
        <h2 className={styles.subHeading}>shop ({products.length})</h2>
        {products.map(product => (
          <div key={product.id} className={styles.userCard}>
            <div className={styles.userRow}>
              <div className={styles.userInfo}>
                <img style={{ width: '60px', height: '60px', objectFit: 'cover' }} src={product.image} alt="" />
                <p></p>
                <b>{product.name}</b>
                <p></p>
                <span style={{ font: '14px Arial', color: 'grey' }}>{product.description}</span>
                <p></p>
                <small style={{ color: 'black' }}>price: ${product.price} | stock: {product.stock}</small>
              </div>
              <div className={styles.actions}>
                <button className={styles.btnDelete} onClick={() => handleDeleteProduct(product.id, product.name)}>
                  delate Products
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}