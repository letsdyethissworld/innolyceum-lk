import React, { useState, useEffect } from 'react';
import { FormData } from '../../types';
import styles from './Profile.module.css';

const regions = [
  'Республика Татарстан',
  'Москва',
  'Санкт-Петербург',
  'Новосибирская область',
  'Свердловская область',
  // ... другие регионы
];

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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

  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const savedData = localStorage.getItem('applicantProfile');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    localStorage.setItem('applicantProfile', JSON.stringify(formData));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Профиль поступающего</h1>
        {isSaved && (
          <div className={styles.successMessage}>
            Данные успешно сохранены!
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
            >
              <option value="">Выберите регион</option>
              {regions.map(region => (
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
          />
        </div>
        
        <div className={styles.actions}>
          <button type="submit" className={styles.primaryButton}>
            Сохранить данные
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;