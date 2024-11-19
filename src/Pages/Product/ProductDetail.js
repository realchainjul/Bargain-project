import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // URL 파라미터 사용
import style from './ProductDetail.module.scss';
import Button from '../../components/common/Button';

const ProductDetail = () => {
  const { productId } = useParams(); // URL에서 productId 가져오기
  const [product, setProduct] = useState(null); // 상품 데이터 저장
  const [count, setCount] = useState(1); // 구매 수량
  const [liked, setLiked] = useState(false); // 찜 상태

  // API 호출하여 상품 상세 정보 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://api.bargainus.kr/products/${productId}`);
        if (response.status === 200) {
          setProduct(response.data); // 상품 데이터 저장
        } else {
          alert('상품 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('상품 데이터 불러오기 오류:', error);
        alert('서버와 연결할 수 없습니다.');
      }
    };

    fetchProduct();
  }, [productId]);

  // 찜하기 버튼 클릭 핸들러
  const handleLike = async () => {
    try {
      const response = await axios.post(
        'https://api.bargainus.kr//like',
        { productId: product.pcode },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.status) {
        setLiked(true); // 찜 상태 업데이트
        alert('찜한 상품에 추가되었습니다.');
      } else {
        alert('찜하기에 실패했습니다.');
      }
    } catch (error) {
      console.error('찜하기 중 오류 발생:', error.response?.data || error);
      alert('찜하기에 실패했습니다.');
    }
  };

  if (!product) {
    return <div className={style.loading}>로딩 중...</div>;
  }

  return (
    <div className={style.detail}>
      <div className={style.container}>
        {/* 이미지 영역 */}
        <div className={style.imgarea}>
          <img
            src={product.photo || '/images/default.jpg'} // 대표 이미지
            alt={product.name}
            className={style.mainImage}
          />
          <div className={style.commentPhotos}>
            {product.productPhotos.map((photo) => (
              <img
                key={photo.photoId}
                src={photo.photoUrl}
                alt="상세 이미지"
                className={style.detailImage}
              />
            ))}
          </div>
        </div>

        {/* 상품 정보 영역 */}
        <div className={style.menu}>
          <div className={style.info}>
            <h1>{product.name}</h1>
            <p className={style.price}>{Number(product.price).toLocaleString()} 원</p>
            <p className={style.description}>{product.comment}</p>
          </div>
          <div className={style.total}>
            <div className={style.countwrap}>
              <p>구매 수량</p>
              <div className={style.count}>
                <button
                  onClick={() => setCount((prev) => (prev > 1 ? prev - 1 : prev))}
                >
                  -
                </button>
                <p>{count}</p>
                <button onClick={() => setCount((prev) => prev + 1)}>+</button>
              </div>
            </div>
            <div className={style.totalprice}>
              <p>총 상품 금액</p>
              <p>{(Number(product.price) * count).toLocaleString()} 원</p>
            </div>
          </div>
          <div className={style.actions}>
            <Button name="장바구니" className={style.cart} />
            <Button name="구매하기" isBrown={true} />
            <Button
              name={liked ? '찜완료' : '찜하기'}
              onClick={handleLike}
              disabled={liked}
              isPurple={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
