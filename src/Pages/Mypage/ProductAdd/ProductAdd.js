import React, { useState } from 'react';
import style from './ProductAdd.module.scss';
import Button from '../../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductAdd = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    inventory: '',
    comment: '',
    categoryName: '', // 카테고리 이름
    photo: null, // 대표 이미지
    commentPhotos: [], // 상세 이미지 배열
  });

  const formatPrice = (value) => {
    // 숫자만 추출 후 천 단위 콤마 추가
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 가격 입력 필드 포맷팅
    if (name === 'price') {
      setProduct({
        ...product,
        [name]: formatPrice(value), // 콤마 추가된 값 설정
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'photo') {
      setProduct({
        ...product,
        photo: files[0], // 단일 파일
      });
    } else if (name === 'commentPhotos') {
      setProduct({
        ...product,
        commentPhotos: [...files], // 파일 배열
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.replace(/,/g, '')); // 콤마 제거 후 전송
    formData.append('inventory', product.inventory);
    formData.append('comment', product.comment);
    formData.append('categoryName', product.categoryName); // 카테고리 이름
    if (product.photo) {
      formData.append('photo', product.photo); // 대표 이미지
    }
    if (product.commentPhotos.length > 0) {
      product.commentPhotos.forEach((file) => formData.append('commentphoto', file)); // 상세 이미지
    }

    try {
      const response = await axios.post('https://api.bargainus.kr/mypage/userpage/productadd', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        alert('상품이 성공적으로 등록되었습니다!');
        navigate('/mypage/userpage/products');
      } else {
        alert(`등록 실패: ${response.data.message}`);
      }
    } catch (error) {
      console.error('상품 등록 중 오류 발생:', error.response?.data || error);
      alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={style.productAdd}>
      <div className={style.header}>
        <h1>상품 등록</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>상품명</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="상품명을 입력하세요"
            required
          />
        </div>
        <div>
          <label>가격</label>
          <input
            type="text" // 숫자 대신 텍스트로 처리하여 포맷팅 적용
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="가격을 입력하세요"
            required
          />
        </div>
        <div>
          <label>재고</label>
          <input
            type="number"
            name="inventory"
            value={product.inventory}
            onChange={handleChange}
            placeholder="재고를 입력하세요"
            required
          />
        </div>
        <div>
          <label>상세 설명</label>
          <textarea
            name="comment"
            value={product.comment}
            onChange={handleChange}
            placeholder="상세 설명을 입력하세요"
            rows="4"
            required
          />
        </div>
        <div>
          <label>상세 설명 이미지</label>
          <input
            type="file"
            name="commentPhotos"
            accept="image/*"
            onChange={handleFileChange}
            multiple
          />
        </div>
        <div>
          <label>대표 이미지</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label>분류 카테고리</label>
          <select
            name="categoryName"
            value={product.categoryName}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              카테고리를 선택하세요
            </option>
            <option value="과일">과일</option>
            <option value="채소">채소</option>
            <option value="곡물">곡물</option>
          </select>
        </div>
        <section className={style.btn}>
          <Button name="등록하기" type="submit" isBrown={true} />
        </section>
      </form>
    </div>
  );
};

export default ProductAdd;
