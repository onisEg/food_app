import { useForm } from "react-hook-form";
import { axiosInstance } from "../../../../services/api";
import toast from "react-hot-toast";
import Header from "../../../shared/components/Header/Header";

import { USERS_URL } from "../../../../services/api/urls";
import { PASSWORD_VALIDATION } from "../../../../services/validations";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  let navigat = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting },
    watch,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await axiosInstance.put(USERS_URL.CHANGE_PASSWORD, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
      console.log(response);
      toast.success(response.data.message || "Password changed successfully");
      navigat("/dashboard");
      reset(); // Clear the form
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <>
      <Header title={"Change Your Password"} headerImg={"/resipes.svg"} />

      <div className="container mt-5 d-flex justify-content-center align-items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow p-5 rounded-4"
          style={{
            width: "100%",
            maxWidth: "900px",
            background: "white",
            border: "1px solid #eee",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-4">
            <img
              src="/logofood.png"
              alt="FoodApp Logo"
              style={{ width: "80px" }}
            />
            <h4 className="mt-3 fw-bold text-success">Change Password</h4>
            <small className="text-muted">
              Ensure your new password is secure
            </small>
          </div>

          {/* Old Password */}
          <div className="form-group mb-4">
            <label className="form-label fw-medium">Old Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter your old password"
              {...register("oldPassword", {
                required: "Old password is required",
              })}
            />
            {errors.oldPassword && (
              <small className="text-danger">
                {errors.oldPassword.message}
              </small>
            )}
          </div>

          {/* New Password */}
          <div className="form-group mb-4">
            <label className="form-label fw-medium">New Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter new password"
              {...register("newPassword", PASSWORD_VALIDATION)}
            />
            {errors.newPassword && (
              <small className="text-danger">
                {errors.newPassword.message}
              </small>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="form-group mb-4">
            <label className="form-label fw-medium">Confirm New Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Confirm new password"
              {...register("confirmNewPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
            />
            {errors.confirmNewPassword && (
              <small className="text-danger">
                {errors.confirmNewPassword.message}
              </small>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-success btn-lg w-100 mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
