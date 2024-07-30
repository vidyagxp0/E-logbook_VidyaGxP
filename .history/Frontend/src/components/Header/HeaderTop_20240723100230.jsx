import { Link, useNavigate } from "react-router-dom";
import "./HeaderModern.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function HeaderTop() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);
  
  useEffect(() => {
    if (loggedInUser?.userId) {
      axios.get(`http://localhost:1000/user/get-a-user/${loggedInUser.userId}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [loggedInUser]);

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    localStorage.removeItem("admin-token");
    navigate("/");
  };

  return (
    <div id="header-top" className="header-top">
      <div className="header-inner">
        <div className="header-left">
          <div className="header-logo">
            <img
              onClick={() => navigate("/dashboard")}
              src="/vidyalogo2.png"
              alt="Logo"
            />
          </div>
        </div>
        <div className="header-center">
          <div className="search-container">
            <div className="search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#efa035"
                width="25"
                height="25"
              >
                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
              </svg>
            </div>
            <div className="search-input">
              <input type="search" placeholder="Search..." />
              <button className="search-button">Search</button>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="notification-icon">
            <i className="ri-notification-3-fill"></i>
          </div>
          <div className="profile-dropdown">
            <div className="profile-img" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img src={user?.profile_pic} alt="Profile" />
            </div>
            <div className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
              <div className="profile-header">
                <img src={user?.profile_pic} alt="Profile" />
                <div className="profile-name">{user?.name}</div>
              </div>
              <Link to="#" className="dropdown-item">
                <i className="ri-settings-2-line"></i> Settings
              </Link>
              <Link to="#" className="dropdown-item">
                <i className="ri-global-line"></i> About
              </Link>
              <Link to="#" className="dropdown-item">
                <i className="ri-hand-heart-line"></i> Help
              </Link>
              <Link to="#" className="dropdown-item">
                <i className="ri-customer-service-2-line"></i> Helpdesk Personnel
              </Link>
              <Link to="/" className="dropdown-item" onClick={handleLogout}>
                <i className="ri-logout-circle-line"></i> Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderTop;
