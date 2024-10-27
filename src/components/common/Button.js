import React from 'react';
import style from '../common/Button.module.scss';

export default function Button({ name, onClick, type, disabled, isBrown, display, width, id }) {
  return (
    <button
    type={type ?? 'button'}
    className={`${style.button} ${isBrown ? style.brown : style.white} ${
      display ? style.displayNone : ''
    }`}
    onClick={onClick}
    disabled={disabled}
    id={id}
    style={{ width: width }}
  >
    <span>{name}</span>
  </button>
);
}