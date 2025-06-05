import { useEffect, useState } from "react";
import { axiosInstance } from "../../../../services/api";
import { USERS_URL, imgBaseURL } from "../../../../services/api/urls";
import toast from "react-hot-toast";

import Header from "../../../shared/components/Header/Header";
import { useForm } from "react-hook-form";
import { useData } from "../../../../context/DataContext";
import { useAuth } from "../../../../context/AuthContext";

export default function Profile() {
  const { loginData } = useAuth();
  const { profile, isProfileLoading, getProfile, updateProfileImage } =
    useData();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [passwordForImage, setPasswordForImage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({});

  console.log(profile);

  // // =========== get profile =============
  // const getProfile = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axiosInstance.get(USERS_URL.GET_CURRENT_USER);
  //     setProfile(response.data);
  //   } catch (error) {
  //     toast.error("Failed to fetch profile.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (let key in data) {
        if (key === "profileImage" && data[key][0]) {
          formData.append("profileImage", data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      }
      console.log(data);

      const res = await axiosInstance.put(USERS_URL.UPDATE_PROFILE, formData);
      console.log(res);

      toast.success("Profile updated successfully!");

      getProfile();
    } catch (err) {
      const backendErrors = err.response?.data?.additionalInfo?.errors;

      if (backendErrors) {
        Object.entries(backendErrors).forEach(([key, messages]) => {
          toast.error(`${key.replace(/([A-Z])/g, " $1")}: ${messages[0]}`);

          setError(key, {
            type: "server",
            message: messages[0],
          });
        });
      } else {
        toast.error(err.response?.data?.message || "Update failed");
      }

      console.error(err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (isProfileLoading) {
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

      <div className="d-flex gap-4 my-5">
        {/* My Profile Card */}
        <div
          className="card p-4 rounded-4 border-0 shadow-sm"
          style={{ backgroundColor: "#F9FAFB", flex: "1" }}
        >
          <h4 className="fw-semibold mb-4">My Profile</h4>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="position-relative">
              <img
                src={
                  profile.imagePath
                    ? `${imgBaseURL}/${profile.imagePath}`
                    : `https://ui-avatars.com/api/?name=${profile.userName}&background=random&size=60`
                }
                alt="Profile"
                className="rounded-circle border"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              {/* Camera Icon */}
              <form>
                <input
                  type="file"
                  id="profileImageInput"
                  className="d-none"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedImage(file);
                      setShowPasswordModal(true);
                    }
                  }}
                />
                {showPasswordModal && (
                  <div
                    className="modal fade show"
                    style={{
                      display: "block",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                    tabIndex="-1"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Confirm Password</h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                              setShowPasswordModal(false);
                              setPasswordForImage("");
                              setSelectedImage(null);
                            }}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={passwordForImage}
                            onChange={(e) =>
                              setPasswordForImage(e.target.value)
                            }
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setShowPasswordModal(false);
                              setPasswordForImage("");
                              setSelectedImage(null);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={async () => {
                              if (!selectedImage) {
                                toast.error("Please select an image");
                                return;
                              }
                              if (!passwordForImage) {
                                toast.error("Password is required");
                                return;
                              }

                              await updateProfileImage(
                                {
                                  file: selectedImage,
                                  password: passwordForImage,
                                },
                                () => {
                                  setShowPasswordModal(false);
                                  setPasswordForImage("");
                                  setSelectedImage(null);
                                }
                              );
                            }}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <label
                  htmlFor="profileImageInput"
                  className="position-absolute bottom-0 end-0 bg-success text-white rounded-circle p-1 border border-white d-flex justify-content-center align-items-center"
                  style={{ cursor: "pointer", width: "30px", height: "30px" }}
                >
                  <i className="bi bi-camera-fill"></i>
                </label>
              </form>
            </div>
            <div>
              <h5 className="mb-0 fw-bold">{profile.userName}</h5>
              <span className="text-muted text-uppercase small">
                {profile.group?.name}
              </span>
            </div>
          </div>

          <div className="border-top pt-3 small text-muted">
            {[
              { label: "UserName", value: profile.userName },
              { label: "Mobile", value: profile.phoneNumber },
              { label: "E-mail", value: profile.email },
              { label: "Location", value: profile.country },
            ].map((item, index) => (
              <div
                key={index}
                className={`d-flex justify-content-between py-2 ${
                  index !== 3 ? "border-bottom" : ""
                }`}
              >
                <span className="text-uppercase">{item.label} :</span>
                <span className="text-dark">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Profile Form */}
        <div
          className="card p-4 shadow-sm rounded-4 border-0"
          style={{ backgroundColor: "#F9FAFB", flex: "2" }}
        >
          <h4 className="mb-4 fw-semibold">Edit Profile</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="UserName"
                  {...register("userName")}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  {...register("email")}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Country"
                  {...register("country")}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone"
                  {...register("phoneNumber")}
                />
              </div>

              <div className="col-md-12">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                />
              </div>
            </div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="btn btn-lg btn-success mt-4 w-100"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
