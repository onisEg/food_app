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
    <main className="container py-4 py-md-5">
      <nav aria-label="Account" className="d-flex justify-content-end align-items-center gap-3 mb-4">
        <Link to="/login" className="link-success">Log in</Link>
        <Link to="/register" className="btn btn-outline-success">Register</Link>
      </nav>
      <h1>Guest recipes</h1>
      <p className="text-secondary mb-4">Explore three sample recipes. Sign in to browse the full catalogue and save favourites.</p>
      <div className="row g-3">
        {recipes.map(({ name, time, ingredients, steps }) => (
          <article key={name} className="col-md-4">
            <div className="card p-4 h-100">
              <p className="small text-success mb-2">{time}</p>
              <h2 className="h4">{name}</h2>
              <p>{ingredients}</p>
              <details>
                <summary className="text-success">Cooking instructions</summary>
                <p className="mt-2 mb-0">{steps}</p>
              </details>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
