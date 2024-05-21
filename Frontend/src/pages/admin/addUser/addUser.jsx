import React, { useEffect, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



function AddNewUser() {


  const [roleGroups, setRoleGroups] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
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
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const myHeaders = {
      Authorization:
        `Bearer ${localStorage.getItem("admin-token")}`,
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

  return (
    <>
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-page">
          <form onSubmit={handleSubmit} style={{}}>
            <h2 style={{ textAlign: "center" }}>
              <strong>Add User</strong>
            </h2>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="name">Name:</label>
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
              <label htmlFor="email">Email:</label>
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
              <label>Age:</label>
              <input
                type="number"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="gender">Gender:</label>
              {/* <input
                type="text"
                
              /> */}
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option>--select--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="roles">Roles:</label>
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
            <button type="submit">Add User</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddNewUser;
