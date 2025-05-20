import { useEffect, useState } from "react";
import Header from "../../../shared/components/Header/Header";
import { imgBaseURL, USERS_URL } from "../../../../services/api/urls";
import { axiosInstance } from "../../../../services/api";
import DeleteModal from "../../../shared/components/DeleteModal/DeleteModal";
import toast from "react-hot-toast";
import NoData from "../../../shared/components/noData/NoData";

export default function UsersList() {
  const [usersList, setUsersList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchUserName, setSearchUserName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchGroup, setSearchGroup] = useState(""); // 1 or 2

  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNumberOfRecords, setTotalNumberOfRecords] = useState(null);
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [isLoading, setIsLoading] = useState(false);

  // ====== on delete User ======
  const onDeleteUser = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`${USERS_URL.DELETE(selectedUserId)}`);
      toast.success("User Deleted Successfully");
      setShowDeleteModal(false);
      getUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };

  // Fetch Users
  const getUsers = async () => {
    setIsLoading(true);
    const params = {
      pageSize: 10,
      pageNumber,
      userName: searchUserName,
      country: searchCountry,
      groups: searchGroup ? [parseInt(searchGroup)] : undefined,
    };

    try {
      const response = await axiosInstance.get(USERS_URL.GET_ALL_USERS, {
        params,
      });
      let data = response.data.data;
      setTotalPages(response.data.totalNumberOfPages);
      if (searchEmail) {
        const search = searchEmail.toLowerCase();
        data = data.filter((user) =>
          user.email?.toLowerCase().includes(search)
        );
      }
      setUsersList(data);
      console.log(response.data);
      setTotalNumberOfRecords(response.data.totalNumberOfRecords);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();

    const delayDebounce = setTimeout(() => {
      getUsers();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchUserName, searchEmail, searchCountry, searchGroup, pageNumber]);

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
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by country"
            value={searchCountry}
            onChange={(e) => setSearchCountry(e.target.value)}
          />
        </div>
        <div className="col-md-2">
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
        <div className="col-md-1">
          <button
            className="btn btn-outline-danger w-100"
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
                    <div className="dropdown">
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
                              setSelectedUserId(user.id);
                              setShowDeleteModal(true);
                            }}
                            className="dropdown-item d-flex align-items-center gap-2 text-danger"
                          >
                            <i className="bi bi-trash"></i> Delete
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
        className="d-flex justify-content-center my-4 gap-3 "
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
            (page) =>
              // page === 1 || // أول صفحة
              // page === totalPages || // آخر صفحة
              Math.abs(page - pageNumber) <= 2 //
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
        onConfirm={onDeleteUser}
        itemName={usersList.find((u) => u.id === selectedUserId)?.userName}
        title="Delete User"
      />
    </>
  );
}
