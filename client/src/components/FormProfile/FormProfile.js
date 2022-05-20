import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, DatePicker } from "antd";
import "./FormProfile.scss";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const regexPhoneNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
const dateFormat = "YYYY/MM/DD";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2VubmluZSIsImEiOiJjbDB0aHljY2UwNnE5M2lwZXA3dG02amRoIn0.OReYhfaCWigJ7ae-eGqogg";

function FormProfile({ form, onSubmit, loading, address }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [lng, setLng] = useState(106.758144);
  const [lat, setLat] = useState(10.862592);
  const [zoom, setZoom] = useState(15);
  const [addresses, setAddresses] = useState([]);

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

  const handleSearch = async (inputValue) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${inputValue}.json?autocomplete=true&access_token=${mapboxgl.accessToken}`
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

  return (
    <Form
      {...layout}
      style={{ maxWidth: 600 }}
      onFinish={onSubmit}
      form={form}
      onValuesChange={(_, values) => {
        handleSearch(values.address);
      }}
    >
      <Form.Item
        label="Name"
        rules={[
          {
            required: true,
            message: "Name is required!",
          },
          {
            min: 4,
            message: "Name length must be at least 4 characters!",
          },
          {
            max: 20,
            message: "Name length must be less than 20 characters!",
          },
        ]}
        name="name"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[
          {
            required: true,
            message: "Address is required!",
          },
        ]}
      >
        <Input autoComplete="off" />
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
        label="E-mail"
        name="email"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
          {
            max: 80,
            message: "Email length must be less than 80 characters!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
        rules={[
          {
            required: true,
            message: "Please input your phone number!",
          },
          {
            validator: (_, value) =>
              value.match(regexPhoneNumber)
                ? Promise.resolve()
                : Promise.reject(new Error("Phone number invalid!")),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Birthday" name="birthday" rules={[{ type: "object" }]}>
        <DatePicker format={dateFormat} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default FormProfile;
