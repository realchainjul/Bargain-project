import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from '../Fruits/FruitsPage.module.scss';
import { VscHeart, VscHeartFilled } from 'react-icons/vsc';

const GrainPage = () => {
  const [grains, setGrains] = useState([]); // 곡물 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 확인
  const navigate = useNavigate(); // 페이지 이동 함수

  // API 호출 및 로그인 상태 확인
  useEffect(() => {
    const fetchGrains = async () => {
      try {
        const loginResponse = await axios.get('https://api.bargainus.kr/info', { withCredentials: true });

        let user = null;
        if (loginResponse.status === 200 && loginResponse.data.nickname) {
          setIsLoggedIn(true);
          user = loginResponse.data; // 로그인한 사용자 정보 저장
        }

        // 곡물 목록 가져오기
        const response = await axios.get('https://api.bargainus.kr/category/grain', { withCredentials: true });
        if (response.status === 200) {
          // 각 상품의 likedStatus를 이용해 상태 설정
          const updatedGrains = response.data.map((grain) => ({
            ...grain,
            likedStatus: user ? grain.likedStatus : false, // 로그인한 경우 서버에서 전달받은 likedStatus 사용
          }));
          setGrains(updatedGrains);
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
        `https://api.bargainus.kr/products/${grain.productCode}/liked`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { likedStatus, message } = response.data; // 서버 응답에서 likedStatus와 메시지 추출
        alert(message); // 메시지 출력

        // grains 상태를 업데이트
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
                {/* likedStatus를 기준으로 하트 상태 표시 */}
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
