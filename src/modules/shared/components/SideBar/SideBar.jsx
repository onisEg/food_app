import  { useState } from "react";
import { Sidebar, Menu, MenuItem,} from "react-pro-sidebar";
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
          <div onClick={toggleCollpase} className="my-4 text-center ">
            <img
              src="/fivicon.png"
              className="img-fluid w-50"
              alt="logo"
            />{" "}
          </div>

          <MenuItem
            icon={<i className="bi bi-house-door"></i>}
            component={<Link to="/dashboard" />}
          >
            Home
          </MenuItem>
          <MenuItem
            icon={<i className="bi bi-people"></i>}
            component={<Link to="/dashboard/users" />}
          >
            Users
          </MenuItem>
          <MenuItem
            icon={<i className="fa-solid fa-bowl-food"></i>}
            component={<Link to="/dashboard/recipes" />}
          >
            Recipes
          </MenuItem>
          <MenuItem
            icon={<i className="bi bi-calendar-week"></i>}
            component={<Link to="/dashboard/categories" />}
          >
            Categories
          </MenuItem>
          <MenuItem icon={<i className="bi bi-lock"></i>}>
            Change Password
          </MenuItem>
          <MenuItem
            icon={<i className="bi bi-box-arrow-right"></i>}
            component={<Link to="/login" />}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}
