import React, { useEffect, useState } from "react";
import { Button, Form, Input, DatePicker, Select, InputNumber } from "antd";
import { notify } from "../../../helper/notify";
import { useLocation, useParams } from "react-router";
import moment from "moment";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { Option } = Select;

const { RangePicker } = DatePicker;

const dateFormat = "YYYY/MM/DD";

const validateMessage = {
  required: "${label} is required!",
};

const UpdateVoucher = () => {
  let { voucherId } = useParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const isAdd =
    useLocation().pathname.slice(16).toLowerCase() === "add"
      ? true
      : false;

  useEffect(() => {
    if (isAdd) return;
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/vouchers/detail?voucherId=${voucherId}`
    )
      .then((res) => res.json())
      .then((result) => {
        form.setFieldsValue({
          name: result.Name,
          voucherId: result.VoucherId,
          date: [
            moment(result.StartDate, dateFormat),
            moment(result.EndDate, dateFormat),
          ],
          discount: result.Discount,
          code: result.Code,
          state: result.State,
        });
      })
      .catch(() => {
        notify(
          "LOAD FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  }, [voucherId]);

  const onFinish = (voucher) => {
    const startDate = voucher.date[0].format(dateFormat);
    const endDate = voucher.date[1].format(dateFormat);
    const { date, ...restInfo } = voucher;
    setLoading(true);
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/vouchers`, {
      method: isAdd ? "POST" : "PUT",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...restInfo,
        startDate: startDate,
        endDate: endDate,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setLoading(false);
          notify(
            `${isAdd ? "ADD" : "EDIT"} SUCCESS`,
            `You have already ${isAdd ? "added" : "edited"} a ${
              isAdd && "new"
            } voucher!`,
            "success"
          );
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        setLoading(false);
        notify(
          `${isAdd ? "ADD" : "EDIT"} FAILED`,
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };

  return (
    <section className="admin">
      <div className="heading">{isAdd ? "Add" : "Edit"}</div>
      <Form
        onFinish={onFinish}
        form={form}
        {...layout}
        style={{ maxWidth: 400 }}
        validateMessages={validateMessage}
      >
        {!isAdd && (
          <Form.Item label="Id" name="voucherId">
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Code" name="code" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Discount"
          name="discount"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} parser={(value) => Math.round(value)} />
        </Form.Item>

        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <RangePicker />
        </Form.Item>

        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Select>
            <Option value={true}>Enable</Option>
            <Option value={false}>Disable</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};

export default UpdateVoucher;
