'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api'; 
import s from './AddProducts.module.css'; 

export default function AddProducts() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    if (!image || !form.name || !form.price) return alert('Please fill all required fields');

    setLoading(true);
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    data.append('image', image);

    try {
      await api.post('/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Product created successfully! ✅');
      router.push('/shop');
    } catch (err) {
      console.error('Upload failed:', err.response?.data);
      alert(err.response?.data?.message || 'Error creating product ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={s.container} onSubmit={handleCreate}>
      <h2 className={s.title}>Create New Product</h2>

      <input
        name="name"
        className={s.field}
        placeholder="Product Name"
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        className={s.field}
        placeholder="Description"
        onChange={handleChange}
        required
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          name="price"
          type="number"
          className={s.field}
          placeholder="Price"
          style={{ flex: 1 }}
          onChange={handleChange}
          required
        />
        <input
          name="stock"
          type="number"
          className={s.field}
          placeholder="Stock"
          style={{ flex: 1 }}
          onChange={handleChange}
          required
        />
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className={s.fileInput}
        required
      />

      <button className={s.submitBtn} disabled={loading}>
        {loading ? 'Publishing...' : 'Create Product'}
      </button>

      <button type="button" onClick={() => router.back()} className={s.backLink}>
        ← Back
      </button>
    </form>
  );
}