import React from "react";
import Menu from "./Menu/Menu";
import { FaRegUser } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { BiShoppingBag } from "react-icons/bi";
import "./Header.scss";
import { useState } from "react";
import { connect } from "react-redux";
import * as actionTyes from "../../store/actions/actionTypes";
import * as actions from "../../store/actions/index";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export function Header({ onOpenCart, onOpenOverlay, isAuth, onLogout, onSetSearch, numberOfCart }) {
  const history = useHistory();
  const [showSearchArea, setShowSearchArea] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const openCartHandler = () => {
    onOpenOverlay();
    onOpenCart();
  };

  const searchHandler = () => {
    onSetSearch(searchValue);
    history.push("/products");
  };

  return (
    <section className="header">
      <Menu />
      <div className="header__logo">
        <Link to="/">MiniMix</Link>
      </div>

      <div className="header__icons">
        <div className="icons__item item__account">
          <span>
            <FaRegUser />
          </span>
          <div className="dropdown-account" style={{ bottom: isAuth ? "-140%" : "-90%" }}>
            {isAuth ? (
              <>
                <div>
                  <Link to="/profile">Profile</Link>
                </div>
                <div>
                  <Link to="/orderHistory">Orders</Link>
                </div>
                <div onClick={onLogout}>Logout</div>
              </>
            ) : (
              <>
                <div>
                  <Link to="/login">Login</Link>
                </div>
                <div>
                  <Link to="/register">Register</Link>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="icons__item">
          <span onClick={() => setShowSearchArea(true)}>
            <FiSearch />
          </span>
          <section
            className={`search__area ${
              showSearchArea && "search__area--active"
            }`}
          >
            <div className="search__icon" onClick={searchHandler}>
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder="Search our store"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <div
              className="search__close"
              onClick={() => setShowSearchArea(false)}
            >
              <IoMdClose />
            </div>
          </section>
        </div>
        <div className="icons__item item__cart" onClick={openCartHandler}>
          <span>
            <BiShoppingBag />
          </span>
          <div className="cart__number">{numberOfCart}</div>
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null,
    numberOfCart: state.cart.cart.length
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOpenCart: () => dispatch({ type: actionTyes.OPEN_CART }),
    onOpenOverlay: () => dispatch({ type: actionTyes.OPEN_OVERLAY }),
    onLogout: () => dispatch(actions.logout()),
    onSetSearch: (search) =>
      dispatch({ type: actionTyes.FILTER_SEARCH, payload: search }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
// export default Header
