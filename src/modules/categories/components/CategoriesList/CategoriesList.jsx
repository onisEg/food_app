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

import ActionBtn from "../../../shared/components/ActionBtn/ActionBtn";
import NoData from "../../../shared/components/noData/NoData";

// ===== COMPONENT =====
export default function CategoriesList() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [editedCategoryId, setEditedCategoryId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [modalType, setModalType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [searchName, setSearchName] = useState("");

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm();

  // ====== Fetch Categories List ======
  const getCategories = async () => {
    const params = {
      pageSize: 1000,
      pageNumber: 1,
    };

    if (searchName) params.name = searchName;

    try {
      let response = await axiosInstance.get(CATEGORY_URLS.GET_CATEGORIES, {
        params,
      });
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
      setShowDeleteModal(false);
      toast.success("Category Deleted Successfully");
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
    const delayDebounce = setTimeout(() => {
      getCategories();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchName]);

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

        <div className=" d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by category name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          <i
            onClick={() => setSearchName("")}
            className="fa-solid fa-circle-xmark fa-2x pe-auto"
          ></i>
        </div>

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
                  {new Date(category.creationDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  {new Date(category.modificationDate).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </td>
                <td className="d-flex gap-2 justify-content-center">
                  <ActionBtn
                    onClick={() => {
                      setEditedCategoryId(category.id);
                      setModalType("edit");
                      setShowFormModal(true);
                      reset();
                    }}
                    btnColor={"warning"}
                    icon={"bi bi-pencil-square"}
                    title={"Edit"}
                  />
                  <ActionBtn
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                      setShowDeleteModal(true);
                    }}
                    btnColor={"danger"}
                    icon={"bi bi-trash"}
                    title={"Delete"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty Data Message */}
      {!categoriesList && <NoData />}

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
              disabled={isSubmitting}
              className={`btn btn-lg w-100 m-auto mt-4 ${
                modalType === "add" ? "btn-success" : "btn-warning"
              }`}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                </>
              ) : modalType === "add" ? (
                "Add"
              ) : (
                "Update"
              )}
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
