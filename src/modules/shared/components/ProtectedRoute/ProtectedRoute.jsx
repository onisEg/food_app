import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ loginData, children }) {
  if (loginData) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
