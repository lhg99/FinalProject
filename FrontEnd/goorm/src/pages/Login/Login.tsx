import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import { useAuth } from './auth/AuthContext';

interface LoginFormInputs {
  loginId: string;
  loginPw: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const navigate = useNavigate();
  const { login } = useAuth();

  const submitForm = async (data: LoginFormInputs) => {
    const { loginId, loginPw } = data;

    try {
      await login({ loginId, loginPw });
      navigate('/main');
    } catch (error: any) {
      console.error('로그인에 실패했습니다:', error);
      alert(error.response?.data || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>로그인</h2>

      <form onSubmit={handleSubmit(submitForm)}>
        <div className={styles.formGroup}>
          <label htmlFor="loginId">아이디</label>
          <input
            type="text"
            id="loginId"
            {...register('loginId', { required: '아이디를 입력하세요' })}
          />
          {errors.loginId && <p>{errors.loginId.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="loginPw">비밀번호</label>
          <input
            type="password"
            id="loginPw"
            {...register('loginPw', { required: '비밀번호를 입력하세요' })}
          />
          {errors.loginPw && <p>{errors.loginPw.message}</p>}
        </div>

        <button className={styles.button} type="submit">
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
