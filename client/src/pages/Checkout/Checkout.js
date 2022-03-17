import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm";
import CheckoutProducts from "../../components/CheckoutProducts/CheckoutProducts";
import "./Checkout.scss";

const breadCrumbRoute = [
  { link: "/", name: "Home" },
  { link: "/Checkout", name: "Checkout" },
];

function Checkout({ cart }) {
  if (cart.length === 0) {
    return <Redirect to="/" />;
  }
  return (
    <section className="checkout">
      <Breadcrumbing route={breadCrumbRoute} />
      <div className="checkout__content">
        <CheckoutForm />
        <CheckoutProducts />
      </div>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.cart,
  };
};

export default connect(mapStateToProps)(Checkout);
