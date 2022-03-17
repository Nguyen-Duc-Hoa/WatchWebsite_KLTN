import React, { useEffect, useState } from "react";
import Breadcrumbing from "../../components/Breadcrumb/Breadcrumb";
import { Button, Image, InputNumber, Space } from "antd";
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

const { TabPane } = Tabs;

function Product({ isAuth, token, userId, username, avatarUser, onAddToCart }) {
  const [comments, setComments] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [replyUserName, setReplyUserName] = useState();
  const [replyCommentId, setReplyCommentId] = useState();
  const { id } = useParams();
  const breadCrumbRoute = [
    { link: "/", name: "Home" },
    { link: "/Products", name: "Products" },
    { link: `/Products/${id}`, name: productDetail && productDetail.Name },
  ];
  const url = document.location.href;

  useEffect(() => {
    if (!id) return;
    fetchComments();
    fetchProductDetail();
  }, []);


  const fetchComments = () => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Comments?productId=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setComments(result);
      });
  };

  const fetchProductDetail = () => {
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/products/ProductDetail?id=${id}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setProductDetail({ ...result });
      })
      .catch((err) => console.log(err));
  };

  const handleReply = (id, author, replyFrom) => {
    setReplyCommentId(replyFrom || id);
    setReplyUserName(author);
  };

  const onFinish = (values) => {
    if (isAuth) {
      onAddToCart(id, values.quantity, userId, token, notify);
    } else {
      notify(
        "YOU MUST LOGIN",
        "You must login to add product to cart",
        "warning"
      );
    }
  };

  const commentTotal = comments.reduce((prev, curr) => prev + curr.Replies.length, 0) + comments.length

  return (
    <section className="product">
      <Breadcrumbing route={breadCrumbRoute} />
      <div className="content">
        <div className="image">
          <Image
            width={"100%"}
            src={`data:image/png;base64,${
              productDetail && productDetail.Image
            }`}
          />
        </div>
        <div className="info">
          <div className="name">{productDetail && productDetail.Name}</div>
          <div className="price">${productDetail && productDetail.Price}</div>
          <div className="stock">
            Only <span>{productDetail && productDetail.Amount}</span> item(s)
            left in stock!
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
            {productDetail && productDetail.Gender === 1 ? "Mens" : "Ladies"}
          </div>
          <div>
            Water resistence:{" "}
            {productDetail && productDetail.GetWaterResistance.WaterValue}
          </div>
          <div>Size: {productDetail && productDetail.Size.SizeId}</div>
          <div>Energy: {productDetail && productDetail.Energy.EnergyValue}</div>
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
                            datetime={new Date(rep.Date).toLocaleDateString()}
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
    </section>
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
