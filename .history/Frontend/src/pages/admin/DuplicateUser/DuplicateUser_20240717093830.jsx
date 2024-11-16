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

  // Initialize form data state
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
        setRoleGroups(response.data.response || []); // Ensure it's an array
      })
      .catch((error) => {
        console.error(error);
      });
  }, [location.state.id]); // Added location.state.id as a dependency

  useEffect(() => {
    // Initialize form data only when userInfo or selectedOptions is updated
    setFormData({
      name: "",
      email: "",
      password: "",
      age: userInfo.age || "",
      gender: userInfo.gender || "",
      rolesArray: selectedOptions,
    });
  }, [userInfo]);

  const options = roleGroups.map((role) => ({
    label: role.roleGroup,
    value: role.roleGroup_id,
  }));

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    // Optionally, you can update the formData here as well
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
      .post("http://localhost:1000/user/add-user", formData, {
        headers: myHeaders,
      })
      .then(() => {
        toast.success("Dupliacted User successfully!!");
        navigate(-1);
      })
      .catch((error) => {
        toast.error("Couldn't duplicate user! " + error.response.data.message);
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
      {/* <AdminHeaderTop /> */}
      <div id="main-form-container">
        <div id="config-form-document-page " className=" p-2 shadow-2xl">
          <form onSubmit={handleSubmit} style={{}}>
            <h2 style={{ textAlign: "center" }}>
              <div className="sub-head"> Duplicate User</div>
            </h2>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="name" style={{ color: "#EFA035" }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required={true}
                onChange={handleInputChange}
                // value={formData.name}
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="email" style={{ color: "#EFA035" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required={true}
                onChange={handleInputChange}
                // value={formData.email}
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label style={{ color: "#EFA035" }}>Age</label>
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
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="gender" style={{ color: "#EFA035" }}>
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                // value={userInfo.gender}
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
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="password" style={{ color: "#EFA035" }}>
                Password
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
                Roles
              </label>

              {options.length > 0 ? (
                <Select
                  name="selectedRoles"
                  onChange={handleChange}
                  options={options}
                  value={selectedOptions}
                  isMulti
                  isDisabled={true}
                />
              ) : (
                <p>Loading roles...</p>
              )}
            </div>
            <div style={buttonContainerStyle}>
              <button type="submit" style={buttonStyle}>
                Duplicate User
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DuplicateUser;
