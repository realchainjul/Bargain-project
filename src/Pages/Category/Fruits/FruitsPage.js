import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './FruitsPage.module.scss';
import { VscHeart } from 'react-icons/vsc';

const FruitsPage = () => {
  const [fruits, setFruits] = useState([]); // 과일 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [likedItems, setLikedItems] = useState([]); // 찜한 상품 목록
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const navigate = useNavigate(); // 페이지 이동 함수

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('https://api.bargainus.kr/info', { withCredentials: true });
        if (response.status === 200 && response.data.nickname) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // API 호출
  useEffect(() => {
    const fetchFruits = async () => {
      try {
        const response = await axios.get('https://api.bargainus.kr/category/fruits');
        if (response.status === 200) {
          setFruits(response.data); // 데이터 저장
        } else {
          alert('과일 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('과일 데이터 불러오기 오류:', error);
        alert('서버와 연결할 수 없습니다.');
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchFruits();
  }, []);

  // 찜 버튼 클릭 핸들러
  const handleLike = async (fruit) => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login'); // 로그인 페이지로 이동
      return;
    }

    try {
      // 찜 추가/삭제 요청
      const response = await axios.get(
        `https://api.bargainus.kr/products/${fruit.pcode}/liked`,
        {},
        { withCredentials: true } // 인증 정보 포함
      );
  
      if (response.status === 200) {
        const { likedStatus, message } = response.data;
  
        if (likedStatus) {
          // 찜 추가
          alert(`${fruit.name}이(가) 찜 목록에 추가되었습니다.`);
          setLikedItems((prev) => [...prev, fruit.pcode]); // 찜한 상품 ID 추가
        } else {
          // 찜 삭제
          alert(`${fruit.name}이(가) 찜 목록에서 삭제되었습니다.`);
          setLikedItems((prev) => prev.filter((id) => id !== fruit.pcode)); // 찜한 상품 ID 삭제
        }
      } else {
        alert('찜 목록 갱신에 실패했습니다.');
      }
    } catch (error) {
      console.error('찜 추가/삭제 오류:', error);
      alert('서버와 연결할 수 없습니다.');
    }
  };

  if (loading) {
    return <div className={style.loading}>로딩 중...</div>;
  }

  return (
    <div className={style.fruitsPage}>
      <h1>과일</h1>
      <div className={style.fruitsList}>
        {fruits.map((fruit) => (
          <div key={fruit.pcode} className={style.fruitCard}>
            <img
              src={fruit.photo || '/images/default.jpg'} // 이미지가 없을 경우 기본 이미지 사용
              alt={fruit.name}
              className={style.fruitImage}
              onClick={() => navigate(`/fruits/products/${fruit.pcode}`)} // 상세 페이지로 이동
            />
            <div className={style.fruitInfo}>
              <h2>{fruit.name}</h2>
              <p>{Number(fruit.price).toLocaleString()} 원</p>
              <button
                className={`${style.likeButton} ${
                  likedItems.includes(fruit.pcode) ? style.liked : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
                  handleLike(fruit);
                }}
              >
                <VscHeart size="20" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FruitsPage;
