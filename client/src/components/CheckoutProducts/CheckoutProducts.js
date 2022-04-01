import React, { useEffect, useState } from "react";
import "./CheckoutProducts.scss";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import CheckoutCard from "./CheckoutCard/CheckoutCard";
import { useWindowDimensions } from "../../hook/useWindowDemension";
import { connect } from "react-redux";

function CheckoutProducts({ cart, total, amount, voucherDiscount }) {
  const windowDimensions = useWindowDimensions();
  const [resizeFlag, setResizeFlag] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    if (windowDimensions.width <= 1080 && !resizeFlag) {
      setResizeFlag(true);
    } else if (windowDimensions.width > 1080 && resizeFlag) {
      setResizeFlag(false);
    }
  }, [windowDimensions]);

  return (
    <div className="content__detail">
      {resizeFlag && (
        <div
          className="detail__header"
          onClick={() => setShowHeader((prevState) => !prevState)}
        >
          <div>
            Show order summary{" "}
            <span>{showHeader ? <IoIosArrowDown /> : <IoIosArrowUp />}</span>
          </div>
          <p>${total - voucherDiscount}</p>
        </div>
      )}
      <div className={`detail__body ${showHeader && "active"}`}>
        {cart.map(({ Image, Name, Quantity, Price, BrandName, Id }) => (
          <CheckoutCard
            image={Image}
            name={Name}
            number={Quantity}
            price={Price}
            brand={BrandName}
            key={Id}
          />
        ))}
        <div className="underline"></div>
        <div className="subtotal">
          <div>Subtotal</div>
          <p>${total}</p>
        </div>
        <div className="shipping">
          <div>Shipping</div>
          <p>Free</p>
        </div>
        {voucherDiscount !== 0 && (
          <div className="shipping">
            <div>Voucher</div>
            <p>${voucherDiscount}</p>
          </div>
        )}
        <div className="underline"></div>
        <div className="total">
          <div>Total</div>
          <p>${(total - voucherDiscount) === 0 ? 1 : (total - voucherDiscount)}</p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.cart,
    total: state.cart.total,
    voucherDiscount: state.order.voucherDiscount
  };
};

export default connect(mapStateToProps, null)(CheckoutProducts);
