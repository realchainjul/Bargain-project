import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import style from './Payment.module.scss';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = location.state || {};
  const [selectedBucketIds, setSelectedBucketIds] = useState([]);
  const [userAddress, setUserAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('카드'); // 기본 결제 방법 설정
  const [loading, setLoading] = useState(false);

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('https://api.bargainus.kr/info', {
          withCredentials: true,
        });
        if (response.status === 200 && response.data) {
          setUserAddress(response.data);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        alert('사용자 정보를 불러오는 데 실패했습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // 장바구니 항목 선택/해제 처리
  const handleSelectBucket = (bucketNo) => {
    setSelectedBucketIds((prevSelected) =>
      prevSelected.includes(bucketNo)
        ? prevSelected.filter((id) => id !== bucketNo)
        : [...prevSelected, bucketNo]
    );
  };

  // 총 금액 계산 함수
  const calculateTotalPrice = () => {
    return cartItems
      .filter((item) => selectedBucketIds.includes(item.bucketNo))
      .reduce((total, item) => total + item.price * item.count, 0);
  };

  // Bills 추가 및 결제 요청 처리
  const handlePayment = async () => {
    if (selectedBucketIds.length === 0) {
      alert('결제할 항목을 선택해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 1단계: Bills 추가 요청 (/bills/add)
      const billsResponse = await axios.post(
        'https://api.bargainus.kr/bills/add',
        { selectedBucketIds }, // 선택된 장바구니 항목들
        { withCredentials: true } // 세션 정보 포함
      );

      // bills/add API 호출 후 상태 확인
      if (billsResponse.status !== 200 || !billsResponse.data.status) {
        alert(billsResponse.data.message || '결제 정보 생성 중 문제가 발생했습니다.');
        return;
      }

      // 2단계: 총 결제 금액과 billCodes 추출 후 결제 요청 (/payments/create)
      const totalAmount = billsResponse.data.bills.reduce(
        (sum, bill) => sum + bill.totalPrice,
        0
      );
      const billCodes = billsResponse.data.bills.map((bill) => bill.billCode);
      const impUid = 'imp_' + uuidv4(); // 고유한 impUid 생성

      // 결제 요청 데이터 준비
      const paymentData = {
        amount: totalAmount, // 총 결제 금액
        paymentMethod: paymentMethod, // 사용자가 선택한 결제 방법
        billCodes: billCodes, // 생성된 청구서 코드들
        impUid: impUid, // 고유 결제 식별자
      };

      // 결제 요청 (/payments/create)
      const paymentResponse = await axios.post(
        'https://api.bargainus.kr/payments/create',
        paymentData,
        { withCredentials: true } // 세션 정보 포함
      );

      // 결제 완료 후 상태 확인
      if (paymentResponse.status === 200 && paymentResponse.data.status) {
        navigate('/order-success', { state: { message: paymentResponse.data.message } });
      } else {
        alert(paymentResponse.data.message || '결제 처리 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('결제 실패:', error);
      alert('결제 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false); // 결제 진행 완료 후 로딩 상태 해제
    }
  };

  if (!cartItems) {
    return <div className={style.loading}>결제 정보를 불러오는 중...</div>;
  }

  if (!userAddress) {
    return <div className={style.loading}>사용자 정보를 불러오는 중...</div>;
  }

  return (
    <div className={style.paymentPage}>
      <h1 className={style.title}>결제 페이지</h1>

      {/* 배송 정보 */}
      <section className={style.addressSection}>
        <h2>배송 정보</h2>
        <p>이름: {userAddress.name}</p>
        <p>전화번호: {userAddress.phoneNumber}</p>
        <p>주소: {userAddress.address}, {userAddress.detailAddress}</p>
        <p>우편번호: {userAddress.postalCode}</p>
      </section>

      {/* 결제 상품 정보 */}
      <section className={style.billSection}>
        <h2>결제 상품 정보</h2>
        {cartItems.map((item) => (
          <div key={item.bucketNo} className={style.billItem}>
            <input
              type="checkbox"
              checked={selectedBucketIds.includes(item.bucketNo)}
              onChange={() => handleSelectBucket(item.bucketNo)}
            />
            <p>상품명: {item.productName}</p>
            <p>수량: {item.count}</p>
            <p>가격: {item.price.toLocaleString()} 원</p>
          </div>
        ))}
      </section>

      {/* 총 금액 */}
      <section className={style.totalPriceSection}>
        <h2>총 결제 금액</h2>
        <h3 className={style.totalPrice}>
          {selectedBucketIds.length > 0
            ? calculateTotalPrice().toLocaleString()
            : '0'} 원
        </h3>
      </section>

      {/* 결제 방법 선택 */}
      <section className={style.paymentMethod}>
        <h2>결제 방법</h2>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)} // 결제 방법 선택 시 상태 업데이트
          className={style.methodSelect}
        >
          <option value="카드">카드</option>
          <option value="계좌이체">계좌이체</option>
          <option value="휴대폰 결제">휴대폰 결제</option>
        </select>
      </section>

      {/* 결제 버튼 */}
      <div className={style.actions}>
        <button
          className={style.paymentButton}
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? '결제 진행 중...' : '결제하기'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
