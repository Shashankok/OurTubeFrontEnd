import { FaHome, FaVideo, FaFire } from "react-icons/fa";
import { PiVideoFill } from "react-icons/pi";
import { RiLogoutBoxFill } from "react-icons/ri";

import { Link } from "react-router-dom";

import "./miniSideNav.css";
import { useDispatch } from "react-redux";
import { logOut } from "../store/auth-slice/authSlice";

function MiniSideNav() {
  const dispatch = useDispatch();
  return (
    <aside className="miniSidenav">
      <Link to="/home" className="miniSidenav__item">
        <FaHome />
        <span className="miniSidenav__label">Home</span>
      </Link>
      <Link className="miniSidenav__item">
        <FaFire />
        <span className="miniSidenav__label">Trending</span>
      </Link>
      <Link className="miniSidenav__item">
        <PiVideoFill />
        <span className="miniSidenav__label">Subscriptions</span>
      </Link>
      <Link className="miniSidenav__item">
        <FaVideo />
        <span className="miniSidenav__label">My Videos</span>
      </Link>
      <Link className="miniSidenav__item" onClick={() => dispatch(logOut())}>
        <RiLogoutBoxFill />
        <span className="miniSidenav__label">Logout</span>
      </Link>
    </aside>
  );
}

export default MiniSideNav;
