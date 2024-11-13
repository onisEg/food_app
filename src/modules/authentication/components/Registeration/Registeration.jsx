import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Registeration() {
  let navigate = useNavigate();
  let {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    
    // try {
    //   let response = await axios.post(
    //     "https://upskilling-egypt.com:3006/api/v1/Users/Login",
    //     data
    //   );
    //   toast.success(response.data.message);
    //   navigate("/login");
    //   // console.log(data);
    // } catch (error) {
    //   console.log(error);
    //   toast.error(error.response.data.message);
    // }
  };
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
                placeholder="userName "
                {...register("userName ", { required: "Field is required" })}
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
                {...register("email", {
                  required: "Field is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid mail",
                  },
                })}
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
                {...register("country ", { required: "Field is required" })}
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
                {...register("phoneNumber ", {
                  required: "Field is required",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Invalid phone number",
                  },
                })}
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
                {...register("password", {
                  required: "Field is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
            </div>
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
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
        <button type="submit" className="btn btn-lg btn-success w-100 my-2">
          Register
        </button>
      </form>
    </>
  );
}
