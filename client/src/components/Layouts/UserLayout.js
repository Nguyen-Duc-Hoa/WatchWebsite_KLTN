import React, { useEffect, useState, useRef } from "react";
import Header from "../Header/Header";
import Cart from "../Header/Cart/Cart";
import Sidebar from "../Header/Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import BackTopBtn from "../BackTopBtn/BackTopBtn";
import Overlay from "../Overlay/Overlay";
import { Launcher } from "react-chat-window";
import { MessengerChat } from "react-messenger-chat-plugin";
import "./UserLayout.scss";

const BOT_TURN = "BOT";
const CUSTOMER_TURN = "CUSTOMER";

function UserLayout({ children }) {
  const [messageList, setMessageList] = useState([]);
  const turnRef = useRef(CUSTOMER_TURN);

  useEffect(() => {
    if (turnRef.current === BOT_TURN) {
      sendMessage("bot answer");
      turnRef.current = CUSTOMER_TURN;
    }
  }, [messageList]);

  const onMessageWasSent = (message) => {
    setMessageList([...messageList, message]);
    turnRef.current = BOT_TURN;
  };

  const sendMessage = (text) =>
    text.length > 0 &&
    setMessageList([
      ...messageList,
      {
        author: "them",
        type: "text",
        data: { text },
      },
    ]);
  return (
    <>
      <Header />
      <Sidebar />
      <Cart />
      {children}
      <Footer />
      <BackTopBtn />
      <Overlay />
      <Launcher
        agentProfile={{
          teamName: "Minimix Watch Shop",
          imageUrl:
            "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png",
        }}
        onMessageWasSent={onMessageWasSent}
        messageList={messageList}
        showEmoji
      />
      <MessengerChat
        pageId="105623528855771"
        language="vi_VN"
        themeColor={"#000000"}
        greetingDialogDisplay={"show"}
        debugMode={true}
      />
    </>
  );
}

export default UserLayout;
