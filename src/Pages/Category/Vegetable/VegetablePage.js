import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from '../Fruits/FruitsPage.module.scss';
import { VscHeart } from 'react-icons/vsc';

const VegetablePage = () => {
  const [vegetables, setVegetables] = useState([]); // 채소 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [likedItems, setLikedItems] = useState([]); // 찜한 상품 목록
  const navigate = useNavigate(); // 페이지 이동 함수

  // API 호출
  useEffect(() => {
    const fetchVegetables = async () => {
      try {
        const response = await axios.get('https://api.bargainus.kr/category/vegetable'); // vegetable URL
        if (response.status === 200) {
          setVegetables(response.data); // 데이터 저장
        } else {
          alert('채소 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('채소 데이터 불러오기 오류:', error);
        alert('서버와 연결할 수 없습니다.');
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchVegetables();
  }, []);

  // 찜 버튼 클릭 핸들러
  const handleLike = async (vegetable) => {
    try {
      const response = await axios.post(
        `https://api.bargainus.kr/products/${vegetable.pcode}/liked`, // 변경된 주소
        null, // POST 요청에 추가 데이터를 보낼 필요가 없으면 null로 설정
        { withCredentials: true } // 인증 정보 포함
      );
      if (response.status === 200) {
        alert(`${vegetable.name}이(가) 찜 목록에 추가되었습니다!`);
        setLikedItems((prev) => [...prev, vegetable.pcode]); // 찜한 상품 ID 저장
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
      <h1>채소</h1>
      <div className={style.fruitsList}>
        {vegetables.map((vegetable) => (
          <div key={vegetable.pcode} className={style.fruitCard}>
            <img
              src={vegetable.photo || '/images/default.jpg'} // 이미지가 없을 경우 기본 이미지 사용
              alt={vegetable.name}
              className={style.fruitImage}
              onClick={() => navigate(`/vegetable/products/${vegetable.pcode}`)} // 상세 페이지로 이동
            />
            <div className={style.fruitInfo}>
              <h2>{vegetable.name}</h2>
              <p>{Number(vegetable.price).toLocaleString()} 원</p>
              <button
                className={`${style.likeButton} ${
                  likedItems.includes(vegetable.pcode) ? style.liked : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
                  handleLike(vegetable);
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

export default VegetablePage;
