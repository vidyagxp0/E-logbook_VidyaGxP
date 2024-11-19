import React, { useEffect, useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import UserVerificationPopUp from "../../../components/UserVerificationPopUp/UserVerificationPopUp";
import { NoteAdd } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const OperationOfSterilizer = () => {
  const [User, setUser] = useState(null);
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [allTableData, setAllTableData] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation();
  const [operationOfSterilizer, setOperationOfSterilizer] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      site_id: location.state?.site_id,
      reviewer_id: 2,
      approver_id: 2,
      description: "",
      department: "",
      review_comments: "",
      compression_area: "",
      limit: 1,
      initiatorComment: " ",
      initiatorAttachment: null,
      initiatorDeclaration: "",
    }
  );
  console.log(operationOfSterilizer, "operationOfSterilizer");
  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);

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

  const handlePopupSubmit = (credentials) => {
    if (
      operationOfSterilizer.site_id === null ||
      operationOfSterilizer.approver_id === null ||
      operationOfSterilizer.reviewer_id === null
    ) {
      toast.error(
        "Please select an approver and a reviewer before saving e-log!"
      );
      return;
    }

    if (operationOfSterilizer.initiatorComment === "") {
      toast.error("Please provide an initiator comment!");
      return;
    }
    if (operationOfSterilizer.description === "") {
      toast.error("Please provide a short description!");
      return;
    }
    // if (
    //   operationOfSterilizer?.FormRecordsArray?.some(
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

    operationOfSterilizer.email = credentials?.email;
    operationOfSterilizer.password = credentials?.password;
    operationOfSterilizer.initiatorDeclaration = credentials?.declaration;

    axios
      .post(
        "http://localhost:1000/operation-sterlizer/post",
        operationOfSterilizer,
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
    setOperationOfSterilizer({ ...operationOfSterilizer, [name]: value });
  };

  useEffect(() => {
    setOperationOfSterilizer({ FormRecordsArray: allTableData });
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
  console.log(allTableData, "allTableData loaded");
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
      air_pressure: "",
      steam_pressure: "",
      printer_ok: "",
      product_name: "",
      container_size: "",
      loaded_quantity: "",
      batch_no_lot_no: "",
      loading_time: "",
      d_well_period_start: "",
      d_well_period_end: "",
      unloading_time: "",
      cleaning_time_start: "",
      cleaning_time_end: "",
      cleaning_done_by: "",
      checked_by: User?.name,
      supporting_docs: null,
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
  return (
    <div>
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-pages" className="min-w-full">
          <div className="top-blocks">
            <div>
              <strong> Record Name:&nbsp;</strong>Operation Of Sterilizer
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
              
              <div className="sub-head-2">Operation Of Sterilizer</div>

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
                          setOperationOfSterilizer({
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
                          setOperationOfSterilizer({
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
                      <input
                        type="text"
                        value={operationOfSterilizer.description}
                        onChange={(e) =>
                          setOperationOfSterilizer({
                            description: e.target.value,
                          })
                        }
                        required // HTML5 attribute to enforce field requirement
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
                          setOperationOfSterilizer({ status: e.target.value })
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
                          value={OperationOfSterilizer.reviewer_id}
                          onChange={(e) => {
                            setOperationOfSterilizer({
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
                          value={OperationOfSterilizer.approver_id}
                          onChange={(e) => {
                            setOperationOfSterilizer({
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
                      <NoteAdd onClick={addRow} />
                      <div className="addrowinstruction"></div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table>
                      <thead>
                        <tr>
                          <th rowSpan={2}>S no.</th>
                          <th rowSpan={2}>Unique Id</th>
                          <th rowSpan={2}>Date</th>
                          <th rowSpan={2}>Air Pressure (4-6 kg)</th>
                          <th rowSpan={2}>Steam Pressure (4-6 kg)</th>
                          <th rowSpan={2}>Printer Ok Yes/No</th>
                          <th rowSpan={2}>Product Name</th>
                          <th rowSpan={2}>Container size (ml)</th>
                          <th rowSpan={2}>Loaded quantity</th>
                          <th rowSpan={2}>Batch No.- Lot. No.</th>
                          <th rowSpan={2}>Loading Time</th>
                          <th rowSpan={1} colSpan={2}>
                            {" "}
                            D-well Period
                          </th>
                          <th rowSpan={2}>Unloading Time</th>
                          <th rowSpan={1} colSpan={2}>
                            Cleaning Time
                          </th>
                          <th rowSpan={2}>Cleaning Done By</th>
                          <th rowSpan={2}>Checked By</th>

                          {/* <th style={{ width: "300px" }}>Supporting Documents</th> */}
                          <th rowSpan={2}>Actions</th>
                        </tr>
                        <tr>
                          <th>Start</th>
                          <th>End</th>
                          <th>Start</th>
                          <th>End</th>
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
                                value={item.air_pressure}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].air_pressure = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.steam_pressure}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].steam_pressure =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.printer_ok}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].printer_ok = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.product_name}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].product_name = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.container_size}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].container_size =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.loaded_quantity}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].loaded_quantity =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.batch_no_lot_no}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].batch_no_lot_no =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.loading_time}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].loading_time = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.d_well_period_start}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].d_well_period_start =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.d_well_period_end}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].d_well_period_end =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.unloading_time}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].unloading_time =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.cleaning_time_start}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].cleaning_time_start =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.cleaning_time_end}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].cleaning_time_end =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.cleaning_done_by}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].cleaning_done_by =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
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

                            {/* <td>
                            <input
                              value={item.remarks}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].remarks = e.target.value;
                                setAllTableData(newData);
                              }}
                            />
                          </td> */}

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

export default OperationOfSterilizer;
