import React from 'react';
import style from './ProductDetail.module.scss';
import Button from '../../components/common/Button';
import Cart from '../../components/Product/Cart/Cart';
import { useEffect, useState } from 'react';

 function ProductDetail() {
    const [modal, setModal] = useState(false);
    const [products] = useState([]);
    const [count, setCount] = useState(1);

    return (
      <div className={style.detail}>
        {modal === true ? <Cart modal={modal} setModal={setModal} /> : null}
        <div className={style.container}>
          {/* 이미지 영역 */}
          <div className={style.imgarea}>
            {/* 썸네일 */}
            <img src={products.thumbnail} width="100%" alt={products.title} />
            {/* 상세페이지 */}
            <img src={products.photo} width="100%" alt={products.title} />
          </div>
          {/* 상품 정보 영역(수량, 총 가격, 장바구니 버튼, 구매 버튼) */}
          <div className={style.menu}>
            <div className={style.fixed}>
              <div className={style.info}>
                <h4 className={style.title}>{products.title}</h4>
                <div className={style.wrap}>
                  <p className={style.price}>{}원</p>
                </div>
                <p className={style.desc}>{products.description}</p>
              </div>
              <div className={style.total}>
                <div className={style.countwrap}>
                  <p>구매 수량</p>
                  {/* 카운트 버튼 */}
                  <div className={style.count}>
                    <button
                      onClick={() => {
                        if (count === 1) {
                          return 1;
                        }
                        setCount(count - 1);
                      }}
                    >
                      -
                    </button>
                    <p>{count}</p>
                    <button
                      onClick={() => {
                        setCount(count + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className={style.totalprice}>
                  <p>총 상품 금액</p>
                  <p>₩ {}원</p>
                </div>
              </div>
              {products.isSoldOut ? (
                <div className={style.button}>
                  <Button name={'품절'} className={style.soldout} disabled={true} />
                </div>
              ) : (
                <div className={style.button}>
                  <Button
                    name={'장바구니'}
                    className={style.sale}/>
                  <Button
                    name={'구매하기'}
                    isBrown={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default ProductDetail;