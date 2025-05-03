import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFouned from "./modules/shared/components/NotFound/NotFouned";
import AuthLayout from "./modules/shared/components/AuthLayout/AuthLayout";
import Login from "./modules/authentication/components/Login/Login";
import Registeration from "./modules/authentication/components/Registeration/Registeration";
import ResetPass from "./modules/authentication/components/ResetPass/ResetPass";
import ChangePass from "./modules/authentication/components/ChangePass/ChangePass";
import MasterLayout from "./modules/shared/components/MasterLayout/MasterLayout";
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
function App() {
  const [loginData, setLoginData] = useState(null);
  let saveLoginData = () => {
    let decodeedToken = localStorage.getItem("token");
    let encodedToken = jwtDecode(decodeedToken);
    setLoginData(encodedToken);
    console.log(encodedToken);
    
    
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      saveLoginData();
    }
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
        { path: "changepass", element: <ChangePass /> },
        { path: "forgetpass", element: <ForgetPass /> },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute loginData={loginData}>
          <MasterLayout loginData={loginData} />
        </ProtectedRoute>
      ),
      errorElement: <NotFouned />,
      children: [
        { index: true, element: <Dashboard loginData={loginData} /> },
        { path: "dashboard", element: <Dashboard loginData={loginData} /> },
        { path: "recipes", element: <RecipeList /> },
        { path: "users", element: <UsersList /> },
        { path: "recipe-data", element: <RecipeData /> },
        { path: "categories", element: <CategoriesList /> },
        { path: "category-data", element: <CategoryData /> },
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
