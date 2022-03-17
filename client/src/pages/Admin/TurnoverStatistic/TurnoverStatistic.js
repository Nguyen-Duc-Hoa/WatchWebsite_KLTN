import React, { useEffect, useState } from "react";
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

const turnOverChartData = [
  { year: "2014", turnover: 3.5 },
  { year: "2015", turnover: 5 },
  { year: "2016", turnover: 4.9 },
  { year: "2017", turnover: 6 },
  { year: "2018", turnover: 7 },
  { year: "2019", turnover: 9 },
  { year: "2020", turnover: 13 },
];

const turnOverColumns = [
  {
    title: "Time",
    key: "Time",
    dataIndex: "Time",
    sorter: (a, b) => a.Time > b.Time,
    sortDirections: ["descend"],
  },
  {
    title: "Turnover",
    key: "TurnOver",
    dataIndex: "TurnOver",
    sorter: (a, b) => a.TurnOver > b.TurnOver,
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
  const [turnOverChartData, setTurnOverChartData] = useState([]);
  const [typeDate, setTypeDate] = useState("day");

  const selectOnChange = (value) => {
    setTypeDate(value);
  };

  const onFinish = (values) => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/statis/chart1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        typeDate: typeDate,
        date: [
          values.date[0].format("MM/DD/yyyy"),
          values.date[1].format("MM/DD/yyyy"),
        ],
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setTurnOverChartData(result);
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="admin">
      <div className="heading">Statistic</div>
      <Form {...layout} onFinish={onFinish} initialValues={{ typeDate: "day" }}>
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
        <Col span={24}>
          <LineChart
            data={turnOverChartData}
            xField={"Time"}
            yField={"TurnOver"}
          />
        </Col>
      </Row>
      <Divider />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={24}>
          <Table
            columns={turnOverColumns}
            dataSource={turnOverChartData}
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
