import { CiSearch } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import "./header.css";
import { RiVideoAddLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem("logoUrl"));
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  useEffect(() => {
    setLogoUrl(localStorage.getItem("logoUrl")); // Update logo URL on mount
  }, [isLoggedIn]); // React to login/logout changes

  return (
    <header className="header">
      <div className="header__left">
        <RxHamburgerMenu className="header__icon" />
        <Link to="/home">
          <img
            className="header__logo"
            src="/YouTube_Logo.svg"
            alt="YouTube Logo"
          />
        </Link>
      </div>
      <form className="header__center" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          placeholder="Search"
          className="header__searchInput"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="header__searchButton">
          <CiSearch className="search-icon" />
        </button>
      </form>
      {isLoggedIn ? (
        <div className="header__right">
          <Link to="/upload" className="links">
            <RiVideoAddLine className="header__icon upload-video-icon" />
          </Link>
          <Link to={`/account/${localStorage.getItem("userId")}`}>
            <img
              src={logoUrl}
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
