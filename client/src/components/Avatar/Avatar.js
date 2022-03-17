import React from "react";
import { Avatar, Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./Avatar.scss";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { AiOutlineProfile, AiOutlineKey } from "react-icons/ai";
import { Link } from "react-router-dom";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

const MenuAvatar = ({ onLogout }) => {
  const history = useHistory();
  const clickHandler = path => {
    history.push(path)
  }
  return (
    <Menu>
      {/* <Link to="/admin/Profile"> */}
        <Menu.Item key={1} icon={<AiOutlineProfile />} onClick={() => clickHandler("/admin/Profile")}>
          Profile
        </Menu.Item>
      {/* </Link> */}
      {/* <Link to="/admin/ChangePassword"> */}
        <Menu.Item key={2} icon={<AiOutlineKey />} onClick={() => clickHandler("/admin/ChangePassword")}>
          Password
        </Menu.Item>
      {/* </Link> */}
      <Menu.Item
        key={3}
        danger
        icon={<RiLogoutCircleRLine />}
        onClick={onLogout}
      >
        Log out
      </Menu.Item>
    </Menu>
  );
};

function AvatarUser({ onLogout, image, name }) {
  return (
    <div className="avatar">
      <Avatar src={`data:image/png;base64,${image}`} />
      <Dropdown overlay={() => <MenuAvatar onLogout={onLogout} />}>
        <div className="userName">
          {name} <DownOutlined />
        </div>
      </Dropdown>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    image: state.auth.avatar,
    name: state.auth.name
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AvatarUser);
