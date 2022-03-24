import React from "react";
import Header from "../Header/Header";
import Cart from "../Header/Cart/Cart";
import Sidebar from "../Header/Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import BackTopBtn from "../BackTopBtn/BackTopBtn";
import Overlay from "../Overlay/Overlay";
import MessengerCustomerChat from "react-messenger-customer-chat";

function UserLayout({ children }) {
  return (
    <>
      <Header />
      <Sidebar />
      <Cart />
      {children}
      <Footer />
      <BackTopBtn />
      <Overlay />
      <MessengerCustomerChat pageId="107224811929347" appId="593385925129811" />
    </>
  );
}

export default UserLayout;
