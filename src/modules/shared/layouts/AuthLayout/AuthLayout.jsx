import { recipeDestination } from "../../../recipes/guestRecipes";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./auth.css";
import { useState } from "react";
export default function AuthLayout() {
  const { search } = useLocation();

  const [isAuthenticated] = useState(() => {
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
      navigate(recipeDestination(search), { replace: true });
    }
  }, [isAuthenticated, navigate, search]);

  if (isAuthenticated) return <p role="status">Opening dashboard…</p>;
  return (
    <main className="account-shell">
      <div className="account-panel">
        <a className="wordmark" href="/guest"><img src="/favicon.svg" alt="" /> Food Recipes</a>
        <Outlet />
      </div>
    </main>
  );
}
