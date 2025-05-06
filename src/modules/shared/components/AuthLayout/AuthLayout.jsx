import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./auth.css";
import { useState } from "react";
export default function AuthLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      return true;
    } else {
      return false;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated && (
        <i className="fa-solid fa-spinner fa-spin-pulse fa-xl"></i>
      )}
      {!isAuthenticated && (
        <div className="auth-container w-100 vh-100 bg-info">
          <div className="container-fluid bgOverlay ">
            <div className="row vh-100 justify-content-center align-items-center">
              <div className=" col-md-10 col-lg-6 px-sm-4  px-md-5 py-4   bg-white rounded">
                <div className="">
                  <div className="log-container text-center">
                    <img src="/foodapplogo.png" alt="foodlogo" />
                  </div>
                </div>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
