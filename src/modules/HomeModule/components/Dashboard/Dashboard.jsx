import { Link } from "react-router-dom";
import Header from "../../../shared/components/Header/Header";

import { useEffect, useState } from "react";

import Card from "../Card/Card";
import { useAuth } from "../../../../context/AuthContext";
import { useData } from "../../../../context/DataContext";
export default function Dashboard() {
  const { loginData } = useAuth();
  const {
    favorites,
    getFavorites,
    getRecipes,
    recipesList,
    categoriesList,
    getCategories,
    tags,
    getTags,
    usersList,
    getUsers,
    totalUsers,
    totalRecipes,
  } = useData();

  console.log(usersList.length);

  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [pageSize, setPageSize] = useState(2000);
  const isAdmin = loginData?.userGroup === "SuperAdmin";
  const isUser = loginData?.userGroup === "SystemUser";
  // console.log("userGroup:", loginData?.userGroup);

  useEffect(() => {
    if (!loginData) return;
    getUsers({ pageSize: 2000 });
    getRecipes({}, 1000);
    getCategories();
    getTags();

    if (isUser) {
      getFavorites();
    }
  }, [loginData, pageSize]);

  useEffect(() => {
    const admins = usersList.filter((u) => u.group?.id === 1).length;
    const users = usersList.filter((u) => u.group?.id === 2).length;

    setAdminCount(admins);
    setUserCount(users);
  }, [usersList]);

  return (
    <>
      <Header
        username={loginData?.userName || ""}
        description={
          "This is a welcoming screen for the entry of the application , you can now see the options"
        }
      />
      <div
        style={{ background: `#F0FFEF` }}
        className="  py-5 my-4 rounded-3 px-5 d-flex align-items-center justify-content-between "
      >
        <div>
          <div className="mb-3 ">
            <span className="h4 ">Fill the </span>
            <span className="fs-5  text-success">Recipes !</span>
          </div>
          <p>
            you can now fill the meals easily using the table and form , click
            here and sill it with the table !
          </p>
        </div>
        <div>
          <Link
            to="/recipes"
            className="btn btn-success btn-lg px-5 fw-light text-decoration-none"
          >
            Fill the Recipes <i className="bi bi-arrow-right "></i>
          </Link>
        </div>
      </div>
      <div className="d-flex gap-3">
        {isAdmin && (
          <Card
            cardTitle="Users overviwe"
            stats={[
              {
                icon: "bi-list-ul",
                value: usersList.length,
                label: "Total",
              },
              {
                icon: "bi-person-fill-gear",
                value: adminCount,
                label: "Admins",
              },
              { icon: "bi-person-fill", value: userCount, label: "Users" },
            ]}
          />
        )}
        <Card
          cardTitle="Recipes Overview"
          stats={[
            {
              icon: "bi-egg-fried",
              value: recipesList.length,
              label: "Total Recipes",
            },
            ...(isUser
              ? [
                  {
                    icon: "bi-heart-fill",
                    value: favorites.length,
                    label: "Favorites",
                  },
                ]
              : []),
                
            { icon: "bi-tags", value: tags.length, label: "Tags" },
            ...(!isUser
              ? [
                  {
                    icon: "bi-layers",
                    value: categoriesList.length,
                    label: "Categories",
                  },
                ]
              : []),
          ]}
        />
      </div>
    </>
  );
}
