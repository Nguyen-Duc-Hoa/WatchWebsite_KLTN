import React from "react";
import "./ImagePreview.css";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ImagePreview = ({ file, onRemove, className = "" }) => {
  const fileUrl = typeof file === "string" ? file : URL.createObjectURL(file);

  return (
    <div className={`imagePreview ${className}`}>
      <img src={fileUrl} />
      <AiOutlineCloseCircle
        className="imageRemoveIcon"
        onClick={onRemove}
      />
    </div>
  );
};

export default ImagePreview;
