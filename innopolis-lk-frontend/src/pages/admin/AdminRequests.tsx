import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import styles from './AdminRequests.module.css';

interface Request {
  id: number;
  user_id: number;
  status: string;
  created_at: string;
  user_email?: string;
  profile?: {
    first_name: string;
    last_name: string;
    state: string;
    city: string;
    school: string;
    class_number: number;
    contact_number: string;
  };
}

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    state: '',
    class_number: ''  // Добавляем фильтр по классу
  });

  useEffect(() => {
    loadRequests();
  }, [filters]);

  const loadRequests = async () => {
    try {
      // Преобразуем class_number в число, если он есть
      const apiFilters = {
        ...filters,
        class_number: filters.class_number ? parseInt(filters.class_number) : undefined
      };
      
      const requestsData = await adminAPI.getApplications(apiFilters);
      setRequests(requestsData);
    } catch (error: any) {
      setError('Ошибка загрузки заявок');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: number, newStatus: string) => {
    try {
      await adminAPI.updateApplicationStatus(requestId, newStatus);
      loadRequests(); // Перезагружаем список
    } catch (error: any) {
      setError('Ошибка обновления статуса');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return styles.statusApproved;
      case 'denied': return styles.statusDenied;
      default: return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Одобрено';
      case 'denied': return 'Отклонено';
      default: return 'На рассмотрении';
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка заявок...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Управление заявками</h1>
        <div className={styles.filters}>
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className={styles.filter}
          >
            <option value="">Все статусы</option>
            <option value="pending">На рассмотрении</option>
            <option value="approved">Одобрено</option>
            <option value="denied">Отклонено</option>
          </select>
          
          <input
            type="text"
            placeholder="Фильтр по региону"
            value={filters.state}
            onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
            className={styles.filter}
          />

          {/* Добавляем фильтр по классу */}
          <select 
            value={filters.class_number}
            onChange={(e) => setFilters(prev => ({ ...prev, class_number: e.target.value }))}
            className={styles.filter}
          >
            <option value="">Все классы</option>
            <option value="6">6 класс</option>
            <option value="7">7 класс</option>
            <option value="8">8 класс</option>
            <option value="9">9 класс</option>
            <option value="10">10 класс</option>
          </select>
        </div>
      </div>

      <div className={styles.requestsList}>
        {requests.length === 0 ? (
          <div className={styles.empty}>Нет заявок</div>
        ) : (
          requests.map(request => (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <h3>Заявка #{request.id}</h3>
                <span className={`${styles.status} ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
              </div>
              
              <div className={styles.requestInfo}>
                <div className={styles.infoItem}>
                  <strong>ФИО:</strong> {request.profile?.first_name} {request.profile?.last_name}
                </div>
                <div className={styles.infoItem}>
                  <strong>Email:</strong> {request.user_email}
                </div>
                <div className={styles.infoItem}>
                  <strong>Регион:</strong> {request.profile?.state}
                </div>
                <div className={styles.infoItem}>
                  <strong>Город:</strong> {request.profile?.city}
                </div>
                <div className={styles.infoItem}>
                  <strong>Школа:</strong> {request.profile?.school}
                </div>
                <div className={styles.infoItem}>
                  <strong>Класс:</strong> {request.profile?.class_number}
                </div>
                <div className={styles.infoItem}>
                  <strong>Телефон:</strong> {request.profile?.contact_number}
                </div>
              </div>

              <div className={styles.actions}>
                <Link to={`/admin/requests/${request.id}`} className={styles.detailsButton}>
                  Подробнее
                </Link>
                
                <div className={styles.statusActions}>
                  <button
                    onClick={() => handleStatusChange(request.id, 'approved')}
                    className={`${styles.statusButton} ${styles.approveButton}`}
                    disabled={request.status === 'approved'}
                  >
                    Одобрить
                  </button>
                  <button
                    onClick={() => handleStatusChange(request.id, 'denied')}
                    className={`${styles.statusButton} ${styles.denyButton}`}
                    disabled={request.status === 'denied'}
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRequests;
