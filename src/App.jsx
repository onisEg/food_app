import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFouned from "./modules/shared/components/NotFound/NotFouned";
import Login from "./modules/authentication/components/Login/Login";
import Registeration from "./modules/authentication/components/Registeration/Registeration";
import ResetPass from "./modules/authentication/components/ResetPass/ResetPass";

import ForgetPass from "./modules/authentication/components/ForgetPass/ForgetPass";

import RecipeList from "./modules/recipes/components/RecipesList/RecipeList";
import RecipeData from "./modules/recipes/components/RecipeData/RecipeData";
import CategoriesList from "./modules/categories/components/CategoriesList/CategoriesList";
import CategoryData from "./modules/categories/components/CategoryData/CategoryData";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "./modules/shared/components/ProtectedRoute/ProtectedRoute";
import UsersList from "./modules/users/components/UsersList/UsersList";
import Dashboard from "./modules/HomeModule/components/Dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
import Profile from "./modules/users/components/Profile/Profile";
import AuthLayout from "./modules/shared/layouts/AuthLayout/AuthLayout";
import ChangePassword from "./modules/authentication/components/ChangePassword/ChangePassword";
import MasterLayout from "./modules/shared/layouts/MasterLayout/MasterLayout";
import { axiosInstance } from "./services/api";
import { USERS_URL } from "./services/api/urls";
import VerifyEmail from "./modules/authentication/components/VerifyEmail/VerifyEmail";
import Favorites from "./modules/recipes/components/Favorites/Favorites";
function App() {
  const [loginData, setLoginData] = useState(null);

  let saveLoginData = async () => {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    setLoginData(decodedToken);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      saveLoginData();
    }
    console.log("logindata : ", loginData);
  }, []);

  const routes = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <NotFouned />,
      children: [
        { index: true, element: <Login saveLoginData={saveLoginData} /> },
        { path: "login", element: <Login saveLoginData={saveLoginData} /> },
        { path: "register", element: <Registeration /> },
        { path: "resetpass", element: <ResetPass /> },
        { path: "forgetpass", element: <ForgetPass /> },
        { path: "verify", element: <VerifyEmail /> },
      ],
    },
    {
      path: "",
      element: (
        <ProtectedRoute loginData={loginData}>
          <MasterLayout setLoginData={setLoginData} loginData={loginData} />
        </ProtectedRoute>
      ),
      errorElement: <NotFouned />,
      children: [
        { path: "dashboard", element: <Dashboard loginData={loginData} /> },
        { path: "recipes", element: <RecipeList loginData={loginData} /> },
        { path: "users", element: <UsersList /> },
        { path: "recipe-data", element: <RecipeData /> },
        { path: "categories", element: <CategoriesList /> },
        { path: "category-data", element: <CategoryData /> },
        { path: "ChangePassword", element: <ChangePassword /> },
        { path: "profile", element: <Profile /> },
        { path: "favorites", element: <Favorites /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
      <Toaster />
    </>
  );
}

export default App;
