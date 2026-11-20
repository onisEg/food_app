import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// ========== Provider ========================
export const AuthProvider = ({ children }) => {
  const [loginData, setLoginData] = useState(null);

  
  // ------------- saveLoginData ---------------------
  let saveLoginData = async () => {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    setLoginData(decodedToken);

  };
  // -------------------------------
  useEffect(() => {
    if (localStorage.getItem("token")) {
      saveLoginData();
    }

  }, []);

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
