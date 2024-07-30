/* eslint-disable react/no-unknown-property */
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Envelope, PasswordLock } from "../../components/Icons/Icons";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: username,
      password: password,
    };

    axios
      .post("http://localhost:1000/user/user-login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        navigate("/dashboard");
        toast.success("Login Successful");
        localStorage.setItem("user-token", response.data.token);
        const decodedData = jwtDecode(response.data.token);
        localStorage.setItem("user-details", JSON.stringify(decodedData));
        dispatch({ type: "LOGGED-IN-USER", payload: decodedData });
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Login failed");
        console.error(error);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      handleSubmit(e);
    }
  };

  return (
    <>
      <div id="admin-console-login-page">
        <div className="login-form-block" style={{ marginLeft: "13%" }}>
          <div className="top-block">
            <div className="logo">
              <img src="https://connexo.io/assets/img/logo/logo.png" alt="..." />
            </div>
            <div className="head">Welcome to eLogBook</div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="group-input">
              <label>{Envelope(20, "#EB7F00")}</label>
              <input
                type="text"
                name="username"
                placeholder="Enter Your Username"
                onChange={handleChange}
                required
              />
            </div>
            <div className="group-input">
              <label>{PasswordLock(20, "#EB7F00")}</label>
              <input
                 type="password"
                name="password"
                placeholder="Enter Your Password"
                onChange={handleChange}
                required
              />
            </div>
          
            <div>
              <input type="submit" value="Login" className="submit-btn" />
            </div>
          </form>
        </div>
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div className="group-input">
            <label>{Envelope(20, "#EB7F00")}</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Your Username"
              value={username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="group-input">
            <label>{PasswordLock(20, "#EB7F00")}</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input type="submit" value="Login" className="submit-btn" />
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;