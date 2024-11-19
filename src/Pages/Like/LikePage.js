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
        const response = await axios.get('https://api.bargainus.kr/liked', {
          withCredentials: true, // 인증 정보 포함
        });
        if (response.status === 200) {
          setLikes(response.data);
        } else {
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
      const response = await axios.delete(`https://api.bargainus.kr/liked/${productCode}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setLikes((prevLikes) => prevLikes.filter((like) => like.product_code !== productCode));
        alert('삭제되었습니다.');
      } else {
        alert('삭제에 실패했습니다.');
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
          likes.slice(offset, offset + limit).map((item, idx) => (
            <li key={idx}>
              <Link to={`/products/${item.product_code}`}>
                <div className={style.img}>
                  <img src={item.photo_url || '/images/default.jpg'} alt={item.product_name} />
                </div>
              </Link>
              <Link to={`/products/${item.product_code}`}>
                <div className={style.product}>
                  <p>{item.product_name}</p>
                  <span>{item.product_price.toLocaleString()} 원</span>
                  <span>재고: {item.product_inventory}</span>
                </div>
              </Link>
              <div className={style.button}>
                <Button
                  name={'삭제'}
                  onClick={() => handleDeleteLike(item.product_code)}
                />
              </div>
            </li>
          ))
        )}
      </ul>
      <div className={style.page}>
        <nav className={style.nav}>
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            <MdArrowBackIosNew />
          </button>
          {Array(Math.ceil(likes.length / limit))
            .fill()
            .map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setPage(idx + 1)}
                aria-current={page === idx + 1 ? 'page' : null}
              >
                {idx + 1}
              </button>
            ))}
          <button onClick={() => setPage(page + 1)} disabled={page === Math.ceil(likes.length / limit)}>
            <MdArrowForwardIos />
          </button>
        </nav>
      </div>
    </div>
  );
}
