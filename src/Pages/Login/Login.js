import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/common/Button';
import style from './Login.module.scss';

function Login({ setIsLoggedIn, setNickname }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://api.bargainus.kr/login', { email, password }, { withCredentials: true });
      if (response.data.status) {
        alert('로그인 성공!');
        // /info 호출하여 사용자 상태를 즉시 업데이트
        const userInfoResponse = await axios.get('https://api.bargainus.kr/info', { withCredentials: true });
        setIsLoggedIn(true);
        setNickname(userInfoResponse.data.nickname);
        navigate('/');
      } else {
        setErrorMessage('로그인 실패: ' + response.data.message);
      }
    } catch (error) {
      setErrorMessage('서버 오류 발생');
    }
  };

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
            <Button name="로그인" type="submit" isBrown={true} />
            <Button name="회원가입" onClick={() => navigate('/signup')} />
          </section>
        </form>
      </section>
    </section>
  );
}

export default Login;

