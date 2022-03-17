import React, { useState } from "react";
import { Select, DatePicker, Space, Button, Form, Row, Col, Table } from "antd";
import LineChart from "../../../components/LineChart/LineChart";
import ColumnChart from "../../../components/ColumnChart/ColumnChart";

const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const turnOverChartData = [
  { year: "2014", turnover: 3.5 },
  { year: "2015", turnover: 5 },
  { year: "2016", turnover: 4.9 },
  { year: "2017", turnover: 6 },
  { year: "2018", turnover: 7 },
  { year: "2019", turnover: 9 },
  { year: "2020", turnover: 13 },
];

const productChartData = [
  {
    name: "ProA",
    year: 2014,
    value: 132,
  },
  {
    name: "ProB",
    year: 2014,
    value: 121,
  },
  {
    name: "ProC",
    year: 2014,
    value: 80,
  },
  {
    name: "ProD",
    year: 2014,
    value: 80,
  },
  {
    name: "ProA",
    year: 2015,
    value: 132,
  },
  {
    name: "ProB",
    year: 2015,
    value: 121,
  },
  {
    name: "ProC",
    year: 2015,
    value: 80,
  },
  {
    name: "ProA",
    year: 2016,
    value: 132,
  },
  {
    name: "ProB",
    year: 2016,
    value: 121,
  },
  {
    name: "ProC",
    year: 2016,
    value: 80,
  },
  {
    name: "ProA",
    year: 2017,
    value: 132,
  },
  {
    name: "ProB",
    year: 2017,
    value: 121,
  },
  {
    name: "ProC",
    year: 2017,
    value: 80,
  },
  {
    name: "ProA",
    year: 2018,
    value: 132,
  },
  {
    name: "ProB",
    year: 2018,
    value: 121,
  },
  {
    name: "ProC",
    year: 2018,
    value: 80,
  },
  {
    name: "ProA",
    year: 2019,
    value: 132,
  },
  {
    name: "ProB",
    year: 2019,
    value: 121,
  },
  {
    name: "ProC",
    year: 2019,
    value: 80,
  },
  {
    name: "ProA",
    year: 2020,
    value: 132,
  },
  {
    name: "ProB",
    year: 2020,
    value: 121,
  },
  {
    name: "ProC",
    year: 2020,
    value: 80,
  },
];

const turnOverColumns = [
  {
    title: "Year",
    key: "year",
    dataIndex: "year",
    sorter: (a, b) => a.year > b.year,
    sortDirections: ["descend"],
  },
  {
    title: "Turnover",
    key: "turnover",
    dataIndex: "turnover",
    sorter: (a, b) => a.turnover > b.turnover,
    sortDirections: ["descend"],
  },
];

const productColumns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name > b.name,
    sortDirections: ["descend"],
  },
  {
    title: "Year",
    dataIndex: "year",
    key: "year",
    sorter: (a, b) => a.year > b.year,
    sortDirections: ["descend"],
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
    sorter: (a, b) => a.value > b.value,
    sortDirections: ["descend"],
  },
];

const titleStyle = {
  fontSize: 18,
  fontWeight: 500,
  textAlign: "center",
  margin: "16px 0 32px",
};

function Statistic() {
  const [typeDate, setTypeDate] = useState("day");
  const selectOnChange = (value) => {
    setTypeDate(value);
  };

  const onFinish = (values) => {
    //     console.log(values)
    //     console.log(values.date[0])
    //     console.log(values.date[1])
    // }

    return (
      <section className="admin">
        <div className="heading">Statistic</div>
        <Form
          {...layout}
          onFinish={onFinish}
          initialValues={{ typeDate: "day" }}
        >
          <Space>
            <Form.Item name="typeDate">
              <Select style={{ minWidth: 150 }} onChange={selectOnChange}>
                <Option value="day">Day</Option>
                <Option value="month">Month</Option>
                <Option value="year">Year</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              rules={[{ required: true, message: "Date is required!" }]}
            >
              <RangePicker picker={typeDate} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Space>
        </Form>

        <div style={titleStyle}>Turnover</div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={14}>
            <LineChart
              data={turnOverChartData}
              xField={"year"}
              yField={"turnover"}
              size={5}
            />
          </Col>
          <Col span={10}>
            <Table
              columns={turnOverColumns}
              dataSource={turnOverChartData}
              pagination={{ position: ["none", "none"] }}
              bordered={true}
            />
          </Col>
        </Row>

        <div style={titleStyle}>Product</div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={14}>
            <ColumnChart
              xField="year"
              yField="value"
              seriesField="name"
              data={productChartData}
            />
          </Col>
          <Col span={10}>
            <Table
              columns={productColumns}
              dataSource={productChartData}
              pagination={{ position: ["none", "none"] }}
              bordered={true}
            />
          </Col>
        </Row>
      </section>
    );
  };
}

export default Statistic;
