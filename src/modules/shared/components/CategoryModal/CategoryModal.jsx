import React from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";

export default function CategoryModal({
  show,
  onHide,
  modalType,
  onSubmit,
  categoryData = null, 
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-light fs-2">
          {modalType === "add"
            ? "Add Category"
            : modalType === "edit"
            ? "Edit Category"
            : "Delete Category"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalType === "add" || modalType === "edit" ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group icon-input mb-4">
              <input
                type="text"
                defaultValue={modalType === "edit" ? categoryData?.name : ""}
                className="form-control"
                placeholder="Category Name"
                {...register("name", { required: "Field is required" })}
              />
            </div>
            {errors.name && (
              <small className="text-danger">{errors.name.message}</small>
            )}
            <button
              className={`btn btn-lg ${
                modalType === "add" ? "btn-success" : "btn-warning"
              } w-100`}
            >
              {modalType === "add" ? "Add" : "Update"}
            </button>
          </form>
        ) : modalType === "delete" ? (
          <div>
            <div className="del-img text-center my-4">
              <img src="/noData.svg" alt="No Data" />
            </div>
            <p>Are you sure you want to delete this category?</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-danger me-2" onClick={onSubmit}>
                Delete
              </button>
              <button className="btn btn-secondary" onClick={onHide}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
}
