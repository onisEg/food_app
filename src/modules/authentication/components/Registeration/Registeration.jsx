import axios from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../services/api";
import { USERS_URL } from "../../../../services/api/urls";
import {
  EMAIL_VALIDATION,
  PASSWORD_VALIDATION,
  PHONE_NUMBER_VALIDATION,
  USER_NAME_VALIDTION,
} from "../../../../services/validations";

export default function Registeration() {
  let navigate = useNavigate();
  let {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    watch,
    trigger,
  } = useForm({ mode: "onChange" });

  const password = watch("password", "");

  const passwordChecks = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[\W_]/.test(password),
    length: password.length >= 6,
  };

  const onSubmit = async (data) => {
    try {
      let response = await axiosInstance.post(USERS_URL.REGISTER, data);

      console.log(data);
      console.log(response);
      toast.success("Account created successfully. Please check your email.");
      reset();
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (watch("confirmPassword")) {
      trigger("confirmPassword");
    }
  }, [watch("password"), watch("confirmPassword"), trigger]);

  return (
    <>
      <div className="title  d-flex flex-column align-items-start mb-4">
        <h3 className="text-center fw-bold">Register</h3>
        <span className="text-muted ">
          Welcome Back! Please enter your details
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* UserName Field */}
          <div className="col-sm-6 mb-3">
            <div className="input-group icon-input">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="userName"
                {...register("userName", USER_NAME_VALIDTION)}
              />
            </div>
            {errors.userName && (
              <small className="text-danger">{errors.userName.message}</small>
            )}
          </div>

          {/* Email Field */}
          <div className="col-sm-6 mb-3">
            <div className="input-group icon-input">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your E-mail"
                {...register("email", EMAIL_VALIDATION)}
              />
            </div>
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}
          </div>

          {/* Country Field */}
          <div className="col-sm-6 mb-3">
            <div className="input-group icon-input">
              <span className="input-group-text">
                <i className="bi bi-geo-alt"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Country"
                {...register("country", { required: "country is required" })}
              />
            </div>
            {errors.country && (
              <small className="text-danger">{errors.country.message}</small>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="col-sm-6 mb-3">
            <div className="input-group icon-input">
              <span className="input-group-text">
                <i className="bi bi-phone"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Phone Number"
                {...register("phoneNumber", PHONE_NUMBER_VALIDATION)}
              />
            </div>
            {errors.phoneNumber && (
              <small className="text-danger">
                {errors.phoneNumber.message}
              </small>
            )}
          </div>

          {/* Password Field */}
          <div className="col-sm-6 mb-3">
            <div className="input-group icon-input">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                {...register("password", PASSWORD_VALIDATION)}
              />
            </div>
            {(password.length > 0 || errors.password) && (
              <div className="mt-2">
                <small className="text-muted d-block">
                  Password must include:
                </small>
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
          </div>

          {/* Confirm Password Field */}
          <div className="col-sm-6 mb-3">
            <div className="input-group icon-input">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
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
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link to="/login" className="text-decoration-none text-success">
            Login Now?
          </Link>
        </div>
        <button
          disabled={isSubmitting}
          className="btn btn-lg btn-success w-100 my-2"
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin-pulse"></i>
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </>
  );
}
