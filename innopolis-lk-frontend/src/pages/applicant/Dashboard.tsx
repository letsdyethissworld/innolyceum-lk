import React from 'react';
import { Link } from 'react-router-dom';
import { User, FileText, BarChart3 } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const menuItems = [
    {
      title: 'Профиль',
      description: 'Заполните личные данные',
      icon: User,
      link: '/applicant/profile',
      color: 'blue'
    },
    {
      title: 'Документы',
      description: 'Загрузите необходимые документы',
      icon: FileText,
      link: '/applicant/documents',
      color: 'green'
    },
    {
      title: 'Статус заявки',
      description: 'Отслеживайте статус рассмотрения',
      icon: BarChart3,
      link: '/applicant/status',
      color: 'purple'
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Личный кабинет поступающего</h1>
      <p className={styles.subtitle}>Лицей Иннополис</p>
      
      <div className={styles.grid}>
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.link} to={item.link} className={styles.card}>
              <div className={`${styles.iconContainer} ${styles[item.color]}`}>
                <Icon className={styles.icon} />
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;