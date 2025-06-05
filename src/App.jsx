import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFouned from "./modules/shared/components/NotFound/NotFouned";
import Login from "./modules/authentication/components/Login/Login";
import Registeration from "./modules/authentication/components/Registeration/Registeration";

import RecipeList from "./modules/recipes/components/RecipesList/RecipeList";
import RecipeData from "./modules/recipes/components/RecipeData/RecipeData";
import CategoriesList from "./modules/categories/components/CategoriesList/CategoriesList";

import ProtectedRoute from "./modules/shared/components/ProtectedRoute/ProtectedRoute";
import UsersList from "./modules/users/components/UsersList/UsersList";
import Dashboard from "./modules/HomeModule/components/Dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
import Profile from "./modules/users/components/Profile/Profile";
import AuthLayout from "./modules/shared/layouts/AuthLayout/AuthLayout";
import ChangePassword from "./modules/authentication/components/ChangePassword/ChangePassword";
import MasterLayout from "./modules/shared/layouts/MasterLayout/MasterLayout";

import VerifyEmail from "./modules/authentication/components/VerifyEmail/VerifyEmail";
import Favorites from "./modules/recipes/components/Favorites/Favorites";
import ForgetPassword from "./modules/authentication/components/ForgetPass/ForgetPassword";
import ResetPassword from "./modules/authentication/components/ResetPass/ResetPassword";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <NotFouned />,
      children: [
        { index: true, element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Registeration /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "verify", element: <VerifyEmail /> },
      ],
    },
    {
      path: "",
      element: (
        <ProtectedRoute>
          <MasterLayout />
        </ProtectedRoute>
      ),
      errorElement: <NotFouned />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "recipes", element: <RecipeList /> },
        { path: "users", element: <UsersList /> },
        { path: "recipe-data", element: <RecipeData /> },
        { path: "categories", element: <CategoriesList /> },

        { path: "ChangePassword", element: <ChangePassword /> },
        { path: "profile", element: <Profile /> },
        { path: "favorites", element: <Favorites /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
      <Toaster />
    </>
  );
}

export default App;
