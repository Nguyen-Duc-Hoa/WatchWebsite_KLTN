import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

function PrivateRoute({
  component: Component,
  path,
  exact,
  layout: Layout,
  isAuth,
  roles,
  onlyAdmin,
  forUser,
}) {
  return (
    <Route
      path={path}
      exact={exact}
      render={(props) => {
        if (forUser && isAuth) {
          return Layout ? (
            <Layout>
              <Component {...props} />
            </Layout>
          ) : (
            <Component {...props} />
          );
        }
        if (isAuth && onlyAdmin && roles.includes("Admin")) {
          // console.log("route only admin");
          return Layout ? (
            <Layout>
              <Component {...props} />
            </Layout>
          ) : (
            <Component {...props} />
          );
        } else if (
          isAuth &&
          !onlyAdmin &&
          (roles.includes("Admin") || roles.includes("Employee"))
        ) {
          // console.log("route employee admin");
          return Layout ? (
            <Layout>
              <Component {...props} />
            </Layout>
          ) : (
            <Component {...props} />
          );
        } else {
          // console.log("route redirect");
          return <Redirect to="/" />;
        }
      }}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null,
    roles: state.auth.roles,
  };
};

export default connect(mapStateToProps)(PrivateRoute);
