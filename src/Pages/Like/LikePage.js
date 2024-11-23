import React, { useEffect, useState } from 'react';
import style from './Like.module.scss';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { VscHeart } from 'react-icons/vsc';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import axios from 'axios';

export default function MyLike() {
  const [likes, setLikes] = useState([]); // 찜한 상품 목록
  const [page, setPage] = useState(1); // 페이지 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const limit = 10; // 한 페이지당 표시할 항목 수
  const offset = (page - 1) * limit;

  // API를 통해 찜 목록 불러오기
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get('https://api.bargainus.kr/mypage/userpage/liked', {
          withCredentials: true, // 인증 정보 포함
        });

        if (response.status === 200 && Array.isArray(response.data)) {
          console.log('찜 목록 데이터:', response.data); // 데이터 확인
          setLikes(response.data); // 데이터 저장
        } else {
          console.error('API 응답 데이터 형식이 잘못되었습니다:', response.data);
          alert('찜 목록 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('찜 목록 불러오기 오류:', error);
        alert('서버와 연결할 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  // 찜 목록에서 삭제하는 함수
  const handleDeleteLike = async (productCode) => {
    if (!window.confirm('찜 목록에서 삭제하시겠습니까?')) return;

    try {
      const response = await axios.get(
        `https://api.bargainus.kr/mypage/userpage/liked/${productCode}/delete`,
        {
          withCredentials: true,
        }
      );
      console.log('삭제 요청 응답:', response.data); // 삭제 응답 확인
      if (response.status === 200 && response.data?.status) {
        setLikes((prevLikes) => prevLikes.filter((like) => like.productCode !== productCode));
        alert(response.data.message || '삭제되었습니다.');
      } else {
        console.error('삭제 실패 응답 데이터:', response.data);
        alert(response.data?.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('찜 삭제 오류:', error);
      alert('서버와 연결할 수 없습니다.');
    }
  };

  // 로딩 상태 표시
  if (loading) {
    return <div className={style.loading}>로딩 중...</div>;
  }

  console.log('현재 찜 목록:', likes); // 렌더링 시 현재 찜 목록 확인

  // 찜 목록 UI
  return (
    <div className={style.myLike}>
      <div className={style.header}>
        <h1>찜한 상품</h1>
      </div>
      <span className={style.likeNum}>({likes.length})</span>
      <ul>
        {likes.length === 0 ? (
          <div className={style.content}>
            <VscHeart size="60" title="찜" color="lightgray" />
            <p>찜한 상품이 없습니다.</p>
          </div>
        ) : (
          likes.slice(offset, offset + limit).map((item, idx) => {
            console.log('렌더링 중 상품 데이터:', item); // 개별 상품 데이터 확인
            return (
              <li key={idx}>
                <Link to={`/${item.categoryName}/products/${item.productCode}`}>
                  <div className={style.img}>
                    <img
                      src={item.photoUrl || '/images/default.jpg'}
                      alt={item.productName || '상품 이미지'}
                    />
                  </div>
                </Link>
                <Link to={`/${item.categoryName}/products/${item.productCode}`}>
                  <div className={style.product}>
                    <p>{item.productName || '상품명 없음'}</p>
                    <span>
                      {item.price
                        ? `${Number(item.price).toLocaleString()} 원`
                        : '가격 정보 없음'}
                    </span>
                    <span>재고: {item.inventory || 0}</span>
                  </div>
                </Link>
                <div className={style.button}>
                  <Button name="삭제" onClick={() => handleDeleteLike(item.productCode)} />
                </div>
              </li>
            );
          })
        )}
      </ul>
      <div className={style.page}>
        <nav className={style.nav}>
          <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
            <MdArrowBackIosNew />
          </button>
          {Array.from({ length: Math.ceil(likes.length / limit) }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              aria-current={page === idx + 1 ? 'page' : null}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(likes.length / limit)))}
            disabled={page === Math.ceil(likes.length / limit)}
          >
            <MdArrowForwardIos />
          </button>
        </nav>
      </div>
    </div>
  );
}
