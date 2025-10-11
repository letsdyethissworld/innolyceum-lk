import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authAPI } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      const adminToken = localStorage.getItem('adminToken');
      
      if (token) {
        // Проверяем токен через бэкенд
        try {
          // Создаем временный api instance без interceptor чтобы избежать рекурсии
          const tempApi = authAPI;
          // Если бэкенд имеет эндпоинт для проверки пользователя, используем его
          // Пока просто считаем, что токен валиден если есть
          const user: User = {
            id: 'temp',
            email: 'user@example.com', // В реальном приложении получаем из токена или API
            role: 'applicant',
            createdAt: new Date().toISOString()
          };
          setCurrentUser(user);
        } catch (error) {
          console.error('Token validation failed:', error);
          logout();
        }
      } else if (adminToken) {
        const user: User = {
          id: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        };
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.login(email, password);
      
      const user: User = {
        id: 'temp',
        email: email,
        role: 'applicant',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('authToken', response.access_token);
      setCurrentUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Ошибка входа');
    }
  };

  const adminLogin = async (email: string, password: string): Promise<void> => {
    try {
      const response = await adminAPI.login(email, password);
      
      const user: User = {
        id: 'admin',
        email: email,
        role: 'admin',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('adminToken', response.access_token);
      localStorage.setItem('adminEmail', email);
      setCurrentUser(user);
      
      // Добавьте явное перенаправление
      window.location.href = '/admin'; // Или используйте navigate если доступен
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Ошибка входа администратора');
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.register(email, password);
      
      const user: User = {
        id: 'temp',
        email: email,
        role: 'applicant',
        createdAt: new Date().toISOString()
      };

      // После регистрации автоматически логинимся
      await login(email, password);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Ошибка регистрации');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    }
  };

  const value: AuthContextType = {
    currentUser,
    login,
    adminLogin,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
