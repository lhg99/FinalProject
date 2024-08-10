import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignUp.module.scss';
import { KakaoSignupData, SignUpData, postKakaoSignup, postSignUpData } from '../../api/signupApi';

const SignUp = () => {
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loginPw, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loginId, setId] = useState<string>('');
  const [isKakaoSignup, setIsKakaoSignup] = useState<boolean>(false);
  const [memberId, setMemberId] = useState<number>(0);
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,16}$/;

   // 쿼리 파라미터에서 데이터를 가져오는 부분
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const memberId = params.get('memberId');
    const email = params.get('email');
    const nickname = params.get('nickname');

    if (memberId) {
      setIsKakaoSignup(true); // 카카오 회원가입으로 설정
    }
    if(memberId) setMemberId(parseInt(memberId));
    if (email) setEmail(email);
    if (nickname) setName(decodeURIComponent(nickname)); // URL 인코딩된 닉네임을 디코딩하여 설정
  }, []);

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

    const kakaoSignupData: KakaoSignupData = {
      loginId,
      loginPw,
      name
    }

    try {
      if (isKakaoSignup) {
        // 카카오 회원가입 처리
        await postKakaoSignup(kakaoSignupData);
      } else {
        // 일반 회원가입 처리
        await postSignUpData(signupData); // 일반 회원가입 API가 별도로 있다면 사용
      }

      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch (err) {
      alert('회원가입에 실패하였습니다.');
      console.error(err);
    }
  };

  return (
    <div className={styles.pageBackground}>
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
          <Link to="/Login" className={styles.link}>계정이 이미 있으신가요?</Link>
        </p>
    </div>

    </div>
  );
};

export default SignUp;
