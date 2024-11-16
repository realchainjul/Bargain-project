import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/common/Button';
import style from './Login.module.scss';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://api.bargainus.kr/login', null, {
        params: {
          email,
          password,
        },
        withCredentials: true, // 세션 쿠키를 받기 위해 설정
      });
      
      if (response.data.status) {
        // 로그인 성공 시
        navigate('/'); // 메인 화면으로 이동
      } else {
        // 로그인 실패 시 오류 메시지 설정
        setErrorMessage(response.data.message || '이메일 또는 비밀번호를 확인하세요.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '서버 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://api.bargainus.kr/logout', null, {
        withCredentials: true, // 세션 쿠키를 사용하기 위해 설정
      });
      if (response.data.status) {
        // 로그아웃 성공 시 로그인 페이지로 이동
        navigate('/login');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생', error);
    }
  };

  const buttons = [
    {
      type: 'submit',
      name: '로그인',
      className: style.loginButton,
      isBrown: true,
    },
    {
      name: '회원가입',
      onClick: () => navigate('/signup'),
    },
  ];

  return (
    <section className={style.login}>
      <h1>로그인</h1>
      <section className={style.login_container}>
        <form id="login" className={style.login_container_inputForm} onSubmit={handleLogin}>
          <input
            type="text"
            name="email"
            className={style.input}
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            className={style.input}
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p className={style.error}>{errorMessage}</p>}
          <section className={style.login_container_buttonSection}>
            {buttons.map((buttonProps, index) => (
              <Button key={index} {...buttonProps} />
            ))}
          </section>
        </form>
      </section>
    </section>
  );
}

export default Login;