import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './ProductDetail.module.scss';
import Button from '../../components/common/Button';

const ProductDetailG = () => {
  const { id } = useParams(); // URL에서 상품 ID 가져오기
  const [product, setProduct] = useState(null); // 상품 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [count, setCount] = useState(1); // 구매 수량
  const [liked, setLiked] = useState(false); // 찜 여부
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

  // 상품 데이터 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://api.bargainus.kr/grain/products/${id}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setProduct(response.data); // 데이터 저장
          setLiked(response.data.likedStatus); // 초기 찜 상태 설정
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

  // 찜 버튼 클릭 핸들러
  const handleLike = async () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login'); // 로그인 페이지로 이동
      return;
    }

    try {
      const response = await axios.get(
        `https://api.bargainus.kr/products/${product.pcode}/liked`, // pcode로 수정
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { likedStatus, message } = response.data; // 서버 응답에서 likedStatus와 메시지 추출
        alert(message); // 서버 메시지 출력
        setLiked(likedStatus); // 찜 상태 업데이트
      } else {
        alert('요청을 처리하지 못했습니다.');
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

  // 장바구니 추가 핸들러
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login'); // 로그인 페이지로 이동
      return;
    }

    if (!product?.pcode) {
      console.error('Invalid product code');
      alert('유효하지 않은 상품입니다.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('productCode', product.pcode); // 상품 코드
      formData.append('count', count); // 구매 수량

      const response = await axios.post(
        `https://api.bargainus.kr/products/${product.pcode}/bucket/add`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message || '장바구니에 추가되었습니다.');
        navigate('/mypage/cart'); // 장바구니 페이지로 이동
      }
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      alert('장바구니 추가 중 문제가 발생했습니다.');
    }
  };

  // 구매하기 버튼 핸들러
  const handleBuyNow = () => {
    navigate('/mypage/cart'); // 구매하기 클릭 시 장바구니 페이지로 이동
  };

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
          <img
            src={product.photo || '/images/default.jpg'}
            alt={product.name}
            className={style.productImage}
          />
          <p className={style.desc}>{product.comment}</p>
          <div className={style.detailImages}>
            {product.productPhotos && product.productPhotos.length > 0 ? (
              product.productPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={typeof photo === 'string' ? photo : photo.photoUrl}
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
          <div className={style.zzim}>
            <div>
              <h2 className={style.title}>{product.name}</h2>
              <p className={style.price}>{Number(product.price).toLocaleString()} 원</p>
            </div>
          </div>

          <div className={style.total}>
            <div className={style.countwrap}>
              <p>구매 수량</p>
              <div className={style.count}>
                <button onClick={() => setCount(count > 1 ? count - 1 : 1)}>-</button>
                <p>{count}</p>
                <button onClick={() => setCount(count + 1)}>+</button>
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
                <Button name="장바구니" onClick={handleAddToCart} />
                <Button name="구매하기" isBrown={true} onClick={handleBuyNow} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailG;
