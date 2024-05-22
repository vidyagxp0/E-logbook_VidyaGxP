import React, { useEffect, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddNewUser() {
  const [roleGroups, setRoleGroups] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    password: "",
    rolesArray: [],
  });

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, rolesArray: selectedOptions }));
  }, [selectedOptions]);

  useEffect(() => {
    const url = "http://localhost:1000/user/get-all-rolegroups";
    axios
      .get(url)
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

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "password") {
      if (value.length < 8 || value.length > 25) {
        setError("Password must be between 8 and 25 characters long.");
      } else {
        setError("");
      }
    } else if (name === "age") {
      const age = Number(value);
      if (!Number.isInteger(age) || age <= 0) {
        setError("Age must be a positive whole number.");
        return;
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password.length < 8 || formData.password.length > 25) {
      setError("Age should be a whole number");
      return;
    }
    const myHeaders = {
      Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
      "Content-Type": "application/json",
    };

    axios
      .post("http://localhost:1000/user/add-user", formData, {
        headers: myHeaders,
      })
      .then((response) => {
        toast.success("User added successfully");
        navigate(-1);
      })
      .catch((error) => {
        toast.error("Couldn't add user");
      });
    setFormData({
      name: "",
      email: "",
      age: "",
      gender: "",
      password: "",
      rolesArray: [],
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
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-page">
          <form onSubmit={handleSubmit} style={{}}>
            <h2 style={{ textAlign: "center", color: "#EFA035" }}>
              <strong>Add User</strong>
            </h2>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="name" style={{ color: "#EFA035" }}>
                Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
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
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label style={{ color: "#EFA035" }}>Age:</label>
              <input
                type="number"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleInputChange}
                min={0}
              />
              {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="gender" style={{ color: "#EFA035" }}>
                Gender:
              </label>
              {/* <input
                type="text"
                
              /> */}
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                style={{ color: "#EFA035" }}
              >
                <option>--select--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="password" style={{ color: "#EFA035" }}>
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="roles" style={{ color: "#EFA035" }}>
                Roles:
              </label>
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
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddNewUser;
