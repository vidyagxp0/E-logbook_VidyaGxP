import React from "react";
import { useEffect, useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop.jsx";
import "../docPanel.css";
import {
  docFormFile,
  tableData,
  time,
} from "./TempretureRecordsPanelFunction.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { NoteAdd } from "@mui/icons-material";

const TempretureRecordsPanel = () => {
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [allTableData, setAllTableData] = useState([]);
  const [editData, setEditData] = useState({
    initiator: "",
    shortDescription: "",
    description: "",
    status: "",
    department: "",
    reviewComment: "",
    compressionArea: "",
    limit: "",
    month: "february",
  });
  console.log(editData,"editData")
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
    const storedData = JSON.parse(localStorage.getItem("allTableData"));
    if (storedData) {
      setAllTableData(storedData);
    }
  }, []);

  const editedData = useSelector((state) => state.dprPanelData.selectedRow);

  useEffect(() => {
    setEditData(editedData);
  }, [editedData]);

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };


  

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
    const updatedData = [...allTableData];
    updatedData.splice(index, 1);
    setAllTableData(updatedData);
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

  const handleSave = (data) => {
    if (parseFloat(data.limit) < 0.6 || parseFloat(data.limit) > 2.6) {
      toast.error("The limit value must be between 0.6 and 2.6.");
      return;
    }
    dispatch({
      type: "EDIT-TEMPERATURETDATA",
      payload: { id: editData.eLogId, editedData: editData },
    });

    toast.success("Data saved successfully!");
    navigate("/dashboard");
  };
  const [addTemperatureRecord, setAddTemperatureRecord] = useReducer(
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
      month: "february",
      gridData: {
        uniqueId: "",
        date,
        time,
        dPressure: "",
        remark: "",
        checkedBy: "Amit Guru",
      },
    }
  );
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
  const TableData = (data) => {
    dispatch({ type: "EDIT-TEMPERATURETDATA", payload: data });
  };

  return (
    <>
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-page">
          <div className="top-block">
            <div>
              <strong> Record Name:&nbsp;</strong>Temperature Records
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
              <div className="sub-head-2">Temperature Records</div>

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
              <>
                {isSelectedGeneral === true ? (
                  <>
                    <div className="group-input">
                      <label className="color-label">Initiator </label>
                      <div>
                        <input
                          type="text"
                          name="initiator"
                          value={editData.initiator}
                          onChange={handleInputChange1}
                        />
                      </div>
                    </div>

                    <div className="group-input">
                      <label className="color-label">Date of Initiator</label>
                      <div>
                        <input
                          type="text"
                          value={date}
                          onChange={(e) =>
                            setAddDifferentialPRecord({
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
                          type="text"
                          name="shortDescription"
                          value={editData.shortDescription || ""}
                          onChange={handleInputChange1}
                        />
                      </div>
                    </div>

                    <div className="group-input">
                      <label className="color-label">Description</label>
                      <div>
                        <input
                          type="text"
                          name="description"
                          value={editData.description || ""}
                          onChange={handleInputChange1}
                        />
                      </div>
                    </div>

                    <div className="group-input">
                      <label className="color-label">Status</label>
                      <div>
                        <input
                          type="text"
                          name="status"
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
                        <option value="Area 6">Area 6</option>```````````````````````````````                                                                                                   `    
                      </select>
                    </div>

                    <div className="group-input">
                      <label className="color-label">Temperature</label>
                      <div className="instruction"></div>
                      <input
                        type="number"
                        className={`${
                          editData.limit < 23
                            ? "limit"
                            : editData.limit > 27
                            ? "limit"
                            : ""
                        }`}
                        name="limit"
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
                          <th>S no.</th>
                          <th>Unique Id</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Temperature</th>
                          <th>Remark</th>
                          <th>Checked By</th>
                          <th>Supporting Documents</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editData.gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>UID000{index + 1}</td>
                            <td>
                              <input value={item.date} readOnly />
                            </td>
                            <td>
                              <input value={item.time} readOnly/>
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.limit}
                                className={`${
                                  item.limit < 23
                                    ? "limit"
                                    : item.limit > 27
                                    ? "limit"
                                    : ""
                                }`}
                                onChange={(e) => {
                                  const newData = [...editData.gridData];
                                  newData[index].limit = e.target.value;
                                  setEditData({
                                    ...editData,
                                    gridData: newData,
                                  });
                                }}
                              />
                            </td>
                            <td>
                              <input
                                value={item.remark}
                                onChange={(e) => {
                                  const newData = [...editData.gridData];
                                  newData[index].remark = e.target.value;
                                  setEditData({
                                    ...editData,
                                    gridData: newData,
                                  });
                                }}
                              />
                            </td>
                            <td>
                              <input
                                value={item.checkedBy}
                                onChange={(e) => {
                                  const newData = [...editData.gridData];
                                  newData[index].checkedBy = e.target.value;
                                  setEditData({
                                    ...editData,
                                    gridData: newData,
                                  });
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
                                (item.limit < 23 || item.limit > 27) && (
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
                        name="reviewComment"
                        value={editData.reviewComment || ""}
                        onChange={handleInputChange1}
                      />
                    </div>
                  </>
                ) : null}
              </>
            </div>
            <div className="button-block" style={{ width: "100%" }}>
              <button
                className="themeBtn"
                onClick={() => {
                  handleSave(addTemperatureRecord)
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
              <button className="themeBtn" onClick={() => navigate("/dashboard")}>
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TempretureRecordsPanel;
