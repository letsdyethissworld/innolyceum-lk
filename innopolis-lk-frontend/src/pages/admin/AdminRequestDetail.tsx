import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import styles from './AdminRequestDetail.module.css';

interface RequestDetail {
  id: number;
  user_id: number;
  status: string;
  achievements: string[];
  motivation_letter: string;
  grades: string;
  state_exam: string;
  official_grades_document: string;
  admin_note: string;
  user?: {
    email: string;
    profile?: {
      first_name: string;
      last_name: string;
      state: string;
      city: string;
      school: string;
      class_number: number;
      contact_number: string;
    };
  };
}

const AdminRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadRequest(parseInt(id));
    }
  }, [id]);

  const loadRequest = async (requestId: number) => {
    try {
      const requestData = await adminAPI.getRequestDetails(requestId);
      setRequest(requestData);
      setAdminNote(requestData.admin_note || '');
    } catch (error: any) {
      setError('Ошибка загрузки заявки');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id) return;
    
    setUpdating(true);
    try {
      await adminAPI.updateApplicationStatus(parseInt(id), newStatus, adminNote);
      loadRequest(parseInt(id)); // Перезагружаем данные
    } catch (error: any) {
      setError('Ошибка обновления статуса');
    } finally {
      setUpdating(false);
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/file?path=${encodeURIComponent(filePath)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      setError('Ошибка загрузки файла');
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!request) return <div className={styles.error}>Заявка не найдена</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate('/admin/requests')} className={styles.backButton}>
          ← Назад к списку
        </button>
        <h1>Заявка #{request.id}</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Информация о поступающем</h2>
          {request.user?.profile && (
            <div className={styles.profileInfo}>
              <p><strong>ФИО:</strong> {request.user.profile.first_name} {request.user.profile.last_name}</p>
              <p><strong>Email:</strong> {request.user.email}</p>
              <p><strong>Регион:</strong> {request.user.profile.state}</p>
              <p><strong>Город:</strong> {request.user.profile.city}</p>
              <p><strong>Школа:</strong> {request.user.profile.school}</p>
              <p><strong>Класс:</strong> {request.user.profile.class_number}</p>
              <p><strong>Телефон:</strong> {request.user.profile.contact_number}</p>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>Документы</h2>
          <div className={styles.documents}>
            <div className={styles.document}>
              <h3>Мотивационное письмо</h3>
              {request.motivation_letter && (
                <button 
                  onClick={() => downloadFile(request.motivation_letter, 'motivation_letter.pdf')}
                  className={styles.downloadButton}
                >
                  Скачать
                </button>
              )}
            </div>

            <div className={styles.document}>
              <h3>Табель успеваемости</h3>
              {request.grades && (
                <button 
                  onClick={() => downloadFile(request.grades, 'grades.pdf')}
                  className={styles.downloadButton}
                >
                  Скачать
                </button>
              )}
            </div>

            {request.state_exam && (
              <div className={styles.document}>
                <h3>Результаты ОГЭ</h3>
                <button 
                  onClick={() => downloadFile(request.state_exam, 'state_exam.pdf')}
                  className={styles.downloadButton}
                >
                  Скачать
                </button>
              </div>
            )}

            {request.official_grades_document && (
              <div className={styles.document}>
                <h3>Аттестат</h3>
                <button 
                  onClick={() => downloadFile(request.official_grades_document, 'certificate.pdf')}
                  className={styles.downloadButton}
                >
                  Скачать
                </button>
              </div>
            )}

            {request.achievements && request.achievements.length > 0 && (
              <div className={styles.document}>
                <h3>Достижения ({request.achievements.length})</h3>
                {request.achievements.map((achievement, index) => (
                  <button 
                    key={index}
                    onClick={() => downloadFile(achievement, `achievement_${index + 1}.pdf`)}
                    className={styles.downloadButton}
                  >
                    Скачать достижение {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Управление заявкой</h2>
          <div className={styles.management}>
            <div className={styles.statusSection}>
              <label>
                <strong>Текущий статус:</strong> 
                <span className={`${styles.status} ${styles[request.status]}`}>
                  {request.status === 'approved' && 'Одобрено'}
                  {request.status === 'denied' && 'Отклонено'}
                  {request.status === 'pending' && 'На рассмотрении'}
                </span>
              </label>
              
              <div className={styles.statusActions}>
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  className={`${styles.statusButton} ${styles.approveButton}`}
                  disabled={request.status === 'approved' || updating}
                >
                  Одобрить
                </button>
                <button
                  onClick={() => handleStatusUpdate('denied')}
                  className={`${styles.statusButton} ${styles.denyButton}`}
                  disabled={request.status === 'denied' || updating}
                >
                  Отклонить
                </button>
              </div>
            </div>

            <div className={styles.noteSection}>
              <label htmlFor="adminNote">Заметка администратора:</label>
              <textarea
                id="adminNote"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className={styles.textarea}
                placeholder="Введите заметку для поступающего..."
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRequestDetail;