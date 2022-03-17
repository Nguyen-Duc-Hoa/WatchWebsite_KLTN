import React from "react";
import { Spin, Table } from "antd";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import Pagination from "../../../components/Pagination/Pagination";
import SearchBox from "../../../components/SearchBox/SearchBox";
import { useFetchData } from "../../../hook/useFetchData";
import { connect } from "react-redux";

function ManageAccount({ token }) {
  // console.log(token);
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
      get: `${process.env.REACT_APP_HOST_DOMAIN}/api/User/SearchCustomer`,
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
      <div className="heading">Customer Account</div>
      <div className="buttonLayout">
        <SearchBox onSubmit={searchHandler} />
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

export default connect(mapStateToProps, null)(ManageAccount);
