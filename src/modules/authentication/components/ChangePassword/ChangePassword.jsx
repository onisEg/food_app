import { useForm } from "react-hook-form";
import { axiosInstance } from "../../../../services/api";
import toast from "react-hot-toast";


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

      toast.success(response.data.message || "Password changed successfully");
      navigat("/dashboard");
      reset(); // Clear the form
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <>
      <h1>Change password</h1>
      <div className="security-panel">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Old Password */}
          <div className="form-group mb-4">
            <label htmlFor="oldPassword" className="form-label fw-medium">Old Password</label>
            <input id="oldPassword" autoComplete="current-password"
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
            <label htmlFor="newPassword" className="form-label fw-medium">New Password</label>
            <input id="newPassword" autoComplete="new-password"
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter new password"
              {...register("newPassword", PASSWORD_VALIDATION)}
            />
            <small>Use at least 6 characters with uppercase, lowercase, a number and a symbol.</small>
            {errors.newPassword && (
              <small className="text-danger">
                {errors.newPassword.message}
              </small>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="form-group mb-4">
            <label htmlFor="confirmNewPassword" className="form-label fw-medium">Confirm New Password</label>
            <input id="confirmNewPassword" autoComplete="new-password"
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
