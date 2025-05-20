import { useNavigate } from "react-router-dom";
import { imgBaseURL } from "../../../../services/api/urls";

export default function Navbar({ loginData }) {
  const navigate = useNavigate();
  console.log(loginData?.group.name);

  const isAdmin = loginData?.group.name === "SuperAdmin";
  const isUser = loginData?.group.name === "SystemUser";

  return (
    <>
      <div className="navbar-container d-flex justify-content-between align-items-center px-4 py-3 bg-light rounded-3 gap-3 shadow-sm">
        {/* Search Bar */}
        {/* <div className="input-group w-100 shadow-sm">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search..."
            aria-label="Search"
          />
        </div> */}

        
        <h4 > </h4>
        {/* User Info */}
        <div
          className="d-flex align-items-center justify-content-end gap-4 w-25 cursor-pointer"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/profile")}
        >
          <i className="bi bi-chevron-down fs-5 text-muted"></i>
          <div className="position-relative">
            <i className="bi bi-bell fs-5 text-muted"></i>
          </div>
          <div className="d-flex">
            <img
              src={
                loginData?.imagePath
                  ? `${imgBaseURL}/${loginData?.imagePath}`
                  : "https://ui-avatars.com/api/?name=User&background=random&size=60"
              }
              alt="User"
              className="rounded-circle"
              width="40"
              height="40"
            />
            <div className=" mx-3 ">
              <span className="fw-bold text-capitalize  fs-6 ">
                {loginData?.userName
                  ? loginData?.userName
                      .replace(/[0-9]/g, "")
                      .replace(/^\w/, (c) => c.toUpperCase())
                  : "UserName"}
              </span>
              <div className="small ">{isAdmin ? "Admin" : "User"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
