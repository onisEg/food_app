import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  EMAIL_VALIDATION,
  PASSWORD_VALIDATION,
} from "../../../../services/validations";
import { axiosInstance } from "../../../../services/api";
import { USERS_URL } from "../../../../services/api/urls";

export default function ResetPass() {
  let navigate = useNavigate();
  const location = useLocation();

  let {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    reset,
  } = useForm({ defaultValues: { email: location.state } });

  const onSubmit = async (data) => {
    try {
      let response = await axiosInstance.post(USERS_URL.RESET, data);

      toast.success(response.data.message);

      reset();
      navigate("/login");
    } catch (error) {
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

  const password = watch("password") || "";

  const passwordChecks = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[\W_]/.test(password),
    length: password.length >= 6,
  };

  return (
    <>
      <div className="title  d-flex flex-column align-items-center">
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
            disabled={true}
            type="text"
            className="form-control"
            placeholder="Enter your E-mail"
            aria-label="email"
            aria-describedby="basic-addon1"
            {...register("email")}
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
            {...register("password", PASSWORD_VALIDATION)}
          />
        </div>

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
          <small className="text-danger">
            {errors.confirmPassword.message}
          </small>
        )}
        {(password.length > 0 || errors.password) && (
          <div className="mt-2">
            <small className="text-muted d-block">Password must include:</small>
            <ul
              className="list-unstyled ms-2 mb-0"
              style={{ fontSize: "12px" }}
            >
              <li
                className={
                  passwordChecks.lowercase ? "text-success" : "text-danger"
                }
              >
                {passwordChecks.lowercase ? "✅" : "❌"} a lowercase letter
              </li>
              <li
                className={
                  passwordChecks.uppercase ? "text-success" : "text-danger"
                }
              >
                {passwordChecks.uppercase ? "✅" : "❌"} an uppercase letter
              </li>
              <li
                className={
                  passwordChecks.number ? "text-success" : "text-danger"
                }
              >
                {passwordChecks.number ? "✅" : "❌"} a number
              </li>
              <li
                className={
                  passwordChecks.special ? "text-success" : "text-danger"
                }
              >
                {passwordChecks.special ? "✅" : "❌"} a special character
              </li>
              <li
                className={
                  passwordChecks.length ? "text-success" : "text-danger"
                }
              >
                {passwordChecks.length ? "✅" : "❌"} at least 6 characters
              </li>
            </ul>
          </div>
        )}
        <button disabled={isSubmitting} className="btn btn-lg w-100 bg-success text-white mt-4 ">
          {isSubmitting ? "Submit..." : "Submit"}
        </button>
      </form>
    </>
  );
}
