import React, { useState, useEffect } from 'react';
import { applicantAPI } from '../../services/api';
import styles from './Status.module.css';

interface ApplicationStatus {
  status: 'pending' | 'approved' | 'denied' | 'no_request';
  message?: string;
  updatedAt?: string;
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
    pending: 'Ваша заявка получена и ожидает обработки.',
    approved: 'Поздравляем! Ваша заявка одобрена.',
    denied: 'К сожалению, ваша заявка не одобрена.',
    no_request: 'Заявка не подана. Пожалуйста, заполните профиль и загрузите документы.'
  };

  const statusLabels = {
    pending: 'На рассмотрении',
    approved: 'Принята',
    denied: 'Отклонена',
    no_request: 'Нет заявки'
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
            {statusLabels[status.status]}
          </span>
        </div>
        
        <p className={styles.statusMessage}>
          {status.message || statusMessages[status.status]}
        </p>
        
        {status.updatedAt && status.status !== 'no_request' && (
          <p className={styles.updateTime}>
            Обновлено: {new Date(status.updatedAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
        
        {status.status !== 'no_request' && (
          <div className={styles.timeline}>
            <div className={`${styles.timelineItem} ${styles.completed}`}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>Заявка подана</h3>
                <p>Ваша заявка успешно отправлена</p>
              </div>
            </div>
            
            <div className={`${styles.timelineItem} ${
              status.status !== 'pending' && status.status !== 'no_request' ? styles.completed : ''
            }`}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>Проверка документов</h3>
                <p>Документы находятся на проверке</p>
              </div>
            </div>
            
            <div className={`${styles.timelineItem} ${
              status.status === 'approved' || status.status === 'denied' ? styles.completed : ''
            }`}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h3>Решение принято</h3>
                <p>По вашей заявке вынесено решение</p>
              </div>
            </div>
          </div>
        )}
        
        {status.status === 'no_request' && (
          <div className={styles.noRequest}>
            <p>Вы еще не подали заявку на поступление.</p>
            <p>Пожалуйста, заполните профиль и загрузите необходимые документы.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Status;