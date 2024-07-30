import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";

function DuplicateUser() {
  const [roleGroups, setRoleGroups] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    password: "",
    rolesArray: [],
  });

  useEffect(() => {
    axios
      .get(`https://elogbookapi.vidyagxp.com/user/get-a-user/${location.state.id}`, {
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
      .get("https://elogbookapi.vidyagxp.com/user/get-all-rolegroups")
      .then((response) => {
        setRoleGroups(response.data.response || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [location.state.id]);

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      age: userInfo.age || "",
      gender: userInfo.gender || "",
      rolesArray: selectedOptions,
    });
  }, [userInfo, selectedOptions]);

  const options = roleGroups.map((role) => ({
    label: role.roleGroup,
    value: role.roleGroup_id,
  }));

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    setFormData((prevData) => ({ ...prevData, rolesArray: selectedOptions }));
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
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password.length < 8 || formData.password.length > 25) {
      setError("Password must be between 8 and 25 characters long.");
      return;
    }
    const myHeaders = {
      Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
      "Content-Type": "application/json",
    };

    axios
      .post("https://elogbookapi.vidyagxp.com/user/add-user", formData, {
        headers: myHeaders,
      })
      .then(() => {
        toast.success("Duplicated User successfully!!");
        navigate(-1);
      })
      .catch((error) => {
        toast.error("Couldn't duplicate user! " + error.response.data.message);
      });
  };

  return (
    <div id="main-form-container">
      <div id="config-form-document-page" className="p-2 shadow-2xl">
        <form onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center" }}>
            <div className="sub-head"> Duplicate User</div>
          </h2>
          <div className="group-input">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required={true}
              onChange={handleInputChange}
            />
          </div>
          <div className="group-input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required={true}
              onChange={handleInputChange}
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
              readOnly
            />
          </div>
          <div className="group-input">
            <label htmlFor="gender">Gender</label>
            <select
              name="gender"
              id="gender"
              onChange={handleInputChange}
              value={formData.gender}
              disabled
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
            {error && <div style={{ color: "red" }}>{error}</div>}
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
                isDisabled
              />
            ) : (
              <p>Loading roles...</p>
            )}
          </div>
          <div className="button-container">
            <button className="submit-button" type="submit">
              Duplicate User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DuplicateUser;
