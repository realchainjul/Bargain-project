import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import style from './Payment.module.scss';

const { IMP } = window;

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, totalAmount } = location.state || {}; // Cart.js에서 전달된 데이터
  const [userAddress, setUserAddress] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    postalCode: '',
    detailAddress: '',
  });
  const [useDefaultAddress, setUseDefaultAddress] = useState(false); // 기본 배송지 사용 여부
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('카드'); // 기본 결제 방법 설정

  // 기본 배송지 정보 가져오기
  useEffect(() => {
    if (useDefaultAddress) {
      const fetchUserInfo = async () => {
        try {
          const response = await axios.get('https://api.bargainus.kr/info', {
            withCredentials: true,
          });
          if (response.status === 200 && response.data) {
            setUserAddress({
              name: response.data.name || '',
              phoneNumber: response.data.phoneNumber || '',
              address: response.data.address || '',
              postalCode: response.data.postalCode || '',
              detailAddress: response.data.detailAddress || '',
            });
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
          alert('기본 배송 정보를 불러오는 데 실패했습니다.');
        }
      };

      fetchUserInfo();
    }
  }, [useDefaultAddress]);

  // 배송 정보 입력 핸들러
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserAddress((prev) => ({ ...prev, [name]: value }));
  };

  // I'mport 결제 요청 처리
  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1단계: Bills 추가 요청 (/bills/add)
      const billsResponse = await axios.post(
        'https://api.bargainus.kr/bills/add',
        { selectedBucketIds: cartItems.map((item) => item.billCode) },
        { withCredentials: true }
      );

      if (billsResponse.status !== 200 || !billsResponse.data.status) {
        alert(billsResponse.data.message || '결제 정보 생성 중 문제가 발생했습니다.');
        return;
      }

      // 청구서 정보로부터 결제 관련 데이터 추출
      const billCodes = billsResponse.data.bills.map((bill) => bill.billCode);
      const merchantUid = 'merchant_' + uuidv4(); // 고유한 주문 번호 생성

      // 2단계: I'mport 결제 모듈 호출
      IMP.init('imp52521078'); // I'mport 고유 코드로 초기화 (코드 교체 필요)

      IMP.request_pay(
        {
          pg: 'html5_inicis', // PG사 선택
          pay_method: paymentMethod.toLowerCase(), // 결제 방법
          merchant_uid: merchantUid,
          name: 'Bargainus - 구매 상품 결제',
          amount: totalAmount,
          buyer_name: userAddress.name,
          buyer_tel: userAddress.phoneNumber,
          buyer_addr: `${userAddress.address} ${userAddress.detailAddress}`,
          buyer_postcode: userAddress.postalCode,
        },
        async (rsp) => {
          if (rsp.success) {
            // 결제가 성공한 경우
            const paymentData = {
              impUid: rsp.imp_uid, // I'mport 결제 고유 ID
              amount: rsp.paid_amount, // 결제된 금액
              paymentMethod: paymentMethod, // 결제 방법
              billCodes: billCodes, // 청구서 코드
            };

            try {
              const paymentResponse = await axios.post(
                'https://api.bargainus.kr/payments/create',
                paymentData,
                { withCredentials: true }
              );

              if (paymentResponse.status === 200 && paymentResponse.data.status) {
                navigate('/order-success', { state: { message: paymentResponse.data.message } });
              } else {
                alert(paymentResponse.data.message || '결제 처리 중 문제가 발생했습니다.');
              }
            } catch (error) {
              console.error('결제 요청 실패:', error);
              alert('결제 요청 중 문제가 발생했습니다. 다시 시도해주세요.');
            }
          } else {
            // 결제가 실패한 경우
            alert(`결제에 실패하였습니다: ${rsp.error_msg}`);
          }
        }
      );
    } catch (error) {
      console.error('결제 요청 실패:', error);
      alert('결제 요청 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems) {
    return <div className={style.loading}>결제 정보를 불러오는 중...</div>;
  }

  return (
    <div className={style.paymentPage}>
      <h1 className={style.title}>결제 페이지</h1>

      {/* 배송 정보 입력 */}
      <section className={style.addressSection}>
        <h2>배송 정보</h2>
        <div className={style.inputGroup}>
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={userAddress.name}
            onChange={handleAddressChange}
            disabled={useDefaultAddress} // 기본 배송지 사용 시 비활성화
          />
        </div>
        <div className={style.inputGroup}>
          <label>전화번호</label>
          <input
            type="text"
            name="phoneNumber"
            value={userAddress.phoneNumber}
            onChange={handleAddressChange}
            disabled={useDefaultAddress} // 기본 배송지 사용 시 비활성화
          />
        </div>
        <div className={style.inputGroup}>
          <label>주소</label>
          <input
            type="text"
            name="address"
            value={userAddress.address}
            onChange={handleAddressChange}
            disabled={useDefaultAddress} // 기본 배송지 사용 시 비활성화
          />
        </div>
        <div className={style.inputGroup}>
          <label>상세 주소</label>
          <input
            type="text"
            name="detailAddress"
            value={userAddress.detailAddress}
            onChange={handleAddressChange}
            disabled={useDefaultAddress} // 기본 배송지 사용 시 비활성화
          />
        </div>
        <div className={style.inputGroup}>
          <label>우편번호</label>
          <input
            type="text"
            name="postalCode"
            value={userAddress.postalCode}
            onChange={handleAddressChange}
            disabled={useDefaultAddress} // 기본 배송지 사용 시 비활성화
          />
        </div>
        <div className={style.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={useDefaultAddress}
              onChange={(e) => setUseDefaultAddress(e.target.checked)}
            />
            기본 배송지 사용
          </label>
        </div>
      </section>

      {/* 결제 상품 정보 */}
      <section className={style.billSection}>
        <h2>결제 상품 정보</h2>
        {cartItems.map((item) => (
          <div key={item.billCode} className={style.billItem}>
            <p>상품명: {item.productName}</p>
            <p>수량: {item.count}</p>
            <p>총 금액: {item.totalPrice.toLocaleString()} 원</p>
          </div>
        ))}
      </section>

      {/* 총 금액 */}
      <section className={style.totalPriceSection}>
        <h2>총 결제 금액</h2>
        <h3 className={style.totalPrice}>{totalAmount.toLocaleString()} 원</h3>
      </section>

      {/* 결제 방법 선택 */}
      <section className={style.paymentMethod}>
        <h2>결제 방법</h2>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
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
