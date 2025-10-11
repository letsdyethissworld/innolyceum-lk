import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authAPI, adminAPI } from '../services/api'; // Добавьте adminAPI в импорт

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
        try {
          const user: User = {
            id: 'temp',
            email: 'user@example.com',
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
          email: localStorage.getItem('adminEmail') || 'admin@example.com',
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

  // ДОБАВЛЯЕМ МЕТОД adminLogin
  const adminLogin = async (email: string, password: string): Promise<void> => {
    try {
      // Очищаем предыдущие токены перед новым входом
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');

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
      
      // Перенаправление на админ-панель
      window.location.href = '/admin';
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          'Ошибка входа администратора';
      console.error('Admin login error:', error);
      throw new Error(errorMessage);
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
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    }
  };

  const value: AuthContextType = {
    currentUser,
    login,
    adminLogin, // ДОБАВЛЯЕМ В КОНТЕКСТ
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
