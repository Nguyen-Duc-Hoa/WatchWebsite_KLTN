import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Space } from "antd";
import "./CheckoutForm.scss";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as actionTypes from "../../store/actions/actionTypes";
import { BiCopy } from "react-icons/bi";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

const formItemLayout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 24,
  },
};

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2VubmluZSIsImEiOiJjbDB0aHljY2UwNnE5M2lwZXA3dG02amRoIn0.OReYhfaCWigJ7ae-eGqogg";

function CheckoutForm({ name, address, phone, onSetInfoOrder, orderInfo }) {
  const [form] = Form.useForm();
  const history = useHistory();
  const [vouchers, setVouchers] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [lng, setLng] = useState(106.758144);
  const [lat, setLat] = useState(10.862592);
  const [zoom, setZoom] = useState(15);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/vouchers`)
      .then((res) => res.json())
      .then((data) => {
        setVouchers(data);
      });
  }, []);

  useEffect(() => {
    if (address !== "null" && "") return;
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?autocomplete=true&access_token=${mapboxgl.accessToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        map.current.flyTo({
          center: data.features[0].center,
          essential: true,
        });
        marker.current.setLngLat(data.features[0].center);
      });
  }, []);

  const getLocationInfo = async (lngInput, latInput) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngInput},${latInput}.json?types=poi&access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      form.setFieldsValue({ address: data.features[0].place_name });
    } catch {
      return "No information";
    }
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    marker.current = new mapboxgl.Marker({ color: "red" })
      .setLngLat([lng, lat])
      .addTo(map.current);

    map.current.on("click", (event) => {
      const { lng: lngEvt, lat: latEvt } = event.lngLat;
      marker.current.setLngLat([lngEvt, latEvt]);
      getLocationInfo(lngEvt, latEvt);
    });
  });

  useEffect(() => {
    if (orderInfo.name || orderInfo.address || orderInfo.phone) {
      form.setFieldsValue({
        name: orderInfo.name,
        address: orderInfo.address,
        phone: orderInfo.phone,
      });
    } else {
      form.setFieldsValue({
        name: (name !== "null" && name) || "",
        address: (address !== "null" && address) || "",
        phone: (phone !== "null" && phone) || "",
      });
    }
  }, []);

  const handleSearch = async (inputValue) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${inputValue}.json?autocomplete=true&country=VN&language=vi&limit=5&access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      setAddresses(data.features);
    } catch {
      console.log("something went wrong");
    }
  };

  const handleClickAddress = (address) => {
    const { place_name, center } = address;
    form.setFieldsValue({ address: place_name });
    setAddresses([]);
    setLng(center[0]);
    setLat(center[1]);
    map.current.flyTo({
      center,
      essential: true,
    });
    marker.current.setLngLat(center);
  };

  const onFinish = (values) => {
    if (values.voucherCode && values.voucherCode.trim() !== "") {
      values["voucherDiscount"] = vouchers.find(
        (voucher) => voucher.Code === values.voucherCode
      ).Discount;
      values["voucherId"] = vouchers.find(
        (voucher) => voucher.Code === values.voucherCode
      ).VoucherId;
    }
    console.log(values);
    onSetInfoOrder(values);
    history.push("/checkout/payment");
  };

  return (
    <div className="form-order">
      <Form
        {...formItemLayout}
        size="large"
        form={form}
        onFinish={onFinish}
        onValuesChange={(_, values) => {
          handleSearch(values.address);
        }}
      >
        <div className="heading">Shipping address</div>

        <Form.Item
          name="name"
          rules={[{ required: true, message: "Full name is required!" }]}
        >
          <Input placeholder="Full name" />
        </Form.Item>

        <Form.Item
          name="address"
          rules={[{ required: true, message: "Address is required!" }]}
        >
          <Input placeholder="Address" autoComplete="off" onBlur={() => setAddresses([])} />
        </Form.Item>

        <div className="addressDropdown">
          {addresses.map((address) => (
            <div
              onClick={() => handleClickAddress(address)}
              className="addressItem"
            >
              {address.place_name}
            </div>
          ))}
        </div>
        <div className="map-container" ref={mapContainer}></div>

        <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Phone is required!",
            },
            {
              validator: (_, value) => {
                const regex =
                  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
                return regex.test(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error("Phone Number is not valid!"));
              },
            },
          ]}
        >
          <Input placeholder="Phone" />
        </Form.Item>

        <Form.Item name="voucherCode">
          <Input placeholder="Your voucher" defaultValue="" />
        </Form.Item>

        <div className="voucher-list">
          {vouchers.length > 0 &&
            vouchers.map((voucher) => (
              <div key={voucher.VoucherId} className="voucher-item">
                <div className="left">
                  <div className="name">{voucher.Name}</div>
                  <div className="value">Value: ${voucher.Discount}</div>
                  <div className="date">
                    Start Date: {new Date(voucher.StartDate).toDateString()}
                  </div>
                  <div className="date">
                    End Date: {new Date(voucher.EndDate).toDateString()}
                  </div>
                </div>
                <div className="right">
                  <div
                    className="copy"
                    title="Click to copy"
                    onClick={() => navigator.clipboard.writeText(voucher.Code)}
                  >
                    <BiCopy style={{ fontSize: "1.5rem" }} />
                  </div>
                </div>
              </div>
            ))}
        </div>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Continue Shipping
            </Button>
            <Link to="/products">
              <Button>Return</Button>
            </Link>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    name: state.auth.name,
    address: state.auth.address,
    phone: state.auth.phone,
    orderInfo: state.order,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetInfoOrder: (orderInfo) =>
      dispatch({ type: actionTypes.ORDER_SET_INFO, payload: orderInfo }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm);
