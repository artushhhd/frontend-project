'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import styles from './Shop.module.css';

export default function ShopClient({ initialProducts }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts || []);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // 1. Состояние для текста поиска
  const [searchTerm, setSearchTerm] = useState('');

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

  // 2. Логика фильтрации (по названию товара или имени продавца)
  const filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const sellerMatch = product.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || sellerMatch;
  });

  const handleDelete = async (id) => {
    if (!confirm('Удалить товар?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Ошибка при удалении');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Shop</h1>
          
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search products or sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              style={{
                padding: '10px 15px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                width: '300px',
                marginRight: '15px'
              }}
            />
            
            <button className={styles.addBtn} onClick={() => router.push('/addProducts')}>
              + New product
            </button>
          </div>
        </header>

        <div className={styles.grid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
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
                    
                    <button className={styles.buyBtn}>buy </button>
                    
                    {isOwner && (
                      <button className={styles.deleteBtn} onClick={() => handleDelete(product.id)}>
                        delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noResults}>
              <p>No products found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}