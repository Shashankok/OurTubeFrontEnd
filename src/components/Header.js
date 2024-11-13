import { CiSearch } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import "./header.css";
import { RiVideoAddLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <header className="header">
      <div className="header__left">
        <RxHamburgerMenu className="header__icon" />
        <img
          className="header__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
          alt="YouTube Logo"
        />
      </div>
      <div className="header__center">
        <input
          type="text"
          placeholder="Search"
          className="header__searchInput"
        />
        <button className="header__searchButton">
          <CiSearch className="search-icon" />
        </button>
      </div>
      {isLoggedIn ? (
        <div className="header__right">
          <Link to="/upload" className="links">
            <RiVideoAddLine className="header__icon upload-video-icon" />
          </Link>
          <Link to="/account">
            <img
              src={localStorage.getItem("logoUrl")}
              alt="logo"
              className="header__icon account-logo"
            />
          </Link>
        </div>
      ) : (
        <div className="header__right">
          <Link to="/login" className="account-login">
            <PiUserCircle className="header__icon account-login-icon" />
            <p className="account-login-text">Sign in</p>
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
