import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// ========== Provider ========================
export const AuthProvider = ({ children }) => {
  const [loginData, setLoginData] = useState(null);
  // ----------------------------------
  let saveLoginData = async () => {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    setLoginData(decodedToken);
    console.log(decodedToken);
  };
  // -------------------------------
  useEffect(() => {
    if (localStorage.getItem("token")) {
      saveLoginData();
    }
    console.log("logindata : ", loginData);
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
