import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import useAnalyticsEventTracker from "../../hook/useAnalyticsEventTracker";
import { useWindowDimensions } from "../../hook/useWindowDemension";
import "./RecommendForUser.scss";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";

// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper/core";
import { Link } from "react-router-dom";
import { Spin } from "antd";
SwiperCore.use([Pagination]);

const RecommendForUser = ({ idUser }) => {
  const windowDimensions = useWindowDimensions();
  const [resizeFlag, setResizeFlag] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const gaEventTracker = useAnalyticsEventTracker("Recommend for user");
  const trackingCookie = localStorage.getItem("trackingCookie");

  useEffect(() => {
    setResizeFlag(windowDimensions.width > 750);
  }, [windowDimensions]);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/products/getRecomUser?cookie=${trackingCookie}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((result) => setData([...result]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="recommendForUser">
      <div className="heading">Recommend</div>
      <Spin spinning={loading}>
        <Swiper
          slidesPerView={resizeFlag ? 5 : 3}
          loop={true}
          loopFillGroupWithBlank={true}
          spaceBetween={20}
          pagination={{
            clickable: true,
          }}
        >
          {data.length !== 0 &&
            data.map((ele) => (
              <SwiperSlide key={ele.Id}>
                <Link
                  to={`/products/${ele.Id}`}
                  onClick={() => {
                    gaEventTracker(`${ele.Id}-${ele.Name}`);
                  }}
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
      </Spin>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    idUser: state.auth.id,
  };
};

export default connect(mapStateToProps)(RecommendForUser);
