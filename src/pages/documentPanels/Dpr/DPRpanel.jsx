import React from "react";
import { useEffect, useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import "../docPanel.css";
import { docFormFile, tableData, time } from "./Dprpanelfunctions.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { NoteAdd } from "@mui/icons-material";

export default function DPRpanel() {
  const editedData = useSelector((state) => state.dprPanelData.selectedRow);
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [editData, setEditData] = useState({
    shortDescription: "",
    description: "",
    status: "",
    department: "",
    reviewComment: "",
    compressionArea: "",
    limit: "",
    initiator: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  useEffect(() => {
    setEditData(editedData);
  }, [editedData]);

  const addRow = () => {
    const currentTime = new Date().toLocaleTimeString();
    const newRow = {
      date: date,
      time: currentTime,
      limit: "",
      remark: "",
      checkedBy: "Amit Guru",
      file: null,
    };
    setEditData((prevState) => ({
      ...prevState,
      gridData: [...prevState.gridData, newRow],
    }));
  };

  const deleteRow = (index) => {
    const updatedGridData = [...editData.gridData];
    updatedGridData.splice(index, 1);
    setEditData((prevState) => ({
      ...prevState,
      gridData: updatedGridData,
    }));
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleDeleteFile = (index) => {
    const updatedGridData = editData.gridData.map((item, i) => {
      if (i === index) {
        return { ...item, file: null };
      }
      return item;
    });
    setEditData((prevState) => ({
      ...prevState,
      gridData: updatedGridData,
    }));
  };

  const handleFileChange = (index, file) => {
    const updatedGridData = [...editData.gridData];
    updatedGridData[index].file = file;
    setEditData((prevState) => ({
      ...prevState,
      gridData: updatedGridData,
    }));
  };

  const uniqueId =
    "ABC/" +
    Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0") +
    "/" +
    Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  const handleSave = () => {
    if (parseFloat(editData.limit) < 0.6 || parseFloat(editData.limit) > 2.6) {
      toast.error("The limit value must be between 0.6 and 2.6.");
      return;
    }
    dispatch({
      type: "EDIT-OBJECT",
      payload: { id: editData.eLogId, editedData: editData },
    });
    toast.success("Data saved successfully!");
    setFileData(null);
    navigate("/desktop");
  };
  const [differentialPRecord, setDifferentialPRecord] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      process: "Diffrential pressure",
      eLogId: uniqueId + 1,
      initiator: "",
      dateOfInitiation: date,
      shortDescription: "",
      description: "",
      status: "",
      department: "",
      reviewComment: "",
      compressionArea: "",
      limit: "",
      gridData: [],
    }
  );

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
              India
            </div>
            <div>
              <strong> Current Status:&nbsp;</strong>Under Initiation
            </div>
            <div>
              <strong> Initiated By:&nbsp;</strong>
              Amit Guru
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
                <div className="analytics-btn">
                  <button
                    className="btn-print"
                    onClick={() => navigate("/analytics")}
                  >
                    Analytics
                  </button>
                  <button className="btn-print" onClick={() => {}}>
                    Print
                  </button>
                </div>
              </div>

              {isSelectedGeneral === true ? (
                <>
                  <div className="group-input">
                    <label className="color-label">Initiator </label>
                    <div>
                      <input
                        type="text"
                        name="initiator"
                        value={editData.initiator || ""}
                        onChange={handleInputChange1}
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
                    <label className="color-label">Short Description</label>
                    <div>
                      <input
                        name="shortDescription"
                        type="text"
                        value={editData.shortDescription || ""}
                        onChange={handleInputChange1}
                      />
                    </div>
                  </div>

                  <div className="group-input">
                    <label className="color-label">Description</label>
                    <div>
                      <input
                        name="description"
                        type="text"
                        value={editData.description || ""}
                        onChange={handleInputChange1}
                      />
                    </div>
                  </div>

                  <div className="group-input">
                    <label className="color-label">Status</label>
                    <div>
                      <input
                        name="status"
                        type="text"
                        value={editData.status || ""}
                        onChange={handleInputChange1}
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
                      name="department"
                      value={editData.department || ""}
                      onChange={handleInputChange1}
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
                      name="compressionArea"
                      value={editData.compressionArea || ""}
                      onChange={handleInputChange1}
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
                      name="limit"
                      type="number"
                      className={`${
                        editData.limit < 0.6
                          ? "limit"
                          : editData.limit > 2.6
                          ? "limit"
                          : ""
                      }`}
                      value={editData.limit || ""}
                      onChange={handleInputChange1}
                    />
                  </div>

                  <div className="group-input">
                    <label className="color-label">Month:</label>
                    <div>
                      <input type="text" value={currentMonth} readOnly />
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
                        <th style={{ width: "50px" }}>S no.</th>
                        <th style={{ width: "50px" }}>Unique Id</th>
                        <th style={{ width: "30px" }}>Date</th>
                        <th style={{ width: "30px" }}>Time</th>
                        <th>Differential Pressure</th>
                        <th>Remark</th>
                        <th style={{ width: "50px" }}>Checked By</th>
                        <th style={{ width: "300px" }}>Supporting Documents</th>
                        <th style={{ width: "180px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editData?.gridData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>UID000{index + 1}</td>
                          <td>
                            <input value={item.date} readOnly />
                          </td>
                          <td>
                            <input value={item.time} readOnly />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.limit}
                              className={`${
                                item.limit < 0.6
                                  ? "limit"
                                  : item.limit > 2.6
                                  ? "limit"
                                  : ""
                              }`}
                              onChange={(e) => {
                                const newData = [...editData.gridData];
                                newData[index].limit = e.target.value;
                                setEditData({ ...editData, gridData: newData });
                              }}
                            />
                          </td>
                          <td>
                            <input
                              value={item.remark}
                              onChange={(e) => {
                                const newData = [...editData.gridData];
                                newData[index].remark = e.target.value;
                                setEditData({ ...editData, gridData: newData });
                              }}
                            />
                          </td>
                          <td>
                            <input
                              value={item.checkedBy}
                              onChange={(e) => {
                                const newData = [...editData.gridData];
                                newData[index].checkedBy = e.target.value;
                                setEditData({ ...editData, gridData: newData });
                              }}
                            />
                          </td>
                          {/* <td style={{ width: "250px" }}>
                            <div className="d-flex">
                              <input
                              value= {item.files}
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
                          </td> */}

                          <td style={{ width: "250px" }}>
                            <div className="d-flex">
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(index, e.target.files[0])
                                }
                                style={{ display: "none" }}
                                id={`file-input-${index}`}
                              />
                              <label
                                htmlFor={`file-input-${index}`}
                                className="file-label"
                              >
                                {item.file ? item.file.name : "Choose File"}
                              </label>
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
                            {item.limit !== "" &&
                              (item.limit < 0.6 || item.limit > 2.6) && (
                                <button
                                  className="deviation-btn"
                                  onClick={() => {
                                    navigate("/chart")
                                  }}
                                >
                                  Launch Deviation
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="group-input">
                    <label> Review By :- </label>
                  </div>

                  <div className="group-input">
                    <label htmlFor="">Review Comments</label>
                    <input
                      value={editData.reviewComment || ""}
                      onChange={handleInputChange1}
                    />
                  </div>
                </>
              ) : null}
            </div>
            <div className="button-block" style={{ width: "100%" }}>
              <button
                className="themeBtn"
                onClick={() => {
                  handleSave(differentialPRecord)
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
              <button className="themeBtn" onClick={() => navigate("/desktop")}>
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
