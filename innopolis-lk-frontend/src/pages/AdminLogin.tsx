import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import styles from './Login.module.css';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Если уже есть admin token, перенаправляем в админку
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await adminAPI.login(formData.email, formData.password);
      // Явное перенаправление на /admin
      navigate('/admin', { replace: true });
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Вход в админ панель</h2>
          <p className={styles.subtitle}>Лицей Иннополис</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти в админку'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
