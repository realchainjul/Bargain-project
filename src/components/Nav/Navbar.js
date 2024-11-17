import React from 'react';
import { Link } from 'react-router-dom';
import { BsCart2, BsFillPersonFill } from 'react-icons/bs';
import { VscHeart } from 'react-icons/vsc';
import { BiSearch } from 'react-icons/bi';
import style from '../Nav/Navbar.module.scss';

function Nav({ isLoggedIn, nickname, onLogout }) {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/search/${searchValue}`;
      setSearchValue('');
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
            <span className={style.welcomeText}>{nickname}님 환영합니다!</span>
            <span className={style.separator}>|</span>
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
            <form onSubmit={handleSearchSubmit}>
              <input
                id="search-input"
                className={style.searchInput}
                type="text"
                value={searchValue}
                placeholder="검색어를 입력해 주세요"
                onChange={handleSearchChange}
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
                <Link to="/mypage/user">
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
            <Link to="/mypage/userpage">과일</Link>
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
