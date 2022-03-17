import React from "react";
import { Form, Button, Input } from "antd";
import { connect } from "react-redux";
import { notify } from "../../helper/notify";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

function ChangePassword({ idUser, center }) {
  const changePasswordHandler = (values) => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/user/ChangePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idUser,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    }).then((response) => {
      if (response.ok) {
        notify(
          "CHANGE PASSWORD SUCCESS",
          "You have already change your password.",
          "success"
        );
      } else {
        notify(
          "CHANGE PASSWORD FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      }
    });
  };
  return (
    <Form
      {...layout}
      style={{ maxWidth: 400, margin: center && "auto" }}
      onFinish={changePasswordHandler}
    >
      <Form.Item
        label="Current Password"
        name="currentPassword"
        rules={[
          {
            required: true,
            message: "Please input your current password!",
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
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[
          {
            required: true,
            message: "Please input your new password!",
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
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Confirm Password"
        name="confirm"
        dependencies={["newPassword"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your new password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

const mapStateToProps = (state) => {
  return {
    idUser: state.auth.id,
  };
};

export default connect(mapStateToProps)(ChangePassword);
