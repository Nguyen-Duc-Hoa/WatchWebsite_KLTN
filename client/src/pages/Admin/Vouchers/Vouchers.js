import { Button, Space, Spin, Table } from "antd";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { notify } from "../../../helper/notify";
import Pagination from "../../../components/Pagination/Pagination";
import { FaLock, FaUnlockAlt } from "react-icons/fa";

const Vouchers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const fetchVouchers = () => {
      setLoading(true);
      fetch(
        `${process.env.REACT_APP_HOST_DOMAIN}/api/vouchers/GetVouchers?currentPage=${currentPage}`
      )
        .then((res) => res.json())
        .then((data) => {
          setVouchers(data.Vouchers);
          setTotalPage(data.TotalPage);
          setCurrentPage(data.CurrentPage);
          console.log(data);
        })
        .catch(() =>
          notify(
            "LOAD FAILED",
            "Something went wrong :( Please try again.",
            "error"
          )
        );
      setLoading(false);
    };

    fetchVouchers();
  }, [currentPage]);

  const columns = [
    {
      title: "ID",
      dataIndex: "VoucherId",
      key: "VoucherId",
      sorter: (a, b) => a.VoucherId > b.VoucherId,
      sortDirections: ["descend"],
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      sorter: (a, b) => a.Name > b.Name,
      sortDirections: ["descend"],
    },
    {
      title: "Code",
      dataIndex: "Code",
      key: "Code",
      sorter: (a, b) => a.Code > b.Code,
      sortDirections: ["descend"],
    },
    {
      title: "Discount",
      dataIndex: "Discount",
      key: "Discount",
      sorter: (a, b) => a.Discount > b.Discount,
      sortDirections: ["descend"],
    },
    {
      title: "Start",
      dataIndex: "StartDate",
      key: "StartDate",
      align: "center",
        render: (source) => <span>{new Date(source).toLocaleDateString()}</span>,
    },
    {
      title: "End",
      dataIndex: "EndDate",
      key: "EndDate",
      align: "center",
        render: (source) => <span>{new Date(source).toLocaleDateString()}</span>,
    },
    {
      title: "State",
      dataIndex: "State",
      key: "State",
      align: "center",
      render: (state) => {
        if (state) return <FaUnlockAlt style={{ fontSize: 20 }} />;
        return <FaLock style={{ fontSize: 20 }} />;
      },
    },
    {
      title: "Action",
      dataIndex: "update",
      key: "update",
      render: (_, record) => (
        <Link to={`/admin/vouchers/${record.VoucherId}`}>Edit</Link>
      ),
    },
  ];

  return (
    <section className="admin">
      <div className="heading">Vouchers</div>
      <div className="buttonLayout">
        <Space>
          <Link to="/admin/vouchers/add">
            <Button size="large" type="primary">
              <AiOutlineAppstoreAdd className="icon" />
              Add
            </Button>
          </Link>
        </Space>
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={vouchers}
          bordered={true}
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
};

export default Vouchers;
