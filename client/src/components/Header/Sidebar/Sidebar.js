import React from "react";
import "./Sidebar.scss";
import { connect } from "react-redux";
import { IoMdClose } from "react-icons/io";
import SidebarItem from "./SidebarItem/SidebarItem";
import SidebarAccount from "./SidebarAccount/SidebarAccount";
import * as actionTypes from "../../../store/actions/actionTypes";
import * as actions from "../../../store/actions/index";
import { Link } from "react-router-dom";

function Sidebar({
  showSidebar,
  onCloseSidebar,
  onCloseOverlay,
  isAuth,
  onLogout,
  brands,
}) {
  const closeSidebarHandler = () => {
    onCloseSidebar();
    onCloseOverlay();
  };

  return (
    <div className={`sidebar ${showSidebar && "active"}`}>
      <div className="sidebar__close" onClick={closeSidebarHandler}>
        <IoMdClose />
      </div>
      <ul className="sidebar__menu">
        <Link to="/">
          <SidebarItem key={0} content="Home" />
        </Link>
        <SidebarItem key={1} content="Brands" submenu={brands} />
        <Link to="/products">
          <SidebarItem key={3} content="Products" />
        </Link>
        <Link to="/products">
          <SidebarItem key={2} content="Mens" />
        </Link>
        <Link to="/products">
          <SidebarItem key={3} content="Ladies" />
        </Link>
      </ul>
      <SidebarAccount isAuth={isAuth} onLogout={onLogout} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    showSidebar: state.ui.showSidebar,
    isAuth: state.auth.token !== null,
    brands: state.brand.brands,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCloseSidebar: () => dispatch({ type: actionTypes.CLOSE_SIDEBAR }),
    onCloseOverlay: () => dispatch({ type: actionTypes.CLOSE_OVERLAY }),
    onLogout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
