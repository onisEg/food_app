import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import "./tabs.css";
export default function MasterLayout() {
  const { loginData, logout } = useAuth();
  const navigate = useNavigate();
  const admin = loginData?.userGroup === "SuperAdmin";
  const { pathname } = useLocation();
  const path = pathname.toLowerCase().replace(/\/$/, "");
  if ((!admin && ["/users", "/categories"].includes(path)) || (admin && path === "/favorites")) return <Navigate to="/dashboard" replace />;
  const links = admin ? [["Dashboard","/dashboard"],["Recipes","/recipes"],["Categories","/categories"],["Users","/users"]] : [["Kitchen","/dashboard"],["Recipes","/recipes"],["Favorites","/favorites"]];
  return <div className={"kitchen-desk " + (admin ? "admin-desk" : "reader-desk")}>
    <header className="desk-menu">
      <Link className="desk-brand" to="/dashboard"><img src="/favicon.svg" alt="" />Food Recipes</Link>
      {admin && <p>Admin workspace</p>}
      <nav aria-label="Workspace">{links.map(([label,to]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
      <details key={pathname} className="desk-account"><summary>Account</summary><div><Link to="/profile">Profile</Link><Link to="/ChangePassword">Change password</Link><button onClick={() => { logout(); navigate("/login", { replace: true }); }}>Log out</button></div></details>
    </header>
    {path === "/dashboard" ? <Outlet /> : <div className="desk-content workspace-tab"><Outlet /></div>}
  </div>;
}
