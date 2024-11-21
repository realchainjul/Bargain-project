import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from '../Fruits/FruitsPage.module.scss';
import { VscHeart, VscHeartFilled } from 'react-icons/vsc';

const GrainPage = () => {
  const [grains, setGrains] = useState([]); // 곡물 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const navigate = useNavigate(); // 페이지 이동 함수

  // 로그인 상태 확인
  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('https://api.bargainus.kr/info', { withCredentials: true });
      if (response.status === 200 && response.data.nickname) {
        setIsLoggedIn(true); // 로그인 상태 저장
      }
    } catch (error) {
      console.warn('로그인 상태 확인 실패:', error);
      setIsLoggedIn(false); // 로그인 상태 없음
    }
  };

  // 곡물 데이터 불러오기
  const fetchGrains = async () => {
    try {
      const response = await axios.get('https://api.bargainus.kr/category/grain');
      if (response.status === 200) {
        setGrains(response.data);
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

  useEffect(() => {
    checkLoginStatus(); // 로그인 상태 확인
    fetchGrains(); // 곡물 데이터 로드
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
        `https://api.bargainus.kr/products/${grain.productCode}/liked`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { likedStatus, message } = response.data; // 서버 응답에서 likedStatus와 메시지 추출
        alert(message); // 메시지 출력

        // likedStatus 업데이트
        setGrains((prevGrains) =>
          prevGrains.map((item) =>
            item.productCode === grain.productCode ? { ...item, likedStatus } : item
          )
        );
      }
    } catch (error) {
      console.error('찜 요청 오류:', error);
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
      } else {
        alert('서버와 연결할 수 없습니다.');
      }
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
          <div key={grain.productCode} className={style.fruitCard}>
            <img
              src={grain.photoUrl || '/images/default.jpg'} // 이미지가 없을 경우 기본 이미지 사용
              alt={grain.productName}
              className={style.fruitImage}
              onClick={() => navigate(`/grain/products/${grain.productCode}`)} // 상세 페이지로 이동
            />
            <div className={style.fruitInfo}>
              <h2>{grain.productName}</h2>
              <p>{Number(grain.price).toLocaleString()} 원</p>
              <button
                className={style.likeButton}
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
                  handleLike(grain);
                }}
              >
                {grain.likedStatus ? (
                  <VscHeartFilled size="20" style={{ color: '#ff4757' }} />
                ) : (
                  <VscHeart size="20" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrainPage;
