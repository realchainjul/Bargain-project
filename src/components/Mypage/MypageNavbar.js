import React from 'react';
import style from './MypageNavbar.module.scss';
import NavbarItem from '../Nav/NavbarItem.js';

export default function MypageNavbar() {
  return (
    <div className={style.mypage}>
      <h1>마이페이지</h1>
      <nav className={style.mypageNav}>
        <ul>
            <NavbarItem page={'/mypage/userpage/info'} title={'개인 정보 수정'} />
            <NavbarItem page={'/mypage/like'} title={'찜한 상품'} />
        </ul>
      </nav>
    </div>
  );
}