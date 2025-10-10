import React, { useState, useEffect } from 'react';
import { ApplicantFormData } from '../../types';
import { applicantAPI } from '../../services/api';
import regionsData from 'C:/Developer/2025/InnoHackathon/innopolis-lk-frontend/data/regions.json'
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<ApplicantFormData>({
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    region: '',
    city: '',
    school: '',
    class: '',
    phone: '',
    email: '',
    address: '',
    parentsInfo: ''
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const profile = await applicantAPI.getProfile();
      setFormData(profile);
    } catch (error: any) {
      setError('Ошибка загрузки профиля');
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await applicantAPI.updateProfile(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error: any) {
      setError('Ошибка сохранения профиля');
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading && !formData.email) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Профиль поступающего</h1>
        {isSaved && (
          <div className={styles.successMessage}>
            Данные успешно сохранены!
          </div>
        )}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Фамилия *</label>
            <input
              type="text"
              name="lastName"
              required
              className={styles.input}
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Имя *</label>
            <input
              type="text"
              name="firstName"
              required
              className={styles.input}
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Отчество</label>
            <input
              type="text"
              name="middleName"
              className={styles.input}
              value={formData.middleName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Дата рождения *</label>
            <input
              type="date"
              name="birthDate"
              required
              className={styles.input}
              value={formData.birthDate}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Регион *</label>
            <select
              name="region"
              required
              className={styles.input}
              value={formData.region}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Выберите регион</option>
              {regionsData.regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Город/район *</label>
            <input
              type="text"
              name="city"
              required
              className={styles.input}
              value={formData.city}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Школа *</label>
            <input
              type="text"
              name="school"
              required
              className={styles.input}
              value={formData.school}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Класс *</label>
            <select
              name="class"
              required
              className={styles.input}
              value={formData.class}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="">Выберите класс</option>
              {[6,7,8,9,10].map(grade => (
                <option key={grade} value={grade}>{grade} класс</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Телефон *</label>
            <input
              type="tel"
              name="phone"
              required
              className={styles.input}
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              required
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Адрес регистрации</label>
          <textarea
            name="address"
            rows={3}
            className={styles.textarea}
            value={formData.address}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Сведения о родителях</label>
          <textarea
            name="parentsInfo"
            rows={3}
            className={styles.textarea}
            value={formData.parentsInfo}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div className={styles.actions}>
          <button 
            type="submit" 
            className={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить данные'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;