import React, { useEffect, useState } from "react";
import { Breadcrumb, Empty, Spin } from "antd";
import "./Products.scss";
import GallaryCard from "../../components/GalleryCard/GalleryCard";
import FilterBar from "../../components/FilterBar/FilterBar";
import { Row, Col } from "antd";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../components/Pagination/Pagination";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import { notify } from "../../helper/notify";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

const breadCrumbRoute = [
  { name: "Home", link: "/" },
  { name: "Products", link: "/products" },
];

function Products({ filterInfo, onAddToCart, token, isAuth, userId }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    filterReq(filterInfo, currentPage);
  }, [currentPage, filterInfo]);

  const filterHandler = (values) => {
    filterReq(values);
  };

  const addToCartHandler = (event, productId) => {
    event.stopPropagation();
    if (isAuth) {
      onAddToCart(productId, 1, userId, token, notify);
    } else {
      notify(
        "YOU MUST LOGIN",
        "You must login to add product to cart",
        "warning"
      );
    }
  };

  const filterReq = (values, currPage = 1) => {
    setSpinning(true);
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/products/FilterProduct?currentPage=${currPage}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.Products);
        setCurrentPage(result.CurrentPage);
        setTotalPage(result.TotalPage);
        setSpinning(false);
      })
      .catch((error) => {
        console.log(error);
        setSpinning(false);
        notify("ERROR", "Something went wrong!", "error");
      });
  };

  return (
    <section className="products">
      <Breadcrumbing route={breadCrumbRoute} />
      <GallaryCard
        className="banner"
        image="https://cdn.shopify.com/s/files/1/1063/3618/files/gallerie-003_3024x.jpg?v=1592242046"
        heading="We love these"
        text="Browser our collection of favorites"
        btnText="Explore"
      />
      <div className="body">
        <FilterBar filterHandler={filterHandler} />
        <div className="product-list">
          <Spin spinning={spinning}>
            <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              {data.length !== 0 &&
                data.map((ele) => (
                  <Col
                    key={ele.Id}
                    xl={{ span: 6 }}
                    md={{ span: 8 }}
                    sm={{ span: 8 }}
                    xs={{ span: 12 }}
                  >
                    <ProductCard
                      productId={ele.Id}
                      image={ele.Image}
                      name={ele.Name}
                      price={ele.Price}
                      brand={ele.Brand}
                      addToCartHandler={addToCartHandler}
                    />
                  </Col>
                ))}
            </Row>
            {data.length === 0 && <Empty />}
          </Spin>
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={totalPage}
          />
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    filterInfo: state.filter,
    token: state.auth.token,
    isAuth: state.auth.token !== null,
    userId: state.auth.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddToCart: (productId, quantity, userId, token, notify) =>
      dispatch(actions.addToCart(productId, quantity, userId, token, notify)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
