import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, FileText, Download, LogOut, Menu, X, BarChart3 } from 'lucide-react';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const adminMenu = [
    { path: '/admin', icon: BarChart3, label: 'Статистика' },
    { path: '/admin/requests', icon: Users, label: 'Заявки' },
    { path: '/admin/files', icon: Download, label: 'Файлы' }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerMain}>
            <h1 className={styles.headerTitle}>
              Админ панель
            </h1>
            
            <button 
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className={`${styles.userSection} ${isMobileMenuOpen ? styles.userSectionOpen : ''}`}>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              <LogOut className={styles.logoutIcon} />
              <span className={styles.logoutText}>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
        <div className={styles.navContent}>
          {adminMenu.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className={styles.navIcon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;