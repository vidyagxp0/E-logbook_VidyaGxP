import React, { useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import "../ConfigForms.css";
import { MultiSelect } from "react-multi-select-component";
import {
  formList,
  site,
  NotifyTo,
  currentYear,
  interpretationOfResult,
  criticalSteps,
  referenceProcedures,
  approvers,
  responsibilities,
  reviewers,
  testData,
  Survey,
  docFormFile,
  docDetails,
  PersonPrintPermission,
  PersonDownloadPermission,
  workFlow,
} from "./DocumentFormFunction";

import RelatedRecords from "../../../components/datafields/RelatedRecords.jsx";
import Grid from "../../../components/datafields/Grid.jsx";
import { useNavigate } from "react-router-dom";
export default function DiffrentialPressure() {
  const navigate = useNavigate();
  const [selectedsetInstrumentSop, setSelectedsetInstrumentSop] = useState([]);
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const [instrumentSop, setInstrumentSop] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      responsibilities: "",
      purpose: "",
      scopeField: "",
      materialsRequired: "",
      equipmentInstruments: "",
      safetyPrecautions: "",
      procedure: "",
      operations: "",
      authorizationMatrix: "",
      references: "",
      changeControl: "",
      fileAttachment: "",
    }
  );
  const [differentialPRecord, setDifferentialPRecord] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      department: "",
      compressionArea: "",
      limit: "",
    }
  );
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
              KSA
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
                  <div>Lifelink ltd</div>
                  {/* <div>Environmental Laboratory</div> */}
                </div>
              </div>
              <div className="sub-head-2">Differential Pressure Record</div>

              <div className="group-input">
                <label>Department</label>

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
                  <option value="CQA">Corporate Quality Assurance</option>
                  <option value="QAB">Quality Assurance Bio-Pharma</option>
                  <option value="CQC">Central Quality Control</option>
                  <option value="Manu">Manufacturing</option>
                  <option value="PSG">Plasma Sourcing Group</option>
                  <option value="CS">Central Stores</option>
                  <option value="ITG">Information Technology Group</option>
                  <option value="MM">Molecular Medicine</option>
                  <option value="CL">Central Laboratory</option>
                  <option value="TT">Tech team</option>
                </select>
              </div>

              <div className="group-input">
                <label>Compression Area with respect to Corridor</label>

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
                  <option value="Shaleen Mishra">Area 1</option>
                  <option value="Amit guru">Area 2</option>
                  <option value="Vikash Prajapati">Area 3</option>
                  <option value="Anshul patel">Area 4</option>
                  <option value="Amit Patel">Area 5</option>
                  <option value="Aakash Asthana">Area 6</option>
                </select>
              </div>

              <div className="group-input">
                <label className="color-label">Limit</label>
                <div className="instruction"></div>
                <textarea type="text" rows="2" value="1.3" readOnly></textarea>
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
              />
            </div>
            <div className="button-block" style={{ width: "100%" }}>
              <button className="themeBtn">Save</button>
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
