import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import "./HeaderTop.css";

function HeaderTop() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Logic for logging out
    navigate("/");
  };
  return (
    <>
      <div id="Header_Top" className="Header_Top">
        <div className="header_inner">
          <div className="left">
            <div className="logo">
              {/* <img src="/logo1.png" alt="..." /> */}
              <img src="/new-logo.png" alt="..." />
            </div>
          </div>
          <div className="center">
            <div className="inputContainer">
              <div className="inputInnerLeft">
                <i className="ri-search-line"></i>
              </div>
              <div className="inputInnerRight flex flex-row">
                <input type="search" />
                <button className="btn btn-secondary" style={{ width: "30%", marginLeft: "20%", padding: "3%" }}>
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="bellLeft">
              <i className="ri-notification-3-fill"></i>
            </div>

            <div class="drop-container">
              <div class="drop-btn name-btn">
                <div className="profile-img">
                  <img src="amit_guru.jpg" alt="" />
                </div>
              </div>
              <div className="drop-list">
                <div className="image">
                  <img src="amit_guru.jpg" alt="..." />
                  <div className="manager-name">Mr.Amit Guru</div>
                </div>
                {/* <div className="drop-item" onclick="openModal('user-setting-modal')">Settings</div>
                <div className="drop-item" onclick="openModal('about-modal')">About</div> */}
                <Link to="#" className="drop-item">
                  {" "}
                  <i className="ri-settings-2-line"></i> Settings
                </Link>
                <Link to="#" className="drop-item">
                  <i className="ri-global-line"></i>About
                </Link>
                <Link to="#" className="drop-item">
                  <i className="ri-hand-heart-line"></i>Help
                </Link>
                <Link to="#" className="drop-item">
                  <i className="ri-customer-service-2-line"></i>
                  Helpdesk Personnel
                </Link>
                <Link to="/" className="drop-item">
                  <i className="ri-logout-circle-line"></i>Logout
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderTop;
