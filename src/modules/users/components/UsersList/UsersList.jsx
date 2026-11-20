import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { axiosInstance } from "../../../../services/api";
import { USERS_URL, imgBaseURL } from "../../../../services/api/urls";
import { sampleUsers } from "./sampleUsers";
import "./directory.css";

const blank = { name: "", country: "", role: "", email: "" };
const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" });

export default function UsersList({ demo = false }) {
  const [draft, setDraft] = useState(blank);
  const [filter, setFilter] = useState(blank);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sample, setSample] = useState(sampleUsers);
  const [result, setResult] = useState({ rows: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        let rows, total, pages;
        if (demo) {
          const matches = sample.filter(u =>
            u.userName.toLowerCase().includes(filter.name.toLowerCase()) &&
            u.country.toLowerCase().includes(filter.country.toLowerCase()) &&
            (!filter.role || String(u.group.id) === filter.role));
          total = matches.length;
          pages = Math.ceil(total / size);
          rows = matches.slice((page - 1) * size, page * size);
        } else {
          const { data } = await axiosInstance.get(USERS_URL.GET_ALL_USERS, {
            signal: controller.signal,
            params: { pageNumber: page, pageSize: size, userName: filter.name, country: filter.country,
              groups: filter.role ? [Number(filter.role)] : undefined },
          });
          rows = data.data; total = data.totalNumberOfRecords; pages = data.totalNumberOfPages;
        }
        if (controller.signal.aborted) return;
        pages = Math.max(1, pages || 1);
        if (page > pages) { setPage(pages); return; }
        rows = rows.filter(u => !filter.email || u.email?.toLowerCase().includes(filter.email.toLowerCase()));
        setResult({ rows, total, pages });
      } catch {
        if (!controller.signal.aborted) setError("The directory could not be loaded.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [demo, sample, filter, size, page, refresh]);

  function clear() { setDraft(blank); setFilter(blank); setPage(1); }
  function close() { if (!busy) { setSelected(null); setConfirm(false); setActionError(""); } }
  async function remove() {
    if (!confirm || busy || selected?.group?.name !== "SystemUser") return;
    setBusy(true); setActionError("");
    try {
      if (demo) setSample(sample.filter(u => u.id !== selected.id));
      else await axiosInstance.delete(USERS_URL.DELETE(selected.id));
      setSelected(null); setConfirm(false); setRefresh(n => n + 1);
    } catch { setActionError("Deletion failed. The account is still listed."); }
    finally { setBusy(false); }
  }
  return (
    <main className={"member-directory" + (demo ? " directory-demo" : "")}>
      {demo && <header className="directory-brand"><Link to="/guest"><img src="/favicon.svg" alt="" /> Food Recipes</Link><span>Sample directory</span></header>}
      <h1>User directory</h1>
      <form className="directory-tools" onSubmit={e => { e.preventDefault(); setFilter({ ...draft }); if (draft.name !== filter.name || draft.country !== filter.country || draft.role !== filter.role) setPage(1); }}>
        {[["name", "Username"], ["country", "Country"], ["email", "Email on this page"]].map(([key, label]) =>
          <label key={key}>{label}<input type="search" value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })} /></label>)}
        <label>Role<select value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value })}><option value="">All roles</option><option value="1">Admin</option><option value="2">Reader</option></select></label>
        <button className="directory-primary">Apply filters</button><button type="button" onClick={clear}>Clear</button>
      </form>
      <div className="directory-heading"><h2>Members</h2><span aria-live="polite">{loading ? "Loading…" : error ? "" : result.total + " accounts"}</span></div>
      {error ? <p role="alert">{error} <button onClick={() => setRefresh(n => n + 1)}>Retry</button></p> : loading ? <p role="status">Loading members…</p> : !result.rows.length ? <p role="status">No matching members on this page. <button onClick={clear}>Reset filters</button></p> :
        <ul className="directory-list">{result.rows.map(u => <li key={u.id}>
          <div className="member-identity"><span className="member-avatar" aria-hidden="true">{u.imagePath ? <img src={imgBaseURL + "/" + u.imagePath} alt="" /> : (u.userName || "?").slice(0, 2).toUpperCase()}</span>
            <div><strong>{u.userName}</strong><small>{u.email}</small></div></div>
          <span className="member-country">{u.country || "—"}</span>
          <span className="member-role">{u.group?.id === 1 ? "Admin" : u.group?.id === 2 ? "Reader" : "Unknown"}</span>
          <button aria-label={"View details for " + u.userName} onClick={() => setSelected(u)}>Details</button>
        </li>)}</ul>}
      {!error && <nav className="directory-pages" aria-label="Member pagination">
        <label>Per page <select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(1); }}>{[5,10,25,50].map(n => <option key={n}>{n}</option>)}</select></label>
        <span>Page {page} of {result.pages}</span>
        <button disabled={loading || page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button disabled={loading || page >= result.pages} onClick={() => setPage(page + 1)}>Next</button>
      </nav>}
      <Modal show={!!selected} onHide={close} centered aria-labelledby="member-title">
        <Modal.Header closeButton={!busy}><Modal.Title id="member-title">{confirm ? "Delete account?" : selected?.userName}</Modal.Title></Modal.Header>
        <Modal.Body>{confirm ? <p>Remove {selected?.userName} from the directory? {demo ? "Refreshing restores this sample account." : "This action is permanent."}</p> :
          selected && <dl>{Object.entries({ Email: selected.email, Country: selected.country, Phone: selected.phoneNumber, ID: selected.id, Role: selected.group?.name, Joined: Number.isFinite(Date.parse(selected.creationDate)) ? dateFormat.format(new Date(selected.creationDate)) : null }).map(([k,v]) => <div key={k}><dt>{k}</dt><dd>{v ?? "—"}</dd></div>)}</dl>}
          {actionError && <p role="alert">{actionError}</p>}</Modal.Body>
        <Modal.Footer><button className="btn btn-outline-secondary" disabled={busy} onClick={close}>{confirm ? "Cancel" : "Close"}</button>
          {selected?.group?.name === "SystemUser" && <button className="btn btn-outline-danger" disabled={busy} onClick={confirm ? remove : () => setConfirm(true)}>{busy ? "Deleting…" : confirm ? "Confirm deletion" : "Delete account"}</button>}</Modal.Footer>
      </Modal>
    </main>
  );
}
UsersList.propTypes = { demo: PropTypes.bool };
