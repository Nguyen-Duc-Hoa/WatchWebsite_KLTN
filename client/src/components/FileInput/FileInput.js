import React, { useRef } from "react";

const FileInput = ({ className = "", children, onChange, multiple }) => {
  const fileRef = useRef();
  const handlePickFiles = (event) => {
    const fileList = [...event.target.files];
    const files = fileList.filter((file) => file.type.match("image.*"));
    onChange(files);
  };

  return (
    <div
      className={`fileInputWrapper ${className}`}
      onClick={() => fileRef.current.click()}
    >
      {children}
      <input
        style={{ display: "none" }}
        onChange={handlePickFiles}
        type="file"
        multiple={multiple}
        ref={fileRef}
        accept="image/*"
      />
    </div>
  );
};

export default FileInput;
