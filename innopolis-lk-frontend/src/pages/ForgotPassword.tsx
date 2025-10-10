import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import styles from './Login.module.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await authAPI.requestPasswordReset(email);
      setMessage('Если аккаунт с таким email существует, ссылка для сброса пароля будет отправлена');
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Ошибка отправки запроса');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Восстановление пароля</h2>
          <p className={styles.subtitle}>Введите ваш email</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        {message && (
          <div className={styles.successMessage}>
            {message}
          </div>
        )}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? 'Отправка...' : 'Отправить ссылку'}
          </button>
          
          <div className={styles.linkContainer}>
            <Link to="/login" className={styles.link}>
              Вернуться к входу
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;