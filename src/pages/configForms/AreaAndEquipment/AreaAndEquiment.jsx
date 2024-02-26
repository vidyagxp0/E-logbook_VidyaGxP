import React, { useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import "../ConfigForms.css";
import { MultiSelect } from "react-multi-select-component";
import {
  docFormFile, 
} from "./AreaAndEquimentFunction.jsx";


import Grid from "../../../components/datafields/Grid.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function AreaAndEquiment() {
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(false)
  const [isSelectedDetails, setIsSelectedDetails] = useState(false)
  const uniqueId = "ABC/" + Math.floor(Math.random() * 1000).toString().padStart(3, '0') + "/" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const date = getCurrentDate()
  const [areaAndEquiment, setAreaAndEquiment] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      eLogId: uniqueId,
      area: "",
      areaCode: "",
      initiator: "",
      dateOfInitiation: date.currentDate,
      shortDescription: "",
      status: "",
      description: "",
      process:"Area and equipment"
    }
  );

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const currentDate = `${day}/${month}/${year}`;

    return {
      currentDate: currentDate,
    };
  }
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const createObject = (newObject) => {
    dispatch({ type: "AREAANDEQUIPMENT_DATA", payload: newObject });
  };

  const handleSave = (data) => {
    toast.success("eLog Saved Successfully!");
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
    createObject(data);
    navigate("/desktop");
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
                  <div>Life Link ltd.</div>
                  {/* <div>Environmental Laboratory</div> */}
                </div>
              </div>
              <div className="sub-head-2">Area and Equipment Usage Log</div>
              <div className="btn-forms">
                <div className={`${isSelectedGeneral === true ? "btn-forms-isSelected" : "btn-forms-select"}`} onClick={() => { setIsSelectedGeneral(true), setIsSelectedDetails(false) }}>General Information</div>
                <div className={`${isSelectedDetails === true ? "btn-forms-isSelected" : "btn-forms-select"}`} onClick={() => { setIsSelectedDetails(true), setIsSelectedGeneral(false) }}> Details</div>
              </div>


           {isSelectedGeneral===true?<>   <div className="group-input">
                <label className="color-label">Initiator </label>
                <div>
                  <input type="text" value={areaAndEquiment.initiator} onChange={(e) => setAreaAndEquiment({ initiator: e.target.value })} />
                </div>
              </div>

              <div className="group-input">
                <label className="color-label">Date of Initiaton</label>
                <div>
                  <input type="text" value={date.currentDate} onChange={(e) => setAreaAndEquiment({ dateOfInitiation: e.target.value })} />
                </div>
              </div>

              <div className="group-input">
                <label className="color-label">Short Description</label>
                <div>
                  <input type="text" value={areaAndEquiment.shortDescription} onChange={(e) => setAreaAndEquiment({ shortDescription: e.target.value })} />
                </div>
              </div>

              <div className="group-input">
                <label className="color-label">Description</label>
                <div>
                  <input type="text" value={areaAndEquiment.description} onChange={(e) => setAreaAndEquiment({ description: e.target.value })} />
                </div>
              </div>

              <div className="group-input">
                <label className="color-label">Status</label>
                <div>
                  <input type="text" value={areaAndEquiment.status} onChange={(e) => setAreaAndEquiment({ status: e.target.value })} />
                </div>
              </div></>:null}

{isSelectedDetails===true?<> <div className="group-input">
                <label className="color-label">Area </label>
                <div>
                  <input type="text" value={areaAndEquiment.area} onChange={(e) => setAreaAndEquiment({ area: e.target.value })} />
                </div>
              </div>
              <div className="group-input">
                <label className="color-label">Area Code </label>
                <div>
                  <input type="text" value={areaAndEquiment.areaCode} onChange={(e) => setAreaAndEquiment({ areaCode: e.target.value })} />
                </div>
              </div>

              <Grid
                label={docFormFile[2].label}
                coloredLabel={docFormFile[2].coloredLabel}
                required={docFormFile[2].required}
                instruction={docFormFile[2].instruction}
                columnList={docFormFile[0].columnList}
              /></>:null}
             

              <div className="button-block" style={{ width: "100%" }}>
                <button className="themeBtn" onClick={() => handleSave(areaAndEquiment)}>
                  Save
                </button>
                <button className="themeBtn" onClick={() => navigate("/desktop")}>
                  Exit
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
