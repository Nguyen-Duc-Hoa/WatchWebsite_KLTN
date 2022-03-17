import React from "react";
import "./SidebarAccount.scss";
import { Button, Space, Row, Col } from "antd";
import { Link } from "react-router-dom";

function SidebarAccount({ isAuth, onLogout }) {
  return (
    <div className="sidebar__account">
      <div className="heading">My Account</div>
      <Space direction="vertical" style={{ width: "100%" }}>
        {isAuth ? (
          <>
            <Row gutter={12}>
              <Col span={12}>
                <Link to="/profile">
                  <Button
                    style={{ height: "46px" }}
                    size="large"
                    block
                    type="primary"
                  >
                    Profile
                  </Button>
                </Link>
              </Col>
              <Col span={12}>
                <Link to="/orderhistory">
                  <Button
                    style={{ height: "46px" }}
                    size="large"
                    block
                    type="primary"
                  >
                    Orders history
                  </Button>
                </Link>
              </Col>
            </Row>
            <Button
              style={{ height: "46px" }}
              size="large"
              block
              onClick={onLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              style={{ height: "46px" }}
              size="large"
              type="primary"
              block
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button style={{ height: "46px" }} size="large" block>
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
      </Space>
    </div>
  );
}

export default SidebarAccount;
