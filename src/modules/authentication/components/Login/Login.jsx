import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { axiosInstance, USERS_URL } from "../../../../services/urls/urls";
export default function Login({ saveLoginData }) {
  let navigate = useNavigate();
  let {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      let response = await axiosInstance.post(USERS_URL.LOGIN, data);
      localStorage.setItem("token", response.data.token);
      toast.success("login success!");
      saveLoginData();
      navigate("/dashboard");
      // console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
            type="text"
            className="form-control"
            placeholder="Enter your E-mail"
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
        <small className="text-muted">Ex: anasabdo704@gmail.com</small>
        <div className="input-group mt-4">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-lock"></i>
          </span>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
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
        <small className="text-muted">Ex password: Anas@123</small>
        <div className="links d-flex justify-content-between mt-2  ">
          <Link
            className="text-decoration-none text-dark fw-medium"
            to="/register"
          >
            Register Now?
          </Link>
          <Link className="text-success text-decoration-none " to="/forgetpass">
            Forgot Password?
          </Link>
        </div>
        <button className="btn btn-lg w-100 bg-success text-white mt-4 ">
          Login
        </button>
      </form>
    </>
  );
}
