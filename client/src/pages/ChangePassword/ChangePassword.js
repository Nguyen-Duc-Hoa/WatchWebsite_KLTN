import React from "react";
import ChangePassword from "../../components/ChangePassword/ChangePassword";
import "./ChangePassword.scss";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";

const breadCrumbRoute = [
  { name: "Home", link: "/" },
  { name: "Change Password", link: "/changepassword" },
];

function ChangePasswordUser() {
  return (
    <section className="userProfile">
      <Breadcrumbing route={breadCrumbRoute} />
      <div className="wrap">
        <ChangePassword center />
      </div>
    </section>
  );
}

export default ChangePasswordUser;
