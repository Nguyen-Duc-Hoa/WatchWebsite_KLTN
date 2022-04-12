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

const breadCrumbRoute = [
  { link: "/", name: "Home" },
  { link: "/Checkout", name: "Checkout" },
  { link: "/Shipping", name: "Shipping" },
];

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with a fake API key.
const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PROMISE}`);

function Shipping({ cart, orderInfo, token, idUser, voucherCode, voucherId }) {
  const [payMethod, setPaymethod] = useState("");

  const makeZalopayReq = () => {
    const items = cart.map((element) => {
      return {
        id: element.Id,
        quantity: element.Quantity,
      };
    });
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/zalopay/createorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: idUser,
        name: orderInfo.name,
        address: orderInfo.address,
        phone: orderInfo.phone,
        products: items,
        voucherCode: voucherCode,
        voucherId: voucherId
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.returncode === 1) {
          window.location.href = data.orderurl
        }
      });
  }


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
              <div className="text">{orderInfo.phone}</div>
              <Link to="/checkout">Change</Link>
            </div>
            <div className="content__item">
              <div className="title">Ship to</div>
              <div className="text">{orderInfo.address}</div>
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
          <Space style={{ marginBottom: 20 }} direction="horizontal">
            <div
              className="paymethod"
              onClick={() => choosePayMethod("Stripe")}
            >
              <div className="left">
                <img
                  src="https://woocommerce.com/wp-content/uploads/2011/12/stripe-logo-blue.png"
                  alt=""
                />
              </div>
            </div>
            <div
              className="paymethod"
              onClick={makeZalopayReq}
            >
              <div className="left">
                <img
                  src="https://upload.wikimedia.org/wikipedia/vi/7/77/ZaloPay_Logo.png"
                  alt=""
                />
              </div>
            </div>
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
    cart: state.cart.cart,
    orderInfo: state.order,
    token: state.auth.token,
    idUser: state.auth.id,
    voucherCode: state.order.voucherCode,
    voucherId: state.order.voucherId,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onFetchCart: (idUser, token) => dispatch(actions.fetchCart(idUser, token)),
//   };
// };

export default connect(mapStateToProps)(Shipping);
