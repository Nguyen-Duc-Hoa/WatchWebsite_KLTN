import { configure, shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { Header } from "./Header";
import React from "react";
import { Link } from "react-router-dom";

configure({ adapter: new Adapter() });

let wrapper;

describe("<Header/>", () => {
  // Giả lập render component Header (chỉ Header)
  beforeEach(() => {
    wrapper = shallow(
      <Header
        isAuth
        onOpenCart={() => {}}
        onOpenOverlay={() => {}}
        onLogout={() => {}}
        onSetSearch={() => {}}
        numberOfCart={4}
      />
    );
  });

  it("should render Orders link when authenticated", () => {
    expect(wrapper.find(<Link to="/orderHistory">Orders</Link>));
  });

  it("should render Login link when not authenticated", () => {
    // Giả lập render component Header (chỉ Header)
    wrapper.setProps({ isAuth: false });
    expect(wrapper.contains(<Link to="/login">Login</Link>)).toEqual(true);
  });
});
