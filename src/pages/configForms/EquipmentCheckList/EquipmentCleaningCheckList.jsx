import { useReducer, useState, useEffect } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import "../ConfigForms.css";
import { tableData } from "./EquipmentCleaningFunction";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import ESignatureModal from '../../../components/Modals/ESignatureModal/ESignatureModal'
import { Tooltip } from "@mui/material";
// import Grid from "../../../components/datafields/Grid.jsx";
export default function EquipmentCleaningCheckList() {
  // const [selectedsetInstrumentSop, setSelectedsetInstrumentSop] = useState([]);
  const [instrumentSop, setInstrumentSop] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      currentDate: "",
      product: "",
      batchNo: "",
      changeControl: "",
      fileAttachment: "",
    }
  );

  const [currentDate, setCurrentDate] = useState("");
  const [signatureModal, setSignatureModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [saveModal, setSaveModal] = useState(false)
 
  const closeSignatureModal = () => setSignatureModal(false);
  useEffect(() => {
    setCurrentDate(getCurrentDateTime().currentDate);
  }, []);

  const [tableData, setTableData] = useState([
    { sNo: "1", description: "	Machine is switched OFF", observation: "", comments: "", doneBy: "" },
    { sNo: "2", description: "Hopper and constant amount feeder Cleaned", observation: "", comments: "", doneBy: "" },
    { sNo: "3", description: "	Scrapper assembly, ejection chute and powder scraper cleaned.	", observation: "", comments: "", doneBy: "" },
    { sNo: "4", description: "Powder conveying system, hosepipes and filter cleaned. 	", observation: "", comments: "", doneBy: "" },
    { sNo: "5", description: "Turret clean	", observation: "", comments: "", doneBy: "" },
    { sNo: "6", description: "Punches and dies cleaned.	", observation: "", comments: "", doneBy: "" },
    { sNo: "7", description: "Main compression and pre-compression rollers cleaned.	", observation: "", comments: "", doneBy: "" },
    { sNo: "8", description: "Turret clean	", observation: "", comments: "", doneBy: "" },
    { sNo: "9", description: "Machine platform cleaned.	", observation: "", comments: "", doneBy: "" },
    { sNo: "10", description: "Top and bottom side of the machine cleaned.", observation: "", comments: "", doneBy: "" },
    { sNo: "11", description: "All the screws, bolts and sensors cleaned.	", observation: "", comments: "", doneBy: "" }
  
  ]);

  const handleInputChange = (index, name, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][name] = value;
    setTableData(updatedTableData);
  };

  function getCurrentDateTime() {

    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const currentDate = `${month}/${day}/${year}`;

    return {
      currentDate: currentDate,
    };
  }


  return (
    <>
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-page">
          <div className="top-block">
            <div>
              <strong> Record Name:&nbsp;</strong>Document
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
                  <img src="/lifelogo.png" alt="..." />
                </div>
                <div className="main-head">
                  <div>LifeLink Digital ltd.</div>
                  {/* <div>Environmental Laboratory</div> */}
                </div>
              </div>
              <div className="sub-head-2">Equipment Cleaning CheckList</div>
              <div className="group-input">
                <label className="color-label">Date :</label>

                <input
                  type="text"
                  rows="2"
                  value={currentDate}
                  onChange={(e) => setInstrumentSop({ currentDate: e.target.value })}
                ></input>
              </div>
              <div className="group-input">
                <label className="color-label">Product :</label>
                <textarea
                  type="text"
                  rows="2"
                  value={instrumentSop.product}
                  onChange={(e) => setInstrumentSop({ product: e.target.value })}
                ></textarea>
              </div>
              {/* <div className="group-input">
                <label>
                  {instrumentSop.responsibilities === "Yes" && ""}
                  <div className="required"></div>3.0 Responsibilities
                </label>
                <div className="instruction">The performance of the tests should be done by</div>
                <MultiSelect
                  options={responsibilities}
                  value={selectedsetInstrumentSop}
                  onChange={setSelectedsetInstrumentSop}
                  labelledBy="selectedsetInstrumentSop"
                  required={instrumentSop.responsibilities === "Yes"}
                  disabled={!instrumentSop.responsibilities === "Yes"}
                />
              </div> */}
              {/* <div className="group-input">
                <label className="color-label">4.0 Materials Required</label>
                <textarea
                  type="text"
                  rows="2"
                  value={instrumentSop.materialsRequired}
                  onChange={(e) => setInstrumentSop({ materialsRequired: e.target.value })}
                ></textarea>
              </div>
              <div className="group-input">
                <label className="color-label">5.0 Procedure</label>
                <textarea
                  type="text"
                  rows="2"
                  value={instrumentSop.procedure}
                  onChange={(e) => setInstrumentSop({ procedure: e.target.value })}
                ></textarea>
              </div>
              <div className="group-input">
                <label className="color-label">6.0 Operations</label>
                <div className="instruction"></div>
                <textarea
                  type="text"
                  rows="2"
                  value={instrumentSop.operations}
                  onChange={(e) => setInstrumentSop({ operations: e.target.value })}
                ></textarea>
              </div>
              <div className="group-input">
                <label className="color-label">7.0 Authorization Matrix</label>
                <div className="instruction"></div>
                <textarea
                  type="text"
                  rows="2"
                  value={instrumentSop.authorizationMatrix}
                  onChange={(e) => setInstrumentSop({ authorizationMatrix: e.target.value })}
                ></textarea>
              </div> */}
              <div className="group-input">
                <label className="color-label">Batch No :</label>
                <div className="instruction"></div>
                <textarea
                  type="text"
                  rows="2"
                  value={instrumentSop.batchNo}
                  onChange={(e) => setInstrumentSop({ batchNo: e.target.value })}
                ></textarea>
              </div>

              {/* <Grid
                label={docFormFile[0].label}
                coloredLabel={docFormFile[0].coloredLabel}
                required={docFormFile[0].required}
                instruction={docFormFile[0].instruction}
                columnList={docFormFile[0].columnList}
              /> */}
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>S no.</th>
                      <th>Description</th>
                      <th>Observation</th>
                      <th>Comments</th>
                      <th>Done By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => {
                      return <tr key={index}>
                        <td>{item.sNo}</td>
                        <td>{item.description}</td>
                        <td>
                          <div className="radio-btn">
                            <input
                              type="radio"
                              id={`ok${index}`}
                              name={`observation${index}`}
                              value="ok"
                              checked={item.observation === "ok"}
                              onChange={(e) => handleInputChange(index, "observation", e.target.value)}
                            />
                            <label>OK</label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id={`no${index}`}
                              name={`observation${index}`}
                              value="no"
                              checked={item.observation === "no"}
                              onChange={(e) => handleInputChange(index, "observation", e.target.value)}
                            />
                            <label>Not ok</label>
                          </div>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.comments}
                            onChange={(e) => handleInputChange(index, "comments", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.doneBy}
                            onChange={(e) => handleInputChange(index, "doneBy", e.target.value)}
                          />
                        </td>


                        <td className="Actions">
                          <Tooltip title="Delete">
                            <DeleteIcon onClick={() => setSignatureModal(true)} />
                          </Tooltip>
                          <Tooltip title="Update">
                            <EditIcon onClick={() => setUpdateModal(true)} />
                          </Tooltip>
                          <Tooltip title="Submit">
                            <SaveAltIcon onClick={() => setSaveModal(true)} />
                          </Tooltip>
                          <Tooltip title="save">
                            <TurnedInNotIcon onClick={() => alert("Data save successfully")} />
                          </Tooltip>

                        </td>
                      </tr>
                    })}

                  </tbody>
                </table>
              </div>


            </div>
          </div>
        </div>
      </div>


      {signatureModal && <ESignatureModal closeModal={closeSignatureModal}  />}
      {updateModal && <ESignatureModal closeModal={() => setUpdateModal(false)} />}
      {saveModal && <ESignatureModal closeModal={() => setSaveModal(false)} />}
    </>
  );
}
