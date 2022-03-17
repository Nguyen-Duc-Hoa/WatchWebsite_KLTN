import React from "react";
import { Form, Input, Button, DatePicker } from "antd";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const regexPhoneNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

function FormProfile({ form, onSubmit, loading }) {
  const dateFormat = "YYYY/MM/DD";

  return (
    <Form {...layout} style={{ maxWidth: 600 }} onFinish={onSubmit} form={form}>
      <Form.Item
        label="Name"
        rules={[
          {
            required: true,
            message: "Name is required!",
          },
          {
            min: 4,
            message: "Name length must be at least 4 characters!",
          },
          {
            max: 20,
            message: "Name length must be less than 20 characters!",
          },
        ]}
        name="name"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[
          {
            required: true,
            message: "Address is required!",
          },
          {
            min: 8,
            message: "Address length must be at least 8 characters!",
          },
          {
            max: 40,
            message: "Address length must be less than 40 characters!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="E-mail"
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
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
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
        <Input />
      </Form.Item>

      <Form.Item label="Birthday" name="birthday" rules={[{ type: "object" }]}>
        <DatePicker format={dateFormat} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default FormProfile;
