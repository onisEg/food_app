export const recipes = [
  {
    id: "tomato-pasta",
    name: "Tomato and basil pasta",
    time: "20 min",
    ingredients: "180 g pasta, 2 tomatoes, 1 garlic clove, olive oil and fresh basil",
    steps: "Cook the pasta in salted water. Soften the sliced garlic in olive oil, add the chopped tomatoes and simmer for 8 minutes. Toss with the pasta, a splash of cooking water and torn basil.",
  },
  {
    id: "chickpea-salad",
    name: "Lemon chickpea salad",
    time: "10 min",
    ingredients: "1 can cooked chickpeas, 1 cucumber, 1 tomato, parsley, lemon and olive oil",
    steps: "Drain and rinse the chickpeas. Dice the cucumber and tomato, chop the parsley and toss everything together with lemon juice and olive oil.",
  },
  {
    id: "lentil-soup",
    name: "Red lentil soup",
    time: "30 min",
    ingredients: "150 g red lentils, 1 carrot, 1 onion, cumin, olive oil and 750 ml vegetable stock",
    steps: "Soften the chopped onion and carrot in olive oil. Stir in cumin and rinsed lentils, pour in the stock and simmer until the lentils are tender. Blend for a smoother texture.",
  },
];

export function recipeQuery(id) {
  return recipes.some(recipe => recipe.id === id) ? "?recipe=" + id : "";
}

export function recipeDestination(query) {
  const id = new URLSearchParams(query).get("recipe");
  return recipeQuery(id) ? "/guest#" + id : "/dashboard";
}
