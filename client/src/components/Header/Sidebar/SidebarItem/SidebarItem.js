import React from "react";
import "./SidebarItem.scss";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { Link } from "react-router-dom";
import * as actionTypes from "../../../../store/actions/actionTypes";
import { connect } from "react-redux";
import useAnalyticsEventTracker from "../../../../hook/useAnalyticsEventTracker";

function SidebarItem({ content, submenu, onSetBrands, onSetGender }) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const gaEventTracker = useAnalyticsEventTracker("Sidebar");

  const clickHandler = () => {
    setShowSubmenu(!showSubmenu);
    if (content === "Mens") {
      onSetGender(1);
    } else if (content === "Ladies") {
      onSetGender(0);
    }
  };

  return (
    <li className="sidebar-item" onClick={clickHandler}>
      <div className="item__content">
        {content}
        {submenu && submenu.length !== 0 && (
          <span className="item__arrow">
            <IoIosArrowDown />
          </span>
        )}
      </div>
      <ul className={`item__submenu ${showSubmenu && "active"}`}>
        {submenu &&
          submenu.length !== 0 &&
          submenu.map((ele) => (
            <li key={ele.key}>
              <Link
                onClick={() => {
                  onSetBrands(ele.name);
                  gaEventTracker(ele.name);
                }}
                to={`/products`}
                style={{ display: "inline-block" }}
              >
                {ele.name}
              </Link>
            </li>
          ))}
      </ul>
    </li>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetBrands: (brandName) =>
      dispatch({ type: actionTypes.FILTER_SET_BRAND, payload: brandName }),
    onSetGender: (gender) =>
      dispatch({ type: actionTypes.FILTER_SET_GENDER, payload: gender }),
  };
};

export default connect(null, mapDispatchToProps)(SidebarItem);
