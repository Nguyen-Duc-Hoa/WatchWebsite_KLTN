import React, { useEffect } from "react";
import { Form, Input, Button, Space } from "antd";
import "./CheckoutForm.scss";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as actionTypes from "../../store/actions/actionTypes";
import { BiCopy } from "react-icons/bi";

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};

function CheckoutForm({ name, address, phone, onSetInfoOrder, orderInfo }) {
  const [form] = Form.useForm();
  const history = useHistory();
  useEffect(() => {
    if (orderInfo.name || orderInfo.address || orderInfo.phone) {
      form.setFieldsValue({
        name: orderInfo.name,
        address: orderInfo.address,
        phone: orderInfo.phone,
      });
    } else {
      form.setFieldsValue({
        name: (name !== "null" && name) || "",
        address: (address !== "null" && address) || "",
        phone: (phone !== "null" && phone) || "",
      });
    }
  }, []);

  const onFinish = (values) => {
    if (values.voucherCode.trim() !== "") {
      values["voucherDiscount"] = 8.5;
    }
    onSetInfoOrder(values);
    history.push("/checkout/payment");
  };

  return (
    <div className="form-order">
      <Form {...formItemLayout} size="large" form={form} onFinish={onFinish}>
        <div className="heading">Shipping address</div>

        <Form.Item
          name="name"
          rules={[{ required: true, message: "Full name is required!" }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>

        <Form.Item
          name="address"
          rules={[{ required: true, message: "Address is required!" }]}
        >
          <Input placeholder="Address" />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Phone is required!",
            },
            {
              validator: (_, value) => {
                const regex =
                  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
                return regex.test(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error("Phone Number is not valid!"));
              },
            },
          ]}
        >
          <Input placeholder="Phone" />
        </Form.Item>

        <Form.Item name="voucherCode">
          <Input placeholder="Your voucher" />
        </Form.Item>

        <div className="voucher-list">
          <div className="voucher-item">
            <div className="left">
              <div className="name">Voucher 1</div>
              <div className="value">Value: $8.50</div>
              <div className="date">Date: 3/22/2022 - 4/22/2022</div>
            </div>
            <div className="right">
              <div
                className="copy"
                title="Click to copy"
                onClick={() => navigator.clipboard.writeText("voucher code")}
              >
                <BiCopy style={{ fontSize: "1.5rem" }} />
              </div>
            </div>
          </div>
          <div className="voucher-item">
            <div className="left">
              <div className="name">Voucher 1</div>
              <div className="value">Value: $8.50</div>
              <div className="date">Date: 3/22/2022 - 4/22/2022</div>
            </div>
            <div className="right">
              <div
                className="copy"
                title="Click to copy"
                onClick={() => navigator.clipboard.writeText("voucher code")}
              >
                <BiCopy style={{ fontSize: "1.5rem" }} />
              </div>
            </div>
          </div>
        </div>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Continue Shipping
            </Button>
            <Link to="/products">
              <Button>Return</Button>
            </Link>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    name: state.auth.name,
    address: state.auth.address,
    phone: state.auth.phone,
    orderInfo: state.order,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetInfoOrder: (orderInfo) =>
      dispatch({ type: actionTypes.ORDER_SET_INFO, payload: orderInfo }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm);
