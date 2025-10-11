import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, FileText, Download, LogOut, Menu, X, BarChart3 } from 'lucide-react';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Определяем мобильный вид
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const adminMenu = [
    { path: '/admin', icon: BarChart3, label: 'Статистика' },
    { path: '/admin/requests', icon: Users, label: 'Заявки' },
    { path: '/admin/files', icon: Download, label: 'Файлы' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerMain}>
            <Link to="/admin" className={styles.headerTitle} onClick={closeMobileMenu}>
              Админ панель
            </Link>
            
            {isMobileView && (
              <button 
                className={styles.mobileMenuButton}
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
          
          <div className={`${styles.userSection} ${isMobileMenuOpen && isMobileView ? styles.userSectionOpen : ''}`}>
            <span className={styles.userEmail}>
              {localStorage.getItem('adminEmail') || 'Администратор'}
            </span>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              <LogOut className={styles.logoutIcon} />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Навигация для десктопа */}
      {!isMobileView && (
        <nav className={styles.nav}>
          <div className={styles.navContent}>
            {adminMenu.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  <Icon className={styles.navIcon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Мобильное меню */}
      {isMobileView && isMobileMenuOpen && (
        <nav className={styles.mobileNav}>
          <div className={styles.mobileNavContent}>
            {adminMenu.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
                  onClick={closeMobileMenu}
                >
                  <Icon className={styles.navIcon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
