import { Link } from "react-router-dom";
import { imgBaseURL, USERS_URL } from "../../../../services/api/urls";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../services/api";
import { useAuth } from "../../../../context/AuthContext";

export default function Navbar() {
  const [userData, setUserData] = useState(null);
  const { loginData } = useAuth();
  //=============== fetch current user ==============
  const fetchCurrentUser = async () => {
    try {
      const res = await axiosInstance.get(USERS_URL.GET_CURRENT_USER);
      setUserData(res.data);
    } catch (error) {
      console.error("Failed to fetch current user", error);
    }
  };
  const isAdmin = loginData?.userGroup === "SuperAdmin";

  // console.log(userData?.imagePath);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <nav className="desk-nav" aria-label="Workspace">
      <Link className="wordmark" to="/dashboard"><img src="/favicon.svg" alt="" />Food Recipes</Link>
      <Link className="profile-link" to="/profile">
        {userData?.imagePath && <img src={imgBaseURL + "/" + userData.imagePath} alt="" width="32" height="32" />}
        {loginData?.userName || "Profile"} <small>{isAdmin ? "Admin" : "Reader"}</small>
      </Link>
    </nav>
  );
}
