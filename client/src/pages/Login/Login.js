import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Space } from "antd";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import "./Login.scss";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { Redirect, useHistory } from "react-router";
import { notify } from "../../helper/notify";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import GoogleLogin from "react-google-login";

const { Text } = Typography;
const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};

const breadcrumbRoute = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Account",
    link: "/login",
  },
];

function Login({ onLogin, isAuth, loading, onReset, onLoginGoogle }) {
  const [openResetForm, setOpenResetForm] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (isAuth) {
      return <Redirect to="/" />;
    }
  }, []);

  const loginHandler = (values) => {
    onLogin(notify, values, () => {
      history.push("/");
    });
  };

  const resetHandler = (values) => {
    onReset(notify, values.email);
  };

  const handleResponseGoogle = (response) => {
    const { email, name, imageUrl, googleId } = response.profileObj;
    onLoginGoogle(notify, { email, name, imageUrl, googleId }, () => {
      history.push("/");
    });

    console.log(response);
  };

  return (
    <section className="login">
      <Breadcrumbing route={breadcrumbRoute} />
      <div className="login__body">
        {!openResetForm && (
          <div className="login__form">
            <div className="heading">Log In</div>
            <Form name="login" {...formItemLayout} onFinish={loginHandler}>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input size="large" placeholder="Username" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password size="large" placeholder="Password" />
              </Form.Item>

              <Form.Item>
                <Text
                  underline
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenResetForm(true)}
                >
                  Forgot your password ?
                </Text>
              </Form.Item>

              <Form.Item>
                <Button
                  size="large"
                  block
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Sign in
                </Button>
              </Form.Item>
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                onSuccess={handleResponseGoogle}
                onFailure={handleResponseGoogle}
                cookiePolicy="single_host_origin"
                render={(renderProps) => (
                  <Form.Item>
                    <Button
                      onClick={renderProps.onClick}
                      loading={loading}
                      className="googleLoginBtn"
                      size="large"
                      block
                      type="primary"
                      icon={<FcGoogle className="googleIcon" />}
                    >
                      Sign in with google
                    </Button>
                  </Form.Item>
                )}
              />
            </Form>
          </div>
        )}
        {openResetForm && (
          <div className="login__form">
            <div className="heading">Reset your password</div>
            <Text style={{ display: "block", marginBottom: 12 }}>
              We will send you an email to reset your password.
            </Text>
            <Form name="reset" {...formItemLayout} onFinish={resetHandler}>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please input your mail!",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    size="large"
                    htmlType="submit"
                    type="primary"
                    loading={loading}
                  >
                    Submit
                  </Button>
                  <Button size="large" onClick={() => setOpenResetForm(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
        <div className="login__newUser">
          <div className="heading">New Customer</div>
          <Space direction="vertical">
            <Text>
              Sign up for early Sale access plus tailored new arrivals, trends
              and promotions. To opt out, click unsubscribe in our emails.
            </Text>
            <Button size="large">
              <Link to="/register">Register</Link>
            </Button>
          </Space>
        </div>
      </div>
    </section>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (notify, loginInfo, redirect) =>
      dispatch(actions.login(notify, loginInfo, redirect)),
    onLoginGoogle: (notify, loginInfo, redirect) =>
      dispatch(actions.loginGoogle(notify, loginInfo, redirect)),
    onReset: (notify, email) => dispatch(actions.reset(notify, email)),
  };
};

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null,
    loading: state.auth.loading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
