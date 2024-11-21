import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './FruitsPage.module.scss';
import { VscHeart, VscHeartFilled } from 'react-icons/vsc';

const FruitsPage = () => {
  const [fruits, setFruits] = useState([]); // 과일 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const navigate = useNavigate(); // 페이지 이동 함수

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('https://api.bargainus.kr/info', {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.nickname) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('로그인 상태 확인 실패:', error);
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
          setFruits(response.data); // 과일 데이터 저장
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
      const response = await axios.get(
        `https://api.bargainus.kr/products/${fruit.productCode}/liked`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { likedStatus, message } = response.data; // 서버 응답에서 likedStatus와 메시지 추출
        alert(message); // 메시지 출력

        // 상태 변경: likedStatus가 변경된 값을 반영
        setFruits((prevFruits) =>
          prevFruits.map((item) =>
            item.productCode === fruit.productCode
              ? { ...item, likedStatus } // likedStatus 업데이트
              : item
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
      <h1>과일</h1>
      <div className={style.fruitsList}>
        {fruits.map((fruit) => (
          <div key={fruit.productCode} className={style.fruitCard}>
            <img
              src={fruit.photoUrl || '/images/default.jpg'} // 이미지가 없을 경우 기본 이미지 사용
              alt={fruit.productName}
              className={style.fruitImage}
              onClick={() => navigate(`/fruits/products/${fruit.productCode}`)} // 상세 페이지로 이동
            />
            <div className={style.fruitInfo}>
              <h2>{fruit.productName}</h2>
              <p>{Number(fruit.price).toLocaleString()} 원</p>
              <button
                className={style.likeButton}
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
                  handleLike(fruit);
                }}
              >
                {/* likedStatus를 기준으로 하트 상태 표시 */}
                {fruit.likedStatus ? (
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

export default FruitsPage;
