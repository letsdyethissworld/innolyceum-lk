import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import styles from './AdminFiles.module.css';

const AdminFiles: React.FC = () => {
  const [downloading, setDownloading] = useState<string>('');
  const [error, setError] = useState('');

  const handleDownload = async (type: 'excel' | 'zip') => {
    setDownloading(type);
    setError('');

    try {
      let blob: Blob;
      
      if (type === 'excel') {
        blob = await adminAPI.exportApplications();
      } else {
        blob = await adminAPI.exportMotivationLetters();
      }

      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'excel' ? 'applicants.xlsx' : 'motivation_letters.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setError('Ошибка скачивания файла');
    } finally {
      setDownloading('');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Экспорт данных</h1>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.downloadCards}>
        <div className={styles.downloadCard}>
          <div className={styles.cardContent}>
            <h3>Excel таблица с данными</h3>
            <p>Скачайте Excel файл с информацией о всех поступающих</p>
            <button
              onClick={() => handleDownload('excel')}
              disabled={!!downloading}
              className={styles.downloadButton}
            >
              {downloading === 'excel' ? 'Скачивание...' : 'Скачать Excel'}
            </button>
          </div>
        </div>

        <div className={styles.downloadCard}>
          <div className={styles.cardContent}>
            <h3>Архив с мотивационными письмами</h3>
            <p>Скачайте ZIP архив со всеми мотивационными письмами, отсортированными по ФИО</p>
            <button
              onClick={() => handleDownload('zip')}
              disabled={!!downloading}
              className={styles.downloadButton}
            >
              {downloading === 'zip' ? 'Скачивание...' : 'Скачать ZIP'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <h3>Информация:</h3>
        <ul>
          <li>Excel файл содержит данные всех зарегистрированных пользователей</li>
          <li>ZIP архив содержит мотивационные письма всех подавших заявки</li>
          <li>Файлы в архиве отсортированы по фамилии и имени</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminFiles;