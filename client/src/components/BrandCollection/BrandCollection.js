import React, { useState, useEffect } from "react";
import { useWindowDimensions } from "../../hook/useWindowDemension";
import * as actions from "../../store/actions/index";
import "./BrandCollection.scss";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";

// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper/core";
import { connect } from "react-redux";
import { Spin } from "antd";

// install Swiper modules
SwiperCore.use([Pagination]);

function BrandCollection({ brands, loading }) {
  const windowDimensions = useWindowDimensions();
  const [resizeFlag, setResizeFlag] = useState(false);

  useEffect(() => {
    setResizeFlag(windowDimensions.width > 750);
  }, [windowDimensions]);

  return (
    <section className="brandCollection">
      <div className="heading">Brand Collection</div>
      <Spin spinning={loading}>
        <Swiper
          slidesPerView={resizeFlag ? 4 : 2}
          loop={true}
          loopFillGroupWithBlank={true}
          spaceBetween={20}
          pagination={{
            clickable: true,
          }}
        >
          {brands.length !== 0 && brands.map((ele, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-card">
                <img
                  src={`data:image/svg+xml;base64,${ele.image}`}
                  alt={ele.name}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Spin>
    </section>
  );
}

const mapStateToProps = (state) => {
  return {
    brands: state.brand.brands,
    loading: state.brand.loading
  };
};

export default connect(mapStateToProps, null)(BrandCollection);
