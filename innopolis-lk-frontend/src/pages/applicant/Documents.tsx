import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Document } from '../../types';
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

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Record<string, UploadedFile[]>>({});

  const handleFileUpload = (type: string, files: FileList): void => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file
    }));
    
    setDocuments(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), ...newFiles]
    }));
  };

  const removeFile = (type: string, fileId: string): void => {
    setDocuments(prev => ({
      ...prev,
      [type]: prev[type]?.filter(file => file.id !== fileId) || []
    }));
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
              />
              <label htmlFor={docType.id} className={styles.uploadLabel}>
                <Upload className={styles.uploadIcon} />
                <span className={styles.uploadText}>Нажмите для загрузки файлов</span>
                <span className={styles.uploadHint}>
                  PDF, JPG, PNG, DOC, DOCX (макс. 10 МБ)
                </span>
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
                        <p className={styles.fileName}>{file.name}</p>
                        <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(docType.id, file.id)}
                      className={styles.removeButton}
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