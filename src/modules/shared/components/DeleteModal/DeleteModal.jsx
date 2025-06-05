import Modal from "react-bootstrap/Modal";

export default function DeleteModal({
  show,
  onClose,
  onConfirm,
  itemName = "this item",
  title = "Delete Item",
  isSubmitting,
}) {
  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-light fs-2">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <div className="del-img text-center my-4">
            <img src="/noData.svg" alt="No Data" />
          </div>
          <h3 className="h4 fw-bold text-danger">Are you sure?</h3>
          <p className="text-muted">
            Do you really want to delete{" "}
            <strong className="text-danger">{itemName}</strong>?
          </p>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-lg px-5 btn-outline-danger me-2 fw-bold"
              onClick={onConfirm}
            >
              {title} {itemName}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
