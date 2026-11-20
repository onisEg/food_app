import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useData } from "../../../../context/DataContext";
import usePage from "../../../../services/api/usePage";
import { CATEGORY_URLS } from "../../../../services/api/urls";
import DeleteModal from "../../../shared/components/DeleteModal/DeleteModal";
import Pager from "../../../recipes/components/Pager";

export default function CategoriesList() {
  const { addCategory, updateCategory, deleteCategory } = useData();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, searchFor] = useState("");
  const [revision, refresh] = useState(0);
  const [editor, edit] = useState(null);
  const [name, setName] = useState("");
  const [removal, remove] = useState(null);
  const [busy, setBusy] = useState(false);
  const { data, error } = usePage(CATEGORY_URLS.GET_CATEGORIES, page, size, search, revision);
  function open(category = {}) { edit(category); setName(category.name || ""); }
  function saved() { edit(null); remove(null); refresh(n => n + 1); }
  async function submit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      const record = { name: name.trim() };
      if (editor.id) await updateCategory(editor.id, record, saved); else await addCategory(record, saved);
    } finally { setBusy(false); }
  }
  async function confirmDelete() {
    setBusy(true);
    try { await deleteCategory(removal.id, () => {
      if (page > 1 && data.data.length === 1) setPage(page - 1);
      saved();
    }); } finally { setBusy(false); }
  }
  return <main><div className="desk-heading"><h1>Categories</h1><button className="desk-primary" onClick={() => open()}>+ Add category</button></div>
    <div className="tab-tools"><label>Search categories<input type="search" value={search} onChange={e => { searchFor(e.target.value); setPage(1); }} /></label>
      <label>Per page<select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(1); }}>{[5,10,25,50].map(n => <option key={n}>{n}</option>)}</select></label></div>
    {error ? <p role="alert">Couldn’t load categories. <button onClick={() => refresh(n => n + 1)}>Retry</button></p> : !data ? <p role="status">Loading categories…</p> : <>
      <p>{data.totalNumberOfRecords ?? data.data.length} categories</p>
      {data.data.length ? <div className="tab-scroll"><table className="desk-table"><thead><tr><th>Category</th><th>Created</th><th>Updated</th><th>Actions</th></tr></thead><tbody>
        {data.data.map(c => <tr key={c.id}><td>{c.name}</td>{[c.creationDate,c.modificationDate].map((date,i) => <td key={i}>{date ? new Date(date).toLocaleDateString() : "—"}</td>)}
          <td><div className="catalog-actions"><button onClick={() => open(c)}>Edit</button><button onClick={() => remove(c)}>Delete</button></div></td></tr>)}
      </tbody></table></div> : <p className="desk-empty">No categories found.</p>}
      <Pager page={page} pages={data.totalNumberOfPages} change={setPage} /></>}
    <Modal show={!!editor} onHide={() => !busy && edit(null)} centered aria-labelledby="category-title">
      <Modal.Header closeButton={!busy}><Modal.Title id="category-title">{editor?.id ? "Edit category" : "Add category"}</Modal.Title></Modal.Header>
      <Modal.Body><form onSubmit={submit}><label className="w-100">Category name<input className="form-control my-2" required value={name} onChange={e => setName(e.target.value)} /></label>
        <button className="btn btn-success" disabled={busy || !name.trim()}>Save category</button></form></Modal.Body>
    </Modal>
    {removal && <DeleteModal show title="Delete category" itemName={removal.name} onClose={() => !busy && remove(null)} isSubmitting={busy} onConfirm={confirmDelete} />}
  </main>;
}
