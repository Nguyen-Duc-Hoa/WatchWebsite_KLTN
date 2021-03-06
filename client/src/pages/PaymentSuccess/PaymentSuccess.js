import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import "./PaymentSuccess.scss";
import Page from "../../components/Page/Page";

function PaymentSuccess() {
  return (
    <Page title="Payment success">
      <section className="paymentSuccess">
        <Result
          status="success"
          title="Payment success!"
          subTitle="Your order is confirmed. We will delivery your product as soon as repair!"
          extra={[
            <Link to="/products">
              <Button size="large" type="primary" key="console">
                Continue shopping
              </Button>
            </Link>,
            <Link to="/orderHistory">
              <Button size="large">View order</Button>
            </Link>,
          ]}
        />
      </section>
    </Page>
  );
}

export default PaymentSuccess;
