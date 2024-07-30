import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";

function EditUser() {
  const [roleGroups, setRoleGroups] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize form data state
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
        setRoleGroups(response.data.response || []); // Ensure it's an array
      })
      .catch((error) => {
        console.error(error);
      });
  }, [location.state.id]); // Added location.state.id as a dependency

  useEffect(() => {
    // Initialize form data only when userInfo or selectedOptions is updated
    setFormData({
      name: userInfo.name || "",
      email: userInfo.email || "",
      age: userInfo.age || "",
      gender: userInfo.gender || "",
      profile_pic: userInfo.profile_pic || "",
      rolesArray: selectedOptions,
    });
  }, [userInfo]);

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
    // Optionally, you can update the formData here as well
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
        `https://elogbookapi.vidyagxp.com/user/edit-user/${location.state.id}`,
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

  console.log(formData);

  const buttonStyle = {
    backgroundColor: "#EFA",
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
              <div className="sub-head"> Edit User</div>
            </h2>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="name" style={{ color: "black" }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                // value={userInfo.name}
                onChange={handleInputChange}
                value={formData.name}
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="email" style={{ color: "black" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                // value={userInfo.email}
                onChange={handleInputChange}
                value={formData.email}
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label style={{ color: "black" }}>Age</label>
              <input
                type="number"
                name="age"
                id="age"
                onChange={handleInputChange}
                value={formData.age}
                min={0}
              />
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="gender" style={{ color: "black" }}>
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                // value={userInfo.gender}
                onChange={handleInputChange}
                value={formData.gender}
              >
                <option>--select--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="profilePic" style={{ color: "black" }}>
                Profile Picture
              </label>
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
              {/* {file && <p>Selected File: {file.name}</p>} */}
            </div>
            <div className="group-input" style={{ margin: "15px" }}>
              <label htmlFor="roles" style={{ color: "black" }}>
                Roles
              </label>

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
            <div style={buttonContainerStyle}>
              <button className="edit-button" type="submit" style={buttonStyle}>
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
