import React from "react";
import { Table, Tag, Spin } from "antd";
import Pagination from "../../../components/Pagination/Pagination";
import { useFetchData } from "../../../hook/useFetchData";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function Order({ token }) {
  // console.log(token);
  const updateData = (result) => {
    const dataArray = result.Orders.map((element) => {
      return {
        key: element["OrderId"],
        id: element["OrderId"],
        userId: element["UserId"],
        name: element["Name"],
        paymentStatus: element["PaymentStatus"],
        address: element["Address"],
        deliveryStatus: element["DeliveryStatus"],
      };
    });
    return dataArray;
  };

  const { data, currentPage, setCurrentPage, totalPage, spinning } =
    useFetchData(
      {
        get: `${process.env.REACT_APP_HOST_DOMAIN}/api/Orders/GetOrdersWithPagination`,
      },
      null,
      updateData,
      token
    );

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id > b.id,
      sortDirections: ["descend"],
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name > b.name,
      sortDirections: ["descend"],
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Delevery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      render: (status) => {
        if (status === "Waiting") {
          return <Tag color="#1890ff">{status}</Tag>;
        }
        if (status === "Confirmed") {
          return <Tag color="#52c41a">{status}</Tag>;
        }
        if (status === "Delivering") {
          return <Tag color="#faad14">{status}</Tag>;
        }
        if (status === "Completed") {
          return <Tag color="#eb2f96">{status}</Tag>;
        } else {
          return <Tag color="#f5222d">{status}</Tag>;
        }
      },
      filters: [
        {
          text: "Waiting",
          value: "Waiting",
        },
        {
          text: "Confirmed",
          value: "Confirmed",
        },
        {
          text: "Delivering",
          value: "Delivering",
        },
        {
          text: "Completed",
          value: "Completed",
        },
        {
          text: "Cancelled",
          value: "Cancelled",
        },
      ],
      onFilter: (value, record) => record.deliveryStatus.indexOf(value) === 0,
    },
    {
      title: "Actions",
      dataIndex: "Update",
      key: "Update",
      render: (_, record) => (
        <Link to={`/admin/Order/${record.key}`}>Edit</Link>
      ),
    },
  ];

  return (
    <section className="admin">
      <div className="heading">Order</div>
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
  };
};

export default connect(mapStateToProps, null)(Order);
