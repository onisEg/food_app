import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";

export default function MasterLayout({ loginData, setLoginData }) {
  return (
    <>
      <div className=" d-flex ">
        <div className=" position-sticky top-0  vh-100 ">
          <SideBar loginData={loginData} setLoginData={setLoginData} />
        </div>
        <div className="w-100 bg-white p-4">
          <div className="container-fluid mb-3 px-0">
            <Navbar loginData={loginData} />
          </div>
          <div className="">
            <Outlet />
          </div>
          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
}
