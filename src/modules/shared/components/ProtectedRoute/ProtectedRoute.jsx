import { Navigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loginData } = useAuth();
  if (loginData) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
