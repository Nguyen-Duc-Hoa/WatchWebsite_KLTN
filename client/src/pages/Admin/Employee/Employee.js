import React from "react";
import { Table, Button, Spin } from "antd";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import Pagination from "../../../components/Pagination/Pagination";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { Link } from "react-router-dom";
import SearchBox from "../../../components/SearchBox/SearchBox";
import { useFetchData } from "../../../hook/useFetchData";
import { connect } from "react-redux";

function Employee({ token }) {
  
  const updateData = (result) => {
    const dataArray = result.Users.map((element) => {
      return {
        key: element["Id"],
        id: element["Id"],
        name: element["Name"],
        phone: element["Phone"],
        address: element["Address"],
        state: element["State"],
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
    updateReq,
    setSearchKey,
    forceUpdate,
  } = useFetchData(
    {
      get: `${process.env.REACT_APP_HOST_DOMAIN}/api/User/SearchEmployee`,
      post: `${process.env.REACT_APP_HOST_DOMAIN}/api/User/UpdateStateEmployee`,
    },
    null,
    updateData,
    token
  );

  const changeStateHandler = (row) => {
    updateReq("PUT", row, () => {
      forceUpdate();
      return data;
    });
  };

  const searchHandler = (values) => {
    setSearchKey(values.search);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name > b.name,
      sortDirections: ["descend"],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address > b.address,
      sortDirections: ["descend"],
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      align: "center",
      render: (state, record) => {
        return (
          <>
            {!state ? (
              <FaLock
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                }}
                onClick={() => changeStateHandler(record)}
              />
            ) : (
              <FaUnlockAlt
                style={{
                  fontSize: 20,
                  cursor: "pointer",
                }}
                onClick={() => changeStateHandler(record)}
              />
            )}
          </>
        );
      },
    },
  ];

  return (
    <section className="admin">
      <div className="heading">Employee</div>
      <div className="buttonLayout" style={{ justifyContent: "space-between" }}>
        <SearchBox onSubmit={searchHandler} />
        <Link to="/admin/CreateAccount">
          <Button size="large" type="primary">
            <AiOutlineAppstoreAdd className="icon" /> Create new account
          </Button>
        </Link>
      </div>
      <Spin spinning={spinning}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ position: ["none", "none"] }}
          footer={() => (
            <Pagination
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              noPadding={true}
              totalPage={totalPage}
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

export default connect(mapStateToProps, null)(Employee);
