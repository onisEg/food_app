import PropTypes from "prop-types";
export default function Pager({ page, pages, change }) {
  if (!(pages > 1 || page > 1)) return null;
  return <nav className="desk-pager" aria-label="Pages">
    <button disabled={page <= 1} onClick={() => change(page - 1)}>Previous</button>
    <span>Page {page} of {Math.max(page, pages || 1)}</span>
    <button disabled={page >= pages} onClick={() => change(page + 1)}>Next</button>
  </nav>;
}
Pager.propTypes = { page: PropTypes.number.isRequired, pages: PropTypes.number, change: PropTypes.func.isRequired };
