import React, { Suspense, lazy } from "react";
import { Switch } from "react-router-dom";
import AdminLayout from "../../../components/Layouts/AdminLayout";
import PageLoading from "../../../components/PageLoading/PageLoading";
// import Energy from "../Energy/Energy";
// import Products from "../Products/Products";
// import AdminResult from "../../../components/Result/Result";
import PrivateRoute from "../../../components/Routes/PrivateRoute";
// import ManageAccount from "../ManageAccount/ManageAccount";
// import Order from "../Order/Order";
// import OrderDetail from "../OrderDetail/OrderDetail";
// import Product from "../UpdateProduct/Product";
// import Comments from "../Comments/Comments";
// import Sizes from "../Sizes/Sizes";
// import Materials from "../Materials/Materials";
// import WaterResistence from "../WaterResistence/WaterResistence";
// import Brands from "../Brands/Brands";
// import UpdateBrand from "../UpdateBrand/UpdateBrand";
// import Profile from "../Profile/Profile";
// import Employee from "../Employee/Employee";
// import CreateAccount from "../CreateAccount/CreateAccount";
// import ChangePassword from "../ChangePassword/ChangePassword";
// import Statistic from "../Statistic/Statistic";
// import ProductsStatistic from "../ProductsStatistic/ProductsStatistic";
// import TurnoverStatistic from "../TurnoverStatistic/TurnoverStatistic";

const AdminResult = lazy(() => import("../../../components/Result/Result"));
const ManageAccount = lazy(() => import("../ManageAccount/ManageAccount"));
const Order = lazy(() => import("../Order/Order"));
const OrderDetail = lazy(() => import("../OrderDetail/OrderDetail"));
const Products = lazy(() => import("../Products/Products"));
const Product = lazy(() => import("../UpdateProduct/Product"));
const Comments = lazy(() => import("../Comments/Comments"));
const Energy = lazy(() => import("../Energy/Energy"));
const Sizes = lazy(() => import("../Sizes/Sizes"));
const Materials = lazy(() => import("../Materials/Materials"));
const WaterResistence = lazy(() =>
  import("../WaterResistence/WaterResistence")
);
const Brands = lazy(() => import("../Brands/Brands"));
const UpdateBrand = lazy(() => import("../UpdateBrand/UpdateBrand"));
const Profile = lazy(() => import("../Profile/Profile"));
const Employee = lazy(() => import("../Employee/Employee"));
const CreateAccount = lazy(() => import("../CreateAccount/CreateAccount"));
const ChangePassword = lazy(() => import("../ChangePassword/ChangePassword"));
const Statistic = lazy(() => import("../Statistic/Statistic"));
const ProductsStatistic = lazy(() =>
  import("../ProductsStatistic/ProductsStatistic")
);
const TurnoverStatistic = lazy(() =>
  import("../TurnoverStatistic/TurnoverStatistic")
);

function AdminMain() {
  return (
    <AdminLayout>
      <Suspense fallback={<PageLoading />}>
        <Switch>
          <PrivateRoute
            exact={true}
            component={AdminResult}
            path="/admin/Home"
          />
          <PrivateRoute
            exact={true}
            component={ManageAccount}
            path="/admin/ManageAccount"
          />
          <PrivateRoute exact={true} component={Order} path="/admin/Order" />
          <PrivateRoute
            exact={true}
            component={OrderDetail}
            path="/admin/Order/:id"
          />
          <PrivateRoute
            exact={true}
            component={Products}
            path="/admin/Products"
          />
          <PrivateRoute
            exact={true}
            component={Product}
            path="/admin/Product/AddProduct"
          />
          <PrivateRoute
            exact={true}
            component={Product}
            path="/admin/Product/:id"
          />
          <PrivateRoute
            exact={true}
            component={Comments}
            path="/admin/Comments"
          />
          <PrivateRoute
            exact={true}
            component={Energy}
            path="/admin/Energy"
            onlyAdmin
          />
          <PrivateRoute
            exact={true}
            component={Sizes}
            path="/admin/Sizes"
            onlyAdmin
          />
          <PrivateRoute
            exact={true}
            component={Materials}
            path="/admin/Materials"
            onlyAdmin
          />
          <PrivateRoute
            exact={true}
            component={WaterResistence}
            path="/admin/WaterResistence"
            onlyAdmin
          />
          <PrivateRoute
            exact={true}
            component={Brands}
            path="/admin/Brands"
            onlyAdmin
          />
          <PrivateRoute
            exact={true}
            component={UpdateBrand}
            path="/admin/Brands/AddBrand"
            onlyAdmin
          />
          <PrivateRoute
            exact={true}
            component={UpdateBrand}
            path="/admin/Brands/:id"
            onlyAdmin
          />
          <PrivateRoute
            exact={true}
            component={Profile}
            path="/admin/Profile"
          />
          <PrivateRoute
            exact={true}
            component={Employee}
            path="/admin/Employees"
            onlyAdmin
          />
          <PrivateRoute
            exact={true}
            component={CreateAccount}
            path="/admin/CreateAccount"
            onlyAdmin
          />
          <PrivateRoute
            exact={true}
            component={ChangePassword}
            path="/admin/ChangePassword"
          />
          <PrivateRoute
            exact={true}
            component={Statistic}
            path="/admin/Statistic"
            onlyAdmin
          />
          <PrivateRoute
            exact
            component={ProductsStatistic}
            path="/admin/ProductsStatistic"
            onlyAdmin
          />
          <PrivateRoute
            exact
            component={TurnoverStatistic}
            path="/admin/TurnoverStatistic"
            onlyAdmin
          />
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}

export default AdminMain;
