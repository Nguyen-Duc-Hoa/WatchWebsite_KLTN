import React, { useEffect, useState } from "react";
import { Button, Divider, Table, Space, Spin } from "antd";
import "./OrderDetail.scss";
import OrderState from "../../../components/OrderState/OrderState";
import { useParams } from "react-router-dom";
import { notify } from "../../../helper/notify";
import { connect } from "react-redux";

const columns = [
  {
    title: "Id",
    dataIndex: "productId",
    key: "productId",
    sorter: (a, b) => a.productId > b.productId,
    sortDirections: ["descend"],
  },
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
    sorter: (a, b) => a.productName > b.productName,
    sortDirections: ["descend"],
  },
  {
    title: "Number",
    dataIndex: "count",
    key: "count",
    sorter: (a, b) => a.count > b.count,
    sortDirections: ["descend"],
  },
  {
    title: "Price per item",
    dataIndex: "price",
    key: "price",
    sorter: (a, b) => a.price > b.price,
    sortDirections: ["descend"],
    render: (price) => <div>${price}</div>,
  },
];

function OrderDetail({ token }) {
  // console.log(token);

  let { id } = useParams();
  const [currentStep, setCurrentStep] = useState(null);
  const [data, setData] = useState(null);
  const [tableDataSrc, setTableDataSrc] = useState([]);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!id) return;
    setSpinning(true);
    fetchOrderDetail();
    setSpinning(false);
  }, []);

  const updateOrder = () => {
    // console.log(token);
    // console.log({ orderId: data.orderId, deliveryStatus: currentStep });
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/orders/updatestatus`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: data.orderId,
        deliveryStatus: currentStep,
      }),
    })
      .then((response) => {
        if (response.ok) {
          notify(
            "UPDATE SUCCESS",
            "You have already update an order.",
            "success"
          );
        } else {
          notify(
            "LOAD FAILED",
            "Something went wrong :( Please try again.",
            "error"
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchOrderDetail = () => {
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
          orderId: result["OrderId"],
          userId: result["UserId"],
          name: result["Name"],
          paymentStatus: result["PaymentStatus"],
          address: result["Address"],
          deliveryStatus: result["DeliveryStatus"],
          orderDate: result["OrderDate"],
          total: result["Total"],
          phone: result["Phone"],
          products: result["OrderDetails"].map((ele) => {
            return {
              productName: ele.ProductName,
              price: ele.Price,
              count: ele.Count,
              productId: ele.ProductId,
            };
          }),
        };
        // console.log(newData)
        setData(newData);
        setTableDataSrc([...newData.products]);
        setCurrentStep(newData.deliveryStatus);
        // console.log(newData.deliveryStatus);
      })
      .catch((err) => {
        // console.log(err);
        notify(
          "LOAD FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };

  return (
    <section className="admin orderDetailAdmin">
      <Spin spinning={spinning}>
        <div className="heading">{`Order # ${data && data.orderId}`}</div>
        <Divider />
        <div className="personalInfo">
          <div className="billedTo">
            <div className="title">Billed To:</div>
            <div>{data && data.name}</div>
            <div>{data && data.phone}</div>
            <div>{data && data.address}</div>
          </div>
          <div className="shippedBy">
            <div className="title">Shipped By:</div>
            <div>Kayle</div>
          </div>
        </div>
        <div className="payment">
          <div className="paymentInfo">
            <div className="title">Payment Method:</div>
            <div>Visa</div>
          </div>
          <div className="paymentDate">
            <div className="title">Order Date:</div>
            <div>{data && data.orderDate}</div>
          </div>
        </div>
        {currentStep && (
          <OrderState
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        )}
        <div className="title">Order Summary</div>
        <Table
          columns={columns}
          dataSource={tableDataSrc}
          pagination={{ position: ["none", "none"] }}
          bordered={true}
        />
        <div className="subtotal">
          <div className="title">Sub Total</div>
          <div>${data && data.total}</div>
        </div>
        <div className="shippingCost">
          <div className="title">Shipping</div>
          <div>Free</div>
        </div>
        <div className="total">
          <div className="title">Total</div>
          <div className="price">${data && data.total}</div>
        </div>
        <Button type="primary" onClick={updateOrder}>
          Update
        </Button>
      </Spin>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps, null)(OrderDetail);
