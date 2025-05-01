import { useForm } from "react-hook-form";
import Header from "../../../shared/components/Header/Header";
import { RECIPE_URLS } from "../../../../services/api/urls";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../services/api";

import Modal from "react-bootstrap/Modal";
import "./RecipesList.css";
import toast from "react-hot-toast";

export default function RecipeList() {
  const [recipesList, setRecipesList] = useState([]);
  const [editedRecipeId, setEditedRecipeId] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" or "edit" or "delete"

  let {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Fetch Recipes
  const getRecipes = async () => {
    try {
      let response = await axiosInstance.get(
        `${RECIPE_URLS.GET_RECIPES}?pageSize=${10}&pageNumber=${1}`
      );
      console.log(response?.data?.data);
      setRecipesList(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch recipes.");
    }
  };

  const onAddRecipe = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("tagId", data.tagId);
      formData.append("recipeImage", data.recipeImage[0]); // رفع ملف الصورة
      formData.append(
        "categoriesIds",
        JSON.stringify(data.categoriesIds.split(",").map((id) => parseInt(id)))
      );

      let response = await axiosInstance.post(
        RECIPE_URLS.ADD_RECIPE,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(`${response.data.name} Recipe Added`);
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
    try {
      let response = await axiosInstance.put(
        `${RECIPE_URLS.UPDATE_RECIPE(selectedRecipeId)}`,
        data
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
      setModalShow(false);
      getRecipes();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete recipe.");
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

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
              reset();
            }}
            style={{ background: "#009247" }}
            className="px-5 btn btn-success btn-lg text-white d-flex justify-content-center align-items-center"
          >
            Add New Item
          </div>
        </div>
      </div>
      {/* Recipes Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Creation Date</th>
            <th>Modification Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipesList.map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.name}</td>
              <td>
                <img
                  className="cat-img"
                  src={recipe.img || "/public/pizza.png"}
                  alt={recipe.name}
                />
              </td>
              <td>{new Date(recipe.creationDate).toLocaleDateString()}</td>
              <td>{new Date(recipe.modificationDate).toLocaleDateString()}</td>
              <td>
                <i
                  className="bi bi-pencil-square text-warning fa-2x mx-2"
                  onClick={() => {
                    setEditedRecipeId(recipe.id);
                    setModalType("edit");
                    setModalShow(true);
                  }}
                ></i>
                <i
                  className="bi bi-trash text-danger fa-2x mx-2"
                  onClick={() => {
                    setSelectedRecipeId(recipe.id);
                    setModalType("delete");
                    setModalShow(true);
                  }}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal for Add/Edit/Delete */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {modalType === "add" && (
          <>
            <Modal.Header closeButton>
              <div>
                <Modal.Title
                  className="fw-light fs-2"
                  id="contained-modal-title-vcenter"
                >
                  Add Recipe
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit(onAddRecipe)}>
                {/* Recipe Name */}
                <div className="input-group icon-input mb-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Recipe Name"
                    {...register("name", {
                      required: "Recipe Name is required",
                    })}
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name.message}</small>
                  )}
                </div>

                {/* Tag ID */}
                <div className="input-group icon-input mb-4">
                  <select
                    className="form-control"
                    {...register("tagId", { required: "Tag ID is required" })}
                  >
                    <option value="" disabled>
                      Select Tag
                    </option>
                    <option value="1">Starter</option>
                    <option value="2">Main Course</option>
                    <option value="3">Dessert</option>
                  </select>
                  {errors.tagId && (
                    <small className="text-danger">
                      {errors.tagId.message}
                    </small>
                  )}
                </div>

                {/* Price */}
                <div className="input-group icon-input mb-4">
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="Price"
                    {...register("price", { required: "Price is required" })}
                  />
                  <span className="input-group-text">EGP</span>
                  {errors.price && (
                    <small className="text-danger">
                      {errors.price.message}
                    </small>
                  )}
                </div>

                {/* Categories IDs */}
                <div className="input-group icon-input mb-4">
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder="Category IDs (comma-separated)"
                    {...register("categoriesIds", {
                      required: "Category IDs are required",
                    })}
                  />
                  {errors.categoriesIds && (
                    <small className="text-danger">
                      {errors.categoriesIds.message}
                    </small>
                  )}
                </div>
                {/* Description */}
                <div className="input-group icon-input mb-4">
                  <textarea
                    className="form-control"
                    placeholder="Description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && (
                    <small className="text-danger">
                      {errors.description.message}
                    </small>
                  )}
                </div>
                {/* Recipe Image */}
                <div className="input-group icon-input mb-4">
                  <div
                    className="drag-drop-zone border border-success text-center py-4 w-100"
                    style={{ backgroundColor: "#f6fff7" }}
                  >
                    <input
                      type="file"
                      className="form-control d-none"
                      id="uploadImage"
                      {...register("image", { required: "Image is required" })}
                    />
                    <label htmlFor="uploadImage" className="text-success">
                      <div>
                        <i class="bi bi-upload fa-2x"></i>
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
                <button className="btn btn-lg btn-success w-100 m-auto mt-4">
                  Add Recipe
                </button>
              </form>
            </Modal.Body>
          </>
        )}

        {modalType === "delete" && (
          <>
            <Modal.Header closeButton>
              <div>
                <Modal.Title
                  className="fw-light fs-2"
                  id="contained-modal-title-vcenter"
                >
                  Delete Recipe
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div className="del-img text-center my-4">
                  <img src="/noData.svg" alt="No Data" />
                  <h3 className="mt-3">Delete This Item ?</h3>
                  <p>Are you sure you want to delete this recipe?</p>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="fw-bold btn btn-outline-danger  me-2"
                    onClick={() => onDeleteRecipe(selectedRecipeId)}
                  >
                    Delete this item
                  </button>
                </div>
              </div>
            </Modal.Body>
          </>
        )}

        {modalType === "edit" && (
          <>
            <Modal.Header closeButton>
              <div>
                <Modal.Title
                  className="fw-light fs-2"
                  id="contained-modal-title-vcenter"
                >
                  Edit Recipe
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit(onEditRecipe)}>
                <div className="input-group icon-input mb-4">
                  <input
                    type="text"
                    defaultValue={
                      recipesList.find((recipe) => recipe.id === editedRecipeId)
                        ?.name
                    } // عرض اسم الوصفة الحالية
                    className="form-control"
                    placeholder="Recipe Name"
                    {...register("name", { required: "Field is required" })}
                  />
                </div>
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
                <button className="btn btn-lg btn-warning w-100 m-auto">
                  Update
                </button>
              </form>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
}
