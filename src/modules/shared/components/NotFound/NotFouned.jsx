import React from "react";
import "./notfound.css";
import { Link } from "react-router-dom";
export default function NotFouned() {
  return (
    <>
      <div className="notFound">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div>
                <div className="d-flex  vh-100 align-items-center">
                  <div className="btn">
                    <Link to="/" className="btn btn-success btn-lg">
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
