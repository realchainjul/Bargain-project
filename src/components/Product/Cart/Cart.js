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
        console.log("Fetched cart items:", response.data); // 데이터 확인용 로그
        setCartItems(response.data);
  
        // 각 항목의 bucketNo 확인
        response.data.forEach((item, index) => {
          if (!item.bucketNo) {
            console.error(`Item at index ${index} is missing bucketNo:`, item);
          }
        });
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

  // 선택 삭제
  const handleDeleteSelected = async () => {
    if (!window.confirm("선택된 상품을 삭제하시겠습니까?")) return;

    try {
      for (let bucketNo of checkedItems) {
        await axios.delete(`https://api.bargainus.kr/bucket/${bucketNo}/remove`, {
          withCredentials: true,
        });
      }
      setCartItems((prev) => prev.filter((item) => !checkedItems.includes(item.bucketNo)));
      setCheckedItems([]);
      alert("선택된 상품이 삭제되었습니다.");
    } catch (error) {
      console.error("상품 삭제 오류:", error);
      alert("상품 삭제 중 문제가 발생했습니다.");
    }
  };

  // 수량 업데이트 핸들러
  const handleQuantityUpdate = async (bucketNo, newCount) => {
    console.log("Updating quantity for:", { bucketNo, newCount });
  
    if (!bucketNo) {
      console.error("Error: bucketNo is undefined!");
      alert("장바구니 번호가 유효하지 않습니다.");
      return;
    }
  
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
        alert(response.data.message || "수량이 업데이트되었습니다.");
      }
    } catch (error) {
      console.error("수량 업데이트 실패:", error);
      alert("수량 업데이트 중 문제가 발생했습니다.");
    }
  };
  
  // 총 가격 계산
  const calculateTotalPrice = () => {
    return cartItems
      .filter((item) => checkedItems.includes(item.bucketNo))
      .reduce((total, item) => total + item.price * item.bucketCount, 0);
  };

  if (loading) {
    return <div className={style.loading}>로딩 중...</div>;
  }

  return (
    <div className={style.cart}>
      {cartItems.length > 0 ? (
        <>
          <div className={style.cartlist}>
            <input
              type="checkbox"
              checked={checkedItems.length === cartItems.length}
              onChange={(e) => handleAllCheck(e.target.checked)}
            />
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
                  <p>수량:</p>
                  <div className={style.quantity}>
  <button
    onClick={() => {
      console.log("Decreasing quantity for:", item);
      handleQuantityUpdate(item.bucketNo, Math.max(item.bucketCount - 1, 1));
    }}
  >
    -
  </button>
  <span>{item.bucketCount}</span>
  <button
    onClick={() => {
      console.log("Increasing quantity for:", item);
      handleQuantityUpdate(item.bucketNo, item.bucketCount + 1);
    }}
  >
    +
  </button>
</div>

                </div>
                <button
                  className={style.deleteButton}
                  onClick={() => handleDeleteSelected(item.bucketNo)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>

          <div className={style.cartprice}>
            <div className={style.calcwrap}>
              <div className={style.orderprice}>
                <p className={style.title}>총 주문 금액</p>
                <p className={style.price}>{calculateTotalPrice().toLocaleString()} 원</p>
              </div>
              <div className={style.discount}>
                <p className={style.title}>할인 금액</p>
                <p className={style.price}>0 원</p>
              </div>
              <div className={style.shipping}>
                <p className={style.title}>배송비</p>
                <p className={style.price}>0 원</p>
              </div>
            </div>
            <div className={style.total}>
              <p className={style.title}>총 결제 금액</p>
              <p className={style.price}>{calculateTotalPrice().toLocaleString()} 원</p>
            </div>
            <Button
              name={"결제하기"}
              isPurple={true}
              onClick={() => navigate("/payment", { state: checkedItems })}
            />
          </div>
        </>
      ) : (
        <div className={style.empty}>
          <BsCart2 size="30" title="장바구니" color="#a99773" />
          <p>장바구니가 비었습니다.</p>
          <Button
            name={"쇼핑하러 가기"}
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
