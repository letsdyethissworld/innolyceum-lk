import React, { useState, useEffect } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Document } from '../../types';
import { applicantAPI } from '../../services/api';
import styles from './Documents.module.css';

interface DocumentType {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

const documentTypes: DocumentType[] = [
  { id: 'achievements', label: 'Достижения', description: 'Грамоты, дипломы олимпиад, конкурсов', required: false },
  { id: 'motivation', label: 'Мотивационное письмо', description: 'Файл в формате PDF', required: true },
  { id: 'grades', label: 'Табель успеваемости', description: 'За текущий/предыдущий учебный год', required: true },
  { id: 'oge', label: 'Протокол результатов ОГЭ', description: 'Для поступающих в 10 класс', required: false },
  { id: 'certificate', label: 'Копия аттестата', description: 'Об основном общем образовании', required: false }
];

interface UploadedFile extends Document {
  file?: File;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Record<string, UploadedFile[]>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async (): Promise<void> => {
    try {
      const docs = await applicantAPI.getDocuments();
      
      // Группируем документы по типам
      const groupedDocs: Record<string, UploadedFile[]> = {};
      documentTypes.forEach(type => {
        groupedDocs[type.id] = docs.filter(doc => doc.documentType === type.id);
      });
      
      setDocuments(groupedDocs);
    } catch (error: any) {
      setError('Ошибка загрузки документов');
      console.error('Failed to load documents:', error);
    }
  };

  const handleFileUpload = async (type: string, files: FileList): Promise<void> => {
    setError('');
    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      for (const file of Array.from(files)) {
        // Проверка размера файла (10 МБ)
        if (file.size > 10 * 1024 * 1024) {
          setError(`Файл "${file.name}" превышает максимальный размер 10 МБ`);
          continue;
        }

        // Проверка типа файла
        const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
          setError(`Недопустимый формат файла: ${file.name}`);
          continue;
        }

        const uploadedDoc = await applicantAPI.uploadDocument(type, file);
        
        setDocuments(prev => ({
          ...prev,
          [type]: [...(prev[type] || []), uploadedDoc]
        }));
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка загрузки файла');
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const removeFile = async (type: string, documentId: string): Promise<void> => {
    try {
      await applicantAPI.deleteDocument(documentId);
      setDocuments(prev => ({
        ...prev,
        [type]: prev[type]?.filter(doc => doc.id !== documentId) || []
      }));
    } catch (error: any) {
      setError('Ошибка удаления файла');
      console.error('Failed to delete document:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Загрузка документов</h1>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      <div className={styles.documentsList}>
        {documentTypes.map(docType => (
          <div key={docType.id} className={styles.documentCard}>
            <div className={styles.documentHeader}>
              <h3 className={styles.documentTitle}>
                {docType.label}
                {docType.required && <span className={styles.required}>*</span>}
              </h3>
              <p className={styles.documentDescription}>{docType.description}</p>
            </div>
            
            <div className={styles.uploadArea}>
              <input
                type="file"
                id={docType.id}
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className={styles.fileInput}
                onChange={(e) => e.target.files && handleFileUpload(docType.id, e.target.files)}
                disabled={uploading[docType.id]}
              />
              <label htmlFor={docType.id} className={styles.uploadLabel}>
                {uploading[docType.id] ? (
                  <div className={styles.uploadingText}>Загрузка...</div>
                ) : (
                  <>
                    <Upload className={styles.uploadIcon} />
                    <span className={styles.uploadText}>Нажмите для загрузки файлов</span>
                    <span className={styles.uploadHint}>
                      PDF, JPG, PNG, DOC, DOCX (макс. 10 МБ)
                    </span>
                  </>
                )}
              </label>
            </div>
            
            {documents[docType.id]?.length > 0 && (
              <div className={styles.uploadedFiles}>
                <h4 className={styles.uploadedTitle}>Загруженные файлы:</h4>
                {documents[docType.id].map(file => (
                  <div key={file.id} className={styles.fileItem}>
                    <div className={styles.fileInfo}>
                      <File className={styles.fileIcon} />
                      <div>
                        <p className={styles.fileName}>{file.fileName}</p>
                        <p className={styles.fileSize}>{formatFileSize(file.fileSize)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(docType.id, file.id)}
                      className={styles.removeButton}
                      disabled={uploading[docType.id]}
                    >
                      <X className={styles.removeIcon} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;