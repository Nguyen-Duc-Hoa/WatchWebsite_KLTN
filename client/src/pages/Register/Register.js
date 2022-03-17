import React from "react";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import "./Register.scss";
import { Form, Input, Button, Typography } from "antd";
import { notify } from "../../helper/notify";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { useEffect } from "react";
import { Redirect, useHistory } from "react-router";

const breadcrumbingRoute = [
  { name: "Home", link: "/" },
  { name: "Create Account", link: "/register" },
];

const { Text } = Typography;

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};

const regexPhoneNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

function Register({ onRegister, loading, isAuth }) {
  const history = useHistory();

  useEffect(() => {
    if (isAuth) {
      return <Redirect to="/" />;
    }
  }, []);
  const registerHandler = (values) => {
    onRegister(notify, values, history);
  };

  return (
    <section className="register">
      <Breadcrumbing route={breadcrumbingRoute} />
      <div className="heading">Personal Infomation</div>
      <div className="register__form">
        <Form name="register" {...formItemLayout} onFinish={registerHandler}>
          <Form.Item
            name="username"
            placeholder="Your username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
              {
                min: 6,
                message: "Username length must be more than 6 characters!",
              },
              {
                max: 15,
                message: "Username length must be less than 15 characters!",
              },
            ]}
          >
            <Input size="large" placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
              {
                max: 80,
                message: "Email length must be less than 80 characters!",
              },
            ]}
          >
            <Input size="large" placeholder="E-mail" />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
              {
                validator: (_, value) =>
                  value.match(regexPhoneNumber)
                    ? Promise.resolve()
                    : Promise.reject(new Error("Phone number invalid!")),
              },
            ]}
          >
            <Input size="large" placeholder="Phone number" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 6,
                message: "Password length must be more than 6 characters!",
              },
              {
                max: 15,
                message: "Password length must be less than 15 characters!",
              },
            ]}
            hasFeedback
          >
            <Input.Password size="large" placeholder="Your password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm password" />
          </Form.Item>

          <Text style={{ display: "block", marginBottom: 24 }}>
            Sign up for early Sale access plus tailored new arrivals, trends and
            promotions. To opt out, click unsubscribe in our emails.
          </Text>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRegister: (notify, registerInfo, history) =>
      dispatch(actions.register(notify, registerInfo, history)),
  };
};

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null,
    loading: state.auth.loading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
