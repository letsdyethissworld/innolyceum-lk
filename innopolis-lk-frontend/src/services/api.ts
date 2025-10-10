import axios from 'axios';
import { User, Applicant, ApplicantFormData, Document } from '../types';

const API_BASE_URL = 'https://innolyceum-lk-back.up.railway.app'; // FastAPI backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Для FormData автоматически убираем Content-Type, чтобы браузер сам установил с boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Response interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//
// ─── AUTH ──────────────────────────────────────────────────────────────────────
//
export const authAPI = {
  // Maps to FastAPI /token
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/token', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    localStorage.setItem('authToken', response.data.access_token);
    return response.data;
  },

  // Maps to FastAPI /register
  register: async (email: string, password: string) => {
    if (password.length > 72) {
      throw new Error("Password must be less than 72 characters");
    }
    const response = await api.post('/register', { email, password });
    return response.data;
  },

  // FastAPI has no /logout — just clear local token
  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('currentUser');
    return { msg: 'Logged out locally' };
  },

  // Password reset endpoints
  requestPasswordReset: async (email: string) => {
    const response = await api.post('/password-reset/request', null, {
      params: { email }
    });
    return response.data;
  },

  confirmPasswordReset: async (token: string, newPassword: string) => {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('new_password', newPassword);
    
    const response = await api.post('/password-reset/confirm', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

//
// ─── APPLICANT ────────────────────────────────────────────────────────────────
//
export const applicantAPI = {
  // GET /profile endpoint
  getProfile: async (): Promise<any> => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Matches FastAPI PUT /profile
  updateProfile: async (profileData: any): Promise<any> => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  // Maps to FastAPI /requests/me
  getDocuments: async (): Promise<any[]> => {
    const response = await api.get('/requests/me');
    return response.data;
  },

  // Submit full enrollment request
  // В разделе APPLICANT добавьте:

// Submit full enrollment request with all documents
  submitEnrollment: async (formData: FormData): Promise<any> => {
    const response = await api.post('/requests/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

// Удалите старый метод uploadDocument или оставьте для обратной совместимости

  // Upload individual document (for compatibility)
  /*uploadDocument: async (documentType: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append(documentType, file);
    
    // Note: This might not work directly with current backend
    // Backend expects all files at once in /requests/submit
    const response = await api.post('/requests/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },*/

  

  // Optional delete placeholder (not supported in FastAPI backend)
  deleteDocument: async (documentId: string): Promise<void> => {
    console.warn('deleteDocument() not supported by backend');
    throw new Error('Delete document not supported');
  },

  // Maps to FastAPI /requests/me to get request status
  getApplicationStatus: async (): Promise<{ status: string; message?: string; updatedAt?: string }> => {
    try {
      const response = await api.get('/requests/me');
      const requests = response.data;
      
      if (!requests || requests.length === 0) {
        return { 
          status: 'no_request', 
          message: 'Заявка не подана',
          updatedAt: new Date().toISOString()
        };
      }
      
      const latest = requests[0];
      return { 
        status: latest.status || 'pending', 
        message: latest.admin_note,
        updatedAt: latest.updated_at
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { 
          status: 'no_request', 
          message: 'Заявка не подана',
          updatedAt: new Date().toISOString()
        };
      }
      throw error;
    }
  },
};

//
// ─── ADMIN ────────────────────────────────────────────────────────────────────
//
export const adminAPI = {
  // Maps to FastAPI /admin/login
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await api.post('/admin/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    localStorage.setItem('adminToken', response.data.access_token);
    return response.data;
  },

  // Maps to FastAPI /admin/requests
  getApplications: async (filters?: any) => {
    const response = await api.get('/admin/requests', { params: filters });
    return response.data;
  },

  // Maps to FastAPI /admin/request/{id}/status
  updateApplicationStatus: async (requestId: number, status: string, adminNote?: string) => {
    const response = await api.post(`/admin/request/${requestId}/status`, { 
      status, 
      admin_note: adminNote 
    });
    return response.data;
  },

  // Get specific request details
  getRequestDetails: async (requestId: number) => {
    const response = await api.get(`/admin/request/${requestId}`);
    return response.data;
  },

  // Send notification to user
  notifyUser: async (userId: number, subject: string, body: string) => {
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('body', body);
    
    const response = await api.post(`/admin/notify/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Maps to FastAPI export routes
  exportApplications: async () => {
    const response = await api.get('/admin/export/users.xlsx', {
      responseType: 'blob',
    });
    return response.data;
  },

  exportMotivationLetters: async () => {
    const response = await api.get('/admin/export/motivation_letters.zip', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get admin statistics
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

export default api;
