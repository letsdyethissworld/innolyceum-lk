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
      if (token) {
        // В реальном приложении здесь был бы запрос для проверки токена
        // const user = await authAPI.checkAuth();
        // setCurrentUser(user);
        
        // Временно используем данные из localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.login(email, password);
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        createdAt: new Date().toISOString()
      };

      // Сохраняем токен и данные пользователя
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      setCurrentUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка входа');
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.register(email, password);
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      setCurrentUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка регистрации');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    }
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};