import React, { useState, useEffect } from "react";
import "./BestSeller.scss";
import { useWindowDimensions } from "../../hook/useWindowDemension";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";

// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper/core";
import { Link } from "react-router-dom";
import useAnalyticsEventTracker from "../../hook/useAnalyticsEventTracker";

// install Swiper modules
SwiperCore.use([Pagination]);

function BestSeller() {
  const windowDimensions = useWindowDimensions();
  const [resizeFlag, setResizeFlag] = useState(false);
  const [data, setData] = useState([]);
  const gaEventTracker = useAnalyticsEventTracker("Best seller");

  useEffect(() => {
    setResizeFlag(windowDimensions.width > 750);
  }, [windowDimensions]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/products/PopularProduct`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => setData([...result]));
  }, []);

  return (
    <section className="best-seller">
      <div className="heading">Best Seller</div>

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
    </section>
  );
}

export default BestSeller;
