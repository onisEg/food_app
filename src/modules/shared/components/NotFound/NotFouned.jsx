
import { Link } from "react-router-dom";
export default function NotFouned() {
  return (
    <>
      <div className="notfound-bg d-flex align-items-center vh-100">
        <div className="container">
          <div className="row justify-content-start">
            <div className="col-md-6 text-start px-4">
              <h1 className="display-3 fw-bold text-success">Oops!</h1>
              <p className="lead text-muted">
                The page you’re looking for doesn’t exist or has been moved.
              </p>
              <Link to="/" className="btn btn-success px-4 mt-3">
                ⬅ Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
