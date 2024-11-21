import React from 'react';
import BannerMain from '../../components/Home/BannerMain/BannerMain';
import BannerSub from '../../components/Home/BannerSub/BannerSub';
import MainDisplay from '../../components/Home/MainDisplay/MainDisplay';


function Home() {
  return (
    <div>
      <BannerMain />
      <BannerSub />
      <MainDisplay endpoint="fruits" name="지금 먹기 딱 좋은 과일 🍎" />
      <MainDisplay endpoint="vegetable" name="건강한 채소의 향연 🥗" />
      <MainDisplay endpoint="grain" name="영양 가득한 곡물 🌾" />

    </div>
  );
}

export default Home;