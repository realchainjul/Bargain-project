// NavBar 컴포넌트 업데이트
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from '../Nav/Navbar.module.scss';

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('https://bargainus.kr/info', {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
          setNickname(response.data.email);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://bargainus.kr/logout', null, {
        withCredentials: true,
      });
      if (response.data.status) {
        setIsLoggedIn(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생', error);
    }
  };

  return (
    <header className={style.header}>
      <section className={style.service}>
        {isLoggedIn ? (
          <>
            <span>{nickname}님 환영합니다!</span>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/signup">회원가입</Link>
            <Link to="/login">로그인</Link>
          </>
        )}
      </section>
    </header>
  );
}

export default NavBar;
