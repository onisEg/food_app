import React from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";


export default function MasterLayout({ loginData }) {
  return (
    <>
      <div className=" d-flex ">
        <div className="  ">
          <SideBar />
        </div>
        <div className="w-100 bg-white p-4">
          <div className="container-fluid mb-3">
            <Navbar loginData={loginData} />
          </div>
          
          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
