'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const res = await api.post('/register', formData); 
      alert(res.data.message || 'Registration successful! ✅');
      router.push('/login');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        alert('Something went wrong! ❌');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={formData.password_confirmation}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading} style={{ marginTop: '10px' }}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        
        <br />
        
        <Link href="/login" style={{ display: 'inline-block', marginTop: '15px' }}>
          Login
        </Link>
        
      </form>
    </div>
  );
}