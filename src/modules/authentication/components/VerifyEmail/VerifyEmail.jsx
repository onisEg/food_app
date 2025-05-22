import React from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../../services/api";
import { USERS_URL } from "../../../../services/api/urls";

import { ClipLoader } from "react-spinners";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: location.state } });

  const onSubmit = async (data) => {
    if (!email) {
      toast.error("Email is missing");
      navigate("/register");
      return;
    }

    try {
      await axiosInstance.put(USERS_URL.VERIFY_ACCOUNT, {
        email,
        code: data.code,
      });
      toast.success("Email verified successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const backendErrors = err?.response?.data?.additionalInfo?.errors;
      if (backendErrors?.email) {
        toast.error(`Email: ${backendErrors.email[0]}`);
      } else if (backendErrors?.code) {
        toast.error(`Code: ${backendErrors.code[0]}`);
      } else {
        toast.error(err?.response?.data?.message || "Verification failed");
      }
    }
  };

  return (
    <>
      <div>
        <div className="title d-flex flex-column align-items-start">
          <h3 className="text-center fw-bold">Verify Your Email</h3>
          <span className="text-muted">
            A verification code has been sent to: <strong>{email}</strong>
          </span>
        </div>

        <form className="py-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="input-group mt-4">
            <div className="input-group icon-input">
              <span className="input-group-text">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                value={email || "Email"}
                readOnly
              />
            </div>
          </div>
          {/* Code Input */}
          <div className="input-group mt-4">
            <span className="input-group-text">
              <i className="bi bi-shield-lock"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter verification code"
              {...register("code", { required: "Code is required" })}
            />
          </div>
          {errors.code && (
            <small className="text-danger">{errors.code.message}</small>
          )}

          <button
            disabled={isSubmitting}
            className="btn btn-lg w-100 bg-success text-white mt-4"
          >
            {isSubmitting ? <ClipLoader size={20} color="#fff" /> : "Verify"}
          </button>
        </form>
        <div className="mt-3 text-end">
          <button
            disabled={isSubmitting}
            type="button"
            className="btn btn-link p-0 text-success"
            onClick={async () => {
              try {
                await axiosInstance.post(USERS_URL.VERIFY_ACCOUNT, {
                  email,
                });
                toast.success("Verification code resent!");
              } catch (err) {
                toast.error("Failed to resend code.");
              }
            }}
          >
            Resend Code
          </button>
        </div>
      </div>
    </>
  );
}
