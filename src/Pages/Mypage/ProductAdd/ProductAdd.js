import React, { useState } from 'react';
import style from './ProductAdd.module.scss';
import Button from '../../../components/common/Button';
import axios from 'axios';

const ProductAdd = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    inventory: '',
    comment: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setProduct({
      ...product,
      image: e.target.files[0],
    });
  };

  /*const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('inventory', product.inventory);
    formData.append('comment', product.comment);
    if (product.image) {
      formData.append('image', product.image);
    }

    try {
      const response = await axios.post('나중에 주소입력칸임', formData, {
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
*/
  return (
    <div className={style.productAdd}>
      <div className={style.header}>
        <h1>상품 등록</h1>
      </div>
      <form /* onSubmit={handleSubmit} */>
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
          <label>상품 이미지</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <section className={style.btn}>
        <Button name="등록하기" type="submit" isBrown={true} />
        </section>
      </form>
    </div>
  );
};

export default ProductAdd;
