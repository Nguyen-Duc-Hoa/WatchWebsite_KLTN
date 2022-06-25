import React from "react";
import ChangePassword from "../../components/ChangePassword/ChangePassword";
import "./ChangePassword.scss";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import Page from "../../components/Page/Page";

const breadCrumbRoute = [
  { name: "Home", link: "/" },
  { name: "Change Password", link: "/changepassword" },
];

function ChangePasswordUser() {
  const description = "If you forgot your password, you can change it here.";
  const title = "Minimix change your password";

  return (
    <Page
      title={title}
      description={description}
      canonicalPath="/"
      schema={{
        "@context": "http://schema.org",
        "@type": "ChangePasswordPage",
        description: description,
        name: title,
      }}
    >
      <section className="userProfile">
        <Breadcrumbing route={breadCrumbRoute} />
        <div className="wrap">
          <ChangePassword center />
        </div>
      </section>
    </Page>
  );
}

export default ChangePasswordUser;
