import React from 'react';
import { Link } from 'react-router-dom';
import { BsCart2, BsFillPersonFill } from "react-icons/bs";
import { VscHeart } from "react-icons/vsc";
import { BiSearch } from 'react-icons/bi';
import style from '../Nav/Navbar.module.scss';

function Nav({ isLoggedIn, nickname, onLogout }) {
  const [value, setValue] = React.useState('');

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

  const handleRestrictedClick = (event) => {
    event.preventDefault();
    alert('로그인 후 이용 가능합니다.');
  };

  return (
    <header className={style.header}>
      <section className={style.service}>
        {isLoggedIn ? (
          <>
            <span>{nickname}님 환영합니다!</span>
            <button onClick={onLogout} className={style.logoutButton}>
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
            {isLoggedIn ? (
              <>
                <Link to="/mypage/like" className={style.like}>
                  <VscHeart size="30" title="찜목록" />
                </Link>
                <Link to="/mypage/cart" className={style.cart}>
                  <BsCart2 size="30" title="장바구니" />
                </Link>
                <Link to="/mypage/order">
                  <BsFillPersonFill size="30" title="마이페이지" color="#a99773" />
                </Link>
              </>
            ) : (
              <>
                <a href="#" onClick={handleRestrictedClick} className={style.like}>
                  <VscHeart size="30" title="찜목록" />
                </a>
                <a href="#" onClick={handleRestrictedClick} className={style.cart}>
                  <BsCart2 size="30" title="장바구니" />
                </a>
                <a href="#" onClick={handleRestrictedClick}>
                  <BsFillPersonFill size="30" title="마이페이지" color="#a99773" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      <nav>
        <ul className={style.categories}>
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
