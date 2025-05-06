import { useLocation } from "react-router-dom";
import "./Header.css";

export default function Header({ title, username, description, headerImg }) {
  const location = useLocation()
  
  return (
    <div className="header-container d-flex justify-content-between align-items-center p-md-4">
      <div className="caption text-white ">
        <div className="mb-3 ">
          <span className="h1 ">{title || "Welcome"}</span>
          <span className="fs-3 mx-3 text-capitalize">
            {username
              ? username
                  .replace(/[0-9]/g, "")
                  .replace(/^\w/, (c) => c.toUpperCase())
              : "UserName"}
          </span>
        </div>

        <p className="">{description}</p>
      </div>
      <div className="header-img ">
        <img
          className="img-fluid"
          src={headerImg || `/header-img.svg`}
          alt="header-image"
        />
      </div>
    </div>
  );
}
