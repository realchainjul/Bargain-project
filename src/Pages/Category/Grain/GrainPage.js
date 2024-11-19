import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from '../Fruits/FruitsPage.module.scss';
import { VscHeart } from 'react-icons/vsc';

const GrainPage = () => { // GrainPage로 이름 변경
  const [grains, setGrains] = useState([]); // 곡물 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [likedItems, setLikedItems] = useState([]); // 찜한 상품 목록
  const navigate = useNavigate(); // 페이지 이동 함수

  // API 호출
  useEffect(() => {
    const fetchGrains = async () => { // 함수 이름 변경
      try {
        const response = await axios.get('https://api.bargainus.kr/category/grain'); // URL에서 grain 사용
        if (response.status === 200) {
          setGrains(response.data); // 데이터 저장
        } else {
          alert('곡물 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('곡물 데이터 불러오기 오류:', error);
        alert('서버와 연결할 수 없습니다.');
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchGrains();
  }, []);

  // 찜 버튼 클릭 핸들러
  const handleLike = async (grain) => {
    try {
      const response = await axios.post(
        'https://api.bargainus.kr/liked',
        { product_code: grain.pcode },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert(`${grain.name}이(가) 찜 목록에 추가되었습니다!`);
        setLikedItems((prev) => [...prev, grain.pcode]); // 찜한 상품 ID 저장
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
    <div className={style.fruitsPage}> {/* 클래스 이름 변경 */}
      <h1>곡물</h1>
      <div className={style.fruitsList}> {/* 클래스 이름 변경 */}
        {grains.map((grain) => ( // grains로 변수 이름 변경
          <div key={grain.pcode} className={style.fruitCard}> {/* 클래스 이름 변경 */}
            <img
              src={grain.photo || '/images/default.jpg'} // 이미지가 없을 경우 기본 이미지 사용
              alt={grain.name}
              className={style.fruitImage} // 클래스 이름 변경
              onClick={() => navigate(`/grain/products/${grain.pcode}`)} // 경로에 grains 사용
            />
            <div className={style.fruitInfo}> {/* 클래스 이름 변경 */}
              <h2>{grain.name}</h2>
              <p>{Number(grain.price).toLocaleString()} 원</p>
              <button
                className={`${style.likeButton} ${
                  likedItems.includes(grain.pcode) ? style.liked : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
                  handleLike(grain);
                }}
              >
                <VscHeart size="20" />
                {likedItems.includes(grain.pcode) ? '찜 완료' : '찜하기'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrainPage;
