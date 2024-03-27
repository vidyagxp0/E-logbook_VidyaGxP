import React from "react";
import { useEffect, useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop.jsx";
import "../docPanel.css";
import { docFormFile, tableData, time } from "./TempretureRecordsPanelFunction.jsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { NoteAdd } from "@mui/icons-material";

const TempretureRecordsPanel = () => {

    const temperatureRecordHistory = useSelector((state) => state.temperature.tempratureRecordData);
  const elogId=useSelector((state)=>state.temperature)
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [allTableData, setAllTableData] = useState([]);
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
    // Load data from local storage if available
    const storedData = JSON.parse(localStorage.getItem("allTableData"));
    if (storedData) {
      setAllTableData(storedData);
    }
  }, []);

  const saveDataToLocalStorage = (data) => {
    localStorage.setItem("allTableData", JSON.stringify(data));
  };

  const handleTableDataSave = () => {
    // Perform save logic here
    toast.success("eLog Saved Successfully!");
    saveDataToLocalStorage(allTableData);
    TableData(allTableData);
  };

  // Function to add a new row to the table
  const addRow = () => {
    const newRow = {
      date: date,
      time: time,
      limit: "",
      remark: "",
      checkedBy: "Amit Guru",
      file: null, // Adding property for file attachment
    };
    setAllTableData([...allTableData, newRow]);
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
    toast.success("eLog Saved Successfully!");
    createObject(data);
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

  const createObject = (newObject) => {
    dispatch({ type: "ADD_OBJECT", payload: newObject });
  };
  const handleDeleteFile = (index) => {
    const updatedData = [...allTableData];
    updatedData[index].file = null;
    setAllTableData(updatedData);
  };
  const TableData = (data) => {
    dispatch({ type: "DIFERENTIALTABLE_DATA", payload: data });
  };

  const differentialData=useSelector(state=>state.tableData.differentialTableData
    )
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
                <div>VidyaGxp</div>
                {/* <div>Environmental Laboratory</div> */}
              </div>
            </div>
            <div className="sub-head-2">Temperature Records</div>

            <div className="outerDiv5">
              <div className="btn-forms">
                <div
                  className={`${
                    isSelectedGeneral === true ? "btn-forms-isSelected" : "btn-forms-select"
                  }`}
                  onClick={() => {
                    setIsSelectedGeneral(true), setIsSelectedDetails(false);
                  }}
                >
                  General Information
                </div>
                <div
                  className={`${
                    isSelectedDetails === true ? "btn-forms-isSelected" : "btn-forms-select"
                  }`}
                  onClick={() => {
                    setIsSelectedDetails(true), setIsSelectedGeneral(false);
                  }}
                >
                  Details
                </div>
              </div>
              <div className="analytics-btn">
                <button className="btn-print" onClick={() => navigate("/analytics")}>
                  Analytics
                </button>
                <button className="btn-print" onClick={() => {}}>
                  Print
                </button>
              </div>
            </div>

          {temperatureRecordHistory?.map((itm,idx)=>{
            return <>
              {isSelectedGeneral === true ? (
              <>
                <div className="group-input">
                  <label className="color-label">Initiator </label>
                  <div>
                    <input
                      type="text"
                      value={itm.initiator}
                      onChange={(e) => {
                        const updatedHistory = [...temperatureRecordHistory];
                        updatedHistory[idx].initiator = e.target.value;
                        setDifferentialPRecord(updatedHistory);
                      }}
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
                      type="text"
                      value={itm.shortDescription}
                      onChange={(e) => {
                        const updatedHistory = [...temperatureRecordHistory];
                        updatedHistory[idx].shortDescription = e.target.value;
                        setDifferentialPRecord(updatedHistory);
                      }}
                    />
                  </div>
                </div>

                <div className="group-input">
                  <label className="color-label">Description</label>
                  <div>
                    <input
                      type="text"
                      value={itm.description}
                      onChange={(e) => {
                        const updatedHistory = [...temperatureRecordHistory];
                        updatedHistory[idx].description = e.target.value;
                        setDifferentialPRecord(updatedHistory);
                      }}
                    />
                  </div>
                </div>

                <div className="group-input">
                  <label className="color-label">Status</label>
                  <div>
                    <input
                      type="text"
                      value={itm.status}
                      onChange={(e) => {
                        const updatedHistory = [...temperatureRecordHistory];
                        updatedHistory[idx].status = e.target.value;
                        setDifferentialPRecord(updatedHistory);
                      }}
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
                    value={itm.department}
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
                    <option value="Central Quality Control">Central Quality Control</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Plasma Sourcing Grou">Plasma Sourcing Group</option>
                    <option value="Central Stores">Central Stores</option>
                    <option value="Information Technology Group">
                      Information Technology Group
                    </option>
                    <option value="Molecular Medicine">Molecular Medicine</option>
                    <option value="Central Laboratory">Central Laboratory</option>
                    <option value="Tech team">Tech team</option>
                  </select>
                </div>

                <div className="group-input">
                  <label className="color-label">Compression Area with respect to Corridor</label>

                  <div className="instruction">&nbsp;</div>
                  <select
                    className="form-control"
                    name="assign_to"
                    value={itm.compressionArea}
                    onChange={(e) =>
                      setDifferentialPRecord({
                        compressionArea: e.target.value,
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
                      itm.limit < 0.6
                        ? "limit"
                        : itm.limit > 2.6
                        ? "limit"
                        : ""
                    }`}
                    value={itm.limit}
                    onChange={(e) => setDifferentialPRecord({ limit: e.target.value })}
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
                      <th>Differential Pressure</th>
                      <th>Remark</th>
                      <th>Checked By</th>
                      <th>Supporting Documents</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {differentialData[0].map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>UID000{index + 1}</td>
                        <td>
                          <input
                            value={item.date}
                            onChange={(e) => {
                              const newData = [...allTableData];
                              newData[index].date = e.target.value;
                              setAllTableData(newData);
                            }}
                          />
                        </td>
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
                            value={item.limit}
                            className={`${
                              item.limit < 0.6 ? "limit" : item.limit > 2.6 ? "limit" : ""
                            }`}
                            onChange={(e) => {
                              const newData = [...allTableData];
                              newData[index].limit = e.target.value;
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
                        <td>
                          <input
                            value={item.checkedBy}
                            onChange={(e) => {
                              const newData = [...allTableData];
                              newData[index].checkedBy = e.target.value;
                              setAllTableData(newData);
                            }}
                          />
                        </td>
                        <td>
                          <div className="w-5">
                            <input
                              type="file"
                              onChange={(e) => handleFileChange(index, e.target.files[0])}
                            />
                          </div>
                          <div className="w-5">
                            {item.file && (
                              <button onClick={() => handleDeleteFile(index)}>Delete File</button>
                            )}
                          </div>
                        </td>
                        <td>
                          <DeleteIcon onClick={() => deleteRow(index)} />
                          {item.limit !== "" && (item.limit < 0.6 || item.limit > 2.6) && (
                            <button
                              className="deviation-btn"
                              onClick={() => {
                                navigate("/chart"), handleTableDataSave;
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
                    value={itm.reviewComment}
                    onChange={(e) => {
                      setDifferentialPRecord({ reviewComment: e.target.value });
                    }}
                  />
                </div>
                {/* Your JSX content */}

                {/* <Grid
                label={docFormFile[2].label}
                coloredLabel={docFormFile[2].coloredLabel}
                required={docFormFile[2].required}
                instruction={docFormFile[2].instruction}
                columnList={docFormFile[2].columnList}
                onChange={(data) => setDifferentialPRecord({ gridData: data })}
              /> */}
              </>
            ) : null}
            </>
          })}

            
          </div>
          <div className="button-block" style={{ width: "100%" }}>
            <button
              className="themeBtn"
              onClick={() => {
                handleSave(differentialPRecord), handleTableDataSave;
              }}
            >
              Save
            </button>
            <button className="themeBtn" onClick={() => navigate("/desktop")}>
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default TempretureRecordsPanel