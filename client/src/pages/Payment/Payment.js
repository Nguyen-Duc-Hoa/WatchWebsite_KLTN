import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutProducts from "../../components/CheckoutProducts/CheckoutProducts";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import "./Payment.scss";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Button, Space } from "antd";
import { SiStripe } from "react-icons/si";

const breadCrumbRoute = [
  { link: "/", name: "Home" },
  { link: "/Checkout", name: "Checkout" },
  { link: "/Shipping", name: "Shipping" },
];

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with a fake API key.
const stripePromise = loadStripe(
  //   "pk_test_51JLIp1IZZBbB9jhOSEmU0HhjLSotrTVGMU7pFcr6wXn75rgcuwHDMFHSQcjzz8OI4f3UosYsfnMKD0qNKLeKiCTU003nNWpvLF"
  `${process.env.REACT_APP_STRIPE_PROMISE}`
);

function Shipping({ phone, address, cart }) {
  const [payMethod, setPaymethod] = useState("");

  if (cart.length === 0) {
    return <Redirect to="/" />;
  }

  const choosePayMethod = (method) => {
    setPaymethod(method);
  };

  return (
    <section className="shipping">
      <Breadcrumbing route={breadCrumbRoute} />
      <div className="shipping__info">
        <div className="info__content">
          <div className="content__top">
            <div className="content__item content__item--first">
              <div className="title">Contact</div>
              <div className="text">{phone}</div>
              <Link to="/checkout">Change</Link>
            </div>
            <div className="content__item">
              <div className="title">Ship to</div>
              <div className="text">{address}</div>
              <Link to="/checkout">Change</Link>
            </div>
          </div>
          <div className="heading">Shipping method</div>
          <div className="content__bottom">
            <div className="circle"></div>
            <div className="method">Standard</div>
            <div className="price">Free</div>
          </div>
          <div className="heading">Payment</div>
          <Space style={{marginBottom: 20}}>
            <Button
              onClick={() => choosePayMethod("Stripe")}
              type="primary"
              icon={<SiStripe style={{ marginRight: "8px" }} />}
            >
              Stripe
            </Button>
            <Button type="primary" onClick={() => choosePayMethod("Zalopay")}>
              Zalo pay
            </Button>
          </Space>
          {payMethod === "Stripe" && (
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          )}
        </div>
        <CheckoutProducts />
      </div>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    phone: state.order.phone,
    address: state.order.address,
    cart: state.cart.cart,
  };
};

export default connect(mapStateToProps)(Shipping);
