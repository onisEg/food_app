import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ lgoinData, children }) {
  if (localStorage.getItem("token") || lgoinData) return children;
  else return <Navigate to="/login" replace={true} />;
}
