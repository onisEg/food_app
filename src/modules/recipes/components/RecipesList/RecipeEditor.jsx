import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import { useData } from "../../../../context/DataContext";
import { imgBaseURL } from "../../../../services/api/urls";

export default function RecipeEditor({ selectedRecipe, tags, categoriesList, onClose, onSaved }) {
  const { onEditRecipe, onAddRecipe } = useData();
  const modalType = selectedRecipe ? "edit" : "add";
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: selectedRecipe?.name ?? "", price: selectedRecipe?.price ?? "",
      tagId: selectedRecipe?.tag?.id ?? "", categoriesIds: selectedRecipe?.category?.[0]?.id ?? "",
      description: selectedRecipe?.description ?? "", imagePath: selectedRecipe?.imagePath ?? "",
    },
  });
  function submit(data) {
    return selectedRecipe ? onEditRecipe(selectedRecipe.id, data, onSaved) : onAddRecipe(data, onSaved);
  }
  return <Modal show onHide={onClose} centered size="lg" aria-labelledby="recipe-editor-title">
    <Modal.Header closeButton><Modal.Title id="recipe-editor-title">{selectedRecipe ? "Update Recipe" : "Add Recipe"}</Modal.Title></Modal.Header>
    <Modal.Body><form onSubmit={handleSubmit(submit)}>
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
    </form></Modal.Body>
  </Modal>;
}
RecipeEditor.propTypes = {
  selectedRecipe: PropTypes.object, tags: PropTypes.array.isRequired, categoriesList: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired, onSaved: PropTypes.func.isRequired,
};
