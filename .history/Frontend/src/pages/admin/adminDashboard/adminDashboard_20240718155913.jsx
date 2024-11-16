import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

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
      .then(() => {
        toast.success("User Delete Successfully");
        setAllUsers((prevUsers) =>
          prevUsers.filter((user) => user.user_id !== selectedUser.user_id)
        );
      })
      .catch(() => {
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
      <div className="admin-dashboard">
        <div className="main-content">
          <div className="Header_Bottom shadow-xl">
            <div
              className="headerBottomInner"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div className="headerBottomLft" style={{ marginRight: "auto" }}>
                <div
                  className="navItem"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <i
                    className="ri-home-3-fill"
                    style={{
                      marginRight: "10px",
                      fontSize: "24px",
                      // color: "#EFA035",
                    }}
                  ></i>
                  <h3 className="text-gray-800 font-bold">User Management</h3>
                </div>
              </div>
              <div
                className="headerBottomRgt"
                onClick={() => {
                  navigate("/admin-add-user");
                }}
              >
                <button
                  className="themeBtn"
                  style={{
                    backgroundColor: "#22f7f4",
                    color: "black",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
          <div id="body-container" className="p-2">
            <br></br>
            <hr />
            {allUsers.length === 0 ? (
              <>No Registered Users</>
            ) : (
              <table className="neumorphism-table">
                <thead>
                  <tr>
                    <th>Sno.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.user_id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          className="neumorphism-button view-permissions"
                          onClick={() => openPermissionsModal(user)}
                        >
                          View Permissions
                        </button>
                        <button
                          className="neumorphism-button edit"
                          onClick={() =>
                            navigate(`/admin-edit-user`, {
                              state: { id: user.user_id },
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="neumorphism-button delete"
                          onClick={() => openConfirmation(user)}
                        >
                          Delete
                        </button>
                        <button
                          className="neumorphism-button duplicate"
                          onClick={() =>
                            navigate(`/duplicate-user`, {
                              state: { id: user.user_id },
                            })
                          }
                        >
                          Duplicate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div className="confirmation-modal neumorphism-modal">
          <div className="neumorphism-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete {selectedUser?.name}?</p>
            <div className="modal-actions">
              <button
                onClick={handleDelete}
                className="neumorphism-button confirm"
              >
                Confirm
              </button>
              <button
                onClick={closeConfirmation}
                className="neumorphism-button cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPermissionsModal && (
        <div className="permissions-modal neumorphism-modal">
          <div className="neumorphism-content">
            <h2>Permissions for {selectedUser?.name}</h2>
            {permissions?.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>
                      {permissions.length > 1 ? "Permissions" : "Permission"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissions?.map((permission) => (
                    <tr key={permission?.id}>
                      <td>{permission.RoleGroup.roleGroup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No permissions found</p>
            )}
            <div className="modal-actions">
              <button
                onClick={closePermissionsModal}
                className="neumorphism-button close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
