import React, { useEffect, useState } from "react";
import "./OrderHistory.scss";
import { Spin, Table, Tag } from "antd";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import { connect } from "react-redux";
import Pagination from "../../components/Pagination/Pagination";
import { Link } from "react-router-dom";
import moment from "moment";

const { Column } = Table;



const breadcrumbRoute = [
  { name: "Home", link: "/" },
  { name: "Order History", link: "/orderHistory" },
];

function OrderHistory({ token, userId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [data, setData] = useState([]);
  const [spinning, setSpinning] = useState(false);
  useEffect(() => {
    setSpinning(true);
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/Orders/History?currentPage=${currentPage}&userid=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
          console.log(result)
        setData(
          result.Histories.map((ele) => {
            return {
              ...ele,
              key: ele.OrderId,
            };
          })
        );
        setCurrentPage(result.CurrentPage);
        setTotalPage(result.TotalPage);
      })
      .catch((err) => console.log(err));
    setSpinning(false);
  }, [currentPage]);

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      sorter: (a, b) => a.Name > b.Name,
      sortDirections: ["descend"],
    },
    {
      title: "Date",
      dataIndex: "OrderDate",
      key: "OrderDate",
      sorter: (a, b) => a.OrderDate > b.OrderDate,
      sortDirections: ["descend"],
      render: (date) => (
          <p>{moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a").toString()}</p>
      )
    },
    {
      title: "Total",
      dataIndex: "Total",
      key: "Total",
    },
    {
      title: "Delivery Status",
      dataIndex: "DeliveryStatus",
      key: "DeliveryStatus",
      sorter: (a, b) => a.DeliveryStatus > b.DeliveryStatus,
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => (
        <Link to={`/Orders/${record.key}`}>Detail</Link>
      ),
    },
  ];

  return (
    <section className="orderHistory">
      <Breadcrumbing route={breadcrumbRoute} />
      <Spin spinning={spinning}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ position: ["none", "none"] }}
          footer={() => (
            <Pagination
              currentPage={currentPage}
              noPadding={true}
              totalPage={totalPage}
              setCurrentPage={setCurrentPage}
            />
          )}
          bordered={true}
        />
      </Spin>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userId: state.auth.id,
  };
};

export default connect(mapStateToProps)(OrderHistory);
