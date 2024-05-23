import React, { useEffect, useState } from "react";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import AdminHeaderTop from "../../../components/Header/AdminHeader";

function EditUser() {
  const [roleGroups, setRoleGroups] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: userInfo?.name,
    email: userInfo?.email,
    age: userInfo?.age,
    gender: userInfo?.gender,
    rolesArray: [],
  });

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, rolesArray: selectedOptions }));
  }, [selectedOptions]);

  useEffect(() => {
    axios
      .get(`http://localhost:1000/user/get-a-user/${location.state.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      })
      .then((response) => {
        setUserInfo(response.data.response);
      });
    axios
      .get("http://localhost:1000/user/get-all-rolegroups")
      .then((response) => {
        setRoleGroups(response.data.response || []); // Ensure it's an array
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const options = roleGroups.map((role) => ({
    label: role.roleGroup,
    value: role.roleGroup_id,
  }));

  function filterObject(obj) {
    const result = {};

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        result[key] = value;
      }
    });

    return result;
  }

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let resultObj = filterObject(formData);
    console.log(formData, ">>>>>>>>>>>>>", resultObj);

    const config = {
      method: "put",
      url: `http://localhost:1000/user/edit-user/${location.state.id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        "Content-Type": "application/json",
      },
      data: resultObj,
    };

    axios(config)
      .then((response) => {
        toast.success("User Details Updated Successfully")
        navigate(-1);
      })
      .catch((error) => {
        toast.error("Couldn't Update User Details")
      });
  };

  const buttonStyle = {
    backgroundColor: "#EFA035",
    color: "white", // White text
    padding: "10px 20px", // Padding
    textAlign: "center", // Centered text
    textDecoration: "none", // No underline
    display: "inline-block", // Inline block
    fontSize: "16px", // Font size
    margin: "4px 2px", // Margin
    cursor: "pointer", // Pointer cursor
    border: "none", // No border
    borderRadius: "5px", // Rounded corners
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center", // Center horizontally
    marginTop: "20px", // Margin on top
  };

  return (
    <>
      <AdminHeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-page">
          <form onSubmit={handleSubmit} style={{}}>
            <h2 style={{ textAlign: "center", color: "#EFA035" }}>
              <strong>Edit User</strong>
            </h2>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="name" style={{ color: "#EFA035" }}>
                Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                // value={userInfo.name}
                onChange={handleInputChange}
                defaultValue={userInfo.name}
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="email" style={{ color: "#EFA035" }}>
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                // value={userInfo.email}
                onChange={handleInputChange}
                defaultValue={userInfo.email}
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label style={{ color: "#EFA035" }}>Age:</label>
              <input
                type="number"
                name="age"
                id="age"
                // value={userInfo.age}
                defaultValue={userInfo.age}
                onChange={handleInputChange}
                min={0}
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="gender" style={{ color: "#EFA035" }}>
                Gender:
              </label>
              <select
                name="gender"
                id="gender"
                // value={userInfo.gender}
                onChange={handleInputChange}
                defaultValue={userInfo.gender}
              >
                <option>--select--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="roles" style={{ color: "#EFA035" }}>
                Roles:
              </label>
              <div style={{ color: "#9b9696", margin: "8px" }}>
                Selected roles will replace the previous roles.
              </div>
              {options.length > 0 ? (
                <MultiSelect
                  name="selectedRoles"
                  onChange={handleChange}
                  options={options}
                  value={selectedOptions}
                />
              ) : (
                <p>Loading roles...</p>
              )}
            </div>
            <div style={buttonContainerStyle}>
              <button type="submit" style={buttonStyle}>
                Edit User
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditUser;
