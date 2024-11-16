import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import React from "react";

function EditUser() {
  const [roleGroups, setRoleGroups] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    profile_pic: "",
    rolesArray: [],
  });

  useEffect(() => {
    axios
      .get(`http://localhost:1000/user/get-a-user/${location.state.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      })
      .then((response) => {
        setUserInfo(response.data);
        setSelectedOptions(response.data.roles || []);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://localhost:1000/user/get-all-rolegroups")
      .then((response) => {
        setRoleGroups(response.data.response || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [location.state.id]);

  useEffect(() => {
    setFormData({
      name: userInfo.name || "",
      email: userInfo.email || "",
      age: userInfo.age || "",
      gender: userInfo.gender || "",
      profile_pic: userInfo.profile_pic || "",
      rolesArray: selectedOptions,
    });
  }, [userInfo, selectedOptions]);

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
    setFormData((prevData) => ({ ...prevData, rolesArray: selectedOptions }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_pic: e.target.files[0] });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let resultObj = filterObject(formData);

    const myHeaders = {
      Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
      "Content-Type": "multipart/form-data",
    };

    axios
      .put(
        `http://localhost:1000/user/edit-user/${location.state.id}`,
        resultObj,
        {
          headers: myHeaders,
        }
      )
      .then(() => {
        toast.success("User Details Updated Successfully");
        navigate(-1);
      })
      .catch((error) => {
        toast.error(
          "Couldn't Update User Details " + error.response.data.message
        );
      });
  };

  return (
    <div id="main-form-container">
      <div id="config-form-document-page" className="p-2 shadow-2xl">
        <form onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center" }}>
            <div className="sub-head"> Edit User</div>
          </h2>
          <div className="group-input">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
              value={formData.name}
            />
          </div>
          <div className="group-input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </div>
          <div className="group-input">
            <label>Age</label>
            <input
              type="number"
              name="age"
              id="age"
              onChange={handleInputChange}
              value={formData.age}
              min={0}
            />
          </div>
          <div className="group-input">
            <label htmlFor="gender">Gender</label>
            <select
              name="gender"
              id="gender"
              onChange={handleInputChange}
              value={formData.gender}
            >
              <option>--select--</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="group-input">
            <label htmlFor="profilePic">Profile Picture</label>
            <input
              type="file"
              name="profile_pic"
              id="profile_pic"
              onChange={handleFileChange}
            />
            {formData.profile_pic && (
              <div>
                <h3>
                  Selected File:{" "}
                  <a
                    href={formData.profile_pic}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View File
                  </a>
                </h3>
              </div>
            )}
          </div>
          <div className="group-input">
            <label htmlFor="roles">Roles</label>
            {options.length > 0 ? (
              <Select
                name="selectedRoles"
                onChange={handleChange}
                options={options}
                value={selectedOptions}
                isMulti
              />
            ) : (
              <p>Loading roles...</p>
            )}
          </div>
          <div className="button-container">
            <button className="edit-button" type="submit">
              Edit User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
