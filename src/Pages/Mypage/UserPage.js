import React from 'react';
import { Outlet } from 'react-router-dom';
import MypageNavbar from '../../components/Mypage/MypageNavbar';
import style from './UserPage.module.scss';

function UserPage() {
  return (
    <div className={style.mypage}>
      <MypageNavbar />
      <div className={style.mypageOutlet}>
        <Outlet />
      </div>
    </div>
  );
}

export default UserPage;