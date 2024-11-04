import { useState } from "react";
import "./signup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Signup = () => {
  const [channelName, setChannelName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [logo, setLogo] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fileHandler = (e) => {
    setLogo(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    formData.append("channelName", channelName);
    formData.append("email", email);
    formData.append("phone", phoneNumber);
    formData.append("password", password);
    formData.append("logo", logo);

    axios
      .post("https://ourtube-fe6i.onrender.com/user/signup", formData)
      .then((res) => {
        toast("Account Created Successfully!");
        setIsLoading(false);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        toast.error(err.response.data.message);
      });
  };

  return (
    <>
      <div className="container">
        <div className="main-heading">
          <img src="Logo-Ourtube.svg" alt="Logo" className="logo-image" />
          <h1 className="heading-text">OurTube</h1>
        </div>
        <div>
          <form className="form-container" onSubmit={submitHandler}>
            <input
              required
              type="text"
              className="channelName"
              placeholder="Enter Channel Name"
              onChange={(e) => {
                setChannelName(e.target.value);
              }}
            />
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
            <input
              required
              type="phone"
              className="phone"
              placeholder="Enter Phone Number"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
            <input type="file" className="upload-file" onChange={fileHandler} />
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="preview-logo" />
            )}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              ) : (
                "Register"
              )}
            </button>
            <p className="sign-in">
              Already have an account?{" "}
              <Link to="/login" className="link">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
