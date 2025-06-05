
import { Link, replace, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { USERS_URL } from "../../../../services/api/urls";
import { axiosInstance } from "../../../../services/api/index";
import toast from "react-hot-toast";
import { EMAIL_VALIDATION } from "../../../../services/validations";
import { useAuth } from "../../../../context/AuthContext";
export default function Login() {
  const navigate = useNavigate();
  const { saveLoginData } = useAuth();
  let {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm();

  // =========== submit login ========
  const onSubmit = async (data) => {
    try {
      let response = await axiosInstance.post(USERS_URL.LOGIN, data);
      localStorage.setItem("token", response.data.token);
      await saveLoginData();
      toast.success("login success!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="title  d-flex flex-column align-items-start">
        <h3 className="text-center fw-bold">Login</h3>
        <span className="text-muted ">
          Welcome Back! please enter your details
        </span>
      </div>
      <form className="py-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group mt-4 ">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-envelope-at"></i>
          </span>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your E-mail"
            aria-label="email"
            aria-describedby="basic-addon1"
            {...register("email", EMAIL_VALIDATION)}
          />
        </div>
        <small className="text-muted ">Ex: anasabdo704@gmail.com</small>
        {errors.email && (
          <small className="text-danger ">{errors.email.message}</small>
        )}
        <div className="input-group mt-4">
          <span className="input-group-text " id="basic-addon1">
            <i className="bi bi-lock"></i>
          </span>
          <input
            type="password"
            className="form-control "
            placeholder="Enter your password"
            aria-label="password"
            aria-describedby="basic-addon1"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <>
            <small className="text-danger ">{errors.password.message}</small>
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
        <small className="text-muted">Ex password: Anas@123</small>
        <div className="links d-flex justify-content-between mt-4  ">
          <Link
            className=" text-secondary fw-bold text-decoration-none fw-medium"
            to="/register"
          >
            Register Now?
          </Link>
          <Link
            className="text-success text-decoration-none "
            to="/forget-password"
          >
            Forgot Password?
          </Link>
        </div>
        <button
          disabled={isSubmitting}
          className="btn btn-lg w-100 bg-success text-white mt-4 "
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin-pulse"></i>
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </>
  );
}
