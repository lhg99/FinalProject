import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import { LoginData, postLoginData, LoginRequest } from '../../api/loginApi';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    const loginData: LoginData = {
      loginId: id,
      loginPw: password,
    };

    try {
      const response: LoginRequest = await postLoginData(loginData);
      console.log('로그인에 성공했습니다:', response);
      alert(response.message);
      navigate('/');
    } catch (err) {
      console.log('로그인에 실패했습니다:', err);
      alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>로그인</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button className={styles.button} type="submit" disabled={isLoading}>
          로그인
        </button>
      </form>
      
      <p>
        아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
};

export default Login;
