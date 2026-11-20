import "./kitchen.css";
import { useEffect } from "react";
import { recipes, recipeQuery } from "../guestRecipes";
import { useAuth } from "../../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function GuestRecipes() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { loginData } = useAuth();
  const active = hash.slice(1);
  const query = recipeQuery(active);
  useEffect(() => {
    if (query) document.getElementById(active)?.scrollIntoView?.({ block: "nearest" });
  }, [active, query]);

  function selectRecipe(id) {
    navigate({ pathname, hash: id }, { replace: true });
  }
  return (
    <main className="cookbook">
      <div className="kitchen-wrap">
        <header className="kitchen-nav">
          <Link className="wordmark" to="/guest"><img src="/favicon.svg" alt="" /> Food Recipes</Link>
          <nav aria-label="Account">{loginData ? <Link to="/dashboard">My dashboard</Link> : <><Link to={"/login" + query}>Log in</Link><Link className="kitchen-button" to={"/register" + query}>Register</Link></>}</nav>
        </header>
        <section className="kitchen-hero" aria-labelledby="featured-dish">
          <div className="hero-copy">
            <p className="dish-meta">Pasta <span>·</span> 20 min</p>
            <h1 id="featured-dish">Tomato &amp;<br/><em>basil pasta</em></h1>
            <p>Fresh tomatoes, garlic and torn basil tossed with warm pasta.</p>
            <a className="kitchen-button" href="#tomato-pasta" onClick={event => { event.preventDefault(); selectRecipe("tomato-pasta"); }}>View recipe <span aria-hidden="true">↗</span></a>
          </div>
          <img className="hero-photo" src="/tomato-pasta.webp" alt="Penne with tomato sauce and fresh basil" />
        </section>
        <section className="recipe-index" aria-labelledby="index-heading">
          <h2 id="index-heading">The recipe index</h2>
          <p>{loginData ? "Open your dashboard for the full collection." : "Three recipes to cook as a guest. Sign in for the full collection."}</p>
          {recipes.map(({ id, name, time, ingredients, steps }) => (
            <details className="recipe-row" key={id} id={id} open={active === id}>
              <summary onClick={event => { event.preventDefault(); selectRecipe(active === id ? "" : id); }}><strong>{name}</strong><span>{time}</span><b aria-hidden="true">+</b></summary>
              <div className="recipe-method"><section><h3>Ingredients</h3><p>{ingredients}</p></section>
                <section><h3>Method</h3><p>{steps}</p></section></div>
            </details>
          ))}
        </section>
      </div>
    </main>
  );
}
