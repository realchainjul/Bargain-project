import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from '../Fruits/FruitsPage.module.scss';
import { VscHeart } from 'react-icons/vsc';

const GrainPage = () => {
  const [grains, setGrains] = useState([]); // 곡물 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [likedItems, setLikedItems] = useState([]); // 찜한 상품 목록
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 확인
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
    const fetchGrains = async () => {
      try {
        const response = await axios.get('https://api.bargainus.kr/category/grain');
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
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login'); // 로그인 페이지로 이동
      return;
    }

    try {
      const response = await axios.get(
        `https://api.bargainus.kr/products/${grain.pcode}/liked`, // 변경된 주소
        { withCredentials: true } // 인증 정보 포함
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
    <div className={style.fruitsPage}>
      <h1>곡물</h1>
      <div className={style.fruitsList}>
        {grains.map((grain) => (
          <div key={grain.pcode} className={style.fruitCard}>
            <img
              src={grain.photo || '/images/default.jpg'}
              alt={grain.name}
              className={style.fruitImage}
              onClick={() => navigate(`/grain/products/${grain.pcode}`)} // 상세 페이지로 이동
            />
            <div className={style.fruitInfo}>
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
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrainPage;
