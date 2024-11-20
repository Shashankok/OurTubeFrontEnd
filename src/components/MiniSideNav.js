import { FaHome } from "react-icons/fa";
import { RiLogoutBoxFill, RiAccountCircleFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

import "./miniSideNav.css";
import { useDispatch } from "react-redux";
import { logOut } from "../store/auth-slice/authSlice";
import { toast } from "react-toastify";

function MiniSideNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    const userId = localStorage.getItem("userId");

    // Check if user is not logged in
    if (!userId) {
      // Show error toast
      toast.error("Please Login to view your account details!");

      // Delay the navigation by 2 seconds to the login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      // If user is logged in, navigate to the account page
      navigate(`/account/${userId}`);
    }
  };

  return (
    <aside className="miniSidenav">
      <Link to="/home" className="miniSidenav__item">
        <FaHome />
        <span className="miniSidenav__label">Home</span>
      </Link>
      <div onClick={handleAccountClick} className="miniSidenav__item">
        <RiAccountCircleFill />
        <span className="miniSidenav__label">My Account</span>
      </div>
      <Link className="miniSidenav__item" onClick={() => dispatch(logOut())}>
        <RiLogoutBoxFill />
        <span className="miniSidenav__label">Logout</span>
      </Link>
    </aside>
  );
}

export default MiniSideNav;
