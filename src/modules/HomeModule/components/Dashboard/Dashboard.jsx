import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../../../../context/AuthContext";
import { axiosInstance } from "../../../../services/api";
import { CATEGORY_URLS, RECIPE_URLS, TAG, USERS_URL, USER_RECIPE_URLS, imgBaseURL } from "../../../../services/api/urls";
import RecipeEditor from "../../../recipes/components/RecipesList/RecipeEditor";
import "./dashboard.css";

function usePage(url, page = 1, size = 1, name = "", revision = 0) {
  const [result, setResult] = useState(null);
  const key = JSON.stringify([url, page, size, name, revision]);
  useEffect(() => {
    const controller = new AbortController();
    axiosInstance.get(url, { params: { pageNumber: page, pageSize: size, name: name || undefined }, signal: controller.signal })
      .then(({ data }) => setResult({ key, data }))
      .catch(() => { if (!controller.signal.aborted) setResult({ key, error: true }); });
    return () => controller.abort();
  }, [url, page, size, name, key]);
  return result?.key === key ? result : {};
}

function photo(recipe) {
  return recipe.imagePath ? imgBaseURL + "/" + recipe.imagePath : "/food.jpg";
}

function ReaderKitchen() {
  const [revision, refresh] = useState(0);
  const { data, error } = usePage(USER_RECIPE_URLS.GET_FAVORITES, 1, 4, "", revision);
  const [selected, select] = useState(null);
  return <main className="desk-content">
    <h1>My kitchen</h1>
    <article className="featured-meal">
      <img src="/tomato-pasta.webp" alt="Penne with tomatoes and fresh basil" />
      <div><small>Pasta · 20 min</small><h2>Tomato &amp; basil pasta</h2><Link className="desk-primary" to="/guest#tomato-pasta">View recipe ↗</Link></div>
    </article>
    <div className="desk-heading"><h2>My favorites</h2><Link to="/favorites">View all</Link></div>
    {error ? <p role="alert">Couldn’t load favorites. <button onClick={() => refresh(revision + 1)}>Try again</button></p>
      : !data ? <p role="status">Loading favorites…</p>
      : data.data?.some(item => item.recipe) ? <div className="favorite-grid">{data.data.filter(item => item.recipe).map(({ id, recipe }) =>
        <button key={id} onClick={() => select(recipe)}><img src={photo(recipe)} alt="" /><span aria-hidden="true">♥</span><strong>{recipe.name}</strong></button>)}</div>
      : <div className="desk-empty"><p>Save a recipe you’d like to cook and you’ll find it here.</p><Link to="/recipes">Explore recipes →</Link></div>}
    {selected && <Modal show onHide={() => select(null)} centered aria-labelledby="favorite-title">
      <Modal.Header closeButton><Modal.Title id="favorite-title">{selected.name}</Modal.Title></Modal.Header>
      <Modal.Body><img className="favorite-photo" src={photo(selected)} alt="" /><p>{selected.description}</p></Modal.Body>
    </Modal>}
  </main>;
}

function AdminLibrary() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [revision, refresh] = useState(0);
  const [editor, setEditor] = useState(null);
  const recipes = usePage(RECIPE_URLS.GET_RECIPES, page, 6, search.trim(), revision);
  const totals = usePage(RECIPE_URLS.GET_RECIPES, 1, 1, "", revision);
  const categories = usePage(CATEGORY_URLS.GET_CATEGORIES, 1, 100);
  const users = usePage(USERS_URL.GET_ALL_USERS);
  const tags = usePage(TAG.ALL_TAGS);
  const ready = Array.isArray(categories.data?.data) && Array.isArray(tags.data);
  const pages = recipes.data?.totalNumberOfPages || 1;
  return <main className="desk-content">
    <div className="desk-heading"><h1>Recipe library</h1><button className="desk-primary" disabled={!ready} onClick={() => setEditor({})}>+ Add recipe</button></div>
    <div className="desk-counts">{[[totals,"Recipes","/recipes"],[categories,"Categories","/categories"],[users,"Users","/users"]].map(([result,label,to]) =>
      <Link to={to} key={label}><strong>{result.data?.totalNumberOfRecords ?? "—"}</strong>{label}</Link>)}</div>
    {(tags.error || categories.error) && <p role="alert">Recipe form options couldn’t load. Refresh the page to try again.</p>}
    <label className="desk-search"><i className="bi bi-search" aria-hidden="true" /><input type="search" aria-label="Search recipes" placeholder="Search recipes…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></label>
    <table className="desk-table"><thead><tr><th>Recipe</th><th>Category</th><th>Actions</th></tr></thead>
      <tbody>{recipes.data?.data?.map(recipe => <tr key={recipe.id}>
        <td><img src={photo(recipe)} alt="" />{recipe.name}</td><td>{recipe.category?.map(c => c.name).join(", ") || "—"}</td>
        <td><button disabled={!ready} aria-label={'Edit ' + recipe.name} onClick={() => setEditor({ recipe })}>Edit</button></td>
      </tr>)}</tbody></table>
    {recipes.error ? <p role="alert">Couldn’t load recipes. <button onClick={() => refresh(revision + 1)}>Try again</button></p>
      : !recipes.data ? <p role="status">Loading recipes…</p>
      : !recipes.data.data?.length && <p className="desk-empty">{search ? "No recipes match your search." : "Your recipe library is empty."}</p>}
    {(pages > 1 || page > 1) && <nav className="desk-pager" aria-label="Recipe pages"><button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page}</span><button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></nav>}
    {editor && <RecipeEditor selectedRecipe={editor.recipe} categoriesList={categories.data.data} tags={tags.data} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); refresh(revision + 1); }} />}
  </main>;
}

export default function Dashboard() {
  const { loginData, logout } = useAuth();
  const navigate = useNavigate();
  const admin = loginData?.userGroup === "SuperAdmin";
  const links = admin ? [["Dashboard","/dashboard"],["Recipes","/recipes"],["Categories","/categories"],["Users","/users"]] : [["Kitchen","/dashboard"],["Recipes","/recipes"],["Favorites","/favorites"]];
  return <div className={"kitchen-desk " + (admin ? "admin-desk" : "reader-desk")}>
    <header className="desk-menu">
      <Link className="desk-brand" to="/dashboard"><img src="/favicon.svg" alt="" />Food Recipes</Link>
      {admin && <p>Admin workspace</p>}
      <nav aria-label="Workspace">{links.map(([label,to]) => <Link key={to} to={to} aria-current={to === "/dashboard" ? "page" : undefined}>{label}</Link>)}</nav>
      <details className="desk-account"><summary>Account</summary><div><Link to="/profile">Profile</Link><Link to="/ChangePassword">Change password</Link><button onClick={() => { logout(); navigate("/login", { replace: true }); }}>Log out</button></div></details>
    </header>
    {admin ? <AdminLibrary /> : <ReaderKitchen />}
  </div>;
}
