import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignUp.module.scss';
import { SignUpData, postSignUpData } from '../../api/signupApi';

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loginPw, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loginId, setId] = useState<string>('');
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordRegex.test(loginPw)) {
      alert('비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상 16자 이하로 입력해주세요.');
      return;
    }

    if (loginPw !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const signupData: SignUpData = {
      loginId,
      loginPw,
      name,
      email,
      username,
    };

    try {
      await postSignUpData(signupData);
      alert('회원가입이 완료되었습니다.');
      navigate('/Login');
    } catch (err) {
      alert('회원가입에 실패하였습니다.');
      console.error(err);
    }
  };

  return (
    <div className={styles['form-container']}>
      <h2>회원가입</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            id="id"
            value={loginId}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={loginPw}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="name">사용자 이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="username">닉네임</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className={styles.button} type="submit">회원가입</button>
      </form>
      <p>
        <Link to="/Login">계정이 이미 있으신가요?</Link>
      </p>
    </div>
  );
};

export default SignUp;
