import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import style from './ProductDetail.module.scss';
import { VscHeart } from 'react-icons/vsc';
import Button from '../../components/common/Button';

const ProductDetailG = () => {
  const { id } = useParams(); // URL에서 상품 ID 가져오기
  const [product, setProduct] = useState(null); // 상품 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [count, setCount] = useState(1); // 구매 수량

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://api.bargainus.kr/grain/products/${id}`);
        if (response.status === 200) {
          setProduct(response.data); // 데이터 저장
        } else {
          alert('상품 정보를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('상품 정보 불러오기 오류:', error);
        alert('서버와 연결할 수 없습니다.');
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className={style.loading}>로딩 중...</div>;
  }

  if (!product) {
    return <div className={style.error}>상품 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={style.detail}>
      <div className={style.container}>
        {/* 이미지 영역 */}
        <div className={style.imgarea}>
          {/* 대표 이미지 */}
          <img
            src={product.photo || '/images/default.jpg'} // 대표 이미지
            alt={product.name}
            className={style.productImage}
          />
          <p className={style.desc}>{product.comment}</p>
          {/* 상세 이미지 */}
          <div className={style.detailImages}>
            {product.productPhotos && product.productPhotos.length > 0 ? (
              product.productPhotos.map((photo) => (
                <img
                  key={photo.photoId}
                  src={photo.photoUrl}
                  alt={`${product.name} 상세 이미지`}
                  className={style.detailImage}
                />
              ))
            ) : (
              <p>상세 이미지가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 상품 정보 영역 */}
        <div className={style.menu}>
        <div className={style.info}>
          <div>
            <h2 className={style.title}>{product.name}</h2>
            <p className={style.price}>{Number(product.price).toLocaleString()} 원</p>
          </div>
          <button
            className={style.likeButton}
            onClick={() => alert('찜 목록에 추가되었습니다!')}
          >
            <VscHeart />
          </button>
        </div>

          <div className={style.total}>
            <div className={style.countwrap}>
              <p>구매 수량</p>
              {/* 수량 선택 */}
              <div className={style.count}>
                <button
                  onClick={() => setCount(count > 1 ? count - 1 : 1)}
                >
                  -
                </button>
                <p>{count}</p>
                <button
                  onClick={() => setCount(count + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className={style.totalprice}>
              <p>총 상품 금액</p>
              <p>{(product.price * count).toLocaleString()} 원</p>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className={style.button}>
            {product.inventory === 0 ? (
              <Button name="품절" className={style.soldout} disabled={true} />
            ) : (
              <>
                <Button name="장바구니" onClick={() => alert('장바구니에 추가되었습니다!')} />
                <Button name="구매하기" isBrown={true} onClick={() => alert('구매 페이지로 이동합니다.')} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailG;
