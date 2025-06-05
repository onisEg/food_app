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

import Modal from "react-bootstrap/Modal";

import toast from "react-hot-toast";

import NoData from "../../../shared/components/noData/NoData";
import DeleteModal from "../../../shared/components/DeleteModal/DeleteModal";
import { useData } from "../../../../context/DataContext";
import { useAuth } from "../../../../context/AuthContext";

export default function RecipeList() {
  const { loginData } = useAuth();

  const [editedRecipeId, setEditedRecipeId] = useState(null);

  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" or "edit" or "delete"

  const [searchName, setSearchName] = useState("");
  const [searchTagId, setSearchTagId] = useState("");
  const [searchCategoryId, setSearchCategoryId] = useState("");

  const isAdmin = loginData?.userGroup === "SuperAdmin";
  const isUser = loginData?.userGroup === "SystemUser";

  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {
    categoriesList,
    getCategories,
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
    totalNumberOfRecords,
    totalPages,
  } = useData();

  let {
    register,
    // setValue,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      imagePath: "", // ✅ مهم علشان تكون موجودة في الداتا
    },
  });
  useEffect(() => {
    getRecipes({
      name: searchName,
      tagId: searchTagId,
      categoryId: searchCategoryId,
      pageNumber,
      pageSize,
    });
    getTags();
    getCategories();
  }, [searchName, searchTagId, searchCategoryId, pageNumber, pageSize]);

  useEffect(() => {
    if (isUser && recipesList.length > 0) {
      getFavorites();
      console.log(`recipeList : `, recipesList);
    }
  }, [isUser, recipesList]);

  return (
    <>
      <Header
        title={"Recipes"}
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
        {isAdmin && (
          <>
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
                    imagePath: "",
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
          </>
        )}
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
            Clear
          </button>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <label className="mb-0 fw-medium">Show :</label>
          <input
            type="number"
            className="form-control"
            value={pageSize}
            min={1}
            onChange={(e) => setPageSize(e.target.value)}
            style={{ width: "80px" }}
            onBlur={() => {
              if (pageSize === "" || parseInt(pageSize) < 1) {
                setPageSize("1");
              }
            }}
          />
        </div>
        <div className="col-md-1 d-flex align-items-center">
          <span className="d-flex align-items-center">
            Total : {totalNumberOfRecords}
          </span>
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
          {isLoading ? (
            <>
              {[...Array(5)].map((_, idx) => (
                <tr className="placeholder-glow" key={idx}>
                  <td>
                    <span className="placeholder col-6"></span>
                  </td>
                  <td>
                    <span
                      className="placeholder rounded"
                      style={{
                        width: "60px",
                        height: "60px",
                        display: "inline-block",
                      }}
                    ></span>
                  </td>
                  <td>
                    <span className="placeholder col-7"></span>
                  </td>
                  <td>
                    <span className="placeholder col-3"></span>
                  </td>
                  <td>
                    <span className="placeholder col-4"></span>
                  </td>
                  <td>
                    <span className="placeholder col-5"></span>
                  </td>
                  <td>
                    <span className="placeholder col-6"></span>
                  </td>
                  {isUser && (
                    <td>
                      <span className="placeholder col-2"></span>
                    </td>
                  )}
                  <td>
                    <span className="placeholder col-2"></span>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <>
              {recipesList.map((recipe) => (
                <tr key={recipe.id}>
                  {/* recipeName  */}
                  <td>
                    <div className=" d-flex justify-content-between align-content-center align-items-center">
                      <div>{recipe.name} </div>
                      <span className="badge bg-primary">
                        {recipe.tag.name}
                      </span>
                    </div>
                  </td>
                  {/* recipeImg */}
                  <td>
                    <img
                      className=" rounded img-thumbnail "
                      src={
                        recipe.imagePath
                          ? `${imgBaseURL}/${recipe.imagePath}`
                          : "/food.jpg"
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
                  <td>
                    {new Date(recipe.modificationDate).toLocaleDateString()}
                  </td>

                  {/* ============= fav icon ========= */}
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
                        {!isUser && (
                          <>
                            <li>
                              <button
                                onClick={() => {
                                  setEditedRecipeId(recipe.id);
                                  setSelectedRecipe(recipe);
                                  setModalType("edit");
                                  setModalShow(true);
                                  reset({
                                    name: recipe.name,
                                    price: recipe.price,
                                    tagId: recipe.tag.id,
                                    categoriesIds: recipe.category?.[0]?.id,
                                    description: recipe.description,
                                    imagePath: recipe.imagePath,
                                  });
                                  console.log(recipe.imagePath);
                                  if (!tags.length || !categoriesList.length) {
                                    toast.error(
                                      "Please wait for data to load..."
                                    );
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
                          </>
                        )}
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      {/* Empty Data Message */}
      {recipesList.length === 0 && <NoData />}

      <div className="d-flex justify-content-center align-items-center gap-2 my-4">
        <button
          style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          className="btn btn-outline-success d-flex justify-content-center align-items-center"
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(1)}
        >
          «
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            disabled={isLoading}
            style={{ borderRadius: "50%", width: "40px", height: "40px" }}
            key={page}
            className={` d-flex justify-content-center align-items-center btn ${
              page === pageNumber ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setPageNumber(page)}
          >
            {isLoading && page === pageNumber ? (
              <div className="spinner-border spinner-border-sm text-white"></div>
            ) : (
              page
            )}
          </button>
        ))}

        <button
          style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          className="btn btn-outline-success d-flex justify-content-center align-items-center"
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber((prev) => prev + 1)}
        >
          »
        </button>
      </div>

      {/* Modal delete Logic */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() =>
          onDeleteRecipe(selectedRecipeId, () => setShowDeleteModal(false))
        }
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
                onSubmit={handleSubmit(async (data) => {
                  modalType === "edit"
                    ? await onEditRecipe(editedRecipeId, data, () => {
                        setModalShow(false);
                        reset();
                      })
                    : await onAddRecipe(data, () => {
                        setModalShow(false);
                        reset();
                      });
                })}
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
                    min="0"
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
                      {...register("image", {
                        validate: (fileList, formValues) => {
                          const hasNewImage = fileList && fileList.length > 0;
                          const hasOldImage =
                            formValues.imagePath && formValues.imagePath !== "";

                          if (modalType === "add" && !hasNewImage) {
                            return "Image is required";
                          }

                          if (
                            modalType === "edit" &&
                            !hasNewImage &&
                            !hasOldImage
                          ) {
                            return "You must provide a new image or keep the existing one.";
                          }

                          return true;
                        },
                      })}
                    />
                    <input type="hidden" {...register("imagePath")} />
                    {modalType === "edit" && selectedRecipe?.imagePath && (
                      <div className="mt-3 text-center">
                        <p className="text-muted mb-2">Current Image:</p>
                        <img
                          src={`${imgBaseURL}/${selectedRecipe.imagePath}`}
                          alt="Current"
                          className="img-thumbnail"
                          style={{ maxWidth: "200px", height: "auto" }}
                        />
                      </div>
                    )}

                    <label
                      style={{ cursor: "pointer" }}
                      htmlFor="uploadImage"
                      className="text-success"
                    >
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
                  style={{
                    ...(selectedRecipe?.imagePath
                      ? { marginTop: "9rem" }
                      : { marginTop: "2rem" }),
                    ...(isSubmitting && { opacity: 0.7 }),
                  }}
                  disabled={isSubmitting}
                  className={`btn btn-lg w-100  ${
                    modalType === "edit" ? "btn-warning" : "btn-success"
                  }`}
                >
                  {isSubmitting ? (
                    <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                  ) : modalType === "edit" ? (
                    "Update Recipe"
                  ) : (
                    "Add Recipe"
                  )}
                </button>
              </form>
            </Modal.Body>
          </>
        )}
      </Modal>
    </>
  );
}
