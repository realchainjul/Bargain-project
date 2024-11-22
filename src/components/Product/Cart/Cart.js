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

  // 장바구니 목록 가져오기
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("https://api.bargainus.kr/bucket/list", {
          withCredentials: true,
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        alert("장바구니 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
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

  // 총 가격 계산
  const calculateTotalPrice = () => {
    return cartItems
      .filter((item) => checkedItems.includes(item.bucketNo))
      .reduce((total, item) => total + item.price * item.bucketCount, 0);
  };

  // 결제 요청
  const handlePayment = async () => {
    const selectedItems = cartItems.filter((item) =>
      checkedItems.includes(item.bucketNo)
    );

    if (selectedItems.length === 0) {
      alert("결제할 상품을 선택해주세요.");
      return;
    }

    const bills = selectedItems.map((item) => ({
      productCode: item.productCode,
      totalPrice: item.price * item.bucketCount,
      price: item.price,
      count: item.bucketCount,
      productName: item.productName,
    }));

    const payload = {
      userAddress: {
        address: "사용자 주소", // 사용자의 주소 데이터를 여기에 추가하세요
        postalCode: "우편번호", // 사용자의 우편번호 데이터를 여기에 추가하세요
        detailAddress: "상세 주소", // 사용자의 상세 주소 데이터를 여기에 추가하세요
      },
      bills,
    };

    try {
      const response = await axios.post("https://api.bargainus.kr/bills/add", payload, {
        withCredentials: true,
      });

      if (response.status === 200) {
        alert("결제가 완료되었습니다!");
        navigate("/payment", { state: { bills, userAddress: payload.userAddress } }); // 결제 데이터 전달
      }
    } catch (error) {
      console.error("결제 요청 실패:", error);
      alert("결제 중 문제가 발생했습니다. 다시 시도해주세요.");
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
                  <img src={item.photoUrl || "/images/default.jpg"} alt={item.productName} />
                </div>
                <div className={style.info}>
                  <h2>{item.productName}</h2>
                  <p>{Number(item.price).toLocaleString()} 원</p>
                  <div className={style.quantity}>
                    <span>{item.bucketCount}</span>
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
          <BsCart2 size="30" title="장바구니" color="#a99773" />
          <p>장바구니가 비었습니다.</p>
          <Button
            name="쇼핑하러 가기"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
