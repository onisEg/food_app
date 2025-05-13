import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../services/api";
import { USERS_URL, imgBaseURL } from "../../../../services/api/urls";
import toast from "react-hot-toast";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import Header from "../../../shared/components/Header/Header";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const getProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(USERS_URL.GET_CURRENT_USER);
      setProfile(response.data);
    } catch (error) {
      toast.error("Failed to fetch profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success"></div>
      </div>
    );
  }

  return (
    <>
      <Header
        title={"My Profile"}
        username={profile.userName}
        description={"You can now edit your data "}
        headerImg={"/Employee Business Profile.svg"}
      />
      <div className="container mt-5">
        <div className="card p-4 shadow-lg position-relative">
          <button
            className="btn btn-outline-warning position-absolute top-0 end-0 m-3 d-flex align-items-center gap-1"
            onClick={() => setShowEditModal(true)}
          >
            <i className="fa-solid fa-pen"></i> Edit
          </button>

          <div className="d-flex align-items-center gap-4">
            <img
              src={
                profile.imagePath
                  ? `${imgBaseURL}/${profile.imagePath}`
                  : "https://ui-avatars.com/api/?name=User&background=random&size=60"
              }
              alt="profile"
              className="rounded-circle"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>User Name:</strong> {profile.userName}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Phone:</strong> {profile.phoneNumber}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Country:</strong> {profile.country}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Role:</strong> {profile.group?.name}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>ID:</strong> {profile.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        refreshProfile={getProfile}
      />
    </>
  );
}
