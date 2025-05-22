import { useNavigate } from "react-router-dom";
import { imgBaseURL, USERS_URL } from "../../../../services/api/urls";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../services/api";

export default function Navbar({ loginData }) {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  //=============== fetch current user ==============
  const fetchCurrentUser = async () => {
    try {
      const res = await axiosInstance.get(USERS_URL.GET_CURRENT_USER);
      setUserData(res.data);
    } catch (error) {
      console.error("Failed to fetch current user", error);
    }
  };
  const isAdmin = loginData?.userGroup === "SuperAdmin";
  const isUser = loginData?.userGroup === "SystemUser";

  console.log(userData?.imagePath);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

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

        <h4> </h4>
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
                userData?.imagePath
                  ? `${imgBaseURL}/${userData.imagePath}`
                  : `https://ui-avatars.com/api/?name=${
                      userData?.userName || "User"
                    }&length=2&background=0D8ABC&color=fff`
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
