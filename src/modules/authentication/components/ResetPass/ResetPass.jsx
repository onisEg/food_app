import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ResetPass() {
  let navigate = useNavigate();

  let {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let response = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Users/Reset",
        data
      );

      toast.success(response.data.message);
      console.log(response);

      reset();
      navigate("/login");
    } catch (error) {
      console.log(error);

      const errors = error?.response?.data?.additionalInfo?.errors;

      if (errors) {
        const firstField = Object.keys(errors)[0];
        const firstError = errors[firstField][0];
        toast.error(firstError);
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
  };
  return (
    <>
      <div className="title  d-flex flex-column align-items-start">
        <h3 className="text-center fw-bold"> Reset Password</h3>
        <span className="text-muted ">
          <small>Please Enter Your Otp or Check Your Inbox </small>
        </span>
      </div>

      <form className="py-3" onSubmit={handleSubmit(onSubmit)}>
        {/* ================== email ================== */}
        <div className="input-group mt-4 ">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-envelope-at"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your E-mail"
            aria-label="email"
            aria-describedby="basic-addon1"
            {...register("email", {
              required: "Field is required",
            })}
          />
        </div>
        {errors.email && (
          <small className="text-danger ">{errors.email.message}</small>
        )}
        {/* =========== otp ======== */}
        <div className="input-group mt-3 ">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-lock"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="OTP"
            aria-label="OTP"
            aria-describedby="basic-addon1"
            {...register("seed", {
              required: "Otb is required",
            })}
          />
        </div>
        {errors.seed && (
          <small className="text-danger ">{errors.seed.message}</small>
        )}

        {/* =========== New password  ======== */}
        <div className="input-group mt-3">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-lock"></i>
          </span>
          <input
            type="password"
            className="form-control"
            placeholder="New password"
            aria-label="password"
            aria-describedby="basic-addon1"
            {...register("password", {
              required: "Field is required",
            })}
          />
        </div>
        {errors.password && (
          <small className="text-danger ">{errors.password.message}</small>
        )}

        {/* =========== Confirm password ======== */}
        <div className="input-group mt-3">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-lock"></i>
          </span>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm New Password"
            aria-label="password"
            aria-describedby="basic-addon1"
            {...register("confirmPassword", {
              required: "Field is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
        </div>
        {errors.confirmPassword && (
          <>
            <small className="text-danger ">
              {errors.confirmPassword.message}
            </small>
            <div
              className="alert alert-danger mt-3 p-2"
              style={{ fontSize: "12px", lineHeight: "1.4" }}
            >
              <div className="small">
                <strong>Password must include:</strong>
                <ul className="mb-0 ms-3">
                  <li>a lowercase letter</li>
                  <li>an uppercase letter</li>
                  <li>a number</li>
                  <li>a special character</li>
                  <li>at least 6 characters</li>
                </ul>
              </div>
            </div>
          </>
        )}

        <button className="btn btn-lg w-100 bg-success text-white mt-4 ">
          {isSubmitting ? "Submit..." : "Submit"}
        </button>
      </form>
    </>
  );
}
