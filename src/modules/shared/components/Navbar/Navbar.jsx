export default function Navbar({ loginData }) {
  return (
    <>
      <div className="navbar-container d-flex justify-content-between align-items-center px-4 py-3 bg-light rounded-4 gap-3 shadow-sm">
        {/* Search Bar */}
        <div className="input-group w-100 shadow-sm">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>

        {/* User Info */}
        <div className="d-flex align-items-center justify-content-end gap-3 w-25">
          <div>
            <img
              src="Ellipse235.png"
              alt="User"
              className="rounded-circle"
              width="40"
              height="40"
            />
            <span className="fw-medium text-capitalize p-2">
              {loginData?.userName
                ? loginData.userName
                    .replace(/[0-9]/g, "")
                    .replace(/^\w/, (c) => c.toUpperCase())
                : "UserName"}
            </span>
          </div>
          <i className="bi bi-chevron-down fs-5 text-muted"></i>
          <i className="bi bi-bell fs-5 text-muted"></i>
        </div>
      </div>
    </>
  );
}
