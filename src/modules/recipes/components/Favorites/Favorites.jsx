import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../../services/api";
import usePage from "../../../../services/api/usePage";
import { USER_RECIPE_URLS } from "../../../../services/api/urls";
import RecipeCard from "../RecipeCard";
import Pager from "../Pager";

export default function Favorites() {
  const [page, setPage] = useState(1);
  const [revision, refresh] = useState(0);
  const [busy, setBusy] = useState(false);
  const { data, error } = usePage(USER_RECIPE_URLS.GET_FAVORITES, page, 12, "", revision);
  async function remove(id) {
    setBusy(true);
    try {
      await axiosInstance.delete(USER_RECIPE_URLS.DELETE_FAVORITE(id));
      if (data.data.length === 1 && page > 1) setPage(page - 1);
      refresh(n => n + 1); toast.success("Removed from favorites");
    } catch { toast.error("Couldn’t remove this recipe."); } finally { setBusy(false); }
  }
  return <main><h1>My favorites</h1>
    {error ? <p role="alert">Couldn’t load favorites. <button onClick={() => refresh(n => n + 1)}>Retry</button></p>
      : !data ? <p role="status">Loading favorites…</p> : data.data.some(f => f.recipe) ?
        <><div className="catalog-grid">{data.data.filter(f => f.recipe).map(f =>
          <RecipeCard key={f.id} recipe={f.recipe}><button disabled={busy} onClick={() => remove(f.id)}>Remove from favorites</button></RecipeCard>)}</div>
          <Pager page={page} pages={data.totalNumberOfPages} change={setPage} /></>
        : <section className="desk-empty"><p>Save recipes you’d like to cook and find them here.</p><Link to="/recipes">Explore recipes →</Link></section>}
  </main>;
}
