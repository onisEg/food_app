import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useData } from "../../../../context/DataContext";
import { CATEGORY_URLS, RECIPE_URLS, TAG } from "../../../../services/api/urls";
import usePage from "../../../../services/api/usePage";
import DeleteModal from "../../../shared/components/DeleteModal/DeleteModal";
import RecipeEditor from "./RecipeEditor";
import RecipeCard from "../RecipeCard";
import Pager from "../Pager";

export default function RecipeList() {
  const admin = useAuth().loginData?.userGroup === "SuperAdmin";
  const { getFavorites, favorites, toggleFavorite, onDeleteRecipe } = useData();
  const [filters, setFilters] = useState({ name: "", tag: "", category: "" });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [revision, refresh] = useState(0);
  const [editor, edit] = useState(null);
  const [removal, remove] = useState(null);
  const [busy, setBusy] = useState(false);
  const { data, error } = usePage(RECIPE_URLS.GET_RECIPES, page, size, filters.name, revision, filters.tag, filters.category);
  const tags = usePage(TAG.ALL_TAGS);
  const categories = usePage(CATEGORY_URLS.GET_CATEGORIES, 1, 100);
  const ready = Array.isArray(tags.data) && Array.isArray(categories.data?.data);
  useEffect(() => { if (!admin) getFavorites(); }, [admin]); // Load saved status when entering the reader catalogue.
  function filter(key, value) { setFilters({ ...filters, [key]: value }); setPage(1); }
  async function favorite(id) { setBusy(true); try { await toggleFavorite(id); } finally { setBusy(false); } }
  function saved() { edit(null); refresh(n => n + 1); }
  async function confirmDelete() {
    setBusy(true);
    try { await onDeleteRecipe(removal.id, () => {
      remove(null); if (data.data.length === 1 && page > 1) setPage(page - 1); refresh(n => n + 1);
    }); } finally { setBusy(false); }
  }
  return <main><div className="desk-heading"><h1>Recipes</h1>{admin && <button disabled={!ready} className="desk-primary" onClick={() => edit({})}>+ Add recipe</button>}</div>
    <div className="tab-tools">
      <label>Search recipes<input type="search" value={filters.name} onChange={e => filter("name", e.target.value)} /></label>
      <label>Tag<select value={filters.tag} onChange={e => filter("tag", e.target.value)}><option value="">All tags</option>{tags.data?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
      <label>Category<select value={filters.category} onChange={e => filter("category", e.target.value)}><option value="">All categories</option>{categories.data?.data?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Per page<select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(1); }}>{[6,12,24,48].map(n => <option key={n}>{n}</option>)}</select></label>
      <button onClick={() => { setPage(1); setFilters({ name:"", tag:"", category:"" }); }}>Clear</button>
    </div>
    {error ? <p role="alert">Couldn’t load recipes. <button onClick={() => refresh(n => n + 1)}>Retry</button></p> : !data ? <p role="status">Loading recipes…</p> : <>
      <p>{data.totalNumberOfRecords ?? data.data.length} recipes</p>
      {data.data.length === 0 && <p className="desk-empty">No recipes match these filters.</p>}
      <div className="catalog-grid">{data.data.map(recipe => {
        const liked = favorites.some(f => f.recipe?.id === recipe.id);
        return <RecipeCard key={recipe.id} recipe={recipe}>{admin ? <>
          <button disabled={!ready} onClick={() => edit({ recipe })}>Edit</button><button onClick={() => remove(recipe)}>Delete</button></>
          : <button disabled={busy} aria-pressed={liked} onClick={() => favorite(recipe.id)}>{liked ? "♥ Saved" : "♡ Save recipe"}</button>}
        </RecipeCard>;
      })}</div><Pager page={page} pages={data.totalNumberOfPages} change={setPage} /></>}
    {editor && admin && <RecipeEditor selectedRecipe={editor.recipe} tags={tags.data} categoriesList={categories.data.data} onClose={() => edit(null)} onSaved={saved} />}
    {removal && admin && <DeleteModal show title="Delete recipe" itemName={removal.name} onClose={() => !busy && remove(null)} isSubmitting={busy} onConfirm={confirmDelete} />}
  </main>;
}
