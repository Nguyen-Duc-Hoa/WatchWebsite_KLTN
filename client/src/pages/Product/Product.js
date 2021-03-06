import React, { useEffect, useState } from "react";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import { Button, Image, InputNumber, Rate, Space, Spin } from "antd";
import "./Product.scss";
import { CgFacebook } from "react-icons/cg";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import { ImReddit } from "react-icons/im";
import { Tabs } from "antd";
import Text from "antd/lib/typography/Text";
import { Form, List } from "antd";
import Commenting from "../../components/Comment/Comment";
import AddComment from "../../components/AddComment/AddComment";
import { useParams } from "react-router";
import * as actions from "../../store/actions/index";
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  TelegramShareButton,
} from "react-share";
import { connect } from "react-redux";
import { notify } from "../../helper/notify";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";

// import required modules
import SwiperCore, { Pagination } from "swiper/core";
import { useWindowDimensions } from "../../hook/useWindowDemension";
import { Link } from "react-router-dom";
import useAnalyticsEventTracker from "../../hook/useAnalyticsEventTracker";
import Page from "../../components/Page/Page";

// install Swiper modules
SwiperCore.use([Pagination]);

const { TabPane } = Tabs;

function Product({ isAuth, token, userId, username, avatarUser, onAddToCart }) {
  const [comments, setComments] = useState([]);
  const [recomData, setRecomData] = useState([]);
  const [rate, setRate] = useState(0);
  const [numOfRate, setNumOfRate] = useState(0);
  const [ratable, setRatable] = useState(false);
  const [productDetail, setProductDetail] = useState(null);
  const [replyUserName, setReplyUserName] = useState();
  const [replyCommentId, setReplyCommentId] = useState();
  const [loadingProductDetail, setLoadingProductDetail] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const { id } = useParams();
  const breadCrumbRoute = [
    { link: "/", name: "Home" },
    { link: "/Products", name: "Products" },
    { link: `/Products/${id}`, name: productDetail && productDetail.Name },
  ];
  const url = document.location.href;

  const windowDimensions = useWindowDimensions();
  const [resizeFlag, setResizeFlag] = useState(false);

  const gaEventTracker = useAnalyticsEventTracker("Add to cart");

  useEffect(() => {
    setResizeFlag(windowDimensions.width > 750);
  }, [windowDimensions]);

  useEffect(() => {
    if (!id) return;
    fetchRecom();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchProductDetail();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchRate();
  }, [id]);

  useEffect(() => {
    let intervalId = setInterval(() => {
      fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/UserTracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cookie: localStorage.getItem("trackingCookie"),
          productId: id,
          behavior: "ViewDetail",
        }),
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, [id]);

  const fetchRecom = () => {
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/products/getRecom?productId=${id}`
    )
      .then((res) => res.json())
      .then((data) => setRecomData(data));
  };

  const fetchRate = () => {
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/rates?userId=${
        userId ? userId : -1
      }&productId=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if ("rateValue" in data && "numOfRate" in data) {
          setRate(data["rateValue"]);
          setNumOfRate(data["numOfRate"]);
        } else {
          setRatable(true);
        }
      });
  };

  const fetchComments = () => {
    setLoadingComments(true);
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Comments?productId=${id}`)
      .then((response) => response.json())
      .then((result) => {
        setComments(result);
      })
      .finally(() => setLoadingComments(false));
  };

  const fetchProductDetail = () => {
    setLoadingProductDetail(true);
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/products/ProductDetail?id=${id}`
    )
      .then((response) => response.json())
      .then((result) => {
        setProductDetail({ ...result });
      })
      .finally(() => setLoadingProductDetail(false));
  };

  const handleReply = (id, author, replyFrom) => {
    setReplyCommentId(replyFrom || id);
    setReplyUserName(author);
  };

  const onFinish = (values) => {
    if (isAuth) {
      gaEventTracker(`${id}-${productDetail.Name}`);
      onAddToCart(id, values.quantity, userId, token, notify);
      fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/UserTracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cookie: localStorage.getItem("trackingCookie"),
          productId: id,
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

  const commentTotal =
    comments.reduce((prev, curr) => prev + curr.Replies.length, 0) +
    comments.length;

  const handleRate = async (value) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST_DOMAIN}/api/rates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userId,
            productId: id,
            value: value,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        if ("rateValue" in data && "numOfRate" in data) {
          setRate(data["rateValue"]);
          setNumOfRate(data["numOfRate"]);
          setRatable(false);
        }
      } else {
        throw Error();
      }
    } catch {
      notify("RATE FAIL", "Something went wrong :( Please try again.", "error");
    }
  };

  const handleClickProduct = (id) => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/UserTracking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cookie: localStorage.getItem("trackingCookie"),
        productId: id,
        behavior: "ClickDetail",
      }),
    });
  };

  const title = productDetail?.Name || "Minimix product";
  const description = `${productDetail?.Name} - ${productDetail?.Price}` || "";
  return (
    <Page
      title={title}
      description={description}
      canonicalPath={`/Products/${id}`}
      schema={{
        "@context": "http://schema.org",
        "@type": "ProductPage",
        description: description,
        name: title,
      }}
      urlImage={productDetail?.Image}
    >
      <section className="product">
        <Breadcrumbing route={breadCrumbRoute} />
        <Spin spinning={loadingComments || loadingProductDetail}>
          <div className="content">
            <div className="image">
              <Swiper
                loop={true}
                loopFillGroupWithBlank={true}
                spaceBetween={10}
                pagination={{
                  clickable: true,
                }}
                slidesPerView={1}
              >
                <SwiperSlide>
                  <Image
                    width={"100%"}
                    src={productDetail && productDetail.Image}
                  />
                </SwiperSlide>
                {productDetail &&
                  productDetail.SubImages.length !== 0 &&
                  productDetail.SubImages.map((subimage) => (
                    <SwiperSlide key={subimage.Id}>
                      <Image width={"100%"} src={subimage.Image} />
                    </SwiperSlide>
                  ))}
                <SwiperSlide
                  style={{
                    width: "100%",
                    textAlign: "center",
                    transform: "translateY(50%)",
                  }}
                >
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`}
                  />
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="info">
              <div className="name">{productDetail && productDetail.Name}</div>
              <div className="price">
                ${productDetail && productDetail.Price}
              </div>
              <Space>
                <Rate onChange={handleRate} value={rate} disabled={!ratable} />
                <span>{ratable ? "Rate now" : `${numOfRate} review(s)`}</span>
              </Space>
              <div className="stock">
                Only <span>{productDetail && productDetail.Amount}</span>{" "}
                item(s) left in stock!
              </div>
              <Space direction="vertical">
                <Form onFinish={onFinish}>
                  <Form.Item name="quantity">
                    <InputNumber
                      min={1}
                      max={productDetail && productDetail.Amount}
                      parser={(value) => Math.round(value)}
                      defaultValue={1}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button size="large" htmlType="submit">
                      Add to cart
                    </Button>
                  </Form.Item>
                </Form>
              </Space>
              <div>
                Case material:{" "}
                {productDetail && productDetail.Material.MaterialValue}
              </div>
              <div>
                Gender:{" "}
                {productDetail && productDetail.Gender === 1
                  ? "Mens"
                  : "Ladies"}
              </div>
              <div>
                Water resistence:{" "}
                {productDetail && productDetail.GetWaterResistance.WaterValue}
              </div>
              <div>Size: {productDetail && productDetail.Size.SizeValue}</div>
              <div>
                Energy: {productDetail && productDetail.Energy.EnergyValue}
              </div>
              <div>Share:</div>

              <span className="icon-social">
                <FacebookShareButton url={url}>
                  <CgFacebook />
                </FacebookShareButton>
              </span>
              <span className="icon-social">
                <TwitterShareButton url={url}>
                  <AiOutlineTwitter />
                </TwitterShareButton>
              </span>
              <span className="icon-social">
                <TelegramShareButton url={url}>
                  <FaTelegramPlane />
                </TelegramShareButton>
              </span>
              <span className="icon-social">
                <RedditShareButton url={url}>
                  <ImReddit />
                </RedditShareButton>
              </span>
            </div>
          </div>
          <section className="descriptionAndComments">
            <Tabs defaultActiveKey="1" centered size="large">
              <TabPane tab="Description" key="1">
                <Text strong>{productDetail && productDetail.Description}</Text>
              </TabPane>
              <TabPane tab="Reviews" key="2">
                {
                  <List
                    className="comment-list"
                    header={`${commentTotal} comments`}
                    itemLayout="horizontal"
                    dataSource={comments}
                    renderItem={(item) => (
                      <li>
                        <Commenting
                          key={item.Id}
                          id={item.Id}
                          author={item.User.UserName}
                          avatar={item.User.Avatar}
                          content={item.Content}
                          datetime={new Date(item.Date).toLocaleDateString()}
                          onReply={handleReply}
                        >
                          {item.Replies &&
                            item.Replies.map((rep) => (
                              <Commenting
                                key={rep.Id}
                                id={rep.Id}
                                author={rep.User.UserName}
                                avatar={rep.User.Avatar}
                                content={rep.Content}
                                datetime={new Date(
                                  rep.Date
                                ).toLocaleDateString()}
                                replyFrom={rep.ReplyFrom}
                                onReply={handleReply}
                              />
                            ))}
                        </Commenting>
                      </li>
                    )}
                  />
                }
                {isAuth && (
                  <AddComment
                    setComments={setComments}
                    replyUserName={replyUserName}
                    replyCommentId={replyCommentId}
                    productId={id}
                    setReplyCommentId={setReplyCommentId}
                    setReplyUserName={setReplyUserName}
                    userId={userId}
                    token={token}
                    username={username}
                    avatarUser={avatarUser}
                  />
                )}
              </TabPane>
            </Tabs>
          </section>
          <section className="recomContainer">
            <div className="heading">Related products</div>
            <Swiper
              slidesPerView={resizeFlag ? 5 : 3}
              spaceBetween={20}
              pagination={{
                clickable: true,
              }}
            >
              {recomData.length !== 0 &&
                recomData.map((ele) => (
                  <SwiperSlide key={ele.Id}>
                    <Link
                      to={`/products/${ele.Id}`}
                      onClick={() => handleClickProduct(ele.Id)}
                    >
                      <div className="card">
                        <img src={`${ele.Image}`} alt="" />
                        <div>{ele.Name}</div>
                        <p>{ele.Brand}</p>
                        <p>${ele.Price}</p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
            </Swiper>
          </section>
        </Spin>
      </section>
    </Page>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    isAuth: state.auth.token !== null,
    userId: state.auth.id,
    username: state.auth.username,
    avatarUser: state.auth.avatar,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddToCart: (productId, quantity, userId, token, notify) =>
      dispatch(actions.addToCart(productId, quantity, userId, token, notify)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
