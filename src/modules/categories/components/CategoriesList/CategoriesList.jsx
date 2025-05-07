// ===== IMPORTS =====
import { useEffect, useState } from "react";
import Header from "../../../shared/components/Header/Header";
import { CATEGORY_URLS } from "../../../../services/api/urls";
import { axiosInstance } from "../../../../services/api";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./categoriesList.css";
import DeleteModal from "../../../shared/components/DeleteModal/DeleteModal";

// ===== COMPONENT =====
export default function CategoriesList() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [editedCategoryId, setEditedCategoryId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [modalType, setModalType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

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

  // ====== Add New Category ======
  const onAddCategory = async (data) => {
    try {
      const response = await axiosInstance.post(
        CATEGORY_URLS.ADD_CATEGORY,
        data
      );
      toast.success(`${response.data.name} Category Added`);
      setShowFormModal(false);
      getCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add category.");
    }
  };

  // ====== Edit Existing Category ======
  const onEditCategory = async (data) => {
    try {
      const response = await axiosInstance.put(
        CATEGORY_URLS.UPDATE_CATEGORY(editedCategoryId),
        data
      );
      toast.success(`${response.data.name} Category Updated`);
      setShowFormModal(false);
      reset();
      getCategories();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update category."
      );
    }
  };

  // ====== Delete Category ======
  const onDeleteCategory = async () => {
    try {
      await axiosInstance.delete(
        CATEGORY_URLS.DELETE_CATEGORY(selectedCategoryId)
      );
      toast.success("Category Deleted Successfully");
      setShowDeleteModal(false);
      getCategories();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete category."
      );
    }
  };

  // ====== Lifecycle: Fetch Categories Once on Mount ======
  useEffect(() => {
    getCategories();
  }, []);

  // ====== Render UI ======
  return (
    <>
      <Header
        title="Categories"
        username="Items"
        description="You can now add your items that any user can order it from the Application and you can edit"
        headerImg="/resipes.svg"
      />

      {/* Top Section - Title + Add Button */}
      <div className="d-flex justify-content-between align-content-center my-4">
        <div className="d-flex flex-column">
          <span className="fs-3">Categories Table Details</span>
          <span>You can check all details</span>
        </div>
        <div>
          <div
            onClick={() => {
              setModalType("add");
              setShowFormModal(true);
              reset();
            }}
            style={{ background: "#009247" }}
            className="px-5 btn btn-success btn-lg text-white d-flex justify-content-center align-items-center"
          >
            Add New Category
          </div>
        </div>
      </div>

      {/* Table */}
      <div>
        <table className="table table-striped-reversed">
          <thead className="my-3">
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Creation Date</th>
              <th>Modification Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="mt-4">
            {categoriesList.map((category) => (
              <tr key={category.id}>
                <td className="text-capitalize">{category.name}</td>
                <td>
                  <img
                    className="cat-img"
                    src={category.img || "/pizza.png"}
                    alt="category"
                  />
                </td>
                <td>
                  {new Date(category.creationDate).toLocaleString("en-GB")}
                </td>
                <td>
                  {new Date(category.modificationDate).toLocaleString("en-GB")}
                </td>
                <td className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                    title="Delete"
                    style={{ width: "3rem", height: "3rem" }}
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>

                  <button
                    className="btn btn-outline-warning rounded-circle d-flex align-items-center justify-content-center"
                    title="Edit"
                    style={{ width: "3rem", height: "3rem" }}
                    onClick={() => {
                      setEditedCategoryId(category.id);
                      setModalType("edit");
                      setShowFormModal(true);
                      reset();
                    }}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty Data Message */}
      {categoriesList.length === 0 && (
        <div className="w-100 text-center py-3">
          <img src="/noData.svg" alt="No Data" />
          <h2>No Data!</h2>
          <p className="text-muted">
            There is no Categories available at the moment.
          </p>
        </div>
      )}

      {/* Modal delete Logic */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onDeleteCategory}
        itemName={
          categoriesList.find((cat) => cat.id === selectedCategoryId)?.name
        }
        title="Delete Category"
      />

      {/* Modal add & edit Logic */}

      <Modal
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-light fs-2">
            {modalType === "add" ? "Add Category" : "Edit Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(
              modalType === "add" ? onAddCategory : onEditCategory
            )}
          >
            <div className="input-group icon-input ">
              <input
                type="text"
                defaultValue={
                  modalType === "edit"
                    ? categoriesList.find((cat) => cat.id === editedCategoryId)
                        ?.name
                    : ""
                }
                className="form-control"
                placeholder="Category Name"
                {...register("name", { required: "Field is required" })}
              />
            </div>
            {errors.name && (
              <small className="text-danger">{errors.name.message}</small>
            )}
            <button
              className={`btn btn-lg w-100 m-auto mt-4 ${
                modalType === "add" ? "btn-success" : "btn-warning"
              }`}
            >
              {modalType === "add" ? "Add" : "Update"}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
