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
      });

      if (response.data.status) {
        // 로그인 성공
        navigate('/home');
      } else {
        // 로그인 실패 시 서버에서 전달한 메시지 사용
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      // 서버 연결 오류 등 예외 처리
      setErrorMessage('로그인 실패: 서버 오류');
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
