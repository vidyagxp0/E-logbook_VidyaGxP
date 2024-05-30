import { Envelope, PasswordLock } from "../../../components/Icons/Icons";
import "../../../default.css";
import "./AdminLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:1000/user/admin-login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navigate("/admin-dashboard");
        toast.success("Login Successful");
        localStorage.setItem("admin-token", response.data.token);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  };

  return (
    <>
      <div id="admin-console-login-page">
        <div className="login-form-block" style={{ marginLeft: "13%" }}>
          <div className="top-block">
            <div className="logo">
              <img src="/vidyagxplogo.png" alt="..." />
            </div>
            <div className="head">Welcome to Admin Console</div>
          </div>
          <form>
            <div className="group-input">
              <label>{Envelope(20, "#EB7F00")}</label>
              <input
                type="text"
                placeholder="Enter Your User ID"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="group-input ">
              <label>{PasswordLock(20, "#EB7F00")}</label>
              <input
                type="password"
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="submit-btn" onClick={handleSubmit}>
                Login
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
