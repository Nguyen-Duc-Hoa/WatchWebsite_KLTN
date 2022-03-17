import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Row,
  Col,
  Space,
} from "antd";
import UploadImage from "../../../components/UploadImage/UploadImage";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router";
import { notify } from "../../../helper/notify";
import { convertToByteArray } from "../../../helper/convertToByteArray";
import * as actions from "../../../store/actions/index";

const { Option } = Select;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const validateMessage = {
  required: "${label} is required!",
};

function Product({ brands, onFetchAllBrands }) {
  const [form] = Form.useForm();
  const [materials, setMaterials] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [energies, setEnergies] = useState([]);
  const [waterRes, setWaterRes] = useState([]);
  const [imageBase64, setImageBase64] = useState("");
  const [imageByteArray, setImageByteArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);
  // console.log(useParams())
  let { id } = useParams();
  const isAdd =
    useLocation().pathname.slice(15).toLocaleLowerCase() === "addproduct"
      ? true
      : false;

  useEffect(() => {
    fetchAllMaterials();
    fetchAllSizes();
    fetchAllEnergies();
    fetchAllWaterRes();
    onFetchAllBrands();
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  const fetchAllMaterials = () => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Materials/GetAll`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        const materialArray = result.map((ele) => {
          return {
            id: ele.MaterialId,
            value: ele.MaterialValue,
          };
        });
        setMaterials(materialArray);
        // console.log(materialArray);
      })
      .catch(() => {
        console.log("fetch all materials failed");
      });
  };

  const fetchAllSizes = () => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Sizes/GetAll`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        const sizeArray = result.map((ele) => {
          return {
            id: ele.SizeId,
            value: ele.SizeValue,
          };
        });
        setSizes(sizeArray);
        console.log(sizeArray);
      })
      .catch(() => {
        console.log("fetch all sizes failed");
      });
  };

  const fetchAllEnergies = () => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Energies/GetAll`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        const energyArray = result.map((ele) => {
          return {
            id: ele.EnergyId,
            value: ele.EnergyValue,
          };
        });
        setEnergies(energyArray);
        console.log(energyArray);
      })
      .catch(() => {
        console.log("fetch all energy failed");
      });
  };

  const fetchAllWaterRes = () => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/WaterResistances/GetAll`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        const waterResArray = result.map((ele) => {
          return {
            id: ele.WaterId,
            value: ele.WaterValue,
          };
        });
        setWaterRes(waterResArray);
        console.log(waterResArray);
      })
      .catch(() => {
        console.log("fetch all waterRes failed");
      });
  };

  const updateProduct = (productInfo) => {
    console.log(productInfo);
    setLoading(true);
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Products/`, {
      method: isAdd ? "POST" : "PUT",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productInfo),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          setLoading(false);
          notify(
            `${isAdd ? "ADD" : "EDIT"} SUCCESS`,
            `You have already ${isAdd ? "added" : "edited"} a ${
              isAdd && "new"
            } product!`,
            "success"
          );
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        notify(
          `${isAdd ? "ADD" : "EDIT"} FAILED`,
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };

  const fetchProduct = () => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Products?id=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setImageBase64(`data:image/png;base64,${result.Image} `);
        setImageByteArray(convertToByteArray(result.Image));
        setHidden(true);
        form.setFieldsValue({
          name: result.Name,
          id: result.Id,
          amount: result.Amount,
          price: result.Price,
          BrandId: result.BrandId,
          gender: result.Gender,
          MaterialId: result.MaterialId,
          EnergyId: result.EnergyId,
          SizeId: result.SizeId,
          WaterResistanceId: result.WaterResistanceId,
          description: result.Description,
        });
      })
      .catch(() => {
        notify(
          "LOAD FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };

  const onFinish = (values) => {
    updateProduct({ ...values, image: imageByteArray });
  };

  return (
    <section className="admin">
      <div className="heading">Add/Edit product</div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col lg={{ span: 16, order: 2 }} sm={{ span: 24, order: 2 }}>
          <Form
            onFinish={onFinish}
            form={form}
            {...layout}
            initialValues={{ amount: 1 }}
            validateMessages={validateMessage}
            style={{ maxWidth: 600 }}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Product Name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select a brand">
                    <Option value={1}>Men</Option>
                    <Option value={0}>Women</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Form.Item
                  name="amount"
                  label="Amount"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber min={0} parser={(value) => Math.round(value)} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber min={0} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Form.Item
                  name="BrandId"
                  label="Brand"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select a brand">
                    {brands.length !== 0 &&
                      brands.map((element) => (
                        <Option value={element.id}>{element.name}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="id"
                  label="Product Id"
                  hidden={hidden}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Form.Item
                  name="MaterialId"
                  label="Material"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select a material">
                    {materials.length !== 0 &&
                      materials.map((element) => (
                        <Option value={element.id}>{element.value}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="EnergyId"
                  label="Energy"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select a energy">
                    {energies.length !== 0 &&
                      energies.map((element) => (
                        <Option value={element.id}>{element.value}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col span={12}>
                <Form.Item
                  name="SizeId"
                  label="Size"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select a size">
                    {sizes.length !== 0 &&
                      sizes.map((element) => (
                        <Option value={element.id}>{element.value}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="WaterResistanceId"
                  label="Water resistence"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Please select a level">
                    {waterRes.length !== 0 &&
                      waterRes.map((element) => (
                        <Option value={element.id}>{element.value}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Description">
              <Input.TextArea rows={8} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!imageBase64}
                  loading={loading}
                >
                  Submit
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
        <Col lg={{ span: 6, order: 2 }} sm={{ span: 24, order: 1 }}>
          <UploadImage
            imageBase64={imageBase64}
            setImageBase64={setImageBase64}
            setImageByteArray={setImageByteArray}
          />
        </Col>
      </Row>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    brands: state.brand.brands,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchAllBrands: () => dispatch(actions.fetchAllBrands()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
