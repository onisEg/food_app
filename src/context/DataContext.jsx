import { createContext, useContext, useState } from "react";
import { axiosInstance } from "../services/api";
import {
  CATEGORY_URLS,
  RECIPE_URLS,
  TAG,
  USER_RECIPE_URLS,
  USERS_URL,
} from "../services/api/urls";
import toast from "react-hot-toast";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recipesList, setRecipesList] = useState([]);

  const [usersList, setUsersList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNumberOfRecords, setTotalNumberOfRecords] = useState(null);

  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // ===================== get profile ================================
  const getProfile = async () => {
    setIsProfileLoading(true);
    try {
      const response = await axiosInstance.get(USERS_URL.GET_CURRENT_USER);
      setProfile(response.data);
    } catch (error) {
      toast.error("Failed to fetch profile.");
    } finally {
      setIsProfileLoading(false);
    }
  };

  // -------------------------------------------------------------
  const updateProfileImage = async ({ file, password }, onSuccess) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("userName", profile.userName);
    formData.append("email", profile.email);
    formData.append("phoneNumber", profile.phoneNumber);
    formData.append("country", profile.country);
    formData.append("confirmPassword", password);

    try {
      await axiosInstance.put(USERS_URL.UPDATE_PROFILE, formData);
      toast.success("Profile image updated!");
      getProfile();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Failed to update image");
      console.error(err);
    }
  };

  // ============== get users ===================
  const getUsers = async ({
    pageNumber = 1,
    pageSize,
    searchUserName = "",
    searchEmail = "",
    searchCountry = "",
    searchGroup = "",
  }) => {
    setIsLoading(true);
    const params = {
      pageSize,
      pageNumber,
      userName: searchUserName,
      country: searchCountry,
      groups: searchGroup ? [parseInt(searchGroup)] : undefined,
    };

    try {
      const response = await axiosInstance.get(USERS_URL.GET_ALL_USERS, {
        params,
      });
      let data = response.data.data;

      setTotalPages(response.data.totalNumberOfPages);
      if (searchEmail) {
        const search = searchEmail.toLowerCase();
        data = data.filter((user) =>
          user.email?.toLowerCase().includes(search)
        );
      }
      setUsersList(data);
      setTotalNumberOfRecords(response.data.totalNumberOfRecords);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  // =================== on delete user =================================
  const onDeleteUser = async (userId, callback) => {
    try {
      await axiosInstance.delete(`${USERS_URL.DELETE(userId)}`);
      toast.success("User Deleted Successfully");
      if (callback) callback();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };

  // =================== get categores =========================================
  const getCategories = async (
    searchName = "",
    pageNumber = 1,
    pageSize = 10
  ) => {
    setIsLoading(true);
    try {
      const params = {
        pageSize,
        pageNumber,
      };
      if (searchName) params.name = searchName;

      const response = await axiosInstance.get(CATEGORY_URLS.GET_CATEGORIES, {
        params,
      });
      setCategoriesList(response.data.data);
      setTotalPages(response.data.totalNumberOfPages);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // =========== Fetch Tags  ===========
  const getTags = async () => {
    try {
      let response = await axiosInstance.get(`${TAG.ALL_TAGS}`);
      console.log(`tags : `, response.data);
      setTags(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch tags.");
    }
  };
  //=======  get all favorite ==============
  const getFavorites = async () => {
    try {
      const res = await axiosInstance.get(USER_RECIPE_URLS.GET_FAVORITES);
      setFavorites(res.data.data);
      // console.log(`favorites: `, favorites);
    } catch (error) {
      const status = error.response?.status;
      if (status !== 403 || recipesList.length > 0) {
        toast.error("Failed to load favorites");
      }
      // setFavorites([]);
    }
  };
  // ========== add category ==============
  const addCategory = async (data, onSuccess) => {
    try {
      const response = await axiosInstance.post(
        CATEGORY_URLS.ADD_CATEGORY,
        data
      );
      toast.success(`${response.data.name} Category Added`);
      onSuccess();
      getCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category.");
    }
  };

  // --------------- edit category -------------
  const updateCategory = async (id, data, onSuccess) => {
    try {
      const response = await axiosInstance.put(
        CATEGORY_URLS.UPDATE_CATEGORY(id),
        data
      );
      toast.success(`${response.data.name} Category Updated`);
      onSuccess();
      getCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update category."
      );
    }
  };

  // --------------- delete category -------------
  const deleteCategory = async (id, onSuccess) => {
    try {
      await axiosInstance.delete(CATEGORY_URLS.DELETE_CATEGORY(id));
      toast.success("Category Deleted Successfully");
      onSuccess();
      getCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete category."
      );
    }
  };
  //========== toggle favorite ==============
  const toggleFavorite = async (recipeId) => {
    const existing = Array.isArray(favorites)
      ? favorites.find((fav) => fav.recipe?.id === recipeId)
      : null;

    try {
      if (existing) {
        await axiosInstance.delete(
          USER_RECIPE_URLS.DELETE_FAVORITE(existing.id)
        );
        await getFavorites(); // هذا يكفي
        toast.success("Removed from favorites");
      } else {
        const res = await axiosInstance.post(USER_RECIPE_URLS.ADD_FAVORITE, {
          recipeId,
        });

        if (res?.data?.id && res?.data?.recipe?.id) {
          await getFavorites(); // هذا يكفي
          toast.success("Added to favorites");
        } else {
          toast.error("Invalid response when adding to favorites");
        }
      }
    } catch (err) {
      toast.error("Favorite update failed");
      console.error(err);
    }
  };

  //================ get recipes =========
  const getRecipes = async (filters = {}, pageSize = 1, pageNumber = 1) => {
    setIsLoading(true);
    const params = {
      pageSize,
      pageNumber,
      ...filters,
    };
    try {
      const res = await axiosInstance.get(RECIPE_URLS.GET_RECIPES, { params });
      setTotalNumberOfRecords(res.data.totalNumberOfRecords);
      setTotalPages(res.data.totalNumberOfPages);
      setRecipesList(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch recipes");
    } finally {
      setIsLoading(false);
    }
  };

  // =========== Delete Recipe ==============
  const onDeleteRecipe = async (selectedRecipeId, onSuccess) => {
    try {
      await axiosInstance.delete(
        `${RECIPE_URLS.DELETE_RECIPE(selectedRecipeId)}`
      );
      toast.success("Recipe Deleted Successfully");
      if (typeof onSuccess === "function") onSuccess();
      getRecipes();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete recipe.");
    }
  };

  // add recipe
  const onAddRecipe = async (data, onSuccess) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", parseInt(data.price));
    formData.append("tagId", parseInt(data.tagId));
    formData.append("categoriesIds", data.categoriesIds);

    if (data.image && data.image[0]) {
      formData.append("recipeImage", data.image[0]);
    }

    try {
      const response = await axiosInstance.post(
        RECIPE_URLS.ADD_RECIPE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(`${response.data.message}`);
      if (typeof onSuccess === "function") onSuccess();
      getRecipes();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add recipe.");
    }
  };
  // edit recipe
  const onEditRecipe = async (id, data, onSuccess) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", parseInt(data.price));
    formData.append("tagId", parseInt(data.tagId));
    formData.append("categoriesIds", data.categoriesIds);

    if (data.image && data.image[0]) {
      formData.append("recipeImage", data.image[0]);
    } else if (data.imagePath) {
      formData.append("imagePath", data.imagePath); // old photo
    }

    try {
      const response = await axiosInstance.put(
        RECIPE_URLS.UPDATE_RECIPE(id),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(`${response.data.name} Recipe Updated`);
      if (typeof onSuccess === "function") onSuccess();
      getRecipes();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update recipe.");
    }
  };

  return (
    <DataContext.Provider
      value={{
        categoriesList,
        isLoading,
        getCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        tags,
        getTags,
        favorites,
        getFavorites,
        toggleFavorite,
        getRecipes,
        recipesList,
        onDeleteRecipe,
        onAddRecipe,
        onEditRecipe,
        usersList,
        getUsers,
        onDeleteUser,
        totalPages,
        totalNumberOfRecords,
        profile,
        isProfileLoading,
        getProfile,
        updateProfileImage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
