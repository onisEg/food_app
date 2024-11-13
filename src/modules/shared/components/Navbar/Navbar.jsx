export default function Navbar({ loginData }) {
  return (
    <>
      <div
        style={{ background: "#F8F9FB" }}
        className="row py-3 px-4 rounded  rounded-4 d-flex align-content-center"
      >
        <div className="input-group p-0 rounded  col bg-white">
          <span className="input-group-text" id="basic-addon1 bg-white">
            <i className="bi bi-search "></i>
          </span>
          <input
            type="text"
            className="form-control "
            placeholder="Search..."
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
        <div className="px-4 d-flex justify-content-evenly align-items-center  col-md-2 col ">
          <img className="" src="/public/Ellipse235.png" alt="" />
          <span className="text-capitalize">
            {loginData?.userName || "userName"}
          </span>
          <i className="bi bi-chevron-down"></i>
          <i className="bi bi-bell"></i>
        </div>
      </div>
    </>
  );
}
