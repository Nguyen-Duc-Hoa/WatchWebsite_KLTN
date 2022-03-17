import { useState } from "react";
import { Form } from "antd";

export const useEditTable = () => {
  const [editingKey, setEditingKey] = useState("");
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  return [
    editingKey,
    setEditingKey,
    visible,
    form,
    handleVisibleChange,
    edit,
    cancel,
  ];
};
