import { useEffect, useReducer, useState, } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import "../ConfigForms.css";
import { docFormFile, } from "./DifferentialPressureFunction.jsx";
import Grid from "../../../components/datafields/Grid.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

export default function DiffrentialPressure() {
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true)
  const [isSelectedDetails, setIsSelectedDetails] = useState(false)
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

  const uniqueId = "ABC/" + Math.floor(Math.random() * 1000).toString().padStart(3, '0') + "/" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  const navigate = useNavigate();
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
  }
  const [differentialPRecord, setDifferentialPRecord] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      process: "Diffrential pressure",
      eLogId: uniqueId,
      initiator: "",
      dateOfInitiation: date,
      shortDescription: "",
      description: "",
      status: "",
      department: "",
      compressionArea: "",
      limit: "",
      month: "february",
      gridData: [],
    }
  );

  const createObject = (newObject) => {
    dispatch({ type: "ADD_OBJECT", payload: newObject });
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
              <div className="sub-head-2">Differential Pressure Record</div>
              <div className="btn-forms">
                <div className={`${isSelectedGeneral === true ? "btn-forms-isSelected" : "btn-forms-select"}`} onClick={() => { setIsSelectedGeneral(true), setIsSelectedDetails(false) }}>General Information</div>
                <div className={`${isSelectedDetails === true ? "btn-forms-isSelected" : "btn-forms-select"}`} onClick={() => { setIsSelectedDetails(true), setIsSelectedGeneral(false) }}> Details</div>
              </div>

              {isSelectedGeneral === true ? <>
                <div className="group-input">
                  <label className="color-label">Initiator </label>
                  <div>
                    <input type="text" value={differentialPRecord.initiator} onChange={(e) => setDifferentialPRecord({ initiator: e.target.value })} />
                  </div>
                </div>

                <div className="group-input">
                  <label className="color-label">Date of Initiator</label>
                  <div>
                    <input type="text" value={date} onChange={(e) => setDifferentialPRecord({ dateOfInitiation: e.target.value })} />
                  </div>
                </div>

                <div className="group-input">
                  <label className="color-label">Short Description</label>
                  <div>
                    <input type="text" value={differentialPRecord.shortDescription} onChange={(e) => setDifferentialPRecord({ shortDescription: e.target.value })} />
                  </div>
                </div>

                <div className="group-input">
                  <label className="color-label">Description</label>
                  <div>
                    <input type="text" value={differentialPRecord.description} onChange={(e) => setDifferentialPRecord({ description: e.target.value })} />
                  </div>
                </div>

                <div className="group-input">
                  <label className="color-label">Status</label>
                  <div>
                    <input type="text" value={differentialPRecord.status} onChange={(e) => setDifferentialPRecord({ status: e.target.value })} />
                  </div>
                </div></> : null}

              {isSelectedDetails === true ? <>

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
                    <option value="Corporate Quality Assurance">Corporate Quality Assurance</option>
                    <option value="Quality Assurance Bio-Pharma">Quality Assurance Bio-Pharma</option>
                    <option value="Central Quality Control">Central Quality Control</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Plasma Sourcing Grou">Plasma Sourcing Group</option>
                    <option value="Central Stores">Central Stores</option>
                    <option value="Information Technology Group">Information Technology Group</option>
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
                    value={differentialPRecord.compressionArea}
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
                  <input type="number" className={`${differentialPRecord.limit< 0.6?"limit":(differentialPRecord.limit>2.6?"limit":"") }`} value={differentialPRecord.limit} onChange={(e) => setDifferentialPRecord({ limit: e.target.value })} />
                </div>

                <div className="group-input">
                  <label className="color-label">Month:</label>
                  <div>
                    <input type="text" value={currentMonth} readOnly />
                  </div>
                </div>

                <Grid
                  label={docFormFile[2].label}
                  coloredLabel={docFormFile[2].coloredLabel}
                  required={docFormFile[2].required}
                  instruction={docFormFile[2].instruction}
                  columnList={docFormFile[2].columnList}
                  onChange={(data) => setDifferentialPRecord({ gridData: data })}
                /></> : null}
            </div>
            <div className="button-block" style={{ width: "100%" }}>
              <button className="themeBtn" onClick={() => handleSave(differentialPRecord)}>
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
  );
}
