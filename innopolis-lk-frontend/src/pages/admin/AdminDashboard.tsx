import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import styles from './AdminDashboard.module.css';

interface Stats {
  total_requests: number;
  status_counts: { [key: string]: number };
  state_counts: { [key: string]: number };
  avg_processing_seconds: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await adminAPI.getStats();
      setStats(statsData);
    } catch (error: any) {
      setError('Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка статистики...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!stats) return <div className={styles.error}>Нет данных</div>;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)} сек`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} мин`;
    return `${Math.round(seconds / 3600)} ч`;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Статистика заявок</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Всего заявок</h3>
          <div className={styles.statNumber}>{stats.total_requests}</div>
        </div>
        
        <div className={styles.statCard}>
          <h3>Среднее время обработки</h3>
          <div className={styles.statNumber}>
            {stats.avg_processing_seconds ? formatTime(stats.avg_processing_seconds) : 'Нет данных'}
          </div>
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.chart}>
          <h3>Статусы заявок</h3>
          <div className={styles.statusList}>
            {Object.entries(stats.status_counts).map(([status, count]) => (
              <div key={status} className={styles.statusItem}>
                <span className={styles.statusName}>
                  {status === 'pending' && 'На рассмотрении'}
                  {status === 'approved' && 'Одобрено'}
                  {status === 'denied' && 'Отклонено'}
                </span>
                <span className={styles.statusCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chart}>
          <h3>Заявки по регионам</h3>
          <div className={styles.regionList}>
            {Object.entries(stats.state_counts).map(([region, count]) => (
              <div key={region} className={styles.regionItem}>
                <span className={styles.regionName}>{region}</span>
                <span className={styles.regionCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;