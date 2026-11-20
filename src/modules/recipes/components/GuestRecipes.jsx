import "./kitchen.css";
import { Link } from "react-router-dom";

const recipes = [
  {
    name: "Tomato and basil pasta",
    time: "20 min",
    ingredients: "180 g pasta, 2 tomatoes, 1 garlic clove, olive oil and fresh basil",
    steps: "Cook the pasta in salted water. Soften the sliced garlic in olive oil, add the chopped tomatoes and simmer for 8 minutes. Toss with the pasta, a splash of cooking water and torn basil.",
  },
  {
    name: "Lemon chickpea salad",
    time: "10 min",
    ingredients: "1 can cooked chickpeas, 1 cucumber, 1 tomato, parsley, lemon and olive oil",
    steps: "Drain and rinse the chickpeas. Dice the cucumber and tomato, chop the parsley and toss everything together with lemon juice and olive oil.",
  },
  {
    name: "Red lentil soup",
    time: "30 min",
    ingredients: "150 g red lentils, 1 carrot, 1 onion, cumin, olive oil and 750 ml vegetable stock",
    steps: "Soften the chopped onion and carrot in olive oil. Stir in cumin and rinsed lentils, pour in the stock and simmer until the lentils are tender. Blend for a smoother texture.",
  },
];

export default function GuestRecipes() {
  return (
    <main className="cookbook">
      <div className="kitchen-wrap">
        <header className="kitchen-nav">
          <Link className="wordmark" to="/guest"><img src="/favicon.svg" alt="" /> Food Recipes</Link>
          <nav aria-label="Account"><Link to="/login">Log in</Link><Link className="kitchen-button" to="/register">Register</Link></nav>
        </header>
        <section className="kitchen-hero" aria-labelledby="featured-dish">
          <div className="hero-copy">
            <p className="dish-meta">Pasta <span>·</span> 20 min</p>
            <h1 id="featured-dish">Tomato &amp;<br/><em>basil pasta</em></h1>
            <p>Fresh tomatoes, garlic and torn basil tossed with warm pasta.</p>
            <a className="kitchen-button" href="#tomato-pasta" onClick={() => { document.getElementById("tomato-pasta").open = true; }}>View recipe <span aria-hidden="true">↗</span></a>
          </div>
          <img className="hero-photo" src="/tomato-pasta.webp" alt="Penne with tomato sauce and fresh basil" />
        </section>
        <section className="recipe-index" aria-labelledby="index-heading">
          <h2 id="index-heading">The recipe index</h2>
          <p>Three recipes to cook as a guest. Sign in for the full collection.</p>
          {recipes.map(({ name, time, ingredients, steps }, i) => (
            <details className="recipe-row" key={name} id={i === 0 ? "tomato-pasta" : undefined}>
              <summary><strong>{name}</strong><span>{time}</span><b aria-hidden="true">+</b></summary>
              <div className="recipe-method"><section><h3>Ingredients</h3><p>{ingredients}</p></section>
                <section><h3>Method</h3><p>{steps}</p></section></div>
            </details>
          ))}
        </section>
      </div>
    </main>
  );
}
