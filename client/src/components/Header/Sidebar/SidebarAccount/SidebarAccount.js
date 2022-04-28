import React from "react";
import "./SidebarAccount.scss";
import { Button, Space, Row, Col } from "antd";
import { Link } from "react-router-dom";
import useAnalyticsEventTracker from "../../../../hook/useAnalyticsEventTracker";

function SidebarAccount({ isAuth, onLogout }) {
  const gaEventTracker = useAnalyticsEventTracker("Sidebar");

  return (
    <div className="sidebar__account">
      <div className="heading">My Account</div>
      <Space direction="vertical" style={{ width: "100%" }}>
        {isAuth ? (
          <>
            <Row gutter={12}>
              <Col span={12}>
                <Link to="/profile" onClick={() => gaEventTracker("Profile")}>
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
                <Link
                  to="/orderhistory"
                  onClick={() => gaEventTracker("Orders history")}
                >
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
              onClick={() => {
                onLogout();
                gaEventTracker("Logout");
              }}
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
              onClick={() => gaEventTracker("Login")}
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              style={{ height: "46px" }}
              size="large"
              block
              onClick={() => gaEventTracker("Register")}
            >
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
      </Space>
    </div>
  );
}

export default SidebarAccount;
