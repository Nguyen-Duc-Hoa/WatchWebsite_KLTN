import React from "react";
import CustomCarousel from "../../components/CustomCarousel/CustomCarousel";
import BrandCollection from "../../components/BrandCollection/BrandCollection";
import Gallery from "../../components/GalleryCard/GalleryCard";
import "./Home.scss";
import BestSeller from "../../components/BestSeller/BestSeller";
import Service from "../../components/Service/Service";

const services = [
  {
    image:
      "https://cdn.shopify.com/s/files/1/0591/1350/4958/files/1_292dc3a2-215e-4ce3-afba-7b00845e162f_84x.png?v=1628328725",
    heading: "Free Shipping",
    text: "Tell about your service.",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0591/1350/4958/files/2_4ab3f0fa-7ff5-4f0d-ba62-503f7f2fc192_90x.png?v=1628328726",
    heading: "Money Guarantee",
    text: "Within 30 days for an exchange.",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0591/1350/4958/files/3_6044e4d8-7c0b-4f31-aac4-89baf1f7a0a9_87x.png?v=1628328727",
    heading: "Online Support",
    text: "24 hours a day, 7 days a week",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0591/1350/4958/files/4_2f378f25-cac8-415a-b98b-e491bd3fd4f3_87x.png?v=1628328727",
    heading: "Flexible Payment",
    text: "Pay with Multiple Credit Cards",
  },
];

function Home() {
  return (
    <>
      <CustomCarousel />
      <BrandCollection />
      <section className="gallery">
        <Gallery
          gender={1}
          image="https://cdn.shopify.com/s/files/1/1063/3618/files/gallerie-006_1512x.jpg?v=1592246815"
          heading="Mens Watches"
          btnText="Shop Mens"
          text="View our extensive range"
        />
        <Gallery
          gender={0}
          image="https://cdn.shopify.com/s/files/1/1063/3618/files/gallerie-007_1512x.jpg?v=1592246827"
          heading="Women's Watches"
          btnText="Shop Women's"
          text="Classic looks and elegant styles"
        />
      </section>
      <BestSeller />
      <section className="services">
        {services.map(({ image, heading, text }, index) => (
          <Service key={index} image={image} heading={heading} text={text} />
        ))}
      </section>
    </>
  );
}

export default Home;
