import React from "react";
import "./Overlay.scss";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";

function Overlay({ showOverlay, onClickOverlay }) {
  return (
    <div
      className={`overlay ${showOverlay && "active"}`}
      onClick={onClickOverlay}
    ></div>
  );
}

const mapStateToProps = (state) => {
  return {
    showOverlay: state.ui.showOverlay,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickOverlay: () => dispatch({ type: actionTypes.CLICK_ON_OVERLAY }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Overlay);
