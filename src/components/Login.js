import { useState } from "react";
import "./login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logIn } from "../store/auth-slice/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, formData)
      .then((res) => {
        console.log(res.data);
        toast.success("Logged In Successfully");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data._id);
        localStorage.setItem("channelName", res.data.channelName);
        localStorage.setItem("logoUrl", res.data.logoUrl);
        setIsLoading(false);
        dispatch(logIn());
        navigate("/home");
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.error);
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="container">
        <div className="main-heading">
          <Link to="/home" className="link-inline">
            <img src="Logo-Ourtube.svg" alt="Logo" className="logo-image" />
            <h1 className="heading-text">OurTube</h1>
          </Link>
        </div>
        <div>
          <form className="login-form-container" onSubmit={submitHandler}>
            <h1 className="form-heading">Login</h1>
            <input
              required
              type="email"
              className="email"
              placeholder="Enter Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              required
              type="password"
              className="password"
              placeholder="Enter Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              ) : (
                "Login"
              )}
            </button>
            <p className="sign-in">
              Do not have an account?{" "}
              <Link to="/signup" className="link">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
