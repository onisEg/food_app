import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../services/api";
import { USERS_URL } from "../../../../services/api/urls";
import { EMAIL_VALIDATION } from "../../../../services/validations";

export default function ForgetPass() {
  let navigate = useNavigate();
  let {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      let response = await axiosInstance.post(USERS_URL.RESET_REQUEST, data);
      toast.success(response.data.message);
      reset();
      navigate("/resetpass", { state: data.email });
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <div className="title  d-flex flex-column align-items-start">
        <h3 className="text-center fw-bold">Forgot Your Password?</h3>
        <span className="text-muted ">
          <span>No worries! </span>
          <small>
            Please enter your email and we will send a password reset link
          </small>
        </span>
      </div>
      <form className="py-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group mt-4 ">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-envelope-at"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your email"
            aria-label="email"
            aria-describedby="basic-addon1"
            {...register("email", EMAIL_VALIDATION)}
          />
        </div>
        {errors.email && (
          <small className="text-danger ">{errors.email.message}</small>
        )}
        <div className="mt-3">
          <Link
            className=" text-secondary fw-bold text-decoration-none fw-medium"
            to="/login"
          >
            Login ?
          </Link>
        </div>

        <button
          disabled={isSubmitting}
          className="btn btn-lg w-100 bg-success text-white mt-4 "
        >
          {isSubmitting ? "Submiting" : "Submit"}
        </button>
      </form>
    </>
  );
}
