/* eslint-disable react/no-unknown-property */
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Envelope, PasswordLock } from "../../components/Icons/Icons";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const handleChange = (e) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
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
        const decodedData = jwtDecode(response.data?.token);
        localStorage.setItem('user-details', JSON.stringify(decodedData));
        dispatch({ type: "LOGGED-IN-USER", payload: decodedData });
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
              <img src="/vidyalogo2.png" alt="..." />
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
      </div>
    </>
  );
}

export default Login;
