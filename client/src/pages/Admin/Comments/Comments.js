import React, { useState } from "react";
import { Table, Button, Spin } from "antd";
import Pagination from "../../../components/Pagination/Pagination";
import { AiTwotoneDelete } from "react-icons/ai";
import AddComment from "../../../components/AddComment/AddComment";
import moment from "moment";
import { useFetchData } from "../../../hook/useFetchData";
import { connect } from "react-redux";

function Comments({ token, userId, avatarUser, username }) {
  const [replyUserName, setReplyUserName] = useState();
  const [replyCommentId, setReplyCommentId] = useState();
  const [productId, setProductId] = useState();

  const updateData = (result) => {
    const dataArray = result.Comments.map((element) => {
      return {
        key: element["Id"],
        id: element["Id"],
        productId: element.Product.Id,
        username: element.User.Username,
        product: element.Product.Name,
        content: element.Content,
        date: element.Date,
        replyFrom: element.ReplyFrom,
      };
    });
    return dataArray;
  };

  const {
    data,
    forceUpdate,
    currentPage,
    setCurrentPage,
    totalPage,
    spinning,
    deleteReq,
    deletiveArray,
  } = useFetchData(
    {
      get: `${process.env.REACT_APP_HOST_DOMAIN}/api/comments/GetCommentsWithPagination`,
      delete: `${process.env.REACT_APP_HOST_DOMAIN}/api/comments/Delete`,
    },
    null,
    updateData,
    token
  );

  const deleteHandler = () => {
    if (deletiveArray.current.length === 0) return;
    deleteReq();
  };

  const handleReply = (commentId) => {
    const item = data.find((ele) => ele.id === commentId);
    setReplyCommentId(item.replyFrom || item.id);
    setReplyUserName(item.username);
    setProductId(item.productId);
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      deletiveArray.current = selectedRows.map((ele) => ele.key);
    },
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username > b.username,
      sortDirections: ["descend"],
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      sorter: (a, b) => a.product > b.product,
      sortDirections: ["descend"],
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date > b.date,
      render: (date) => (
        <p>{moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</p>
      ),
    },
    {
      title: "Action",
      dataIndex: "reply",
      key: "reply",
      render: (_, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handleReply(record.key)}
        >
          Reply
        </div>
      ),
    },
  ];

  return (
    <section className="admin">
      <div className="heading">Comments</div>
      <div className="buttonLayout">
        <Button size="large" type="danger" onClick={deleteHandler}>
          <AiTwotoneDelete className="icon" /> Delete
        </Button>
      </div>
      <Spin spinning={spinning}>
        <Table
          columns={columns}
          dataSource={data}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
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
      <AddComment
        forceUpdate={forceUpdate}
        replyUserName={replyUserName}
        replyCommentId={replyCommentId}
        productId={productId}
        setReplyCommentId={setReplyCommentId}
        setReplyUserName={setReplyUserName}
        userId={userId}
        token={token}
        username={username}
        avatarUser={avatarUser}
      />
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userId: state.auth.id,
    username: state.auth.username,
    avatarUser: state.auth.avatar,
  };
};

export default connect(mapStateToProps)(Comments);
