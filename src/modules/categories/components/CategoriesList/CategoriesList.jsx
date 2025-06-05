// ===== IMPORTS =====
import { useEffect, useState } from "react";
import Header from "../../../shared/components/Header/Header";
import { CATEGORY_URLS } from "../../../../services/api/urls";
import { axiosInstance } from "../../../../services/api";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";

import "./categoriesList.css";
import DeleteModal from "../../../shared/components/DeleteModal/DeleteModal";

import NoData from "../../../shared/components/noData/NoData";
import { useData } from "../../../../context/DataContext";

// ===== COMPONENT =====
export default function CategoriesList() {
  const {
    categoriesList,
    isLoading,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    totalPages,
  } = useData();


  const [editedCategoryId, setEditedCategoryId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [modalType, setModalType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm();

  // // ====== Add New Category ======
  const handleAdd = (data) => {
    addCategory(data, () => {
      setShowFormModal(false);
      reset();
    });
  };

  // // ====== Edit Category ======
  const handleEdit = (data) => {
    updateCategory(editedCategoryId, data, () => {
      setShowFormModal(false);
      reset();
    });
  };

  // // ====== Delete Category ======
  const handleDelete = () => {
    deleteCategory(selectedCategoryId, () => {
      setShowDeleteModal(false);
    });
  };

  // ====== Lifecycle: Fetch Categories Once on Mount ======
  useEffect(() => {
    getCategories(searchName, pageNumber, pageSize);
  }, [searchName, pageNumber, pageSize]);

  // ====== Render UI ======
  return (
    <>
      <Header
        title="Categories"
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
            className="fa-solid fa-circle-xmark fa-2x pe-auto text-danger"
          ></i>
        </div>

        {/* ========= show input ======= */}
        <div className="d-flex gap-2 align-items-center">
          <label className="mb-0 fw-medium">Show :</label>
          <input
            type="number"
            className="form-control"
            value={pageSize}
            min={1}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{ width: "80px" }}
          />
        </div>
        <span className="m-0">Total : {categoriesList.length}</span>
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
            {isLoading
              ? [...Array(5)].map((_, idx) => (
                  <tr key={idx} className="placeholder-glow">
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
                      <span className="placeholder col-5"></span>
                    </td>
                    <td>
                      <span className="placeholder col-5"></span>
                    </td>
                    <td>
                      <span className="placeholder col-3"></span>
                    </td>
                  </tr>
                ))
              : categoriesList.map((category) => (
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
                      {new Date(category.creationDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
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
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn border-0"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fa-solid fa-ellipsis fa-lg"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                          <li>
                            <button
                              disabled={isSubmitting}
                              onClick={() => {
                                setEditedCategoryId(category.id);
                                setModalType("edit");
                                setShowFormModal(true);
                                reset();
                              }}
                              className="dropdown-item d-flex align-items-center gap-2 text-warning"
                            >
                              <i className="bi bi-pencil-square"></i> Edit
                            </button>
                          </li>
                          <li>
                            <button
                              disabled={isSubmitting}
                              onClick={() => {
                                setSelectedCategoryId(category.id);
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
      </div>

      {/* =========================== */}
      {/* {/* Users pagination */}
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

      {/* Empty Data Message */}
      {!categoriesList && <NoData />}

      {/* Modal delete Logic */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={
          categoriesList.find((cat) => cat.id === selectedCategoryId)?.name
        }
        title="Delete Category"
      />

      {/* =========================================== */}
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
              modalType === "add" ? handleAdd : handleEdit
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
