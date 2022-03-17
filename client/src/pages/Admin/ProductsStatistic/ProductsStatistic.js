import React, { useState } from "react";
import {
  Select,
  DatePicker,
  Space,
  Button,
  Form,
  Row,
  Col,
  Table,
  Divider,
} from "antd";
import LineChart from "../../../components/LineChart/LineChart";
import ColumnChart from "../../../components/ColumnChart/ColumnChart";
import { connect } from "react-redux";

const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

// const turnOverChartData = [
//     { year: '2014', turnover: 3.5 },
//     { year: '2015', turnover: 5 },
//     { year: '2016', turnover: 4.9 },
//     { year: '2017', turnover: 6 },
//     { year: '2018', turnover: 7 },
//     { year: '2019', turnover: 9 },
//     { year: '2020', turnover: 13 },
// ];

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

// const turnOverColumns = [
//     {
//         title: 'Year',
//         key: 'year',
//         dataIndex: 'year',
//         sorter: (a, b) => a.year > b.year,
//         sortDirections: ['descend'],
//     },
//     {
//         title: 'Turnover',
//         key: 'turnover',
//         dataIndex: 'turnover',
//         sorter: (a, b) => a.turnover > b.turnover,
//         sortDirections: ['descend'],
//     },
// ]

const productColumns = [
  {
    title: "Name",
    dataIndex: "Name",
    key: "Name",
    sorter: (a, b) => a.Name > b.Name,
    sortDirections: ["descend"],
  },
  {
    title: "Value",
    dataIndex: "Value",
    key: "Value",
    sorter: (a, b) => a.Value > b.Value,
    sortDirections: ["descend"],
  },
  {
    title: "Percent",
    dataIndex: "Percent",
    key: "Percent",
    sorter: (a, b) => a.Percent > b.Percent,
    sortDirections: ["descend"],
  },
  {
    title: "AveragePrice",
    dataIndex: "AveragePrice",
    key: "AveragePrice",
    sorter: (a, b) => a.AveragePrice > b.AveragePrice,
    sortDirections: ["descend"],
    render: (avg) => <p>{avg.toFixed(2)}</p>
  },
  {
    title: "Quantity",
    dataIndex: "Quantity",
    key: "Quantity",
    sorter: (a, b) => a.Quantity > b.Quantity,
    sortDirections: ["descend"],
  },
];

const titleStyle = {
  fontSize: 18,
  fontWeight: 500,
  textAlign: "center",
  margin: "16px 0 32px",
};

function Statistic({ token }) {
  const [typeDate, setTypeDate] = useState("month");
  const [productChartData, setProductChartData] = useState([]);

  const selectOnChange = (value) => {
    setTypeDate(value);
  };

  const onFinish = (values) => {
    // console.log({
    //   typeDate: typeDate,
    //   date: [values.date.format("MM/DD/yyyy")],
    // });
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/statis/chart2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        typeDate: typeDate,
        date: [values.date.format("MM/DD/yyyy")],
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        setProductChartData(result);
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="admin">
      <div className="heading">Statistic</div>
      <Form
        {...layout}
        onFinish={onFinish}
        initialValues={{ typeDate: "month" }}
      >
        <Space>
          <Form.Item name="typeDate">
            <Select style={{ minWidth: 150 }} onChange={selectOnChange}>
              {/* <Option value="day">Day</Option> */}
              <Option value="month">Month</Option>
              <Option value="year">Year</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            rules={[{ required: true, message: "Date is required!" }]}
          >
            <DatePicker picker={typeDate} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Space>
      </Form>

      <div style={titleStyle}>Product</div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={24}>
          <ColumnChart
            xField="Name"
            yField="Value"
            seriesField=""
            data={productChartData}
          />
          {/* <LineChart
            data={productChartData}
            xField={"Name"}
            yField={"Value"}
          /> */}
        </Col>
      </Row>
      <Divider />
      <div style={titleStyle}>Detail</div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={24}>
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
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(Statistic);
