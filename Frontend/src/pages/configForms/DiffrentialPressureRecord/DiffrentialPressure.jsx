import { useEffect, useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import "../ConfigForms.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { NoteAdd } from "@mui/icons-material";
import axios from "axios";

export default function DiffrentialPressure() {
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [allTableData, setAllTableData] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [User, setUser] = useState(null);
  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const config = {
      method: "post",
      url: "http://localhost:1000/process/get-user-roleGroups",
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
      url: "http://localhost:1000/process/get-user-roleGroups",
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

  const object = getCurrentDateTime();
  let date = object.currentDate;
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const currentDate = `${day}/${month}/${year}`;
    return {
      currentDate: currentDate,
    };
  }

  const addRow = () => {
    const currentTime = new Date().toLocaleTimeString();
    const newRow = {
      unique_id: generateUniqueId(),
      time: currentTime,
      differential_pressure: "",
      remarks: "",
      checked_by: User?.name,
      file: null,
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

  const handleSave = (data) => {
    if (
      data.site_id === null ||
      data.approver_id === null ||
      data.reviewer_id === null
    ) {
      toast.error(
        "Please select an approver and a reviewer before saving e-log!"
      );
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post(
        "http://localhost:1000/process/post-differential-pressure",
        differentialPRecord,
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

  const generateUniqueId = () => {
    return `UU0${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
  };

  const [differentialPRecord, setDifferentialPRecord] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      site_id: location.state?.site_id,
      reviewer_id: null,
      approver_id: null,
      description: "",
      department: "",
      review_comments: "",
      compression_area: "",
      limit: null,
    }
  );

  useEffect(() => {
    setDifferentialPRecord({ FormRecordsArray: allTableData });
  }, [allTableData]);

  const handleDeleteFile = (index) => {
    const updatedData = [...allTableData];
    updatedData[index].file = null; // This should remove the file
    setAllTableData(updatedData);
  };

  const handleFileChange = (index, file) => {
    const updatedData = [...allTableData];
    updatedData[index].file = file;
    setAllTableData(updatedData);
  };

  return (
    <>
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-page">
          <div className="top-block">
            <div>
              <strong> Record Name:&nbsp;</strong>Differential Pressure
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
              <div className="sub-head-2">Differential Pressure Record</div>

              <div className="outerDiv5">
                <div className="btn-forms">
                  <div
                    className={`${
                      isSelectedGeneral === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedGeneral(true), setIsSelectedDetails(false);
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
                {/* <div className="analytics-btn">
                  <button className="btn-print" onClick={() => navigate("/analytics")}>
                    Analytics
                  </button>
                  <button className="btn-print" onClick={() => {}}>
                    Print
                  </button>
                </div> */}
              </div>

              {isSelectedGeneral === true ? (
                <>
                  <div className="group-input">
                    <label className="color-label">Initiator </label>
                    <div>
                      <input
                        type="text"
                        value={User?.name}
                        onChange={(e) =>
                          setDifferentialPRecord({ initiator: e.target.value })
                        }
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
                          setDifferentialPRecord({
                            dateOfInitiation: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="group-input">
                    <label className="color-label">Description</label>
                    <div>
                      <input
                        type="text"
                        value={differentialPRecord.description}
                        onChange={(e) =>
                          setDifferentialPRecord({
                            description: e.target.value,
                          })
                        }
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
                          setDifferentialPRecord({ status: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </>
              ) : null}

              {isSelectedDetails === true ? (
                <>
                  <div className="group-input">
                    <label className="color-label">Department</label>
                    <div className="instruction">&nbsp;</div>
                    <select
                      className="form-control"
                      name="assign_to"
                      value={differentialPRecord.department}
                      onChange={(e) =>
                        setDifferentialPRecord({
                          department: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Select --</option>
                      <option value="Corporate Quality Assurance">
                        Corporate Quality Assurance
                      </option>
                      <option value="Quality Assurance Bio-Pharma">
                        Quality Assurance Bio-Pharma
                      </option>
                      <option value="Central Quality Control">
                        Central Quality Control
                      </option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Plasma Sourcing Grou">
                        Plasma Sourcing Group
                      </option>
                      <option value="Central Stores">Central Stores</option>
                      <option value="Information Technology Group">
                        Information Technology Group
                      </option>
                      <option value="Molecular Medicine">
                        Molecular Medicine
                      </option>
                      <option value="Central Laboratory">
                        Central Laboratory
                      </option>
                      <option value="Tech team">Tech team</option>
                    </select>
                  </div>

                  <div className="group-input">
                    <label className="color-label">
                      Compression Area with respect to Corridor
                    </label>
                    <div className="instruction">&nbsp;</div>
                    <select
                      className="form-control"
                      name="assign_to"
                      value={differentialPRecord.compression_area}
                      onChange={(e) =>
                        setDifferentialPRecord({
                          compression_area: e.target.value,
                        })
                      }
                    >
                      <option value="Select a value">Select a value</option>
                      <option value="Area 1">Area 1</option>
                      <option value="Area 2">Area 2</option>
                      <option value="Area 3">Area 3</option>
                      <option value="Area 4">Area 4</option>
                      <option value="Area 5">Area 5</option>
                      <option value="Area 6">Area 6</option>
                    </select>
                  </div>

                  <div className="group-input">
                    <label className="color-label">Limit</label>
                    <div className="instruction"></div>
                    <input
                      type="number"
                      className={`${
                        differentialPRecord.limit < 0.6
                          ? "limit"
                          : differentialPRecord.limit > 2.6
                          ? "limit"
                          : ""
                      }`}
                      value={differentialPRecord.limit}
                      onChange={(e) =>
                        setDifferentialPRecord({ limit: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label">Reviewer</label>
                      <div>
                        <select
                          value={differentialPRecord.reviewer_id}
                          onChange={(e) => {
                            setDifferentialPRecord({
                              reviewer_id: e.target.value,
                            });
                          }}
                        >
                          <option value="">Select a reviewer</option>
                          {reviewers.map((reviewer, index) => (
                            <option key={index} value={reviewer.user_id}>
                              {reviewer.User.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="group-input">
                      <label className="color-label">Approver</label>
                      <div>
                        <select
                          value={differentialPRecord.approver_id}
                          onChange={(e) => {
                            setDifferentialPRecord({
                              approver_id: e.target.value,
                            });
                          }}
                        >
                          <option value="">Select an approver</option>
                          {approvers.map((approver, index) => (
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
                      <NoteAdd onClick={addRow} />
                      <div className="addrowinstruction"></div>
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>S no.</th>
                        <th>Unique Id</th>
                        <th>Time</th>
                        <th>Differential Pressure</th>
                        <th>Remark</th>
                        <th>Checked By</th>
                        <th style={{ width: "300px" }}>Supporting Documents</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTableData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{generateUniqueId()}</td>
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
                              value={item.time}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].time = e.target.value;
                                setAllTableData(newData);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.differential_pressure}
                              className={`${
                                item.differential_pressure < 0.6
                                  ? "limit"
                                  : item.differential_pressure > 2.6
                                  ? "limit"
                                  : ""
                              }`}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].differential_pressure =
                                  e.target.value;
                                setAllTableData(newData);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              value={item.remarks}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].remarks = e.target.value;
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
                            />
                          </td>
                          <td style={{ width: "250px" }}>
                            <div className="d-flex">
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(index, e.target.files[0])
                                }
                              />
                              {item.file && (
                                <DeleteIcon
                                  style={{ color: "red" }}
                                  onClick={() => handleDeleteFile(index)}
                                />
                              )}
                            </div>
                          </td>
                          <td>
                            <DeleteIcon onClick={() => deleteRow(index)} />
                            {item.differential_pressure !== "" &&
                              (item.differential_pressure < 0.6 ||
                                item.differential_pressure > 2.6) && (
                                <button
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  className="deviation-btn"
                                  onClick={() => {
                                    window.location.href =
                                      "https://naveen.vidyagxp.com/deviation";
                                  }}
                                >
                                  Deviation
                                </button>
                              )}
                            {item.differential_pressure !== "" &&
                              (item.differential_pressure < 0.6 ||
                                item.differential_pressure > 2.6) && (
                                <button
                                  className="deviation-btn"
                                  onClick={() => {
                                    navigate("/chart");
                                  }}
                                >
                                  Action item
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : null}
            </div>
            <div className="button-block" style={{ width: "100%" }}>
              <button
                className="themeBtn"
                onClick={() => {
                  handleSave(differentialPRecord);
                }}
              >
                Save
              </button>
              {isSelectedGeneral === true ? (
                <button
                  className="themeBtn"
                  onClick={() => {
                    setIsSelectedDetails(true), setIsSelectedGeneral(false);
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  className="themeBtn"
                  onClick={() => {
                    setIsSelectedGeneral(true), setIsSelectedDetails(false);
                  }}
                >
                  Back
                </button>
              )}
              <button
                className="themeBtn"
                onClick={() => navigate("/dashboard")}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
