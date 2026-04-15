'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import styles from './Shop.module.css';

export default function ShopClient({ initialProducts }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserId(user.id);
      } catch (e) {
        console.error("User parsing error", e);
      }
    }
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('delate products:')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));

    } catch (err) {
      alert('error delate');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Shop</h1>
          <button className={styles.addBtn} onClick={() => router.push('/addProducts')}>
            + New product
          </button>
        </header>

        <div className={styles.grid}>
          {products.map((product) => {
            const isOwner = Number(currentUserId) === Number(product.user_id);

            return (
              <div key={product.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img 
                    src={product.image?.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${product.image}`} 
                    alt={product.name} 
                    className={styles.image}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
                  />
                </div>
                
                <div className={styles.content}>
                  <h3>{product.name}</h3>
                  <p className={styles.seller}>👤 {product.user?.name || 'Անհայտ'}</p>
                  <p className={styles.price}>${Number(product.price).toLocaleString()}</p>
                  <p>{product.description}</p>
                  
                  <button className={styles.buyBtn}>buy</button>
                  
                  {isOwner && (
                    <button className={styles.deleteBtn} onClick={() => handleDelete(product.id)}>
                      delate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}