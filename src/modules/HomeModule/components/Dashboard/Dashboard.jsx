import { Link } from "react-router-dom";

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
  } = useData();

  console.log(usersList.length);

  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const isAdmin = loginData?.userGroup === "SuperAdmin";
  const isUser = loginData?.userGroup === "SystemUser";
  // console.log("userGroup:", loginData?.userGroup);

  useEffect(() => {
    if (!loginData) return;
    if (isAdmin) getUsers({ pageSize: 2000 });
    getRecipes({}, 1000);
    getCategories();
    getTags();

    if (isUser) {
      getFavorites();
    }
  }, [loginData, isAdmin, isUser]);

  useEffect(() => {
    const admins = usersList.filter((u) => u.group?.id === 1).length;
    const users = usersList.filter((u) => u.group?.id === 2).length;

    setAdminCount(admins);
    setUserCount(users);
  }, [usersList]);

  return (
    <>
      <section className="desk-intro"><h1>{isAdmin ? "Recipe management" : "Your kitchen"}</h1>
        <p>{isAdmin ? "Manage the catalogue, categories and reader accounts." : "Browse the catalogue or return to a saved recipe."}</p>
        <Link className="kitchen-button" to="/recipes">{isAdmin ? "Manage recipes" : "Browse recipes"}</Link>
        {isUser && <Link className="ms-3 link-success" to="/favorites">My favourites</Link>}
      </section>
      <div className="d-flex flex-wrap gap-3">
        {isAdmin && (
          <Card
            cardTitle="User overview"
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
