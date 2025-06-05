import { useEffect, useState } from "react";
import Header from "../../../shared/components/Header/Header";
import { imgBaseURL, USERS_URL } from "../../../../services/api/urls";

import DeleteModal from "../../../shared/components/DeleteModal/DeleteModal";
import toast from "react-hot-toast";
import NoData from "../../../shared/components/noData/NoData";
import { useData } from "../../../../context/DataContext";

export default function UsersList() {
  const {
    usersList,
    getUsers,
    onDeleteUser,
    totalPages,
    totalNumberOfRecords,
  } = useData();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchUserName, setSearchUserName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchGroup, setSearchGroup] = useState(""); // 1 or 2

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState("10"); // القيمة الافتراضية

  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [isLoading, setIsLoading] = useState(false);

  // // ====== on delete User ======

  const handleDelete = async () => {
    await onDeleteUser(selectedUserId, () => {
      getUsers({
        pageSize,
        pageNumber,
        searchUserName,
        searchEmail,
        searchCountry,
        searchGroup,
      });
      setShowDeleteModal(false);
    });
  };

  useEffect(() => {
    getUsers({
      pageSize: parseInt(pageSize) || 1,
      searchUserName,
      searchEmail,
      searchCountry,
      searchGroup,
      pageNumber,
    });
  }, [
    searchUserName,
    searchEmail,
    searchCountry,
    searchGroup,
    pageNumber,
    pageSize,
  ]);

  return (
    <>
      <Header
        title={"Welcome to"}
        username={"User List !"}
        description={
          "We're thrilled to have you here. Explore and enjoy everything we have to offer!"
        }
        headerImg={"/resipes.svg"}
      />

      {/* filter ui */}
      <div className="row g-3 my-4 align-items-center">
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username"
            value={searchUserName}
            onChange={(e) => setSearchUserName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            className="form-control"
            placeholder="country"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
          />
        </div>
        <div className="col-md-1">
          <select
            className="form-select"
            value={searchGroup}
            onChange={(e) => setSearchGroup(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="1">Admin</option>
            <option value="2">User</option>
          </select>
        </div>
        <div className="col-md-1 ">
          <button
            className="btn btn-outline-danger w-75 "
            onClick={() => {
              setSearchUserName("");
              setSearchEmail("");
              setSearchCountry("");
              setSearchGroup("");
            }}
          >
            Clear
          </button>
        </div>
        <div className="col-md-2">
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="pageSize" className="mb-0 fw-medium">
              Show :
            </label>
            <input
              id="pageSize"
              type="number"
              className="form-control"
              style={{ maxWidth: "80px" }}
              min="1"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              onBlur={() => {
                if (pageSize === "" || parseInt(pageSize) < 1) {
                  setPageSize("1");
                }
              }}
            />
          </div>
        </div>

        <div className="col-md-1">Total : {totalNumberOfRecords}</div>
      </div>

      {/* Users Table */}
      <table className="table table-striped-reversed">
        <thead>
          <tr>
            <th>image</th>
            <th>userName</th>
            <th>country</th>
            <th>email</th>
            <th>id</th>
            <th>role</th>
            <th>phoneNumber</th>
            <th>creation Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <>
              {[...Array(10)].map((_, idx) => (
                <tr className="placeholder-glow" key={idx}>
                  <td>
                    <span
                      className="placeholder rounded-circle"
                      style={{ width: 60, height: 60, display: "inline-block" }}
                    ></span>
                  </td>
                  <td>
                    <span className="placeholder col-6"></span>
                  </td>
                  <td>
                    <span className="placeholder col-5"></span>
                  </td>
                  <td>
                    <span className="placeholder col-7"></span>
                  </td>
                  <td>
                    <span className="placeholder col-4"></span>
                  </td>
                  <td>
                    <span className="placeholder col-3"></span>
                  </td>
                  <td>
                    <span className="placeholder col-4"></span>
                  </td>
                  <td>
                    <span className="placeholder col-5"></span>
                  </td>
                  <td>
                    <span className="placeholder col-2"></span>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <>
              {usersList.map((user) => (
                <tr key={user.id}>
                  {/* imagePath */}
                  <td>
                    <img
                      className="img-thumbnail rounded-circle "
                      src={
                        user.imagePath
                          ? `${imgBaseURL}/${user.imagePath}`
                          : "https://ui-avatars.com/api/?name=User&background=random&size=60"
                      }
                      alt={user.userName}
                      style={{
                        maxWidth: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                  </td>

                  {/* userName */}
                  <td>{user.userName}</td>

                  {/* country */}
                  <td>{user.country}</td>

                  {/* email */}
                  <td className="text-start">{user.email}</td>

                  {/* id */}
                  <td>{user.id}</td>

                  {/* role */}
                  <td>
                    {" "}
                    {user.group?.id === 1
                      ? "Admin"
                      : user.group?.id === 2
                      ? "User"
                      : "Unknown"}
                  </td>

                  {/* phoneNumber */}
                  <td>{user.phoneNumber}</td>

                  {/* modificationDate */}
                  <td>
                    {new Date(user.creationDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {" - "}
                    {new Date(user.creationDate).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  {/* Actions */}

                  <td>
                    <div className="dropdown ">
                      <button
                        className="btn border-0"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fa-solid fa-ellipsis fa-lg"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                        <li>
                          <button
                            onClick={() => {
                              if (user.group.name == "SystemUser") {
                                setSelectedUserId(user.id);
                                setShowDeleteModal(true);
                              } else {
                                toast.error("YOU CAN'T DELETE ADMIN!");
                                return;
                              }
                            }}
                            className="dropdown-item d-flex align-items-center gap-2 text-danger"
                          >
                            <i className="bi bi-trash "></i> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      {/* Users pagination */}
      <div
        className="d-flex my-4 mb-0 gap-3 bg-success-subtle px-5 mx-4 rounded-4 justify-content-center "
        style={{
          position: "sticky",
          bottom: 0,
          padding: "1rem",
          zIndex: 999,
        }}
      >
        <button
          style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          className="btn btn-outline-success d-flex justify-content-center align-items-center"
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(1)}
        >
          «
        </button>

        {pagesArray
          .filter(
            (page) => Math.abs(page - pageNumber) <= 2 //
          )
          .map((page) => (
            <button
              disabled={isLoading}
              style={{ borderRadius: "50%", width: "40px", height: "40px" }}
              key={page}
              className={` d-flex justify-content-center align-items-center btn ${
                page === pageNumber ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setPageNumber(page)}
            >
              {isLoading && page === pageNumber ? (
                <div className="spinner-border spinner-border-sm text-white"></div>
              ) : (
                page
              )}
            </button>
          ))}

        <button
          style={{ borderRadius: "50%", width: "40px", height: "40px" }}
          className="btn btn-outline-success d-flex justify-content-center align-items-center"
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber(totalPages)}
        >
          »
        </button>
      </div>

      {/* Empty Data Message */}
      {usersList.length === 0 && <NoData />}

      {/* Delete Module */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={usersList.find((u) => u.id === selectedUserId)?.userName}
        title="Delete User"
      />
    </>
  );
}
