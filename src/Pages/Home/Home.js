import React from 'react';

import BannerMain from '../../components/Home/BannerMain/BannerMain';
import BannerSub from '../../components/Home/BannerSub/BannerSub';

//bannersub아래에 maindisplay 추가 예정입니다

function Home() {
  return (
    <div>
      <BannerMain />
      <BannerSub />
    </div>
  );
}

export default Home;