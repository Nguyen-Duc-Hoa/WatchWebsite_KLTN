import "./App.less";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import PublicRoute from "./components/Routes/PublicRoute";
import UserLayout from "./components/Layouts/UserLayout";
import * as actions from "./store/actions/index";
import { connect } from "react-redux";
import { useEffect, useState, Suspense, lazy } from "react";
import PrivateRoute from "./components/Routes/PrivateRoute";
import PageLoading from "./components/PageLoading/PageLoading";

import ReactGA from "react-ga";

const Home = lazy(() => import("./pages/Home/Home"));
const Product = lazy(() => import("./pages/Product/Product"));
const Products = lazy(() => import("./pages/Products/Products"));
const Payment = lazy(() => import("./pages/Payment/Payment"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const ChangePassword = lazy(() =>
  import("./pages/ChangePassword/ChangePassword")
);
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const OrderHistory = lazy(() => import("./pages/OrderHistory/OrderHistory"));
const OrderDetail = lazy(() => import("./pages/OrderDetail/OrderDetail"));
const PaymentSuccess = lazy(() =>
  import("./pages/PaymentSuccess/PaymentSuccess")
);
const Profile = lazy(() => import("./pages/Profile/Profile"));
const LoginAdmin = lazy(() => import("./pages/Admin/Login/Login"));
const AdminMain = lazy(() => import("./pages/Admin/AdminMain/AdminMain"));

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_CODE);

function App({ onCheckAuthState, onFetchAllBrands }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRand = () => Math.floor(Math.random() * 10000000) + 1;
    const trackingCookie = localStorage.getItem("trackingCookie");
    if (!trackingCookie) {
      localStorage.setItem(
        "trackingCookie",
        `TC_${getRand()}_${new Date().getTime()}`
      );
    }
  }, []);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    onCheckAuthState();
    onFetchAllBrands();
    setLoading(false);
  }, []);
  if (loading) {
    return <PageLoading />;
  }
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Switch>
            <PublicRoute
              path="/"
              exact={true}
              component={Home}
              layout={UserLayout}
            />
            <PublicRoute
              path="/products/:id"
              component={Product}
              layout={UserLayout}
            />
            <PublicRoute
              path="/products"
              component={Products}
              layout={UserLayout}
            />
            <PrivateRoute
              path="/checkout/payment"
              component={Payment}
              layout={UserLayout}
              forUser
            />
            <PrivateRoute
              path="/checkout"
              component={Checkout}
              layout={UserLayout}
              forUser
            />
            <PrivateRoute
              path="/changepassword"
              component={ChangePassword}
              layout={UserLayout}
              forUser
            />
            <PublicRoute
              exact={true}
              path="/login"
              component={Login}
              layout={UserLayout}
            />
            <PublicRoute
              path="/register"
              component={Register}
              layout={UserLayout}
            />
            <PrivateRoute
              path="/orderHistory"
              component={OrderHistory}
              layout={UserLayout}
              forUser
            />
            <PrivateRoute
              path="/orders/:id"
              component={OrderDetail}
              layout={UserLayout}
              forUser
            />
            <PrivateRoute
              path="/paymentSuccess"
              component={PaymentSuccess}
              layout={UserLayout}
              forUser
            />
            <PrivateRoute
              path="/profile"
              component={Profile}
              layout={UserLayout}
              forUser
            />
            <PublicRoute
              exact={true}
              path="/secretRoute/login"
              component={LoginAdmin}
            />
            <Route path="/admin" component={AdminMain} />
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCheckAuthState: () => dispatch(actions.authCheckState()),
    onFetchAllBrands: () => dispatch(actions.fetchAllBrands()),
  };
};

export default connect(null, mapDispatchToProps)(App);
