import { useEffect, useReducer, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import "./Desktop.css";
import { convertDateFormat } from "../../components/DateReturners";
import { Link, useNavigate } from "react-router-dom";
import DiffrentialPressure from "../configForms/DiffrentialPressureRecord/DiffrentialPressure";
import { useDispatch, useSelector } from "react-redux";

function Desktop() {
  const navigate = useNavigate();
  const differentialPRecordHistory = useSelector(
    (state) => state.objects.objects
  );
  console.log(differentialPRecordHistory,"differentialPRecordHistory")
  const equipmentCRecordHistory = useSelector(
    (state) => state.equipment.EquipmentCleaningData
  );
  const areaAndERecordHistory = useSelector(
    (state) => state.area.areaAndEquipmentData
  );
  const temperatureRecordHistory = useSelector(
    (state) => state.temperature.tempratureRecordData
  );

  const [eLogSelect, setELogSelect] = useState("All_Records");
  const [getId, setGetId] = useState(null);
  console.log(getId);
  const dispatch = useDispatch();

  function padNumber(number, width) {
    number = number + "";
    return number.length >= width
      ? number
      : new Array(width - number.length + 1).join("0") + number;
  }

  const handleId = (eLogId) => {
    dispatch({ type: "SELECTED_ELOG_ID", payload: eLogId }); // Dispatching the selected ELog ID
    navigate("/tpr-panel");
  };
  const combinedRecords = [
    ...differentialPRecordHistory,
    ...equipmentCRecordHistory,
    ...areaAndERecordHistory,
    ...temperatureRecordHistory,
  ];
  return (
    <>
      <HeaderTop />
      <HeaderBottom />
      <div className="desktop-input-table-wrapper">
        <div className="input-wrapper">
          <div className="group-input-2">
            <label>eLog</label>
            <select
              value={eLogSelect}
              onChange={(e) => setELogSelect(e.target.value)}
            >
              <option value="All_Records">All Records</option>
              <option value="diffrential_pressure">
                Diffrential Pressure Record
              </option>
              <option value="area_and_equipment">
                Area & Equipment Usage Log
              </option>
              <option value="equipment_cleaning">
                Equipment Cleaning Checklist
              </option>
              <option value="temprature_records">Temperature Records</option>
            </select>
          </div>
          <button className="btn">Print</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>S no</th>
              <th>E.Log no</th>
              <th>Initiator</th>
              <th>Date of initiation</th>
              <th>Short description</th>
              <th>Process</th>
            </tr>
          </thead>
          <tbody>
            {eLogSelect === "diffrential_pressure"
              ? differentialPRecordHistory?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td>{item.eLogId}</td>
                      <td>{item.initiator}</td>
                      <td>{item.dateOfInitiation}</td>
                      <td>{item.shortDescription}</td>
                      <td>{item.process}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "area_and_equipment"
              ? areaAndERecordHistory?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td>{item.eLogId}</td>
                      <td>{item.initiator}</td>
                      <td>{item.dateOfInitiation}</td>
                      <td>{item.shortDescription}</td>
                      <td>{item.process}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "equipment_cleaning"
              ? equipmentCRecordHistory?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td>{item.eLogId}</td>
                      <td>{item.initiator}</td>
                      <td>{item.dateOfInitiation}</td>
                      <td>{item.shortDescription}</td>
                      <td>{item.process}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "temprature_records"
              ? temperatureRecordHistory?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td>{item.eLogId}</td>
                      <td>{item.initiator}</td>
                      <td>{item.dateOfInitiation}</td>
                      <td>{item.shortDescription}</td>
                      <td>{item.process}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "All_Records" &&
              combinedRecords?.map((item, index) => {
                return (
                  <tr key={item.index}>
                    <td> {index + 1}</td>
                    <td
                      style={{
                        cursor: "pointer",
                        color: "black", // Default text color
                      }}
                      onClick={() => {
                        handleId(item.eLogId),
                          console.log("Clicked, item.eLogId:", item.eLogId);
                        setGetId(item.eLogId);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "blue";
                      }} // Change text color on hover
                      onMouseLeave={(e) => {
                        e.target.style.color = "black";
                      }}
                    >
                      {item.eLogId}
                    </td>
                    <td>{item.initiator}</td>
                    <td>{item.dateOfInitiation}</td>
                    <td>{item.shortDescription}</td>
                    <td>{item.process}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Desktop;
