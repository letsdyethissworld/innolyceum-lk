import React, { useState, useEffect } from 'react';
import { applicantAPI } from '../../services/api';
import regionsData from '../../../data/regions.json';
import styles from './Profile.module.css';

interface ParentData {
  first_name: string;
  last_name: string;
  contact_number?: string;
  email?: string;
  relation?: string;
}

interface ProfileFormData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  state: string;
  city: string;
  school: string;
  class_number: number;
  contact_number: string;
  address?: string;
  parents: ParentData[];
}

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    state: '',
    city: '',
    school: '',
    class_number: 6,
    contact_number: '',
    address: '',
    parents: [{ first_name: '', last_name: '', relation: 'parent' }]
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
      if (profile) {
        setFormData({
          first_name: profile.first_name || '',
          middle_name: profile.middle_name || '',
          last_name: profile.last_name || '',
          date_of_birth: profile.date_of_birth || '',
          state: profile.state || '',
          city: profile.city || '',
          school: profile.school || '',
          class_number: profile.class_number || 6,
          contact_number: profile.contact_number || '',
          address: profile.address || '',
          parents: profile.parents || [{ first_name: '', last_name: '', relation: 'parent' }]
        });
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        setError('Ошибка загрузки профиля');
      }
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
      setError(error.response?.data?.detail || 'Ошибка сохранения профиля');
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

  const handleParentChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.map((parent, i) => 
        i === index ? { ...parent, [field]: value } : parent
      )
    }));
  };

  const addParent = () => {
    setFormData(prev => ({
      ...prev,
      parents: [...prev.parents, { first_name: '', last_name: '', relation: 'parent' }]
    }));
  };

  const removeParent = (index: number) => {
    if (formData.parents.length > 1) {
      setFormData(prev => ({
        ...prev,
        parents: prev.parents.filter((_, i) => i !== index)
      }));
    }
  };

  if (isLoading && !formData.first_name) {
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
              name="last_name"
              required
              className={styles.input}
              value={formData.last_name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Имя *</label>
            <input
              type="text"
              name="first_name"
              required
              className={styles.input}
              value={formData.first_name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Отчество</label>
            <input
              type="text"
              name="middle_name"
              className={styles.input}
              value={formData.middle_name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Дата рождения *</label>
            <input
              type="date"
              name="date_of_birth"
              required
              className={styles.input}
              value={formData.date_of_birth}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Регион *</label>
            <select
              name="state"
              required
              className={styles.input}
              value={formData.state}
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
              name="class_number"
              required
              className={styles.input}
              value={formData.class_number}
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
              name="contact_number"
              required
              className={styles.input}
              value={formData.contact_number}
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
        
        <div className={styles.parentsSection}>
          <h3 className={styles.sectionTitle}>Сведения о родителях *</h3>
          {formData.parents.map((parent, index) => (
            <div key={index} className={styles.parentCard}>
              <div className={styles.parentHeader}>
                <h4>Родитель {index + 1}</h4>
                {formData.parents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParent(index)}
                    className={styles.removeButton}
                    disabled={isLoading}
                  >
                    Удалить
                  </button>
                )}
              </div>
              
              <div className={styles.parentGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Имя *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={parent.first_name}
                    onChange={(e) => handleParentChange(index, 'first_name', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Фамилия *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={parent.last_name}
                    onChange={(e) => handleParentChange(index, 'last_name', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Телефон</label>
                  <input
                    type="tel"
                    className={styles.input}
                    value={parent.contact_number || ''}
                    onChange={(e) => handleParentChange(index, 'contact_number', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    className={styles.input}
                    value={parent.email || ''}
                    onChange={(e) => handleParentChange(index, 'email', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label}>Родство</label>
                  <select
                    className={styles.input}
                    value={parent.relation || 'parent'}
                    onChange={(e) => handleParentChange(index, 'relation', e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="parent">Родитель</option>
                    <option value="guardian">Опекун</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addParent}
            className={styles.addButton}
            disabled={isLoading}
          >
            + Добавить родителя
          </button>
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
