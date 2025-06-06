import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

export default function SideBar() {
  const location = useLocation();
  const { loginData, logout } = useAuth();
  const [isCollapse, setIsCollapse] = useState(false);


  let toggleCollpase = () => {
    setIsCollapse((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", newState);
      return newState;
    });
  };
  // استرجاع القيمة من localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored !== null) {
      setIsCollapse(stored === "true");
    }
  }, []);

  const isAdmin = loginData?.userGroup === "SuperAdmin";
  const isUser = loginData?.userGroup === "SystemUser";

  return (
    <div className="sidebar-container">
      <Sidebar
        collapsed={isCollapse}
        // onMouseEnter={() => setIsCollapse(false)}
        // onMouseLeave={() => setIsCollapse(true)}
      >
        <Menu>
          <div
            onClick={toggleCollpase}
            className="my-4 text-center cursor-pointer "
            style={{ cursor: "pointer" }}
          >
            <img src="/fivicon.png" className="img-fluid w-50" alt="logo" />{" "}
          </div>

          <MenuItem
            className={location.pathname === "/dashboard" ? "active-menu" : ""}
            icon={<i className="bi bi-house-door"></i>}
            component={<Link to="dashboard" />}
          >
            Home
          </MenuItem>
          {isAdmin && (
            <>
              <MenuItem
                className={location.pathname === "/users" ? "active-menu" : ""}
                icon={<i className="fa-solid fa-users"></i>}
                component={<Link to="/users" />}
              >
                Users
              </MenuItem>
              <MenuItem
                className={
                  location.pathname === "/recipes" ? "active-menu" : ""
                }
                icon={<i className="fa-solid fa-bowl-rice"></i>}
                component={<Link to="/recipes" />}
              >
                Recipes
              </MenuItem>
              <MenuItem
                className={
                  location.pathname === "/categories" ? "active-menu" : ""
                }
                icon={<i className="fa-solid fa-layer-group"></i>}
                component={<Link to="/categories" />}
              >
                Categories
              </MenuItem>
            </>
          )}
          {isUser && (
            <>
              <MenuItem
                className={
                  location.pathname === "/recipes" ? "active-menu" : ""
                }
                icon={<i className="fa-solid fa-bowl-rice"></i>}
                component={<Link to="/recipes" />}
              >
                Recipes
              </MenuItem>
              <MenuItem
                className={
                  location.pathname === "/favorites" ? "active-menu" : ""
                }
                icon={<i className="fa-solid fa-heart"></i>}
                component={<Link to="/favorites" />}
              >
                Favorites
              </MenuItem>
            </>
          )}

          <div className="sidebar-divider my-2"></div>

          <MenuItem
            component={<Link to="/ChangePassword" />}
            icon={<i className="fa-solid fa-key"></i>}
          >
            Change Password
          </MenuItem>
          <MenuItem
            icon={<i className="fa-solid fa-right-from-bracket"></i>}
            component={<Link to="/login" />}
            onClick={() => logout()}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}
