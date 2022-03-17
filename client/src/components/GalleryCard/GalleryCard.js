import React from "react";
import { Button } from "antd";
import "./GalleryCard.scss";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";
import { useHistory } from "react-router";

function Gallery({
  heading,
  image,
  text,
  btnText,
  className,
  onSetGender,
  gender,
}) {
  const history = useHistory();
  const clickBtnHandler = () => {
    if (gender === 1) {
      onSetGender(1);
    } else {
      onSetGender(0);
    }
    history.push("/products");
  };
  return (
    <div className={`gallery__card ${className}`}>
      <div className="gallery__text">
        <div>{heading}</div>
        <p>{text}</p>
        <Button
          type="primary"
          style={{ height: "50px" }}
          onClick={clickBtnHandler}
        >
          {btnText}
        </Button>
      </div>
      <img src={image} alt="" />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSetGender: (gender) =>
      dispatch({ type: actionTypes.FILTER_SET_GENDER, payload: gender }),
  };
};

export default connect(null, mapDispatchToProps)(Gallery);
