import { Row, Col, Button } from "antd";
import React from "react";
import { connect } from "react-redux";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import FormProfile from "../../components/FormProfile/FormProfile";
import UploadImage from "../../components/UploadImage/UploadImage";
import { Form } from "antd";
import "./Profile.scss";
import * as actions from "../../store/actions/index";
import { Link } from "react-router-dom";
import Page from "../../components/Page/Page";
import { useUpdateProfile } from "../../hook/useUpdateProfile";

const breadCrumbRoute = [
  { name: "Home", link: "/" },
  { name: "Profile", link: "/profile" },
];

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

  const [updateAccount, loading, imageBase64, setImageBase64] =
    useUpdateProfile(
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

  const title = `Profile of ${name}`

  return (
    <Page title={title} >
      <section className="userProfile">
        <Breadcrumbing route={breadCrumbRoute} />
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col lg={{ span: 16, order: 2 }} sm={{ span: 24, order: 2 }}>
            <FormProfile
              address={address}
              form={form}
              style={{ maxWidth: 600 }}
              onSubmit={updateAccount}
              loading={loading}
            />
          </Col>

          <Col lg={{ span: 6, order: 2 }} sm={{ span: 24, order: 1 }}>
            <UploadImage
              imageBase64={imageBase64}
              setImageBase64={setImageBase64}
            />
          </Col>
        </Row>
        <Link to="/changepassword">
          <Button>Change password</Button>
        </Link>
      </section>
    </Page>
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
