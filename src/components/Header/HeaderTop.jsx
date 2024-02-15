import { useNavigate } from "react-router-dom";
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
            <div className="profileRight">
              <img src="./amit_guru.jpg" alt="" />
            </div>

            <button
              className="btn btn-secondary"
              style={{ width: "30%", marginLeft: "20%", padding: "3%" }}
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderTop;
