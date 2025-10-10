import axios from 'axios';
import { User, Applicant, ApplicantFormData, Document } from '../types';

const API_BASE_URL = 'http://localhost:8000'; // Замените на ваш бэкенд URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string) => {
    const response = await api.post('/register', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
};

export const applicantAPI = {
  getProfile: async (): Promise<Applicant> => {
    const response = await api.get('/applicant/profile');
    return response.data;
  },

  updateProfile: async (profileData: ApplicantFormData): Promise<Applicant> => { // Изменили тип
    const response = await api.put('/profile', profileData);
    return response.data;
  },
  getDocuments: async (): Promise<Document[]> => {
    const response = await api.get('/applicant/documents');
    return response.data;
  },

  uploadDocument: async (documentType: string, file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);

    const response = await api.post('/applicant/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    await api.delete(`/applicant/documents/${documentId}`);
  },

  getApplicationStatus: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/applicant/status');
    return response.data;
  },
};

export const adminAPI = {
  getApplications: async (filters?: any) => {
    const response = await api.get('/admin/applications', { params: filters });
    return response.data;
  },

  updateApplicationStatus: async (applicantId: string, status: string) => {
    const response = await api.patch(`/admin/applications/${applicantId}/status`, { status });
    return response.data;
  },

  exportApplications: async (filters?: any) => {
    const response = await api.get('/admin/export', { 
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  },
};

export default api;