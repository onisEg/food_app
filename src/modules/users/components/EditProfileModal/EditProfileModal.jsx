import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../../services/api";
import { USERS_URL } from "../../../../services/api/urls";
import {
  EMAIL_VALIDATION,
  PHONE_NUMBER_VALIDATION,
  USER_NAME_VALIDTION,
} from "../../../../services/validations";

export default function EditProfileModal({
  show,
  onClose,
  profile,
  refreshProfile,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
   
  } = useForm({
    defaultValues: {
      userName: profile.userName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      country: profile.country,
    },
  });

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
      onClose();
      refreshProfile(); // إعادة تحميل البيانات بعد التعديل
    } catch (err) {
      const backendErrors = err.response?.data?.additionalInfo?.errors;

      if (backendErrors) {
        // لف على كل حقل فيه أخطاء
        Object.entries(backendErrors).forEach(([key, messages]) => {
          toast.error(`${key.replace(/([A-Z])/g, " $1")}: ${messages[0]}`);

          // لو حابب برضو تظبطها بالـ react-hook-form (اختياري)
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

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      aria-labelledby="edit-profile-title"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="edit-profile-title" className="fw-light fs-2">
          Edit Profile
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="input-group icon-input ">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              {...register("userName", USER_NAME_VALIDTION)}
            />
          </div>
          {errors.userName && (
            <small className="text-danger">{errors.userName.message}</small>
          )}

          {/* Email */}
          <div className="input-group icon-input mt-4">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              {...register("email", EMAIL_VALIDATION)}
            />
          </div>
          {errors.email && (
            <small className="text-danger">{errors.email.message}</small>
          )}

          {/* Country */}
          <div className="input-group icon-input mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Country"
              {...register("country", { required: "Country is required" })}
            />
          </div>
          {errors.country && (
            <small className="text-danger">{errors.country.message}</small>
          )}

          {/* Phone */}
          <div className="input-group icon-input mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Phone Number"
              {...register("phoneNumber", PHONE_NUMBER_VALIDATION)}
            />
          </div>
          {errors.phoneNumber && (
            <small className="text-danger">{errors.phoneNumber.message}</small>
          )}

          {/* Profile Image */}
          <div
            style={{ marginBottom: "6rem" }}
            className="input-group icon-input mt-4 "
          >
            <div
              className="drag-drop-zone text-center w-100"
              style={{
                backgroundColor: "#f6fff7",
                border: "1px dashed green",
              }}
            >
              <input
                type="file"
                className="form-control d-none"
                id="uploadImage"
                {...register("profileImage")}
              />
              <label
                style={{ cursor: "pointer" }}
                htmlFor="uploadImage"
                className="text-success"
              >
                <div>
                  <i className="bi bi-upload fa-2x"></i>
                </div>
                Drag & Drop or{" "}
                <span className="text-primary">
                  Choose a profile image to upload
                </span>
              </label>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group icon-input mb-4 ">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Password confirmation is required",
              })}
            />
          </div>
          {errors.confirmPassword && (
            <small className="text-danger">
              {errors.confirmPassword.message}
            </small>
          )}

          <button
            type="submit"
            className="btn btn-warning btn-lg w-100 mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="spinner-border spinner-border-sm text-light"></div>
            ) : (
              "Update Changes"
            )}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
}
