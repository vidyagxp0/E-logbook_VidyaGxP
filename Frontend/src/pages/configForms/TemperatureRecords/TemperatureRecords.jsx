import { useEffect, useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NoteAdd } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderTop from "../../../components/Header/HeaderTop";
import { toast } from "react-toastify";

export default function TemperatureRecords() {
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
    setTemperatureRecords({
      gridData: allTableData,
    });
  }, [allTableData]);

  // Function to add a new row to the table
  const addRow = () => {
    const currentTime = new Date().toLocaleTimeString();
    const newRow = {
      date: date,
      time: currentTime,
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
    // if (parseFloat(data.limit) < 0.6 || parseFloat(data.limit) > 2.6) {
    //   toast.error("The limit value must be between 0.6 and 2.6.");
    //   return;
    // }
    toast.success("eLog Saved Successfully!");
    // createObject(data);
    TemperatureData(data);
    navigate("/dashboard");
  };
  const [temperatureRecords, setTemperatureRecords] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      process: "Temperature Records",
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
    }
    
  );


  const TemperatureData = (data) => {
    dispatch({ type: "ADD-TEMPERATURETDATA", payload: data });
  };
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
                        value={temperatureRecords.initiator}
                        onChange={(e) =>
                          setTemperatureRecords({ initiator: e.target.value })
                        }
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
                          setTemperatureRecords({
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
                        value={temperatureRecords.shortDescription}
                        onChange={(e) =>
                          setTemperatureRecords({
                            shortDescription: e.target.value,
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
                        value={temperatureRecords.description}
                        onChange={(e) =>
                          setTemperatureRecords({
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
                        value={temperatureRecords.status}
                        onChange={(e) =>
                          setTemperatureRecords({ status: e.target.value })
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
                      value={temperatureRecords.department}
                      onChange={(e) =>
                        setTemperatureRecords({
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
                      value={temperatureRecords.compressionArea}
                      onChange={(e) =>
                        setTemperatureRecords({
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
                        temperatureRecords.limit < 23
                          ? "limit"
                          : temperatureRecords.limit > 27
                          ? "limit"
                          : ""
                      }`}
                      value={temperatureRecords.limit}
                      onChange={(e) =>
                        setTemperatureRecords({ limit: e.target.value })
                      }
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
                        <th>Temperature Records</th>
                        <th>Remark</th>
                        <th>Checked By</th>
                        <th>Supporting Documents</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTableData?.map((item, index) => (
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
                                item.limit < 23
                                  ? "limit"
                                  : item.limit > 27
                                  ? "limit"
                                  : ""
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
                            {item.limit !== "" &&
                              (item.limit < 23 || item.limit > 27) && (
                                <button
                                  className="deviation-btn"
                                  onClick={() => {
                                    navigate("/chart")
                                  }}
                                >
                                  Deviation
                                </button>
                              )}
                            {item.limit !== "" &&
                              (item.limit < 23 || item.limit > 27) && (
                                <button
                                  className="deviation-btn"
                                  onClick={() => {
                                    navigate("/chart")
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

                  {/* <div className="group-input">
                  <label> Review By :- </label>
                </div>

                <div className="group-input">
                  <label htmlFor="">Review Comments</label>
                  <input
                    value={temperatureRecords.reviewComment}
                    onChange={(e) => {
                      setTemperatureRecords({ reviewComment: e.target.value });
                    }}
                  />
                </div> */}

                  {/* Your JSX content */}

                  {/* <Grid
                label={docFormFile[2].label}
                coloredLabel={docFormFile[2].coloredLabel}
                required={docFormFile[2].required}
                instruction={docFormFile[2].instruction}
                columnList={docFormFile[2].columnList}
                onChange={(data) => setTemperatureRecords({ gridData: data })}
              /> */}
              </>
            ) : null}
          </div>
          <div className="button-block" style={{ width: "100%" }}>
            <button
              className="themeBtn"
              onClick={() => {
                handleSave(temperatureRecords);
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
}
