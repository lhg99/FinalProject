import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { useAuth } from '../../pages/Login/auth/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };


  return (
    <header className={styles.header}>
  <div className={styles.logo}>
    <a href="/">헬스</a>
  </div>
  <nav className={styles.nav}>
    <ul>
      <li className={styles.navItem}>
        <button onClick={() => toggleDropdown('exercise')} className={styles.dropdownToggle}>
          운동
        </button>
        {activeDropdown === 'exercise' && (
          <ul className={styles.dropdownMenu}>
            <li onClick={() => { navigate('/exercise'); closeDropdown(); }}>운동 기록 작성</li>
            <li onClick={() => { navigate('/exercise/records/AUG'); closeDropdown(); }}>운동 기록 목록</li>
            <li onClick={() => { navigate('/exercise/chart/AUG'); closeDropdown(); }}>운동 기록 차트</li>
            <li onClick={() => { navigate('/exvideo'); closeDropdown(); }}>운동 영상</li>
            <li onClick={() => { navigate('/carevideo'); closeDropdown(); }}>재활</li>
          </ul>
        )}
      </li>
      <li className={styles.navItem}>
        <button onClick={() => toggleDropdown('diet')} className={styles.dropdownToggle}>
          식단
        </button>
        {activeDropdown === 'diet' && (
          <ul className={styles.dropdownMenu}>
            <li onClick={() => { navigate('/food'); closeDropdown(); }}>식단 기록 작성</li>
            <li onClick={() => { navigate('/'); closeDropdown(); }}>식단 기록 목록</li>
            <li onClick={() => { navigate('/'); closeDropdown(); }}>식단 정보</li>
          </ul>
        )}
      </li>
      <li className={styles.navItem}>
        <button onClick={() => toggleDropdown('board')} className={styles.dropdownToggle}>
          게시판
        </button>
        {activeDropdown === 'board' && (
          <ul className={styles.dropdownMenu}>
            <li onClick={() => { navigate('/Board/free'); closeDropdown(); }}>자유게시판</li>
            <li onClick={() => { navigate('/Board/exercise'); closeDropdown(); }}>운동게시판</li>
            <li onClick={() => { navigate('/Board/diet'); closeDropdown(); }}>식단게시판</li>
          </ul>
        )}
          </li>
        <li className={styles.navItem}><a href="/findgym">헬스장 찾기</a></li>
    </ul>
    <div className={styles.authButton}>
      {user ? (
        <button onClick={handleLogout}>로그아웃</button>
      ) : (
        <button onClick={() => navigate('/login')}>로그인</button>
      )}
    </div>
  </nav>
</header>

  );
};

export default Header;
