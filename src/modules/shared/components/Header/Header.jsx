import PropTypes from "prop-types";
import "./Header.css";

export default function Header({ title, username, description, headerImg }) {

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
              : ""}
          </span>
        </div>

        <p>{description}</p>
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

Header.propTypes = {
  title: PropTypes.string,
  username: PropTypes.string,
  description: PropTypes.node,
  headerImg: PropTypes.string,
};
