import React, { Suspense, lazy } from "react";
import { Switch } from "react-router-dom";
import AdminLayout from "../../../components/Layouts/AdminLayout";
import PageLoading from "../../../components/PageLoading/PageLoading";
import PrivateRoute from "../../../components/Routes/PrivateRoute";

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
const ProductsStatistic = lazy(() =>
  import("../ProductsStatistic/ProductsStatistic")
);
const TurnoverStatistic = lazy(() =>
  import("../TurnoverStatistic/TurnoverStatistic")
);
const Vouchers = lazy(() => import("../Vouchers/Vouchers"));
const UpdateVoucher = lazy(() => import("../UpdateVoucher/UpdateVoucher"));

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
          <PrivateRoute
            exact
            component={Vouchers}
            path="/admin/Vouchers"
            onlyAdmin
          />
          <PrivateRoute
            exact
            component={UpdateVoucher}
            path="/admin/Vouchers/:voucherId"
            onlyAdmin
          />
          <PrivateRoute
            exact
            component={UpdateVoucher}
            path="/admin/Vouchers/AddVoucher"
            onlyAdmin
          />
        </Switch>
      </Suspense>
    </AdminLayout>
  );
}

export default AdminMain;
