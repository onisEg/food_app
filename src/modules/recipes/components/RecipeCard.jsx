import PropTypes from "prop-types";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { imgBaseURL } from "../../../services/api/urls";

export default function RecipeCard({ recipe, children }) {
  const [open, setOpen] = useState(false);
  const image = recipe.imagePath ? imgBaseURL + "/" + recipe.imagePath : "/food.jpg";
  return <article className="catalog-card">
    <button className="catalog-open" onClick={() => setOpen(true)}>
      <img src={image} alt="" /><strong>{recipe.name}</strong>
    </button>
    <div className="catalog-meta">{[recipe.category?.[0]?.name, recipe.tag?.name, recipe.price != null && recipe.price + " EGP"].filter(Boolean).join(" · ")}</div>
    <div className="catalog-actions">{children}</div>
    <Modal show={open} onHide={() => setOpen(false)} centered aria-label={recipe.name}>
      <Modal.Header closeButton><Modal.Title>{recipe.name}</Modal.Title></Modal.Header>
      <Modal.Body><img className="favorite-photo" src={image} alt="" /><p>{recipe.description}</p>
        <small>{recipe.category?.map(c => c.name).join(", ")} {recipe.price != null && " · " + recipe.price + " EGP"}</small></Modal.Body>
    </Modal>
  </article>;
}
RecipeCard.propTypes = { recipe: PropTypes.object.isRequired, children: PropTypes.node };
