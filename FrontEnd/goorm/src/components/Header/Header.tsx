import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { useAuth } from '../../pages/Login/auth/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="/">헬스</a>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><a href="/Board">게시판</a></li>
          <li><a href="/exercise">운동 기록</a></li>
          <li><a href="/Food">식단 기록</a></li>
          <li><a href="/Food">운동 영상</a></li>
          <li><a href="/mypage">재활</a></li>
          {user ? (
            <li>
              <button onClick={handleLogout}>로그아웃</button>
            </li>
          ) : (
            <li>
              <button onClick={() => navigate('/login')}>로그인</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
