import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";


export default function ForgetPass() {
  let navigate = useNavigate();
  let {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      let response = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/Users/Reset/Request",
        data
      );
      toast.success(response.data.message);
      navigate("/resetpass");
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
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
          <small className="text-danger ">{errors.email.message}</small>
        )}
        <div className="mt-3">
          <Link
            className="text-decoration-none text-dark fw-medium "
            to="/login"
          >
            Login ?
          </Link>
        </div>

        <button className="btn btn-lg w-100 bg-success text-white mt-4 ">
          Submit
        </button>
      </form>
    </>
  );
}
