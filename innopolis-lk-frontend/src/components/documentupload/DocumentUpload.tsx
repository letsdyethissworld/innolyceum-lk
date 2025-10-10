import React, { useState, useEffect } from 'react';
import { Upload, File, X, Send } from 'lucide-react';
import { applicantAPI } from '../../services/api.ts';
import styles from './DocumentUpload.module.css';

interface DocumentType {
  id: string;
  label: string;
  description: string;
  required: boolean;
  fieldName: string;
}

const documentTypes: DocumentType[] = [
  { 
    id: 'achievements', 
    label: 'Достижения', 
    description: 'Грамоты, дипломы олимпиад, конкурсов', 
    required: false,
    fieldName: 'achievements'
  },
  { 
    id: 'motivation_letter', 
    label: 'Мотивационное письмо', 
    description: 'Файл в формате PDF', 
    required: true,
    fieldName: 'motivation_letter'
  },
  { 
    id: 'grades', 
    label: 'Табель успеваемости', 
    description: 'За текущий/предыдущий учебный год', 
    required: true,
    fieldName: 'grades_file'
  },
  { 
    id: 'state_exam', 
    label: 'Протокол результатов ОГЭ', 
    description: 'Для поступающих в 10 класс', 
    required: false,
    fieldName: 'state_exam_file'
  },
  { 
    id: 'official_grades', 
    label: 'Копия аттестата', 
    description: 'Об основном общем образовании', 
    required: false,
    fieldName: 'official_grades_file'
  }
];

interface UploadedFile {
  id: string;
  file: File;
  type: string;
  fieldName: string;
}

const DocumentUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [userClass, setUserClass] = useState<number>(6);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async (): Promise<void> => {
    try {
      const profile = await applicantAPI.getProfile();
      if (profile && profile.class_number) {
        setUserClass(profile.class_number);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleFileSelect = (type: string, fieldName: string, files: FileList): void => {
    setError('');
    
    // Для motivation_letter, grades_file, state_exam_file, official_grades_file - только один файл
    const isSingleFile = fieldName !== 'achievements';
    
    if (isSingleFile) {
      // Удаляем предыдущие файлы этого типа
      setUploadedFiles(prev => prev.filter(f => f.fieldName !== fieldName));
    }

    for (const file of Array.from(files)) {
      // Проверка размера файла (10 МБ)
      if (file.size > 10 * 1024 * 1024) {
        setError(`Файл "${file.name}" превышает максимальный размер 10 МБ`);
        continue;
      }

      // Проверка типа файла
      const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension || '')) {
        setError(`Недопустимый формат файла: ${file.name}. Разрешены: ${allowedTypes.join(', ')}`);
        continue;
      }

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type,
        fieldName
      };

      setUploadedFiles(prev => {
        if (isSingleFile) {
          // Заменяем существующий файл этого типа
          return [...prev.filter(f => f.fieldName !== fieldName), newFile];
        } else {
          // Добавляем к существующим achievement файлам
          return [...prev, newFile];
        }
      });
    }
  };

  const removeFile = (fileId: string): void => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = async (): Promise<void> => {
    setError('');
    setSuccess('');

    // Проверка обязательных файлов
    const requiredFiles = documentTypes.filter(doc => doc.required);
    const missingFiles = requiredFiles.filter(doc => 
      !uploadedFiles.some(f => f.fieldName === doc.fieldName)
    );

    if (missingFiles.length > 0) {
      setError(`Необходимо загрузить обязательные документы: ${missingFiles.map(doc => doc.label).join(', ')}`);
      return;
    }

    // Проверка специальных требований для классов
    if (userClass === 10 && !uploadedFiles.some(f => f.fieldName === 'state_exam_file')) {
      setError('Для 10 класса обязателен протокол результатов ОГЭ');
      return;
    }

    if (userClass > 8 && !uploadedFiles.some(f => f.fieldName === 'official_grades_file')) {
      setError('Для классов выше 8 обязательна копия аттестата');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Добавляем файлы в FormData
      uploadedFiles.forEach(uploadedFile => {
        if (uploadedFile.fieldName === 'achievements') {
          // achievements - это массив файлов
          formData.append('achievements', uploadedFile.file);
        } else {
          // Остальные - одиночные файлы
          formData.append(uploadedFile.fieldName, uploadedFile.file);
        }
      });

      await applicantAPI.submitEnrollment(formData);
      setSuccess('Документы успешно отправлены!');
      setUploadedFiles([]);
      
      // Автоматически скрыть сообщение об успехе через 5 секунд
      setTimeout(() => setSuccess(''), 5000);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Ошибка отправки документов');
      console.error('Failed to submit documents:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFilesByType = (fieldName: string): UploadedFile[] => {
    return uploadedFiles.filter(f => f.fieldName === fieldName);
  };

  const isFileUploaded = (fieldName: string): boolean => {
    return uploadedFiles.some(f => f.fieldName === fieldName);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Загрузка документов</h1>
      <p className={styles.subtitle}>
        Загрузите все необходимые документы и нажмите "Отправить документы"
      </p>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {success && (
        <div className={styles.successMessage}>
          {success}
        </div>
      )}
      
      <div className={styles.documentsList}>
        {documentTypes.map(docType => {
          const files = getFilesByType(docType.fieldName);
          const isUploaded = isFileUploaded(docType.fieldName);
          
          return (
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
                  multiple={docType.fieldName === 'achievements'}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className={styles.fileInput}
                  onChange={(e) => e.target.files && handleFileSelect(docType.id, docType.fieldName, e.target.files)}
                  disabled={isSubmitting}
                />
                <label htmlFor={docType.id} className={`${styles.uploadLabel} ${isUploaded ? styles.uploaded : ''}`}>
                  {isUploaded ? (
                    <div className={styles.uploadedText}>
                      <File className={styles.uploadIcon} />
                      <span>Файл загружен</span>
                      <span className={styles.uploadHint}>Нажмите для замены</span>
                    </div>
                  ) : (
                    <>
                      <Upload className={styles.uploadIcon} />
                      <span className={styles.uploadText}>Нажмите для загрузки файла</span>
                      <span className={styles.uploadHint}>
                        PDF, JPG, PNG, DOC, DOCX (макс. 10 МБ)
                        {docType.fieldName === 'achievements' && ' - можно несколько файлов'}
                      </span>
                    </>
                  )}
                </label>
              </div>
              
              {files.length > 0 && (
                <div className={styles.uploadedFiles}>
                  {files.map(file => (
                    <div key={file.id} className={styles.fileItem}>
                      <div className={styles.fileInfo}>
                        <File className={styles.fileIcon} />
                        <div>
                          <p className={styles.fileName}>{file.file.name}</p>
                          <p className={styles.fileSize}>{formatFileSize(file.file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className={styles.removeButton}
                        disabled={isSubmitting}
                      >
                        <X className={styles.removeIcon} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className={styles.submitSection}>
        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={isSubmitting || uploadedFiles.length === 0}
        >
          <Send className={styles.submitIcon} />
          {isSubmitting ? 'Отправка...' : 'Отправить документы'}
        </button>
        
        <div className={styles.uploadSummary}>
          <p>Загружено файлов: {uploadedFiles.length}</p>
          <p>Текущий класс: {userClass}</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
