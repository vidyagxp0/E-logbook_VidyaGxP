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

const MediaRecord = () => {
  const [User, setUser] = useState(null);
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [allTableData, setAllTableData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [approvers, setApprovers] = useState([]);
  const [reviewers, setReviewers] = useState([]);

  const location = useLocation();
  const [mediaRecords, setMediaRecords] = useReducer(
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
      additionalAttachment: null,
      additionalInfo: "",
    }
  );

  const handleFileChange = (e) => {
    setMediaRecords({
      ...mediaRecords,
      additionalAttachment: e.target.files[0],
    });
  };
  console.log(mediaRecords.additionalInfo, "additionalInfo");
  console.log(mediaRecords.additionalAttachment, "additionalAttachment");

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
      mediaRecords.site_id === null ||
      mediaRecords.approver_id === null ||
      mediaRecords.reviewer_id === null
    ) {
      toast.error(
        "Please select an approver and a reviewer before saving e-log!"
      );
      return;
    }

    if (mediaRecords.initiatorComment === "") {
      toast.error("Please provide an initiator comment!");
      return;
    }
    if (mediaRecords.description === "") {
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

    mediaRecords.email = credentials?.email;
    mediaRecords.password = credentials?.password;
    mediaRecords.initiatorDeclaration = credentials?.declaration;

    axios
      .post("http://localhost:1000/media-record/post", mediaRecords, config)
      .then(() => {
        toast.success("eLog Saved Successfully!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("There was an error creating eLog:", error);
        toast.error("There was an error creating eLog");
      });
  };

  useEffect(() => {
    setMediaRecords({ FormRecordsArray: allTableData });
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
      name_medium: "",
      date_of_preparation: "",
      date_of_use: "",
      lot_no: "",
      no_of_plate_prepared: "",
      no_of_plate_used: "",
      used_for: "",

      balance_no_plate: "",
      signature: "",
      checked_by: User?.name,
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
    setMediaRecords({
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
              <strong> Record Name:&nbsp;</strong>Media Records
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
              <div className="sub-head-2">Media Records</div>

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
                          setMediaRecords({
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
                          setMediaRecords({
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
                        value={mediaRecords.description}
                        onChange={(e) =>
                          setMediaRecords({
                            description: e.target.value,
                          })
                        }
                        required // HTML5 attribute to enforce field requirement
                      /> */}

                      <TinyEditor
                        editorContent={mediaRecords.description}
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
                          setMediaRecords({ status: e.target.value })
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
                          value={mediaRecords.reviewer_id}
                          onChange={(e) => {
                            setMediaRecords({
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
                          value={mediaRecords.approver_id}
                          onChange={(e) => {
                            setMediaRecords({
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
                          <th>S no.</th>
                          <th>Unique Id</th>
                          <th>Date</th>
                          <th>Name of the Medium</th>
                          <th>Date of Preparation</th>
                          <th>Date of Use</th>
                          <th>Lot No.</th>
                          <th>No. of Plates Prepared</th>
                          <th>No. of Plates used</th>
                          <th>Used for</th>
                          <th>Balance No. of Plates</th>
                          <th>Checked By</th>

                          <th> Signature</th>
                          {/* <th style={{ width: "300px" }}>Supporting Documents</th> */}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTableData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.unique_id}</td>
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
                            {/* <td>
                          <input
                            type="date"
                            value={item.date}
                            onChange={(e) => {
                              const newData = [...allTableData];
                              newData[index].differential_pressure =
                                e.target.value;
                              setAllTableData(newData);
                            }}
                            required
                          />
                        </td> */}
                            <td>
                              <input
                                type="text"
                                value={item.name_medium}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].name_medium = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={item.date_of_preparation}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].date_of_preparation =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                value={item.date_of_use}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].date_of_use = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.lot_no}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].lot_no = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.no_of_plate_prepared}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].no_of_plate_prepared =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.no_of_plate_used}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].no_of_plate_used =
                                    e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.used_for}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].used_for = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.balance_no_plate}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].balance_no_plate =
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
                            <td>
                              <input
                                type="text"
                                value={item.signature}
                                onChange={(e) => {
                                  const newData = [...allTableData];
                                  newData[index].signature = e.target.value;
                                  setAllTableData(newData);
                                }}
                                required
                              />
                            </td>
                            {/* <td>
                          <input
                            type="text"
                           value={item.unloadingTime}
                            onChange={(e) => {
                              const newData = [...allTableData];
                              newData[index].unloadingTime = e.target.value;
                              setAllTableData(newData);
                            }}
                            required
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
                  <div className="group-input flex flex-col mt-6 items-start">
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

                    <div className="flex flex-col w-full mt-4">
                      <label className="text-sm font-medium text-gray-900 mb-1">
                        Additional Info{" "}
                        <span className="text-sm text-zinc-600">
                          (If / Any)
                        </span>{" "}
                        :
                      </label>
                      <textarea
                        className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        value={mediaRecords.additionalInfo}
                        onChange={(e) => {
                          setMediaRecords({
                            additionalInfo: e.target.value,
                          });
                        }}
                        disabled
                      ></textarea>
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

export default MediaRecord;
