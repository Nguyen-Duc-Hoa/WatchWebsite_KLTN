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
import RecommendForUser from "../../components/RecommendForUser/RecommendForUser";
import useAnalyticsEventTracker from "../../hook/useAnalyticsEventTracker";
import Page from "../../components/Page/Page";
import { FILTER } from "../../store/actions/actionTypes";

const breadCrumbRoute = [
  { name: "Home", link: "/" },
  { name: "Products", link: "/products" },
];

function Products({ filterInfo, onAddToCart, token, isAuth, userId, onFilter }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const gaEventTracker = useAnalyticsEventTracker("Add to cart");
  const isHaveTrackingCookie = !!localStorage.getItem("trackingCookie");

  useEffect(() => {
    filterReq(filterInfo, currentPage);
  }, [currentPage, filterInfo]);

  const filterHandler = (values) => {
    setSpinning(true);
    const searchValue = document.querySelector(".search__area input").value;
    values["search"] = searchValue;
    onFilter(values)
  };

  const addToCartHandler = (event, productId) => {
    event.stopPropagation();
    if (isAuth) {
      onAddToCart(productId, 1, userId, token, notify);
      gaEventTracker(productId);
      fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/UserTracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cookie: localStorage.getItem("trackingCookie"),
          productId: productId,
          behavior: "ClickCart",
        }),
      });
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
    const searchValue = document.querySelector(".search__area input").value;
    values["search"] = searchValue;
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
      .catch(() => {
        setSpinning(false);
        notify("ERROR", "Something went wrong!", "error");
      });
  };

  const title = "Minimix products";
  const description =
    "Visit minimix-watch-shop.surge.sh today - the world's No.1 for designer watches online. We stock hundreds of designer brands including Olivia Burton, Hugo Boss and Timex, with FREE next day delivery.";

  return (
    <Page
      title={title}
      description={description}
      canonicalPath="/products"
      schema={{
        "@context": "http://schema.org",
        "@type": "ProductsPage",
        description: description,
        name: title,
      }}
    >
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
        {isHaveTrackingCookie && <RecommendForUser />}
      </section>
    </Page>
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
    onFilter: (payload) => dispatch({type: FILTER, payload})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
