import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";

export default function MasterLayout() {
  
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="workspace-shell d-flex ">
        <button type="button" className="directory-menu-toggle" aria-controls="workspace-nav" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
        <div id="workspace-nav" className={"position-sticky top-0 vh-100 " + (menuOpen ? "directory-menu-open" : "")}>
          <SideBar />
        </div>
        <div className="w-100 bg-white p-4 ">
          <div className="container-fluid mb-3 px-0">
            <Navbar />
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
