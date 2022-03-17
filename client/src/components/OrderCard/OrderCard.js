import React from "react";
import "./OrderCard.scss";

function OrderCard({ image, name, number, brand, price }) {
  return (
    <div className="orderCard">
      <div className="image">
        <img src={image} alt="" />
      </div>
      <div className="info">
        <div className="name">{name}</div>
        <div className="brand">{brand}</div>
        <div className="number">x{number}</div>
      </div>
      <div className="price">${price}</div>
    </div>
  );
}

export default OrderCard;
