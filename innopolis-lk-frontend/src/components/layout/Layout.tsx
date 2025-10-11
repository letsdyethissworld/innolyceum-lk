import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, FileText, BarChart3, LogOut, Menu, X } from 'lucide-react';
import styles from './Layout.module.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const applicantMenu = [
    { path: '/applicant/profile', icon: User, label: 'Профиль' },
    { path: '/applicant/documents', icon: FileText, label: 'Документы' },
    { path: '/applicant/status', icon: BarChart3, label: 'Статус заявки' }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerMain}>
            <Link to="/applicant" className={styles.logo}>
              <h1 className={`${styles.logoText} ${styles.headerTitle}`}>Лицей Иннополис</h1>
            </Link>
            
            {/* Mobile menu button */}
            <button 
              className={styles.mobileMenuButton}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          <div className={`${styles.userSection} ${isMobileMenuOpen ? styles.userSectionOpen : ''}`}>
            <span className={styles.userEmail}>{currentUser?.email}</span>
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

      {/* Navigation */}
      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
        <div className={styles.navContent}>
          {applicantMenu.map(item => {
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

      {/* Main Content */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
