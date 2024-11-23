import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './Cart.module.scss';
import { BsCart2 } from 'react-icons/bs';
import Button from '../../../components/common/Button';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // 장바구니 아이템 목록
  const [checkedItems, setCheckedItems] = useState([]); // 체크된 항목의 bucketNo
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [userAddress, setUserAddress] = useState({}); // 사용자 주소 정보

  // 장바구니 목록 및 사용자 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartResponse, userResponse] = await Promise.all([
          axios.get('https://api.bargainus.kr/bucket/list', { withCredentials: true }),
          axios.get('https://api.bargainus.kr/info', { withCredentials: true }),
        ]);

        setCartItems(cartResponse.data);
        setUserAddress(userResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 전체 선택 및 해제 핸들러
  const handleAllCheck = (isChecked) => {
    if (isChecked) {
      setCheckedItems(cartItems.map((item) => item.bucketNo)); // 모든 항목 체크
    } else {
      setCheckedItems([]); // 모든 항목 체크 해제
    }
  };

  // 개별 체크박스 핸들러
  const handleCheck = (bucketNo, isChecked) => {
    if (isChecked) {
      setCheckedItems((prev) => [...prev, bucketNo]);
    } else {
      setCheckedItems((prev) => prev.filter((no) => no !== bucketNo));
    }
  };

  // 수량 업데이트 핸들러
  const handleQuantityUpdate = async (bucketNo, newCount) => {
    if (newCount < 1) return;

    try {
      const response = await axios.put(
        `https://api.bargainus.kr/bucket/${bucketNo}/update?newCount=${newCount}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.bucketNo === bucketNo ? { ...item, bucketCount: newCount } : item
          )
        );
      }
    } catch (error) {
      console.error('수량 업데이트 실패:', error);
      alert('수량 업데이트 중 문제가 발생했습니다.');
    }
  };

  // 총 가격 계산
  const calculateTotalPrice = () => {
    return cartItems
      .filter((item) => checkedItems.includes(item.bucketNo))
      .reduce((total, item) => total + item.price * item.bucketCount, 0);
  };

  // 결제 요청
  const handlePayment = async () => {
    const selectedItems = cartItems.filter((item) => checkedItems.includes(item.bucketNo));
  
    if (selectedItems.length === 0) {
      alert('결제할 상품을 선택해주세요.');
      return;
    }
  
    const selectedBucketIds = selectedItems.map((item) => item.bucketNo);
  
    try {
      const response = await axios.post(
        'https://api.bargainus.kr/bills/add',
        { selectedBucketIds },
        { withCredentials: true }
      );
  
      console.log("Payload:", { selectedBucketIds });
      console.log("Response:", response.data);
  
      if (response.status === 200 && response.data.status) {
        const { bills } = response.data;
        navigate('/payment', { state: { cartItems: bills } }); // bills를 cartItems로 전달
      } else {
        alert(response.data.message || '결제 처리 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('결제 요청 실패:', error);
      alert('결제 요청 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };
  
  
  if (loading) {
    return <div className={style.loading}>로딩 중...</div>;
  }

  return (
    <div className={style.cart}>
      <div className={style.header}>
        <h1>장바구니</h1>
      </div>
      {cartItems.length > 0 ? (
        <>
          <div className={style.cartlist}>
            <label className={style.selectAll}>
              <input
                type="checkbox"
                checked={checkedItems.length === cartItems.length}
                onChange={(e) => handleAllCheck(e.target.checked)}
              />
              전체 선택
            </label>
            {cartItems.map((item) => (
              <div key={item.bucketNo} className={style.cartItem}>
                <input
                  type="checkbox"
                  checked={checkedItems.includes(item.bucketNo)}
                  onChange={(e) => handleCheck(item.bucketNo, e.target.checked)}
                />
                <div className={style.img}>
                  <img src={item.photoUrl || '/images/default.jpg'} alt={item.productName} />
                </div>
                <div className={style.info}>
                  <h2>{item.productName}</h2>
                  <p>{Number(item.price).toLocaleString()} 원</p>
                  <div className={style.quantity}>
                    <button onClick={() => handleQuantityUpdate(item.bucketNo, item.bucketCount - 1)}>
                      -
                    </button>
                    <span>{item.bucketCount}</span>
                    <button onClick={() => handleQuantityUpdate(item.bucketNo, item.bucketCount + 1)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={style.cartprice}>
            <div className={style.calcwrap}>
              <div className={style.orderprice}>
                <p className={style.title}>총 주문 금액</p>
                <p className={style.price}>{calculateTotalPrice().toLocaleString()} 원</p>
              </div>
            </div>
            <Button name="결제하기" isPurple={true} onClick={handlePayment} />
          </div>
        </>
      ) : (
        <div className={style.empty}>
          <div className={style.bs}>
            <BsCart2 size="30" title="장바구니" color="#a99773" />
          </div>
          <p>장바구니가 비었습니다.</p>
          <Button
            name="쇼핑하러 가기"
            onClick={() => {
              navigate('/');
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
