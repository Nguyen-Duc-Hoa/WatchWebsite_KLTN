import React from "react";
import { Button, Space, Spin, Table, Tag } from "antd";
import Pagination from "../../../components/Pagination/Pagination";
import { AiOutlineAppstoreAdd, AiTwotoneDelete } from "react-icons/ai";
import SearchBox from "../../../components/SearchBox/SearchBox";
import { useFetchData } from "../../../hook/useFetchData";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function Products({ token }) {
  const updateData = (result) => {
    const dataArray = result.Products.map((element) => {
      return {
        key: element["Id"],
        id: element["Id"],
        name: element["Name"],
        image: element["Image"],
        amount: element["Amount"],
        price: element["Price"],
        brand: element["Brand"],
        gender: element["Gender"],
      };
    });
    return dataArray;
  };

  const {
    data,
    currentPage,
    setCurrentPage,
    totalPage,
    spinning,
    setSearchKey,
    deleteReq,
    deletiveArray,
  } = useFetchData(
    {
      get: `${process.env.REACT_APP_HOST_DOMAIN}/api/products/Search`,
      delete: `${process.env.REACT_APP_HOST_DOMAIN}/api/products/Delete`,
    },
    null,
    updateData,
    token
  );

  const searchHandler = (values) => {
    setSearchKey(values.search);
    setCurrentPage(1);
  };

  const deleteHandler = () => {
    // console.log(deletiveArray.current)
    if (deletiveArray.current.length === 0) return;
    deleteReq();
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      deletiveArray.current = selectedRows.map((ele) => ele.key);
    },
  };

  const columns = [
    {
      title: "Id",
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
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) =>
        gender === 1 ? (
          <Tag color="#52c41a">Men</Tag>
        ) : (
          <Tag color="#eb2f96">Women</Tag>
        ),
      filters: [
        {
          text: "Men",
          value: "1",
        },
        {
          text: "Women",
          value: "0",
        },
      ],
      onFilter: (value, record) => record.gender === +value
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      sorter: (a, b) => a.brand > b.brand,
      sortDirections: ["descend"],
      filters: [
        {
          text: "Gucci",
          value: "Gucci",
        },
        {
          text: "Piaget",
          value: "Piaget",
        },
        {
          text: "Lange & Söhne",
          value: "Lange & Söhne",
        },
        {
          text: "Audemars Piguet",
          value: "Audemars Piguet",
        },
      ],
      onFilter: (value, record) => record.brand.indexOf(value) === 0,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount > b.amount,
      sortDirections: ["descend"],
      filters: [
        {
          text: "Less than 10",
          value: "<10",
        },
        {
          text: "From 10 to 50",
          value: "10-50",
        },
        {
          text: "More than 50",
          value: ">50",
        },
      ],
      onFilter: (value, record) => {
        if (value === "<10") {
          return parseInt(record.amount) < 10;
        } else if (value === "10-50") {
          return parseInt(record.amount) >= 10 && parseInt(record.amount) <= 50;
        } else if (value === ">50") {
          return parseInt(record.amount) > 50;
        }
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price > b.price,
      sortDirections: ["descend"],
      filters: [
        {
          text: "Less than 200",
          value: "<200",
        },
        {
          text: "From 200 to 500",
          value: "200-500",
        },
        {
          text: "More than 500",
          value: ">500",
        },
      ],
      onFilter: (value, record) => {
        if (value === "<200") {
          return parseFloat(record.price) < 200;
        } else if (value === "200-500") {
          return (
            parseFloat(record.price) >= 200 && parseFloat(record.price) <= 500
          );
        } else if (value === ">500") {
          return parseFloat(record.price) > 500;
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "Edit",
      key: "Edit",
      render: (_, record) => (
        <Link to={`/admin/Product/${record.key}`}>Edit</Link>
      ),
    },
  ];

  return (
    <section className="admin">
      <div className="heading">Products</div>
      <div className="buttonLayout" style={{ justifyContent: "space-between" }}>
        <SearchBox onSubmit={searchHandler} />
        <Space>
          <Link to="/admin/Product/AddProduct">
            <Button size="large" type="primary">
              <AiOutlineAppstoreAdd className="icon" /> Add
            </Button>
          </Link>
          <Button size="large" type="danger" onClick={deleteHandler}>
            <AiTwotoneDelete className="icon" /> Delete
          </Button>
        </Space>
      </div>
      <Spin spinning={spinning}>
        <Table
          columns={columns}
          dataSource={data}
          bordered={true}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          pagination={{ position: ["none", "none"] }}
          footer={() => (
            <Pagination
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              noPadding={true}
              totalPage={totalPage}
            />
          )}
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

export default connect(mapStateToProps, null)(Products);
