import { Link } from "react-router-dom";
import Header from "../../../shared/components/Header/Header";

import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../services/api";
import {
  USERS_URL,
  RECIPE_URLS,
  USER_RECIPE_URLS,
  TAG,
  CATEGORY_URLS,
} from "../../../../services/api/urls";
import Card from "../Card/Card";

export default function Dashboard({ loginData }) {
  const [totalUsers, setTotalUsers] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const [totalRecipes, setTotalRecipes] = useState(0);
  const [favoriteRecipesCount, setFavoriteRecipesCount] = useState(0);
  const [totalTags, setTotalTags] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  const isAdmin = loginData?.group.name === "SuperAdmin";
  const isUser = loginData?.group.name === "SystemUser";

  const getUsers = async () => {
    try {
      const res = await axiosInstance.get(USERS_URL.GET_ALL_USERS, {
        params: { pageSize: 1000, pageNumber: 1 },
      });
      const users = res.data.data;
      setTotalUsers(users.length);
      setAdminCount(users.filter((u) => u.group?.id === 1).length);
      setUserCount(users.filter((u) => u.group?.id === 2).length);
    } catch (err) {
      console.error("Failed to fetch user stats", err);
    }
  };

  const getRecipesStats = async () => {
    try {
      const recipesRes = await axiosInstance.get(RECIPE_URLS.GET_RECIPES, {
        params: { pageSize: 1000, pageNumber: 1 },
      });
      setTotalRecipes(recipesRes.data.data.length);
    } catch (err) {
      console.error("Failed to fetch recipes", err);
    }
  };

  const getFavoritesStats = async () => {
    try {
      const favRes = await axiosInstance.get(USER_RECIPE_URLS.GET_FAVORITES);
      setFavoriteRecipesCount(favRes.data.data.length);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  const getTagsAndCategoriesStats = async () => {
    try {
      const [tagsRes, categoriesRes] = await Promise.all([
        axiosInstance.get(TAG.ALL_TAGS),
        axiosInstance.get(CATEGORY_URLS.GET_CATEGORIES, {
          params: { pageSize: 1000, pageNumber: 1 },
        }),
      ]);
      setTotalTags(tagsRes.data.length);
      setTotalCategories(categoriesRes.data.data.length);
    } catch (err) {
      console.error("Failed to fetch tags or categories", err);
    }
  };

  useEffect(() => {
    getUsers();
    getRecipesStats();
    getFavoritesStats();
    getTagsAndCategoriesStats();
  }, []);

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
              { icon: "bi-list-ul", value: totalUsers, label: "Total" },
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
              value: totalRecipes,
              label: "Total Recipes",
            },
            ...(isUser
              ? [
                  {
                    icon: "bi-heart-fill",
                    value: favoriteRecipesCount,
                    label: "Favorites",
                  },
                ]
              : []),

            { icon: "bi-tags", value: totalTags, label: "Tags" },
            { icon: "bi-layers", value: totalCategories, label: "Categories" },
          ]}
        />
      </div>
    </>
  );
}
