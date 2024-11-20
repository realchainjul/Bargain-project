import React from 'react';
import style from './BannerSub.module.scss';
import { Swiper, SwiperSlide } from "swiper/react"; // basic
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/scss"; //basic
import "swiper/scss/pagination";
import "swiper/scss/navigation";

//일단 ssg 이미지 가져옴 쿼리스트링 이용해서 주소 생성 예정

function BannerSub() {
  return (
    <div className={style.banner_m}>
    <div className={style.title}>     
      <h1>이 상품 어때요?</h1>
    </div>
    <Swiper
      className={style.swiper}
      modules = {[Pagination, Autoplay]}
      pagination={{ clickable : true }}
      loop={true} 
      autoplay={{ delay: 4000 }} 
      spaceBetween={70} 
      slidesPerView={4} 
      style={{
        "--swiper-navigation-color": "#383810",
        "--swiper-navigation-size": "40px",
        "--swiper-pagination-color": "#383810"
      }}
      breakpoints= {{
        1800:{
          slidesPerView:5,             
          },
        1320:{
          slidesPerView:3,             
          },
        1024:{
          slidesPerView:2,             
          },
        0:{
          slidesPerView:1, 
          }
      }}
    >
    <SwiperSlide className={style.slide}>
      <a href="/products/">
      <img src="https://simg.ssgcdn.com/trans.ssg?src=/cmpt/edit/202308/25/102023082510093441532622051362_311.jpg&w=830&t=1628eb8b2e70902dd202390929a85760019ef967" alt="" className={style.image}/>
      </a>
      </SwiperSlide>
      <SwiperSlide className={style.slide}>
      <a href="/products/">
      <img src="https://simg.ssgcdn.com/trans.ssg?src=/cmpt/edit/202310/30/102023103010005247000232354023_79.jpg&w=830&t=2aaec7bd5e1780e1de79f9e06a8a141e8fb2b5cd" alt="" className={style.image}/>
      </a>
      </SwiperSlide>
      <SwiperSlide className={style.slide}>
      <a href="/fruits/products/12">
      <img src="https://simg.ssgcdn.com/trans.ssg?src=/cmpt/edit/202303/29/102023032910151010083953051495_975.jpg&w=830&t=ee7048857c2106150c3abdbd8cf9ac683a5c17a7" alt="" className={style.image}/>
      </a>
      </SwiperSlide>
      <SwiperSlide className={style.slide}>
      <a href="/products/">
      <img src="https://simg.ssgcdn.com/trans.ssg?src=/cmpt/edit/202106/02/102021060210585754099601492070_651.jpg&w=830&t=836a50f58379c27c4fbf6e5c12e00e4688ee44e6" alt="" className={style.image}/>
      </a>
      </SwiperSlide>
      <SwiperSlide className={style.slide}>
      <a href="/grain/products/6">
      <img src="https://simg.ssgcdn.com/trans.ssg?src=/cmpt/edit/202405/16/132024051613284001788369076936_579.jpg&w=830&t=734c7a1c0fd519916a1310e70db19b19397a767e" alt="" className={style.image}/>
      </a>
      </SwiperSlide>
      <SwiperSlide className={style.slide}>
      <a href="/products/">
      <img src="https://simg.ssgcdn.com/trans.ssg?src=/cmpt/edit/202210/28/132022102813350461873667312466_219.jpg&w=830&t=482ce5a5aa2d7fcbb63ee28751e1cd1013c3f021" alt="" className={style.image}/>
      </a>
      </SwiperSlide>
    </Swiper>
    </div>
  );
}

export default BannerSub;