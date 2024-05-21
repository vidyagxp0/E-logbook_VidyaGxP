import React, { useEffect, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    const url = "http://localhost:1000/user/get-all-users"; // Assuming the endpoint is corrected to "/user/get-all-users"
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Include Bearer prefix with the token
        },
      })
      .then((response) => {
        setAllUsers(response.data.response); // Access the response data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <HeaderTop />
      <>
        <div className="Header_Bottom">
          <div className="headerBottomInner">
            <div className="headerBottomLft" onClick={{}}>
              <div className="navItem">
                <i className="ri-home-3-fill"></i>
                <h3>User Management</h3>
              </div>
            </div>
            <div
              className="headerBottomRgt"
              onClick={() => {
                navigate("/admin-add-user");
              }}
            >
              <div className="themeBtn">Add User</div>
            </div>
          </div>
        </div>
      </>
      <div id="body-container" style={{ margin: "20px" }}>
        <h3 style={{ textAlign: "center" }}>
          <strong>Users</strong>
        </h3>
        <hr></hr>
        {allUsers?.map((user) => (
          <>
            <li
              style={{
                listStyle: "none",
                margin: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
              key={user.id}
            >
              <div>
                Name: {user.name} <br />
                Email: {user.email}
              </div>
              <div>
                <button
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border: "1px solid",
                  }}
                >
                  Edit
                </button>
                <button
                  style={{
                    margin: "0 5px",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border: "1px solid",
                  }}
                  onClick={() => {}}
                >
                  Delete
                </button>
              </div>
            </li>
          </>
        ))}
      </div>
    </>
  );
}

export default AdminDashboard;
