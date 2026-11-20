import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// ========== Provider ========================
export const AuthProvider = ({ children }) => {
  const [loginData, setLoginData] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const claims = jwtDecode(token);
      if (!claims.exp || claims.exp * 1000 > Date.now()) return claims;
    } catch {
      // Discard an unreadable saved session.
    }
    localStorage.removeItem("token");
    return null;
  });

  const saveLoginData = () => setLoginData(jwtDecode(localStorage.getItem("token")));

  const logout = () => {
    localStorage.removeItem("token");
    setLoginData(null);
  };
  return (
    <AuthContext.Provider
      value={{ loginData, setLoginData, saveLoginData, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ========== Custom Hook ==================
export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node,
};
