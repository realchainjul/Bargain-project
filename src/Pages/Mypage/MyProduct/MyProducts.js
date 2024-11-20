import React, { useEffect, useState } from 'react';
import style from './MyProducts.module.scss';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import axios from 'axios';

const MyProducts = () => {
  const [products, setProducts] = useState([]); // 상품 목록
  const [page, setPage] = useState(1); // 페이지 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const limit = 10; // 페이지당 상품 개수
  const offset = (page - 1) * limit;

  // 상품 목록 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://api.bargainus.kr/mypage/userpage/products', {
          withCredentials: true, // 인증 정보 포함
        });

        if (response.status === 200 && response.data.status) {
          setProducts(response.data.products); // 상품 데이터 저장
        } else {
          alert('상품 목록을 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('상품 데이터 가져오기 오류:', error);
        alert('서버와 연결할 수 없습니다.');
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchProducts();
  }, []);

  // 상품 삭제
  const handleDeleteProduct = async (productCode) => {
    if (!window.confirm('이 상품을 삭제하시겠습니까?')) return;

    try {
      const response = await axios.get(
        `https://api.bargainus.kr/mypage/userpage/products/delete?productCode=${productCode}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.status) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.pcode !== productCode));
        alert(response.data.message || '상품이 성공적으로 삭제되었습니다.');
      } else {
        alert(response.data.message || '상품 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('상품 삭제 오류:', error);
      alert('서버와 연결할 수 없습니다.');
    }
  };

  // 로딩 상태 렌더링
  if (loading) {
    return <div className={style.loading}>로딩 중...</div>;
  }

  // 상품 관리 페이지 렌더링
  return (
    <div className={style.myProducts}>
      <div className={style.header}>
        <h1>내 상품 관리</h1>
      </div>
      <span className={style.productNum}>({products.length})</span>
      <ul>
        {products.length === 0 ? (
          <div className={style.content}>
            <p>등록된 상품이 없습니다.</p>
          </div>
        ) : (
          products.slice(offset, offset + limit).map((product) => {
            const categoryPath = product.category?.name.toLowerCase(); // category.name 사용
            return (
              <li key={product.pcode}>
                <Link to={`/${categoryPath}/products/${product.pcode}`}>
                  <div className={style.img}>
                    <img
                      src={product.photo || '/images/default.jpg'}
                      alt={product.name || '상품 이미지'}
                    />
                  </div>
                </Link>
                <Link to={`/${categoryPath}/products/${product.pcode}`}>
                  <div className={style.product}>
                    <p>{product.name || '상품명 없음'}</p>
                    <span>{product.price ? `${Number(product.price).toLocaleString()} 원` : '가격 정보 없음'}</span>
                    <span>재고: {product.inventory || 0}</span>
                  </div>
                </Link>
                <div className={style.button}>
                  <Button name="삭제" onClick={() => handleDeleteProduct(product.pcode)} />
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
          {Array.from({ length: Math.ceil(products.length / limit) }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              aria-current={page === idx + 1 ? 'page' : null}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(products.length / limit)))}
            disabled={page === Math.ceil(products.length / limit)}
          >
            <MdArrowForwardIos />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MyProducts;
