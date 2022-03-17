import { Button, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router";
import UploadImage from "../../../components/UploadImage/UploadImage";
import * as actions from "../../../store/actions/index";
import { notify } from "../../../helper/notify";
import { convertToByteArray } from "../../../helper/convertToByteArray";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

function UpdateBrand({ onUpdateBrand, loading, token }) {
  const [imageBase64, setImageBase64] = useState("");
  const [imageByteArray, setImageByteArray] = useState([]);
  const [form] = Form.useForm();
  let { id } = useParams();
  const isAdd =
    useLocation().pathname.slice(14).toLocaleLowerCase() === "addbrand"
      ? true
      : false;

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/brands?id=${id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
      .then((response) => response.json())
      .then((result) => {
        setImageBase64(`data:image/svg+xml;base64,${result.Image} `);
        setImageByteArray(convertToByteArray(result.Image));
        form.setFieldsValue({ name: result.Name });
      })
      .catch(() => {
        notify(
          "LOAD FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  }, [id]);

  const updateBrand = (values) => {
    if (!imageByteArray) return;
    id
      ? onUpdateBrand(
          { brandId: id, name: values.name, image: imageByteArray },
          isAdd,
          notify,
          token
        )
      : onUpdateBrand(
          { name: values.name, image: imageByteArray },
          isAdd,
          notify,
          token
        );
  };
  return (
    <section className="admin">
      <div className="heading">{isAdd ? "Add" : "Edit"} Brand</div>
      <UploadImage
        imageBase64={imageBase64}
        setImageBase64={setImageBase64}
        setImageByteArray={setImageByteArray}
      />
      <Form
        {...layout}
        style={{ maxWidth: 400 }}
        onFinish={updateBrand}
        form={form}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Name is required!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={!imageBase64}
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.brand.lading,
    token: state.auth.token
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateBrand: (brandInfo, isAdd, notify, token) =>
      dispatch(actions.updateBrand(brandInfo, isAdd, notify, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateBrand);
