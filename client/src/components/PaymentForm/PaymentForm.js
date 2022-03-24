import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button, Space, Typography } from "antd";
import { useHistory } from "react-router";
import { connect } from "react-redux";
import { notify } from "../../helper/notify";
import * as actions from "../../store/actions/index";

const { Paragraph } = Typography;

const cardStyle = {
  style: {
    base: {
      color: "#000",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      lineHeight: "23px",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function PaymentForm({
  cart,
  orderInfo,
  token,
  idUser,
  onFetchCart,
  voucherCode,
}) {
  const history = useHistory();
  const [clientSecret, setClientSecret] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) return;
    const items = cart.map((element) => {
      return {
        id: element.Id,
        quantity: element.Quantity,
        voucherCode: voucherCode,
      };
    });
    // Create PaymentIntent as soon as the page loads
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Orders/Payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        products: items,
        voucherCode: voucherCode,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [cart]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
      setLoading(false);
    } else {
      const items = cart.map((element) => {
        return {
          id: element.Id,
          quantity: element.Quantity,
        };
      });
      fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Orders/CreateOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: idUser,
          transaction: payload.paymentIntent.id,
          paymentStatus: payload.paymentIntent.status,
          address: orderInfo.address,
          name: orderInfo.name,
          phone: orderInfo.phone,
          products: items,
        }),
      }).then((response) => {
        if (response.ok) {
          setError(null);
          setProcessing(false);
          setSucceeded(true);
          onFetchCart(idUser, token);
          setLoading(false);
          history.push("/paymentSuccess");
        } else {
          notify("ERROR", "Something went wrong :(", "error");
          setLoading(false);
        }
      });
    }
  };

  const handleChange = async (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <Paragraph
        style={{
          padding: "10px 25px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
      </Paragraph>
      <Paragraph>{error && <div>{error}</div>}</Paragraph>
      <Space>
        <Button
          disabled={processing || disabled || succeeded}
          id="submit"
          htmlType="submit"
          type="primary"
          size="large"
          loading={loading}
        >
          Pay now
        </Button>

        <Button size="large" onClick={history.goBack}>
          Return to information
        </Button>
      </Space>
    </form>
  );
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.cart,
    orderInfo: state.order,
    token: state.auth.token,
    idUser: state.auth.id,
    voucherCode: state.order.voucherCode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchCart: (idUser, token) => dispatch(actions.fetchCart(idUser, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);
