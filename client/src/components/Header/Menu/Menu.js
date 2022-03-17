import React from "react";
import "./Menu.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { connect } from "react-redux";
import * as actionTypes from "../../../store/actions/actionTypes";
import { useHistory, Link } from "react-router-dom";

function Menu({
  onOpenSidebar,
  onOpenOverlay,
  brands,
  onSetBrands,
  onSetGender,
}) {
  const history = useHistory();
  const openSidebarHandler = () => {
    onOpenSidebar();
    onOpenOverlay();
  };
  const clickHandler = (brandName) => {
    onSetBrands(brandName);
    history.push("/products");
  };
  return (
    <div className="menu">
      <div className="menu__item">
        <Link to="/">
          <span>Home</span>
        </Link>
      </div>
      <div className="menu__item">
        <span className="item-brand">Brands</span>
        <div className="drop-down">
          <div className="brands">
            {brands &&
              brands.length !== 0 &&
              brands.map((ele) => (
                <div
                  onClick={() => clickHandler(ele.name)}
                  to={`/products`}
                  key={ele.key}
                >
                  {ele.name}
                </div>
              ))}
          </div>
          <div>
            <img
              src="https://d1rkccsb0jf1bk.cloudfront.net/landingpages/rado/270x350OptRadoTopNav.webp"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="menu__item">
        <Link to="/products">
          <span>Products</span>
        </Link>
      </div>
      <div className="menu__item">
        <Link to="/products" onClick={() => onSetGender(0)}>
          <span>Ladies</span>
        </Link>
      </div>
      <div className="menu__item">
        <Link to="/products" onClick={() => onSetGender(1)}>
          <span>Mens</span>
        </Link>
      </div>
      <div className="hamburger" onClick={openSidebarHandler}>
        <GiHamburgerMenu />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    brands: state.brand.brands,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOpenSidebar: () => dispatch({ type: actionTypes.OPEN_SIDEBAR }),
    onOpenOverlay: () => dispatch({ type: actionTypes.OPEN_OVERLAY }),
    onSetBrands: (brandName) =>
      dispatch({ type: actionTypes.FILTER_SET_BRAND, payload: brandName }),
    onSetGender: (gender) =>
      dispatch({ type: actionTypes.FILTER_SET_GENDER, payload: gender }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
