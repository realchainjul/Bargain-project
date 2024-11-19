import React, { useState, useEffect } from 'react';
import style from './ProductAdd.module.scss';
import Button from '../../../components/common/Button';
import axios from 'axios';

const ProductAdd = () => {
  const [categories, setCategories] = useState([]); // 서버에서 가져온 카테고리 리스트
  const [product, setProduct] = useState({
    name: '',
    price: '',
    inventory: '',
    comment: '',
    category_code: '', // 선택한 카테고리 코드 저장
    photo: null,
    commentPhotos: [],
  });

  // 서버에서 카테고리 리스트 가져오기
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get('https://api.bargainus.kr/categories'); // 카테고리 API 주소
        if (response.status === 200 && response.data) {
          setCategories(response.data); // 서버에서 가져온 카테고리 리스트 설정
          setProduct((prev) => ({
            ...prev,
            category_code: response.data[0]?.category_code || '', // 첫 번째 카테고리를 기본값으로 설정
          }));
        }
      } catch (error) {
        console.error('카테고리 리스트 불러오기 실패:', error);
        alert('카테고리를 불러오는 데 실패했습니다. 다시 시도해주세요.');
      }
    }
    fetchCategories();
  }, []);

  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  // 파일 변경 처리
  const handleFileChange = (e) => {
    const { name } = e.target;
    if (name === 'photo') {
      setProduct({
        ...product,
        photo: e.target.files[0],
      });
    } else if (name === 'commentPhotos') {
      setProduct({
        ...product,
        commentPhotos: [...e.target.files],
      });
    }
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('inventory', product.inventory);
    formData.append('comment', product.comment);
    formData.append('category_code', product.category_code); // 선택된 카테고리 코드 전송
    if (product.photo) {
      formData.append('photo', product.photo);
    }
    if (product.commentPhotos.length > 0) {
      product.commentPhotos.forEach((file) => formData.append('commentPhotos', file));
    }

    try {
      const response = await axios.post('https://api.bargainus.kr/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        alert('상품이 성공적으로 등록되었습니다!');
      } else {
        alert('상품 등록에 실패했습니다.');
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
            type="number"
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
          <label>상세 정보</label>
          <textarea
            name="comment"
            value={product.comment}
            onChange={handleChange}
            placeholder="상세 정보를 입력하세요"
            rows="4"
            required
          />
        </div>
        <div>
          <label>대표 상품 이미지</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label>상세 정보 이미지</label>
          <input
            type="file"
            name="commentPhotos"
            accept="image/*"
            onChange={handleFileChange}
            multiple
          />
        </div>
        <div>
          <label>분류 카테고리</label>
          <select
            name="category_code"
            value={product.category_code}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat.category_code} value={cat.category_code}>
                {cat.category_name} ({cat.category_code})
              </option>
            ))}
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
