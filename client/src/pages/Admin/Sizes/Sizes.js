import React from "react";
import {
  Table,
  Popover,
  Popconfirm,
  Form,
  Typography,
  Space,
  Button,
  Input,
  Spin,
} from "antd";
import Pagination from "../../../components/Pagination/Pagination";
import { AiOutlineAppstoreAdd, AiTwotoneDelete } from "react-icons/ai";
import EditTableCell from "../../../components/EditTableCell/EditTableCell";
import { useMergedColumns } from "../../../hook/useMergedColums";
import { useFetchData } from "../../../hook/useFetchData";
import { useEditTable } from "../../../hook/useEditTable";
import { connect } from "react-redux";

function Sizes({ token }) {
  const updateData = (result) => {
    const dataArray = result.Sizes.map((element) => {
      return {
        key: element["SizeId"],
        id: element["SizeId"],
        value: element["SizeValue"],
      };
    });
    return dataArray;
  };

  const [
    editingKey,
    setEditingKey,
    visible,
    form,
    handleVisibleChange,
    edit,
    cancel,
  ] = useEditTable();

  const {
    data,
    currentPage,
    setCurrentPage,
    totalPage,
    loading,
    spinning,
    updateReq,
    deleteReq,
    deletiveArray,
  } = useFetchData(
    {
      get: `${process.env.REACT_APP_HOST_DOMAIN}/api/Sizes`,
      post: `${process.env.REACT_APP_HOST_DOMAIN}/api/Sizes`,
      delete: `${process.env.REACT_APP_HOST_DOMAIN}/api/Sizes/Delete`,
    },
    setEditingKey,
    updateData,
    token
  );

  const isEditing = (record) => record.key === editingKey;

  const save = async (key) => {
    const row = await form.validateFields();
    const newData = [...data];
    const index = newData.findIndex((item) => item.key === key);
    updateReq("PUT", { SizeId: key, SizeValue: row.value }, () => {
      newData.splice(index, 1, {
        ...newData[index],
        ...row,
      });
      return newData;
    });
  };

  const deleteHandler = () => {
    if (deletiveArray.current.length === 0) return;
    deleteReq();
  };

  const addSizeHandler = (values) => {
    updateReq("POST", { SizeId: 0, SizeValue: values.value });
  };

  const rowSelection = {
    onChange: (_, selectedRows) => {
      deletiveArray.current = selectedRows.map((ele) => ele.key);
    },
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id > b.id,
      sortDirections: ["descend"],
    },
    {
      title: "Value (mm)",
      dataIndex: "value",
      key: "value",
      sorter: (a, b) => a.value > b.value,
      sortDirections: ["descend"],
      editable: true,
    },
    {
      title: "Actions",
      dataIndex: "edit",
      key: "edit",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = useMergedColumns(columns, isEditing);

  return (
    <section className="admin">
      <div className="heading">Sizes</div>
      <div className="buttonLayout">
        <Space>
          <Popover
            content={
              <Form onFinish={addSizeHandler}>
                <Form.Item name="value" rules={[{ required: true }]}>
                  <Input placeholder="Value (mm)" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            }
            placement="leftBottom"
            title="Add here"
            trigger="click"
            visible={visible}
            onVisibleChange={handleVisibleChange}
          >
            <Button size="large" type="primary">
              <AiOutlineAppstoreAdd className="icon" /> Add
            </Button>
          </Popover>
          <Button size="large" type="danger" onClick={deleteHandler}>
            <AiTwotoneDelete className="icon" /> Delete
          </Button>
        </Space>
      </div>
      <Form form={form} component={false}>
        <Spin spinning={spinning}>
          <Table
            columns={mergedColumns}
            dataSource={data}
            components={{
              body: {
                cell: EditTableCell,
              },
            }}
            rowClassName="editable-row"
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
      </Form>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps, null)(Sizes);
