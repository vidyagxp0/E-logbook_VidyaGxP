import React, { useEffect, useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import UserVerificationPopUp from "../../../components/UserVerificationPopUp/UserVerificationPopUp";
import { NoteAdd } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import TinyEditor from "../../../components/TinyEditor";

const DispensingOfMaterials = () => {
  const [User, setUser] = useState(null);
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [allTableData, setAllTableData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [approvers, setApprovers] = useState([]);
  const [reviewers, setReviewers] = useState([]);

  const location = useLocation();
  const [dispensingOfMaterials, setDispensingOfMaterials] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      site_id: location.state?.site_id,
      reviewer_id: 2,
      approver_id: 2,
      description: "",
      department: 1,
      review_comments: "",
      compression_area: "",
      limit: 1,
      initiatorComment: " ",
      // initiatorAttachment: null,
      // initiatorDeclaration: "",
      additionalInfo: "",
      additionalAttachment: null,
    }
  );
  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);

  const handleFileChange = (e) => {
    setDispensingOfMaterials({
      ...dispensingOfMaterials,
      additionalAttachment: e.target.files[0],
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      method: "post",
      url: "http://localhost:1000/differential-pressure/get-user-roleGroups",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
      data: {
        site_id: location.state?.site_id,
        role_id: 2,
        process_id: 1,
      },
    };

    axios(config)
      .then((response) => {
        setReviewers(response.data.message);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfig = {
      method: "post",
      url: "http://localhost:1000/differential-pressure/get-user-roleGroups",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
      data: {
        site_id: location.state?.site_id,
        role_id: 3,
        process_id: 1,
      },
    };

    axios(newConfig)
      .then((response) => {
        setApprovers(response.data.message);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      url: `http://localhost:1000/user/get-a-user/${loggedInUser?.userId}`, // Ensure you use the correct URL format including 'http://'
      headers: {}, // You can add any necessary headers here
    };

    axios(requestOptions)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      url: `http://localhost:1000/user/get-a-user/${loggedInUser?.userId}`, // Ensure you use the correct URL format including 'http://'
      headers: {}, // You can add any necessary headers here
    };

    axios(requestOptions)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handlePopupSubmit = (credentials) => {
    if (
      dispensingOfMaterials.site_id === null ||
      dispensingOfMaterials.approver_id === null ||
      dispensingOfMaterials.reviewer_id === null
    ) {
      toast.error(
        "Please select an approver and a reviewer before saving e-log!"
      );
      return;
    }

    if (dispensingOfMaterials.initiatorComment === "") {
      toast.error("Please provide an initiator comment!");
      return;
    }
    if (dispensingOfMaterials.description === "") {
      toast.error("Please provide a short description!");
      return;
    }
    // if (
    //   loadedQuantity?.FormRecordsArray?.some(
    //     (record) => record.differential_pressure === "" || record.remarks === ""
    //   )
    // ) {
    //   toast.error("Please provide grid details!");
    //   return;
    // }

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    dispensingOfMaterials.email = credentials?.email;
    dispensingOfMaterials.password = credentials?.password;
    dispensingOfMaterials.initiatorDeclaration = credentials?.declaration;

    axios
      .post(
        "http://localhost:1000/dispensing-material/post",
        dispensingOfMaterials,
        config
      )
      .then(() => {
        toast.success("eLog Saved Successfully!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("There was an error creating eLog:", error);
        toast.error("There was an error creating eLog");
      });
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setDispensingOfMaterials({ ...dispensingOfMaterials, [name]: value });
  };

  useEffect(() => {
    setDispensingOfMaterials({ FormRecordsArray: allTableData });
  }, [allTableData]);
  const object = getCurrentDateTime();
  let date = object.currentDate;
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(0);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const currentDate = `${year}/${month}/${day}`;
    return {
      currentDate: currentDate,
    };
  }
  const addRow = () => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    };

    const currentTime = new Date().toLocaleTimeString("en-us", options);
    const newRow = {
      unique_id: generateUniqueId(),
      time: currentTime,
      date: date,
      on_time_auh: "",
      on_time_laf: "",
      on_time_uv_light: "",
      on_time_done_by: "",
      name_of_material: "",
      control_no: "",
      dispensed_quantity: "",
      dispensed_by_qa: "",
      dispensed_by_store: "",
      off_time_auh: "",
      off_time_laf: "",
      off_time_uv_light: "",
      uv_burning: "",
      off_time_done_by: "",
      cleaning_done_by: "",
      weighing_balance_id: "",
      checked_by: User?.name,
      remark: "",
    };
    setAllTableData([...allTableData, newRow]);
  };

  const deleteRow = (index) => {
    const updatedData = [...allTableData];
    updatedData.splice(index, 1);
    setAllTableData(updatedData);
  };

  // const currentDate = new Date();
  // const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  const generateUniqueId = () => {
    return `UU0${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const setTinyContent = (content) => {
    setDispensingOfMaterials({
      description: content,
    });
  };
  return (
    <div>
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-pages" className="min-w-full">
          <div className="top-blocks">
            <div>
              <strong> Record Name:&nbsp;</strong>Dispensing Of Materials
            </div>
            <div>
              <strong> Site:&nbsp;</strong>
              {location.state?.site}
            </div>
            <div>
              <strong> Current Status:&nbsp;</strong>Under Initiation
            </div>
            <div>
              <strong> Initiated By:&nbsp;</strong>
              {User?.name}
            </div>
          </div>
          <div className="document-form">
            <div className="details-form-data">
              <div className="sop-type-header">
                <div className="logo">
                  <img src="/vidyalogo2.png" alt="..." />
                </div>
                <div className="main-head">
                  <div>VidyaGxP Private Limited</div>
                </div>
              </div>
              <div className="sub-head-2">Dispensing Of Materials</div>

              <div className="outerDiv4">
                <div className="btn-forms">
                  <div
                    className={`${
                      isSelectedGeneral === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false), setIsSelectedGeneral(true);
                    }}
                  >
                    General Information
                  </div>
                  <div
                    className={`${
                      isSelectedDetails === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(true), setIsSelectedGeneral(false);
                    }}
                  >
                    Details
                  </div>
                </div>
              </div>

              {isSelectedGeneral === true ? (
                <>
                  <div className="group-input">
                    <label className="color-label">Initiator</label>
                    <div>
                      <input
                        type="text"
                        value={User?.name}
                        onChange={(e) =>
                          setDispensingOfMaterials({
                            initiator: e.target.value,
                          })
                        }
                        disabled
                        style={{ backgroundColor: "#fafafa" }}
                        className="shadow-xl"
                      />
                    </div>
                  </div>

                  <div className="group-input">
                    <label className="color-label">Date of Initiation</label>
                    <div>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) =>
                          setDispensingOfMaterials({
                            dateOfInitiation: e.target.value,
                          })
                        }
                        disabled
                        style={{ backgroundColor: "#fafafa" }}
                        className="shadow-xl"
                      />
                    </div>
                  </div>

                  <div className="group-input">
                    <label className="color-label">
                      Description{" "}
                      <span className="required-asterisk text-red-500">*</span>
                    </label>
                    <div>
                      {/* <input
                        type="text"
                        value={dispensingOfMaterials.description}
                        onChange={(e) =>
                          setDispensingOfMaterials({
                            description: e.target.value,
                          })
                        }
                        required // HTML5 attribute to enforce field requirement
                      /> */}

                      <TinyEditor
                        editorContent={dispensingOfMaterials.description}
                        setEditorContent={setTinyContent}
                        tinyNo={1}
                      />
                    </div>
                  </div>

                  <div className="group-input">
                    <label className="color-label">Status</label>
                    <div>
                      <input
                        type="text"
                        value="Under Initiation"
                        onChange={(e) =>
                          setDispensingOfMaterials({ status: e.target.value })
                        }
                        disabled
                        style={{ backgroundColor: "#fafafa" }}
                        className="shadow-xl"
                      />
                    </div>
                  </div>
                </>
              ) : null}

              {isSelectedDetails === true ? (
                <>
                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label">
                        Reviewer
                        <span style={{ color: "red", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <div>
                        <select
                          value={dispensingOfMaterials.reviewer_id}
                          onChange={(e) => {
                            setDispensingOfMaterials({
                              reviewer_id: e.target.value,
                            });
                          }}
                        >
                          <option value="">Select a reviewer</option>
                          {[
                            ...new Map(
                              reviewers.map((reviewer) => [
                                reviewer.user_id,
                                reviewer,
                              ])
                            ).values(),
                          ].map((reviewer, index) => (
                            <option key={index} value={reviewer.user_id}>
                              {reviewer.User.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="group-input">
                      <label className="color-label">
                        Approver
                        <span style={{ color: "red", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <div>
                        <select
                          value={dispensingOfMaterials.approver_id}
                          onChange={(e) => {
                            setDispensingOfMaterials({
                              approver_id: e.target.value,
                            });
                          }}
                        >
                          <option value="">Select an approver</option>
                          {[
                            ...new Map(
                              approvers.map((approver) => [
                                approver.user_id,
                                approver,
                              ])
                            ).values(),
                          ].map((approver, index) => (
                            <option key={index} value={approver.user_id}>
                              {approver.User.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="AddRows d-flex">
                      <NoteAdd /*onClick={addRow}*/ />
                      <div className="addrowinstruction"></div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table>
                      <thead>
                        <tr>
                          <th rowSpan={3}>S no.</th>
                          <th rowSpan={3}>Unique Id</th>
                          <th rowSpan={3}>Date</th>
                          <th rowSpan={1} colSpan={3}>
                            ON TIME
                          </th>
                          <th rowSpan={3}>Done by</th>
                          <th rowSpan={3}>Name of Material</th>
                          <th rowSpan={3}>Control No.</th>
                          <th rowSpan={3}>Dispensed Quantity (Kg)</th>
                          <th rowSpan={1} colSpan={2}>
                            Dispensed By (Sign/Date)
                          </th>
                          <th rowSpan={1} colSpan={3}>
                            OFF TIME
                          </th>
                          <th rowSpan={3}>UV Burning Hrs</th>
                          <th rowSpan={3}>Done by</th>
                          <th rowSpan={3}>Cleaning done by</th>
                          <th rowSpan={3}>Checked by (Sign/Date)</th>
                          <th rowSpan={3}>Weighing Balance ID</th>
                          <th rowSpan={3}>Remark</th>

                          {/* <th style={{ width: "300px" }}>Supporting Documents</th> */}
                          <th rowSpan={3}>Actions</th>
                        </tr>
                        <tr>
                          <th>AHU</th>
                          <th>LAF</th>
                          <th>UV LIGHT</th>
                          <th>QA</th>
                          <th>STORE</th>
                          <th>AHU</th>
                          <th>LAF</th>
                          <th>UV LIGHT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTableData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.unique_id}</td>
                            {/* <td>
                          <input
                            value={item.date}
                            onChange={(e) => {
                              const newData = [...allTableData];
                              newData[index].date = e.target.value;
                              setAllTableData(newData);
                            }}
                          />
                        </td> */}
                            <td>
                              <input
                                value={item.date}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].date = e.target.value;
                                  setAllTableData(newData);
                                }}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.on_time_auh}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].on_time_auh = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.on_time_laf}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].on_time_laf = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.on_time_uv_light}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].on_time_uv_light =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.on_time_done_by}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].on_time_done_by =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.name_of_material}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].name_of_material =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.control_no}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].control_no = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.dispensed_quantity}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].dispensed_quantity =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.dispensed_by_qa}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].dispensed_by_qa =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.dispensed_by_store}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].dispensed_by_store =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.off_time_auh}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].off_time_auh = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.off_time_laf}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].off_time_laf = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.off_time_uv_light}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].off_time_uv_light =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.uv_burning}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].uv_burning = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.off_time_done_by}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].off_time_done_by =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                value={item.cleaning_done_by}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].cleaning_done_by =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                value={item.checked_by}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].checked_by = e.target.value;
                                  setAllTableData(newData);
                                }}
                                readOnly
                              />
                            </td>
                            <td>
                              <input
                                value={item.weighing_balance_id}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].weighing_balance_id =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                              />
                            </td>
                            <td>
                              <input
                                value={item.remark}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].remark = e.target.value;
                                  setAllTableData(newData);
                                }}
                              />
                            </td>

                            {/* <td style={{ width: "250px" }}>
                          <div className="d-flex align-items-center">
                            <button
                              type="button"
                              className="btn-upload"
                              onClick={() =>
                                document
                                  .getElementsByName("supporting_docs")
                                  [index].click()
                              }
                              style={{ marginRight: "10px" }}
                            >
                              {item.supporting_docs
                                ? "Change File"
                                : "Select File"}
                            </button>
                            {item.supporting_docs && (
                              <div>
                                <a
                                  href={item.supporting_docs}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ marginRight: "10px" }}
                                >
                                  View File
                                </a>
                                <DeleteIcon
                                  style={{ color: "red", cursor: "pointer" }}
                                  onClick={() => handleDeleteFile(index)}
                                />
                              </div>
                            )}
                            <input
                              type="file"
                              name="supporting_docs"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleFileChange(index, e.target.files[0])
                              }
                            />
                          </div>
                        </td> */}
                            <td>
                              <DeleteIcon onClick={() => deleteRow(index)} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="group-input mt-4">
                      <label className="color-label">
                        Additional Attachment
                        <span className="text-sm text-zinc-600">
                          (If / Any)
                        </span>{" "}
                        :
                      </label>
                      <div>
                        <input
                          type="file"
                          name="additionalAttachment"
                          onChange={handleFileChange}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="group-input ">
                      <label className="color-label">
                        Additional Info{" "}
                        <span className="text-sm text-zinc-600">
                          (If / Any)
                        </span>{" "}
                        :{" "}
                      </label>
                      <div>
                        <textarea
                          type="text"
                          name="Additional"
                          value={dispensingOfMaterials.additionalInfo}
                          onChange={(e) => {
                            setDispensingOfMaterials({
                              additionalInfo: e.target.value,
                            });
                          }}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <div className="button-block" style={{ width: "100%" }}>
              <button
                className="themeBtn"
                onClick={() => {
                  setIsPopupOpen(true);
                }}
              >
                Save
              </button>
              <button
                className="themeBtn"
                onClick={() => navigate("/dashboard")}
              >
                Exit
              </button>
            </div>
            {isPopupOpen && (
              <UserVerificationPopUp
                onClose={handlePopupClose}
                onSubmit={handlePopupSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispensingOfMaterials;
