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
    formState: { errors },
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
      reset(); // Clear the form
      navigat("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <>
      <Header
        title={"Change Your Password"}
        username={" "}
        headerImg={"/resipes.svg"}
      />

      <div className="container mt-5 d-flex justify-content-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow-lg p-5 rounded"
          style={{ width: "100%", maxWidth: "600px", background: "white" }}
        >
          <div className=" text-center mb-4">
            <img style={{ width: "60%" }} src="/logofood.png" alt="foodApp" />
          </div>
          {/* <h2 className="mb-3 text-center pb-3">Change Your Password</h2> */}

          {/* Old Password */}
          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Old Password"
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
          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="New Password"
              {...register("newPassword", PASSWORD_VALIDATION)}
            />
            {errors.newPassword && (
              <small className="text-danger">
                {errors.newPassword.message}
              </small>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg "
              placeholder="Confirm New Password"
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

          <button type="submit" className="btn btn-success w-100 btn-lg mt-3">
            Change Password
          </button>
        </form>
      </div>
    </>
  );
}
