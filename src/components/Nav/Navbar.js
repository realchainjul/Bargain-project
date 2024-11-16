import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCart2, BsFillPersonFill } from "react-icons/bs";
import { VscHeart } from "react-icons/vsc";
import { BiSearch } from 'react-icons/bi';
import axios from 'axios';
import style from '../Nav/Navbar.module.scss';

function Nav() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    // 로그인 상태 확인
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('https://bargainus.kr/info', {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
          setNickname(response.data.email); // 서버에서 닉네임이 아닌 이메일을 반환하는 경우
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (value.trim()) {
      window.location.href = `/search/${value}`;
      setValue('');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://bargainus.kr/logout', null, {
        withCredentials: true,
      });
      if (response.data.status) {
        localStorage.removeItem('token');
        localStorage.removeItem('nickname');
        setIsLoggedIn(false);
        setNickname('');
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
            <button onClick={handleLogout} className={style.logoutButton}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">회원가입</Link>
            <Link to="/login">로그인</Link>
          </>
        )}
      </section>
      <div className={style.navbar}>
        <div className={style.search}>
          <Link to="/" className={style.logoLink}>
            <img className={style.logo} src="/images/logo.png" alt="logo" />
            <h1 className={style.title}>Bargain</h1>
          </Link>
          <div className={style.inputWrap}>
            <form onSubmit={handleSubmit}>
              <input
                id="search-input"
                className={style.searchInput}
                type="text"
                value={value}
                placeholder="검색어를 입력해 주세요"
                onChange={handleChange}
              />
              <button className={style.searchBtn} type="submit" aria-label="search">
                <BiSearch size="24" color="#a99773" />
              </button>
            </form>
          </div>
          <div className={style.links}>
            <Link to="/mypage/like" className={style.like}>
              <VscHeart size="30" title="찜목록" />
            </Link>
            <Link to="/mypage/cart" className={style.cart}>
              <BsCart2 size="30" title="장바구니" />
            </Link>
            <Link to="/mypage/order">
              <BsFillPersonFill size="30" title="마이페이지" color="#a99773" />
            </Link>
          </div>
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/category/fruits">과일</Link>
          </li>
          <li>
            <Link to="/category/vegetable">채소</Link>
          </li>
          <li>
            <Link to="/category/grain">곡물</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Nav;
