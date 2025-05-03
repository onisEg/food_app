import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ loginData, children }) {
  if (localStorage.getItem("token") || loginData) return children;
  else return <Navigate to="/login" replace={true} />;
}
