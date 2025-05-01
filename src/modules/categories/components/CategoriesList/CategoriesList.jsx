import { useEffect, useState } from "react";
import Header from "../../../shared/components/Header/Header";
import { CATEGORY_URLS } from "../../../../services/api/urls";
import { axiosInstance } from "../../../../services/api";

import "./categoriesList.css";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function CategoriesList() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [editedCategoryId, setEditedCategoryId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [modalType, setModalType] = useState(""); // "add" or "delete"
  const [modalShow, setModalShow] = useState(false);
  let {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onAddCategory = async (data) => {
    try {
      let response = await axiosInstance.post(CATEGORY_URLS.ADD_CATEGORY, data);
      console.log(response);
      toast.success(`${response.data.name} Categorey Added`);
      setModalShow(false);
      getCategories();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  let getCategories = async () => {
    try {
      let response = await axiosInstance.get(`${CATEGORY_URLS.GET_CATEGORIES}`);
      console.log(response?.data?.data);
      setCategoriesList(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };

  const onDeleteCategory = async () => {
    try {
      let response = await axiosInstance.delete(
        CATEGORY_URLS.DELETE_CATEGORY(selectedCategoryId)
      );

      toast.success("Category deleted successfully!");
      console.log(response);
      getCategories();
      setModalShow(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete category."
      );
    }
  };
  const onEditCategory = async (data) => {
    try {
      let response = await axiosInstance.put(
        CATEGORY_URLS.UPDATE_CATEGORY(editedCategoryId),
        data
      );
      toast.success(`${response.data.name} category updated successfully!`);
      setModalShow(false);
      reset();
      getCategories();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update category."
      );
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Header
        title={"Categories"}
        username={"Items"}
        description={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
        headerImg={"/resipes.svg"}
      />
      <div className="d-flex justify-content-between align-content-center my-4">
        <div className="d-flex flex-column ">
          <span className="fs-3">Categories Table Details</span>
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
            Add New Category
          </div>
        </div>
      </div>

      <div>
        <table className="table table-striped">
          <thead className="my-3">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">creationDate</th>
              <th scope="col">modificationDate</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className="mt-4">
            {categoriesList.map((category) => (
              <tr key={category.id}>
                <td className="text-capitalize" scope="row">
                  {category.name}
                </td>
                <td>
                  <img
                    className="cat-img"
                    src={category.img || `/pizza.png`}
                    alt="pizaa"
                  />
                </td>
                <td>
                  {new Date(category.creationDate).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td>
                  {new Date(category.modificationDate).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>

                <td className="">
                  <i
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                      setModalType("delete");
                      setModalShow(true);
                    }}
                    className=" bi bi-trash mx-4 text-danger fa-2x "
                  ></i>
                  <i
                    onClick={() => {
                      setEditedCategoryId(category.id);
                      setModalType("edit");
                      setModalShow(true);
                      reset();
                    }}
                    className="bi bi-pencil-square text-warning fa-2x"
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(!categoriesList || categoriesList.length === 0) && (
        <div className="w-100 text-center py-3">
          <img src="/public/noData.svg" alt="noData" />
          <h2 className="">No Data!</h2>
          <p className="text-muted">
            Are you sure you want to delete this item? If you are sure, just
            click on delete it.
          </p>
        </div>
      )}

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
                  Add Category
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit(onAddCategory)}>
                <div className="input-group icon-input mb-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Category Name"
                    {...register("name", { required: "Field is required" })}
                  />
                </div>
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
                <button className="btn btn-lg btn-success w-100 m-auto">
                  Add
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
                  Delete Category
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div className="del-img text-center my-4">
                  <img src="/noData.svg" alt="No Data" />
                </div>
                <p>Are you sure you want to delete this category?</p>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => onDeleteCategory(selectedCategoryId)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setModalShow(false)}
                  >
                    Cancel
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
                  Edit Category
                </Modal.Title>
              </div>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit(onEditCategory)}>
                <div className="input-group icon-input mb-4">
                  <input
                    type="text"
                    defaultValue={
                      categoriesList.find((cat) => cat.id === editedCategoryId)
                        ?.name
                    } // عرض اسم الفئة الحالية
                    className="form-control"
                    placeholder="Category Name"
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
