import React from 'react';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">헬스</a>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><a href="/Chat">채팅</a></li>
          <li><a href="/Board">게시판</a></li>
          <li><a href="/exercise">운동 기록</a></li>
          <li><a href="/Food">식단 기록</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
