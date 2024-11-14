import React from "react";
import { Outlet } from "react-router-dom";
import './auth.css'
export default function AuthLayout() {
  return (
    <>
      <div className="auth-container w-100 vh-100 bg-info">
        <div className="container-fluid bgOverlay ">
          <div className="row vh-100 justify-content-center align-items-center">
            <div className="col-md-6 col-lg-4 col-4 px-5 py-4   bg-white rounded">
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
    </>
  );
}
