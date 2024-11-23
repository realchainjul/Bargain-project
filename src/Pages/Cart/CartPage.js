import React from 'react';
import style from './CartPage.module.scss';
import Cart from '../../components/Product/Cart/Cart';

export default function CartPage() {
  return (
    <div className={style.cart}>
      <div className={style.container}>
        <Cart />
      </div>
    </div>
  );
}