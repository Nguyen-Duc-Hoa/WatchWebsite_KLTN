import React from "react";
import "./PageLoading.scss";

export default function PageLoading() {
  return (
    <div className='page-loading'>
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
