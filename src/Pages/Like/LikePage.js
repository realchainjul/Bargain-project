import React, { useState } from 'react';
import style from './Like.module.scss';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { VscHeart } from 'react-icons/vsc';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';

export default function MyLike() {
  // 더미 데이터로 찜한 상품 목록 초기화
  const [likes, setLikes] = useState([
    {
      product_code: '12345',
      product_name: '사과',
      product_price: 1000,
      product_inventory: 50,
      photo_url: 'https://via.placeholder.com/150',
    },
    {
      product_code: '67890',
      product_name: '바나나',
      product_price: 2000,
      product_inventory: 30,
      photo_url: 'https://via.placeholder.com/150',
    },
    // 더미 데이터 추가 가능
  ]);

  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;

  // 찜 목록에서 삭제하는 함수 (UI에서만 삭제)
  const handleDeleteLike = (productCode) => {
    if (window.confirm('찜 목록에서 삭제하시겠습니까?')) {
      setLikes((prevLikes) => prevLikes.filter((like) => like.product_code !== productCode));
      alert('삭제되었습니다.');
    }
  };

  const numPages = Math.ceil(likes.length / limit);

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
                  <img src={item.photo_url} alt={item.product_name} />
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
          {Array(numPages)
            .fill()
            .map((_, idx) => {
              return (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  aria-current={page === idx + 1 ? 'page' : null}
                >
                  {idx + 1}
                </button>
              );
            })}
          <button onClick={() => setPage(page + 1)} disabled={page === numPages}>
            <MdArrowForwardIos />
          </button>
        </nav>
      </div>
    </div>
  );
}
