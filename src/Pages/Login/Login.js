import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import style from './Login.module.scss';

//버튼만 만들어둠 연결은 나중에

function Login() {
  const navigate = useNavigate();

  // 버튼 정보 배열
  const buttons = [
    {
      type: 'submit',
      name: '로그인',
      form: 'login',
      className: style.loginButton,
      isBrown: true,
      onClick: null,
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
        <form id="login" className={style.login_container_inputForm}>
          <input
            type="text"
            name="email"
            className={style.input}
            placeholder="이메일을 입력해 주세요"
          />
          <input
            type="password"
            name="password"
            className={style.input}
            placeholder="비밀번호를 입력해 주세요"
          />
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
