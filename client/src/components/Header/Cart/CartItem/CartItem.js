import React from "react";
import "./CartItem.scss";
import { InputNumber } from "antd";

function CartItem({
  name,
  image,
  amount,
  number,
  price,
  changeCartNumberHandler,
  brand,
  idProduct,
}) {
  return (
    <div className="cart__card">
      <img src={`data:image/png;base64,${image}`} alt="" />
      <div className="card__info">
        <div>{name}</div>
        <p>{brand}</p>
        <InputNumber
          min={0}
          max={amount}
          defaultValue={number}
          parser={(value) => Math.round(value)}
          value={number}
          onChange={(value) => changeCartNumberHandler(idProduct, value)}
        />
      </div>
      <div className="price">${price}</div>
    </div>
  );
}

export default CartItem;
