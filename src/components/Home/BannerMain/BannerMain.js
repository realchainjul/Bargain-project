import React from 'react';
import style from './BannerMain.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react'; // basic
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css'; //basic
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

 function BannerMain() {
  return (
    <div className={style.banner}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        loop={true} // 루프 슬라이드
        autoplay={{ delay: 4000 }} // 자동 슬라이드
        spaceBetween={0} // 슬라이드간의 간격
        slidesPerView={1} // 한 번에 보여지는 슬라이드 개수
        style={{
          '--swiper-navigation-color': '#383810',
          '--swiper-pagination-color': '#383810',
        }}
      >
        <SwiperSlide className={style.slide}>
          <a href="/products/#">
            <img src="/images/main-banner-02.png" alt="" className={style.image} />
          </a>
        </SwiperSlide>
        <SwiperSlide className={style.slide}>
          <a href="/products/#">
            <img src="/images/main-banner-01.png" alt="" className={style.image} />
          </a>
        </SwiperSlide>
        <SwiperSlide className={style.slide}>
          <a href="/products/#">
            <img src="/images/main-banner-02.png" alt="" className={style.image} />
          </a>
        </SwiperSlide>
        <SwiperSlide className={style.slide}>
          <a href="products/#">
            <img src="/images/main-banner-01.png" alt="" className={style.image} />
          </a>
        </SwiperSlide>
        <SwiperSlide className={style.slide}>
          <a href="/products/#">
            <img src="/images/main-banner-02.png" alt="" className={style.image} />
          </a>
        </SwiperSlide>
        <SwiperSlide className={style.slide}>
          <a href="/products/#">
            <img src="/images/main-banner-01.png" alt="" className={style.image} />
          </a>
        </SwiperSlide>
        <SwiperSlide className={style.slide}>
          <a href="/products/#">
            <img src="/images/main-banner-02.png" alt="" className={style.image} />
          </a>
        </SwiperSlide>
        <SwiperSlide className={style.slide}>
          <a href="/products/#">
            <img src="/images/main-banner-01.png" alt="" className={style.image} />
          </a>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default BannerMain;