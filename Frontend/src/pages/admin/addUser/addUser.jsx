import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AddUser.css";
import Select from "react-select";

function AddNewUser() {
  const [roleGroups, setRoleGroups] = useState([]);
  const [roleGroups2, setRoleGroups2] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptions2, setSelectedOptions2] = useState([]);
  const [error, setError] = useState("");
  const [AgeError, setAgeError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    password: "",
    profile_pic: "",
    rolesArray: [],
    rolesArray2: [],
  });

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, rolesArray: selectedOptions }));
  }, [selectedOptions]);

  useEffect(() => {
    const url =
      "http://localhost:1000/user/get-all-rolegroups";
    axios
      .get(url)
      .then((response) => {
        setRoleGroups(response.data.response || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, rolesArray2: selectedOptions2 }));
  }, [selectedOptions2]);

  useEffect(() => {
    const url =
      "https://elog-backend.mydemosoftware.com//user/get-all-effective-roles";
    axios
      .get(url)
      .then((response) => {
        setRoleGroups2(response.data.response || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const options = [
    { label: "Select All", value: "all" },
    ...roleGroups.map((role) => ({
      label: role.roleGroup,
      value: role.roleGroup_id,
    })),
  ];
  const options2 = [
    { label: "Select All", value: "all" },
    ...roleGroups2.map((role) => ({
      label: role.roleGroup,
      value: role.roleGroup_id,
    })),
  ];

  const handleChange = (selectedOptions) => {
    if (
      selectedOptions &&
      selectedOptions.length &&
      selectedOptions[selectedOptions.length - 1].value === "all"
    ) {
      setSelectedOptions(options.slice(1));
    } else {
      setSelectedOptions(selectedOptions);
    }
  };
  const handleChange2 = (selectedOptions2) => {
    if (
      selectedOptions2 &&
      selectedOptions2.length &&
      selectedOptions2[selectedOptions2.length - 1].value === "all"
    ) {
      setSelectedOptions2(options2.slice(1));
    } else {
      setSelectedOptions2(selectedOptions2);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_pic: e.target.files[0] });
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
        setAgeError("Age must be a positive whole number.");
        return;
      } else {
        setAgeError("");
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password.length < 8 || formData.password.length > 25) {
      setAgeError("Age should be a whole number");
      return;
    }
    const myHeaders = {
      Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
      "Content-Type": "multipart/form-data",
    };

    axios
      .post(
        "https://elog-backend.mydemosoftware.com//user/add-user",
        formData,
        {
          headers: myHeaders,
        }
      )
      .then(() => {
        toast.success("User added successfully");
        navigate(-1);
      })
      .catch((error) => {
        toast.error("Couldn't add user! " + error.response.data.message);
      });
    setFormData({
      name: "",
      email: "",
      age: "",
      gender: "",
      password: "",
      profile_pic: "",
      rolesArray: [],
    });
  };

  return (
    <div id="main-form-container">
      <div id="config-form-document-page">
        <form className="p-3" onSubmit={handleSubmit}>
          <h2 className="add-heading">Add User</h2>
          <div className="group-input">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="group-input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="group-input">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              name="age"
              id="age"
              value={formData.age}
              onChange={handleInputChange}
              min={0}
            />
            {AgeError && <div className="error">{AgeError}</div>}
          </div>
          <div className="group-input">
            <label htmlFor="gender">Gender</label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              defaultValue={formData.gender}
              onChange={handleInputChange}
            >
              <option>--select--</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="group-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {error && <div className="error">{error}</div>}
          </div>
          <div className="group-input">
            <label htmlFor="profilePic">Profile Picture</label>
            <input
              type="file"
              name="profile_pic"
              id="profile_pic"
              onChange={handleFileChange}
            />
          </div>
          <div className="group-input">
            <label htmlFor="roles">Roles</label>
            <Select
              name="selectedRoles"
              onChange={handleChange}
              options={options}
              value={selectedOptions}
              isMulti
            />
          </div>
          <div className="group-input">
            <label htmlFor="roles">Effective Roles</label>
            <Select
              name="selectedRoles"
              onChange={handleChange2}
              options={options2}
              value={selectedOptions2}
              isMulti
            />
          </div>
          <button className="submit-button" type="submit">
            Add User
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNewUser;
