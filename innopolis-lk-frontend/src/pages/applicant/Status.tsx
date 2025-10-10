import React from 'react';
import styles from './Status.module.css';

const Status: React.FC = () => {
  // Заглушка для данных о статусе
  const status = 'in_review'; // 'new', 'in_review', 'accepted', 'rejected'
  const statusMessages = {
    new: 'Ваша заявка получена и ожидает обработки.',
    in_review: 'Ваши документы находятся на рассмотрении.',
    accepted: 'Поздравляем! Ваша заявка одобрена.',
    rejected: 'К сожалению, ваша заявка не одобрена.'
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Статус заявки</h1>
      
      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <h2 className={styles.statusTitle}>Текущий статус</h2>
          <span className={`${styles.statusBadge} ${styles[status]}`}>
            {status === 'new' && 'Новая'}
            {status === 'in_review' && 'На рассмотрении'}
            {status === 'accepted' && 'Принята'}
            {status === 'rejected' && 'Отклонена'}
          </span>
        </div>
        
        <p className={styles.statusMessage}>
          {statusMessages[status]}
        </p>
        
        <div className={styles.timeline}>
          <div className={`${styles.timelineItem} ${styles.completed}`}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h3>Заявка подана</h3>
              <p>Ваша заявка успешно отправлена</p>
            </div>
          </div>
          
          <div className={`${styles.timelineItem} ${status !== 'new' ? styles.completed : ''}`}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <h3>Проверка документов</h3>
              <p>Документы находятся на проверке</p>
            </div>
          </div>
          
          <div className={`${styles.timelineItem} ${status === 'accepted' || status === 'rejected' ? styles.completed : ''}`}>
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