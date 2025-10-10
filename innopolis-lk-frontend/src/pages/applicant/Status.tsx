import React, { useState, useEffect } from 'react';
import { applicantAPI } from '../../services/api';
import styles from './Status.module.css';

interface ApplicationStatus {
  status: 'new' | 'in_review' | 'accepted' | 'rejected';
  message: string;
  updatedAt: string;
}

const Status: React.FC = () => {
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async (): Promise<void> => {
    try {
      const statusData = await applicantAPI.getApplicationStatus();
      setStatus(statusData);
    } catch (error: any) {
      setError('Ошибка загрузки статуса заявки');
      console.error('Failed to load status:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusMessages = {
    new: 'Ваша заявка получена и ожидает обработки.',
    in_review: 'Ваши документы находятся на рассмотрении.',
    accepted: 'Поздравляем! Ваша заявка одобрена.',
    rejected: 'К сожалению, ваша заявка не одобрена.'
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка статуса...</div>;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>Статус заявки не найден</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Статус заявки</h1>
      
      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <h2 className={styles.statusTitle}>Текущий статус</h2>
          <span className={`${styles.statusBadge} ${styles[status.status]}`}>
            {status.status === 'new' && 'Новая'}
            {status.status === 'in_review' && 'На рассмотрении'}
            {status.status === 'accepted' && 'Принята'}
            {status.status === 'rejected' && 'Отклонена'}
          </span>
        </div>
        
        <p className={styles.statusMessage}>
          {status.message || statusMessages[status.status]}
        </p>
        
        {status.updatedAt && (
          <p className={styles.updateTime}>
            Обновлено: {new Date(status.updatedAt).toLocaleDateString('ru-RU')}
          </p>
        )}
        
        <div className={styles.timeline}>
          <div className={`${styles.timelineItem} ${styles.completed}`}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h3>Заявка подана</h3>
              <p>Ваша заявка успешно отправлена</p>
            </div>
          </div>
          
          <div className={`${styles.timelineItem} ${status.status !== 'new' ? styles.completed : ''}`}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h3>Проверка документов</h3>
              <p>Документы находятся на проверке</p>
            </div>
          </div>
          
          <div className={`${styles.timelineItem} ${status.status === 'accepted' || status.status === 'rejected' ? styles.completed : ''}`}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h3>Решение принято</h3>
              <p>По вашей заявке вынесено решение</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;