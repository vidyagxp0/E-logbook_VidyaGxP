import React, { useEffect, useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import UserVerificationPopUp from "../../../components/UserVerificationPopUp/UserVerificationPopUp";
import { NoteAdd } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

const LoadedQuantity = () => {
  const [User, setUser] = useState(null);
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [allTableData, setAllTableData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const location = useLocation();
  const [loadedQuantity, setLoadedQuantity] = useReducer(
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
      initiatorComment: "",
      initiatorAttachment: null,
      initiatorDeclaration: "",
    }
  );
  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);

  const navigate = useNavigate();

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

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setLoadedQuantity({ ...loadedQuantity, [name]: value });
  };

  useEffect(() => {
    setLoadedQuantity({ FormRecordsArray: allTableData });
  }, [allTableData]);
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
      differential_pressure: "",
      remarks: "",
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
        <div id="config-form-document-pages">
          <div className="top-blocks">
            <div>
              <strong> Record Name:&nbsp;</strong>Loaded Quantity
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
              {/* <div className="sop-type-header">
                <div className="logo">
                  <img src="/vidyalogo2.png" alt="..." />
                </div>
                <div className="main-head">
                  <div>VidyaGxP Private Limited</div>
                </div>
              </div> */}
              <div className="sub-head-2">Loaded Quantity</div>

              <div className="outerDiv4">
                <div className="btn-forms">
                  <div
                    className={`${
                      isSelectedGeneral === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false),
                        setIsSelectedGeneral(true);
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
                      setIsSelectedDetails(true),
                        setIsSelectedGeneral(false);
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
                          setLoadedQuantity({ initiator: e.target.value })
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
                          setLoadedQuantity({
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
                        value={loadedQuantity.description}
                        onChange={(e) =>
                          setLoadedQuantity({
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
                          setLoadedQuantity({ status: e.target.value })
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
                        <th>Product Name</th>
                        <th>Batch No.</th>
                        <th>Container Size (ml)</th>
                        <th>Batch Size (Ltr)</th>
                        <th>Theoretical Production</th>
                        <th>Loaded Quantity</th>
                        <th>Checked By</th>
                        <th>% Yield</th>
                        {/* <th>Date</th> */}
                        {/* <th>Product Name</th> */}
                        <th>Remark</th>
                        {/* <th style={{ width: "300px" }}>Supporting Documents</th> */}
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
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.productName}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].productName =
                                  e.target.value;
                                setAllTableData(newData);
                              }}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={item.batchNo}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].batchNo =
                                  e.target.value;
                                setAllTableData(newData);
                              }}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={""}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].containerSize =
                                  e.target.value;
                                setAllTableData(newData);
                              }}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={""}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].batchSize =
                                  e.target.value;
                                setAllTableData(newData);
                              }}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={""}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].theoreticalProduction =
                                  e.target.value;
                                setAllTableData(newData);
                              }}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={""}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].loadedQuantity =
                                  e.target.value;
                                setAllTableData(newData);
                              }}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={""}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].checkedBy =
                                  e.target.value;
                                setAllTableData(newData);
                              }}
                              required
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={""}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].yeild =
                                  e.target.value;
                                setAllTableData(newData);
                              }}
                              required
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
              // onSubmit={handlePopupSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadedQuantity;
