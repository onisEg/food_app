import { useForm } from "react-hook-form";
import Header from "../../../shared/components/Header/Header";
import {
  CATEGORY_URLS,
  imgBaseURL,
  RECIPE_URLS,
  TAG,
  USER_RECIPE_URLS,
} from "../../../../services/api/urls";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../services/api";

import Modal from "react-bootstrap/Modal";
import "./RecipesList.css";
import toast from "react-hot-toast";

import NoData from "../../../shared/components/noData/NoData";
import DeleteModal from "../../../shared/components/DeleteModal/DeleteModal";

export default function RecipeList({ loginData }) {
  const [recipesList, setRecipesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [editedRecipeId, setEditedRecipeId] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" or "edit" or "delete"

  const [searchName, setSearchName] = useState("");
  const [searchTagId, setSearchTagId] = useState("");
  const [searchCategoryId, setSearchCategoryId] = useState("");
  const [favorites, setFavorites] = useState([]);
  const isUser = loginData?.roles?.[0] === "User";

  let {
    register,
    setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm();

  //get all favorite
  const getFavorites = async () => {
    try {
      const res = await axiosInstance.get(USER_RECIPE_URLS.GET_FAVORITES);

      setFavorites(res.data.data);
      console.log(favorites);
    } catch (error) {
      toast.error("Failed to load favorites");
      setFavorites([]);
    }
  };

  //toggle favorite
  const toggleFavorite = async (recipeId) => {
    const existing = Array.isArray(favorites)
      ? favorites.find((fav) => fav.recipe?.id === recipeId)
      : null;

    try {
      if (existing) {
        await axiosInstance.delete(
          USER_RECIPE_URLS.DELETE_FAVORITE(existing.id)
        );
        setFavorites((prev) =>
          Array.isArray(prev) ? prev.filter((f) => f.id !== existing.id) : []
        );
        toast.success("Removed from favorites");
      } else {
        const res = await axiosInstance.post(USER_RECIPE_URLS.ADD_FAVORITE, {
          recipeId,
        });

        if (res?.data?.id && res?.data?.recipe?.id) {
          setFavorites((prev) => [
            ...(Array.isArray(prev) ? prev : []),
            res.data,
          ]);
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

  // Fetch Recipes
  const getRecipes = async () => {
    const params = {
      pageSize: 1000,
      pageNumber: 1,
    };

    if (searchName) params.name = searchName;
    if (searchTagId) params.tagId = searchTagId;
    if (searchCategoryId) params.categoryId = searchCategoryId;

    try {
      const response = await axiosInstance.get(RECIPE_URLS.GET_RECIPES, {
        params,
      });
      setRecipesList(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch recipes.");
    }
  };

  // ====== Fetch Categories List ======
  const getCategories = async () => {
    try {
      let response = await axiosInstance.get(
        `${CATEGORY_URLS.GET_CATEGORIES}?pageSize=1000&pageNumber=1`
      );
      console.log(response.data.data);

      setCategoriesList(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories."
      );
    }
  };
  // ====== Fetch Tags  ======
  const getTags = async () => {
    try {
      let response = await axiosInstance.get(`${TAG.ALL_TAGS}`);
      console.log(response.data);
      setTags(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch tags.");
    }
  };

  const onAddRecipe = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", parseInt(data.price)); // تأكد إنه رقم
    formData.append("tagId", parseInt(data.tagId)); // قيمة واحدة فقط
    formData.append("categoriesIds", data.categoriesIds);

    // add image
    if (data.image && data.image[0]) {
      formData.append("recipeImage", data.image[0]);
    }
    //
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
      console.log(response);
      toast.success(`${response.data.message}`);
      setModalShow(false);
      reset();
      getRecipes();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add recipe.");
    }
  };

  // Edit Recipe
  const onEditRecipe = async (data) => {
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
      const response = await axiosInstance.put(
        `${RECIPE_URLS.UPDATE_RECIPE(editedRecipeId)}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(`${response.data.name} Recipe Updated`);
      setModalShow(false);
      reset();
      getRecipes();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update recipe.");
    }
  };

  // Delete Recipe
  const onDeleteRecipe = async () => {
    try {
      await axiosInstance.delete(
        `${RECIPE_URLS.DELETE_RECIPE(selectedRecipeId)}`
      );
      toast.success("Recipe Deleted Successfully");
      setShowDeleteModal(false);
      getRecipes();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete recipe.");
    }
  };

  useEffect(() => {
    getRecipes();
    getTags();
    getCategories();
    getFavorites();

    const delayDebounce = setTimeout(() => {
      getRecipes();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchName, searchTagId, searchCategoryId]);

  return (
    <>
      <Header
        title={"Recipes"}
        username={"Items"}
        description={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
        headerImg={"/resipes.svg"}
      />
      <div className="d-flex justify-content-between align-content-center my-4">
        <div className="d-flex flex-column ">
          <span className="fs-3">Recipe Table Details</span>
          <span>You can check all details</span>
        </div>
        <div>
          <div
            onClick={() => {
              setModalType("add");
              setModalShow(true);
              reset({
                name: "",
                price: "",
                tagId: "",
                categoriesIds: "",
                description: "",
                image: null,
              });
              if (!tags.length || !categoriesList.length) {
                toast.error("Please wait for data to load...");
                return;
              }
            }}
            style={{ background: "#009247" }}
            className="px-5 btn btn-success btn-lg text-white d-flex justify-content-center align-items-center"
          >
            Add New Resipe
          </div>
        </div>
      </div>

      {/* filter ui */}
      <div className="d-flex gap-3 mb-3">
        <input
          type="text"
          className="form-control form-control"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ flex: "5" }}
        />

        <select
          className="form-select "
          style={{ flex: "1" }}
          value={searchTagId}
          onChange={(e) => setSearchTagId(e.target.value)}
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>

        <select
          className="form-select "
          style={{ flex: "1" }}
          value={searchCategoryId}
          onChange={(e) => setSearchCategoryId(e.target.value)}
        >
          <option value="">All Categories</option>
          {categoriesList.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="col-auto">
          <button
            className="btn  btn-outline-danger"
            onClick={() => {
              setSearchName("");
              setSearchTagId("");
              setSearchCategoryId("");
            }}
          >
            Clear Filter
          </button>
        </div>
      </div>

      {/* Recipes Table */}
      <table className="table table-striped-reversed">
        <thead className="">
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>description</th>
            <th>price</th>
            <th>Category</th>
            <th>Creation Date</th>
            <th>Modification Date</th>
            {isUser && <th>Favorite</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipesList.map((recipe) => (
            <tr key={recipe.id}>
              {/* recipeName  */}
              <td>
                <div className=" d-flex justify-content-between align-content-center">
                  <div>{recipe.name} </div>
                  <span className="badge bg-primary">{recipe.tag.name}</span>
                </div>
              </td>
              {/* recipeImg */}
              <td>
                <img
                  className=" rounded img-thumbnail "
                  src={
                    recipe.imagePath ? `${imgBaseURL}/${recipe.imagePath}` : ""
                  }
                  alt={recipe.name}
                />
              </td>
              <td className="text-start">
                {recipe.description.slice(0, 50)}...
              </td>
              <td>{recipe.price} EGP</td>
              <td>{recipe.category?.[0]?.name}</td>

              <td>
                {new Date(recipe.creationDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td>{new Date(recipe.modificationDate).toLocaleDateString()}</td>

              {/* ============= fav ========= */}

              {isUser && (
                <td>
                  <i
                    style={{ cursor: "pointer" }}
                    className={`bi ${
                      Array.isArray(favorites) &&
                      favorites.some((fav) => fav.recipe?.id === recipe.id)
                        ? "bi-heart-fill text-danger"
                        : "bi-heart"
                    }`}
                    onClick={() => toggleFavorite(recipe.id)}
                  ></i>
                </td>
              )}
              <td>
                <div className="dropdown">
                  <button
                    className="btn  border-0"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-ellipsis fa-lg"></i>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow  border-0">
                    <li>
                      <button className="dropdown-item d-flex align-items-center gap-2 text-success">
                        <i className="bi bi-eye"></i> View
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setEditedRecipeId(recipe.id);
                          setModalType("edit");
                          setModalShow(true);
                          reset({
                            name: recipe.name,
                            price: recipe.price,
                            tagId: recipe.tag.id,
                            categoriesIds: recipe.category?.[0]?.id,
                            description: recipe.description,
                            image: null,
                          });
                          if (!tags.length || !categoriesList.length) {
                            toast.error("Please wait for data to load...");
                            return;
                          }
                        }}
                        className="dropdown-item d-flex align-items-center gap-2 text-success"
                      >
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setSelectedRecipeId(recipe.id);
                          setModalType("delete");
                          setShowDeleteModal(true);
                        }}
                        className="dropdown-item d-flex align-items-center gap-2 text-danger"
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty Data Message */}
      {recipesList.length === 0 && <NoData />}

      {/* Modal delete Logic */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDeleteRecipe}
        itemName={
          recipesList.find((recipe) => recipe.id === selectedRecipeId)?.name
        }
        title="Delete Recipe"
      />

      {/* Modal for Add/Edit */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {(modalType === "add" || modalType === "edit") && (
          <>
            <Modal.Header closeButton>
              <div>
                <Modal.Title
                  className="fw-light fs-2"
                  id="contained-modal-title-vcenter"
                >
                  {modalType === "edit" ? "Update Recipe" : "Add Recipe"}
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <form
                onSubmit={handleSubmit(
                  modalType === "edit" ? onEditRecipe : onAddRecipe
                )}
              >
                {/* Recipe Name */}
                <div className="input-group icon-input  ">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Recipe Name"
                    {...register("name", {
                      required: "Recipe Name is required",
                    })}
                  />
                </div>
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}

                {/* Price */}
                <div className="input-group icon-input mt-4">
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="Price"
                    {...register("price", { required: "Price is required" })}
                  />
                  <span className="input-group-text">EGP</span>
                </div>
                {errors.price && (
                  <small className="text-danger">{errors.price.message}</small>
                )}

                {/* chooce Tag ID */}
                <div className="mt-4">
                  <select
                    className="form-select form-control-lg"
                    {...register("tagId", { required: "Tag ID is required" })}
                  >
                    <option value="">Add Tag</option>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                  {errors.tagId && (
                    <small className="text-danger">
                      {errors.tagId.message}
                    </small>
                  )}
                </div>

                {/* choose Categories IDs */}
                <div className="mt-4">
                  <select
                    className="form-select form-control-lg"
                    {...register("categoriesIds", {
                      required: "Category is required",
                    })}
                  >
                    <option value="">Add Category</option>
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoriesIds && (
                    <small className="text-danger">
                      {errors.categoriesIds.message}
                    </small>
                  )}
                </div>

                {/* write Description */}
                <div className="input-group icon-input mt-3 mb-4 ">
                  <textarea
                    className="form-control"
                    placeholder="Description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                </div>
                {errors.description && (
                  <small className="text-danger">
                    {errors.description.message}
                  </small>
                )}

                {/* upload Recipe Image */}
                <div className="input-group icon-input mb-5">
                  <div
                    className="drag-drop-zone  text-center w-100 "
                    style={{
                      backgroundColor: "#f6fff7",
                      border: "1px dashed green",
                    }}
                  >
                    <input
                      type="file"
                      className="form-control d-none"
                      id="uploadImage"
                      {...register("image", { required: "Image is required" })}
                    />
                    <label htmlFor="uploadImage" className="text-success">
                      <div>
                        <i className="bi bi-upload fa-2x"></i>
                      </div>
                      Drag & Drop or{" "}
                      <span className="text-primary">
                        Choose an Item Image to Upload
                      </span>
                    </label>
                  </div>
                  {errors.image && (
                    <small className="text-danger">
                      {errors.image.message}
                    </small>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  className={`btn btn-lg w-100 mt-5 ${
                    modalType === "edit" ? "btn-warning" : "btn-success"
                  }`}
                >
                  {modalType === "edit" ? "Update" : "Add Recipe"}
                </button>
              </form>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
}
