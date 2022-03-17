import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Space, Image, Spin } from "antd";
import Pagination from "../../../components/Pagination/Pagination";
import { AiOutlineAppstoreAdd, AiTwotoneDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import { notify } from "../../../helper/notify";

function Brands({ brands, loading, onFetchBrands, totalPage, onDeleteBrands, token }) {
  const [currentPage, setCurrentPage] = useState(1);
  const deletiveArray = useRef([])

  useEffect(() => {
    onFetchBrands(currentPage, notify, token);
  }, [currentPage]);

  const columns = [
    {
      title: "ID",
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
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (source) => (
        <Image width={160} src={`data:image/svg+xml;base64,${source}`} />
      ),
    },
    {
      title: "Action",
      dataIndex: "edit",
      key: "edit",
      render: (_, record) => <Link to={`/admin/Brands/${record.key}`}>Edit</Link>,
    },
  ];

  const rowSelection = {
    onChange: (_, selectedRows) => {
      deletiveArray.current = selectedRows.map((ele) => ele.key);
    },
  };

  const deleteHandler = () => {
    if (deletiveArray.current.length === 0) return;
    onDeleteBrands(deletiveArray.current, notify, token);
  };

  return (
    <section className="admin">
      <div className="heading">Brands</div>
      <div className="buttonLayout">
        <Space>
          <Link to="/admin/Brands/AddBrand">
            <Button size="large" type="primary">
              <AiOutlineAppstoreAdd className="icon" />
              Add
            </Button>
          </Link>
          <Button size="large" type="danger" onClick={deleteHandler}>
            <AiTwotoneDelete className="icon" /> Delete
          </Button>
        </Space>
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={brands}
          bordered={true}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          pagination={{ position: ["none", "none"] }}
          footer={() => (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
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
    loading: state.brand.loading,
    brands: state.brand.brands,
    totalPage: state.brand.totalPage,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchBrands: (currentPage, notify, token) =>
      dispatch(actions.fetchBrands(currentPage, notify, token)),
    onDeleteBrands: (deletiveArray, notify, token) =>
      dispatch(actions.deleteBrands(deletiveArray, notify, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Brands);
