
import { Link, useNavigate } from "react-router-dom";
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
      <h1 className="account-title">Welcome back</h1>
      <p>Sign in to browse the full collection and save your favourites.</p>
      <form className="kitchen-form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" autoComplete="email" required {...register("email", EMAIL_VALIDATION)} />
        {errors.email && <small role="alert">{errors.email.message}</small>}
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" autoComplete="current-password" required {...register("password")} />
        <Link to="/forget-password">Forgot password?</Link>
        <button className="kitchen-button" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Log in"}</button>
      </form>
      <div className="account-links"><Link to="/register">Create an account</Link><Link to="/guest">Continue as guest</Link></div>
    </>
  );
}
