import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './FruitsPage.module.scss';
import { VscHeart } from 'react-icons/vsc';

const FruitsPage = () => {
  const [fruits, setFruits] = useState([]); // 과일 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [likedItems, setLikedItems] = useState([]); // 찜한 상품 목록
  const navigate = useNavigate(); // 페이지 이동 함수

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
    try {
      const response = await axios.post(
        'https://api.bargainus.kr/liked',
        { product_code: fruit.pcode },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert(`${fruit.name}이(가) 찜 목록에 추가되었습니다!`);
        setLikedItems((prev) => [...prev, fruit.pcode]); // 찜한 상품 ID 저장
      } else {
        alert('찜 목록 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('찜 추가 오류:', error);
      alert('서버와 연결할 수 없습니다.');
    }
  };

  if (loading) {
    return <div className={style.loading}>로딩 중...</div>;
  }

  return (
    <div className={style.fruitsPage}>
      <h1>과일 목록</h1>
      <div className={style.fruitsList}>
        {fruits.map((fruit) => (
          <div key={fruit.pcode} className={style.fruitCard}>
            <img
              src={fruit.photo || '/images/default.jpg'} // 이미지가 없을 경우 기본 이미지 사용
              alt={fruit.name}
              className={style.fruitImage}
              onClick={() => navigate(`/products/${fruit.pcode}`)} // 상품 클릭 시 상세 페이지로 이동
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
                {likedItems.includes(fruit.pcode) ? '찜 완료' : '찜하기'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FruitsPage;
