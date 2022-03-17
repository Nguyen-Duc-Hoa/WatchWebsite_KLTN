import React, { useEffect, useState } from "react";
import "./FilterBar.scss";
import { Form, Select, Radio, Checkbox, Space, Button, Spin } from "antd";
import { useWindowDimensions } from "../../hook/useWindowDemension";
import { RiFilter3Fill } from "react-icons/ri";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";

const { Option } = Select;
const formItemLayout = {
  wrapperCol: {
    span: 24,
  },
};

function FilterBar({ filterHandler, brandInfo, onReset }) {
  const windowDemnsion = useWindowDimensions();
  const [resizeFlag, setResizeFlag] = useState(false);
  const [showFilerBar, setShowFilterBar] = useState(false);
  const [form] = Form.useForm();

  const options = brandInfo.map((ele) => {
    return {
      label: ele.name,
      value: ele.name,
    };
  });

  useEffect(() => {
    if (windowDemnsion.width <= 980 && resizeFlag) {
      setResizeFlag(true);
    } else if (windowDemnsion.width > 980 && !resizeFlag) {
      setResizeFlag(false);
    }
  }, [windowDemnsion]);

  const filterBarBtnHandler = () => {
    setShowFilterBar(!showFilerBar);
  };

  const resetHandler = () => {
    onReset();
    form.resetFields();
    filterHandler(form.getFieldsValue())
  };

  return (
    <div className={`filterBar`}>
      {resizeFlag && (
        <Button
          onClick={filterBarBtnHandler}
          icon={<RiFilter3Fill />}
          style={{
            background: "#000",
            color: "white",
            height: "40px",
          }}
        >
          Filter
        </Button>
      )}
      <Form
        form={form}
        name="filter"
        {...formItemLayout}
        onFinish={filterHandler}
        initialValues={{
          sortBy: "Best Selling",
        }}
        className={`${resizeFlag === true && showFilerBar === false && "hide"}`}
      >
        <div className="heading">Sort by</div>
        <Form.Item name="sortBy">
          <Select>
            <Option value="Best Selling">Best Selling</Option>
            <Option value="Price, high to low">Price, hight to low</Option>
            <Option value="Price, low to high">Price, low to high</Option>
            <Option value="Alphabetically, A-Z">Alphabetically, A-Z</Option>
            <Option value="Alphabetically, Z-A">Alphabetically, Z-A</Option>
          </Select>
        </Form.Item>

        <div className="heading">Gender</div>
        <Form.Item name="gender">
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="1">Men</Radio>
              <Radio value="0">Women</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <div className="heading">Prices</div>
        <Form.Item name="prices">
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="0-50">$0-$50</Radio>
              <Radio value="50-100">$50-$100</Radio>
              <Radio value="100-150">$100-$150</Radio>
              <Radio value="150-200">$150-$200</Radio>
              <Radio value="200-300">$200-$300</Radio>
              <Radio value="300-400">$300-$400</Radio>
              <Radio value="400-999999">More than $400</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <div className="heading">Brands</div>
        <Form.Item name="brands">
          <Checkbox.Group options={options} />
        </Form.Item>

        <Space>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Select
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={resetHandler}>
              Reset
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    brandInfo: state.brand.brands,
    loading: state.brand.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onReset: () => dispatch({ type: actionTypes.FILTER_RESET }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);
