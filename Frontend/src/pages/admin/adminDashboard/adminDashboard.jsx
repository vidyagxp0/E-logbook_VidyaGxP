import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../../components/sidebar/sidebar";
import "./AdminDashboard.css";
import AdminHeaderTop from "../../../components/Header/AdminHeader";

function AdminDashboard() {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [permissions, setPermissions] = useState([]);

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

  const openConfirmation = (user) => {
    setSelectedUser(user);
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setSelectedUser(null);
  };

  const handleDelete = () => {
    const config = {
      method: "delete",
      url: `http://localhost:1000/user/delete-user/${selectedUser.user_id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
      },
    };
    axios(config)
      .then((response) => {
        toast.success("User Delete Successfully");
        setAllUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_id !== selectedUser.user_id)
        );
      })
      .catch((error) => {
        toast.error("Couldn't delete User");
      });
    closeConfirmation();
  };

  const openPermissionsModal = (user) => {
    const token = localStorage.getItem("admin-token");
    axios
      .get(`http://localhost:1000/user/get-user-permissions/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setPermissions(response.data.message);
        setSelectedUser(user);
        setShowPermissionsModal(true);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't fetch permissions");
      });
  };

  const closePermissionsModal = () => {
    setShowPermissionsModal(false);
    setPermissions([]);
    setSelectedUser(null);
  };

  return (
    <>
      <AdminHeaderTop />
      <div className="admin-dashboard">
        <Sidebar /> {/* Include the Sidebar component */}
        <div className="main-content">
          <div className="Header_Bottom">
            <div className="headerBottomInner">
              <div className="headerBottomLft">
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
          <div id="body-container" style={{ margin: "20px" }}>
            <h3 style={{ textAlign: "center" }}>
              <strong>Users</strong>
            </h3>
            <br></br>
            <hr />
            {allUsers.length === 0 ? (
              <>No Registered Users</>
            ) : (
              allUsers.map((user) => (
                <div key={user.id}>
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
                        onClick={() => openPermissionsModal(user)}
                      >
                        View Permissions
                      </button>
                      <button
                        style={{
                          margin: "0 5px",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          border: "1px solid",
                        }}
                        onClick={() =>
                          navigate(`/admin-edit-user`, {
                            state: { id: user.user_id },
                          })
                        }
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
                        onClick={() => openConfirmation(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.1)",
            zIndex: "1000",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Confirm Deletion</h2>
          <p>Are you sure you want to delete {selectedUser?.name}?</p>
          <div style={{ textAlign: "center", alignItems: "center" }}>
            <button
              onClick={handleDelete}
              style={{
                margin: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid",
              }}
            >
              Confirm
            </button>
            <button
              onClick={closeConfirmation}
              style={{
                margin: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showPermissionsModal && (
        <div
          style={{
            position: "fixed",
            backgroundColor: "#EFA035",
            color: "white",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.1)",
            zIndex: "1000",
            width: "500px", // Fixed width
            height: "250px", // Fixed height
            overflowY: "scroll", // Enable vertical scrolling
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            Permissions for {selectedUser?.name}
          </h2>
          <hr style={{margin: '8px'}}></hr>
          <ul style={{ padding: "0 20px" }}>
            {permissions?.length > 0 ? (
              permissions?.map((permission) => (
                <li key={permission?.id}>{permission.RoleGroup.roleGroup}</li>
              ))
            ) : (
              <li>No permissions found</li>
            )}
          </ul>
          <div style={{ textAlign: "center", alignItems: "center" }}>
            <button
              onClick={closePermissionsModal}
              style={{
                margin: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
