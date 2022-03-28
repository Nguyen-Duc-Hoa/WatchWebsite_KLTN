import {  Image, Space } from "antd";
import React from "react";
import { faultTolerant } from "./FaultTolerant";
import { AiOutlineUpload } from "react-icons/ai";
import "./UploadImage.scss";

function UploadImage({ imageBase64, setImageBase64 }) {
  const onChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", (event) => {
      const base64 = event.target.result;
      setImageBase64(base64);
    });
  };

  return (
    <Space direction="vertical">
      <Image
        width={200}
        height={200}
        src={imageBase64}
        fallback={faultTolerant}
      />
      <label htmlFor="inputFile" className="customBtnUpload">
        <AiOutlineUpload /> Upload
      </label>
      <input
        id="inputFile"
        type="file"
        accept=".jpg, .png"
        required
        onChange={onChange}
      />
    </Space>
  );
}

export default UploadImage;
