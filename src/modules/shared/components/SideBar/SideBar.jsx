import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";

export default function SideBar() {
  const [isCollapse, setIsCollapse] = useState(true);
  let toggleCollpase = () => {
    setIsCollapse(!isCollapse);
  };

  return (
    <div className="sidebar-container">
      <Sidebar collapsed={isCollapse}>
        <Menu>
          <div
            onClick={toggleCollpase}
            className="my-4 text-center cursor-pointer "
            style={{ cursor: "pointer" }}
          >
            <img src="/fivicon.png" className="img-fluid w-50" alt="logo" />{" "}
          </div>
          <MenuItem
            icon={<i className="bi bi-house-door"></i>}
            component={<Link to="/dashboard" />}
          >
            Home
          </MenuItem>
          <MenuItem
            icon={<i className="fa-solid fa-users"></i>}
            component={<Link to="/dashboard/users" />}
          >
            Users
          </MenuItem>
          <MenuItem
            icon={<i className="fa-solid fa-bowl-rice"></i>}
            component={<Link to="/dashboard/recipes" />}
          >
            Recipes
          </MenuItem>
          <MenuItem
            icon={<i className="fa-solid fa-layer-group"></i>}
            component={<Link to="/dashboard/categories" />}
          >
            Categories
          </MenuItem>
          <MenuItem icon={<i className="fa-solid fa-key"></i>}>
            Change Password
          </MenuItem>
          <MenuItem
            icon={<i className="fa-solid fa-right-from-bracket"></i>}
            component={<Link to="/login" />}
            onClick={() => localStorage.removeItem("token")}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}
