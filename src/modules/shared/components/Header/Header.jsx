import "./Header.css";

export default function Header({ title, username, description, headerImg }) {
  return (
    <div className="header-container d-flex justify-content-evenly align-items-center py-2">
      <div className="caption text-white ">
        <div className="mb-3 ">
          <span className="h1 ">{title || "Welcome"}</span>
          <span className="fs-3 mx-3 text-capitalize">
            {username || "UserName"}
          </span>
        </div>

        <p className="">{description}</p>
      </div>
      <div className="header-img">
        <img
          className="img-fluid"
          src={headerImg || `/public/header-img.svg`}
          alt="header-image"
        />
      </div>
    </div>
  );
}
