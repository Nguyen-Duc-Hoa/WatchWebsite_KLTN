import React from "react";
import FormProfile from "../../../components/FormProfile/FormProfile";
import { Row, Col, Form } from "antd";
import UploadImage from "../../../components/UploadImage/UploadImage";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

import { useUpdateProfile } from "../../../hook/useUpdateProfile";

function Profile({
  name,
  address,
  email,
  phone,
  birthday,
  avatar,
  idUser,
  onUpdateInfo,
}) {
  const [form] = Form.useForm();

  const [
    updateAccount,
    loading,
    imageBase64,
    setImageBase64,
    setImageByteArray,
  ] = useUpdateProfile(
    form,
    name,
    address,
    email,
    phone,
    birthday,
    avatar,
    idUser,
    onUpdateInfo
  );

  return (
    <section className="admin">
      <div className="heading">Profile</div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col lg={{ span: 16, order: 2 }} sm={{ span: 24, order: 2 }}>
          <FormProfile
            loading={loading}
            form={form}
            style={{ maxWidth: 600 }}
            onSubmit={updateAccount}
          />
        </Col>
        <Col lg={{ span: 6, order: 2 }} sm={{ span: 24, order: 1 }}>
          <UploadImage
            imageBase64={imageBase64}
            setImageBase64={setImageBase64}
            setImageByteArray={setImageByteArray}
          />
        </Col>
      </Row>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    name: state.auth.name,
    address: state.auth.address,
    email: state.auth.email,
    phone: state.auth.phone,
    birthday: state.auth.birthday,
    avatar: state.auth.avatar,
    idUser: state.auth.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateInfo: (userInfo) => dispatch(actions.authUpdateInfo(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
