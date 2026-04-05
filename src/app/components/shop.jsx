'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/utils/api'; // 1. Օգտագործում ենք մեր api-ն

export default function Shop() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Վերցնում ենք user-ին localStorage-ից ստուգելու համար՝ սա իր ապրանքն է թե ոչ
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserId(user.id);
      } catch (e) {
        console.error("User parsing error:", e);
      }
    }

    // 2. Օգտագործում ենք api.get առանց լրիվ հասցեի
    api.get('/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      // 3. Ոչ մի ձեռքով գրված Header կամ Token, api.js-ը դա անում է քո փոխարեն
      await api.delete(`/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert('Deleted! ✅');
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product ❌');
    }
  };

  // 4. Նկարի URL-ի օգնական ֆունկցիա (որպեսզի localhost-ը ձեռքով չգրենք)
  const getProductImage = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL.replace('/api', '');
    return `${backendUrl}/storage/${imagePath}`;
  };

  const styles = {
    page: { padding: '40px 20px', background: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif' },
    container: { maxWidth: '1200px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
    h2: { fontSize: '2rem', fontWeight: 'bold', color: '#1a1a1a', margin: 0 },
    addBtn: { padding: '12px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', marginBottom: '40px' },
    card: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
    imageWrapper: { width: '100%', height: '220px', background: '#eee', overflow: 'hidden' },
    image: { width: '100%', height: '100%', objectFit: 'cover' },
    content: { padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 },
    title: { fontSize: '18px', fontWeight: '700', margin: '0 0 5px 0', color: '#333' },
    seller: { fontSize: '13px', color: '#0070f3', marginBottom: '10px', fontWeight: '600' },
    price: { fontSize: '20px', fontWeight: '800', color: 'green', marginBottom: '12px' },
    desc: { fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '20px', flexGrow: 1 },
    buyBtn: { width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
    deleteBtn: { width: '100%', marginTop: '10px', padding: '10px', background: 'white', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.h2}>Store</h2>
          <button onClick={() => router.push('/addProducts')} style={styles.addBtn}>+ New Product</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.grid}>
            {products.map(product => (
              <div key={product.id} style={styles.card}>
                <div style={styles.imageWrapper}>
                  <img
                    style={styles.image}
                    src={getProductImage(product.image)}
                    alt={product.name}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                  />
                </div>
                <div style={styles.content}>
                  <h3 style={styles.title}>{product.name}</h3>
                  <div style={styles.seller}>👤 Seller: {product.user?.name || 'Unknown'}</div>
                  <p style={styles.price}>${parseFloat(product.price || 0).toLocaleString()}</p>
                  <p style={styles.desc}>{product.description}</p>
                  <button style={styles.buyBtn} onClick={() => alert('Added to cart!')}>Buy Now</button>

                  {currentUserId && Number(product.user_id) === Number(currentUserId) && (
                    <button style={styles.deleteBtn} onClick={() => handleDelete(product.id)}>
                      🗑 Delete My Product
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}