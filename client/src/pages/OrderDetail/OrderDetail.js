import React, { useEffect, useState } from "react";
import "./OrderDetail.scss";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import { notify } from "../../helper/notify";
import { Table, Spin, Divider } from "antd";
import moment from "moment";
import { useParams } from "react-router";
import { connect } from "react-redux";
import Page from "../../components/Page/Page";

const breadcrumbRoute = [
  { name: "Home", link: "/" },
  { name: "Order History", link: "/orderHistory" },
  { name: "Order Detail", link: "/" },
];

const columns = [
  {
    title: "Id",
    dataIndex: "ProductId",
    key: "ProductId",
    sorter: (a, b) => a.ProductId > b.ProductId,
    sortDirections: ["descend"],
  },
  {
    title: "Product Name",
    dataIndex: "ProductName",
    key: "ProductName",
    sorter: (a, b) => a.ProductName > b.ProductName,
    sortDirections: ["descend"],
  },
  {
    title: "Number",
    dataIndex: "Count",
    key: "Count",
    sorter: (a, b) => a.Count > b.Count,
    sortDirections: ["descend"],
  },
  {
    title: "Price",
    dataIndex: "Price",
    key: "Price",
    sorter: (a, b) => a.Price > b.Price,
    sortDirections: ["descend"],
    render: (price, record) => <div>${price * record.Count}</div>,
  },
];

function OrderDetail({ token }) {
  const { id } = useParams();
  const [tableDataSrc, setTableDataSrc] = useState([]);
  const [data, setData] = useState(null);
  const [spinning, setSpinning] = useState(false);
  useEffect(() => {
    if (!id) return;
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/orders/AdminGetOrderDetail?orderid=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        const newData = {
          OrderDate: moment(result.OrderDate).format(
            "dddd, MMMM Do YYYY, h:mm:ss a"
          ),
          Total: result.Total,
          Address: result.Address,
          Name: result.Name,
          Phone: result.Phone,
          DeliveryStatus: result.DeliveryStatus,
          PaymentMethod: result.PaymentMethod,
          VoucherName: result.VoucherName,
          Discount: result.Discount,
        };
        setData(newData);
        setTableDataSrc(result.OrderDetails);
      })
      .catch(() => {
        notify(
          "LOAD FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  }, [id]);

  const title = "Order detail";
  return (
    <Page
      title={title}
      schema={{
        "@context": "http://schema.org",
        "@type": "OrderDetailPage",
        name: title,
      }}
    >
      <section className="orderDetail">
        <Breadcrumbing route={breadcrumbRoute} />
        <Spin spinning={spinning}>
          <div className="heading">Invoice</div>
          <div className="orderItem">
            <div className="title left">BILL FROM</div>
            <div className="title right">BILL TO</div>
          </div>
          <div className="orderItem">
            <div className="name">{data && data.Name}</div>
            <div className="name">MINIMIX SHOP</div>
          </div>
          <div className="orderItem">
            <div>{data && data.Address}</div>
            <div>SU PHAM KY THUAT</div>
          </div>
          <div className="orderItem">
            <div>{data && data.Phone}</div>
            <div>0908849577</div>
          </div>
          <Divider />
          <div className="orderItem vertical">
            <div>Order status: {data && data.DeliveryStatus}</div>
            <div>Create at: {data && data.OrderDate}</div>
            <div>Payment method: {data && data.PaymentMethod}</div>
            {data && data.VoucherName && <div>Voucher: {data.VoucherName}</div>}
            {data && data.Discount && <div>Discount: {data.Discount}$</div>}
          </div>
          <Divider />
          <Table
            columns={columns}
            dataSource={tableDataSrc}
            pagination={{ position: ["none", "none"] }}
            bordered={true}
          />
        </Spin>
        <div className="total">
          <span>Total:</span> ${data && data.Total}
        </div>
      </section>
    </Page>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(OrderDetail);
