// this button

import React from "react";

export default function ActionBtn({ onClick, btnColor, icon, title }) {
  return (
    <button
      className={`btn btn-outline-${btnColor} rounded-circle d-flex align-items-center justify-content-center`}
      title={title}
      style={{ width: "3rem", height: "3rem" }}
      onClick={onClick}
    >
      <i className={`${icon}`}></i>
    </button>
  );
}
