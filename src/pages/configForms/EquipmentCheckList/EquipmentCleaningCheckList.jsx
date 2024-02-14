
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
export default function EquipmentCleaningCheckList() {
  const [selectedsetInstrumentSop, setSelectedsetInstrumentSop] = useState([]);
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
                  <img src="/customer.png" alt="..." />
                </div>
                <div className="main-head">
                  <div>Diffrential Pressure Record</div>
                  <div>Environmental Laboratory</div>
                </div>
              </div>
              <div className="sub-head-2">Instrument SOP</div>
              <div className="group-input">
                <label className="color-label">1.0 Purpose</label>
                <div className="instruction">
                  To establish a plan for handling, operating, calibration and maintaining of instrumentation
                </div>
                <textarea
                  type="text"
                  rows="2"
                  value={instrumentSop.purpose}
                  onChange={(e) => setInstrumentSop({ purpose: e.target.value })}
                ></textarea>
              </div>
              <div className="group-input">
                <label className="color-label">2.0 Scope/Field of Application</label>
                <textarea
                  type="text"
                  rows="2"
                  value={instrumentSop.scopeField}
                  onChange={(e) => setInstrumentSop({ scopeField: e.target.value })}
                ></textarea>
              </div>
              <div className="group-input">
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
              </div>
              <div className="group-input">
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
              </div>
              <div className="group-input">
                <label className="color-label">8.0 References</label>
                <div className="instruction"></div>
                <textarea
                  type="text"
                  rows="2"
                  value={instrumentSop.references}
                  onChange={(e) => setInstrumentSop({ references: e.target.value })}
                ></textarea>
              </div>
              <RelatedRecords
                label="9.0 Change Control"
                coloredLabel={true}
                instruction="Add referenced Change Control records"
              />
              <Grid
                label={docFormFile[2].label}
                coloredLabel={docFormFile[2].coloredLabel}
                required={docFormFile[2].required}
                instruction={docFormFile[2].instruction}
                columnList={docFormFile[2].columnList}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
