import React, { useEffect, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import "./Desktop.css";
import { convertDateFormat } from "../../components/DateReturners";
import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

function Desktop() {
  const [labIncident, setLabIncident] = useState();
  const [changeControl, setChangeControl] = useState();
  function padNumber(number, width) {
    number = number + "";
    return number.length >= width
      ? number
      : new Array(width - number.length + 1).join("0") + number;
  }
  const fetchLabIncidentData = async () => {
    try {
      const response = await fetch(
        "http://195.35.6.197:9091/LabIncident/api/findAllDivision"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setLabIncident(result);
    } catch (error) {
      toast.error(error);
    }
  };
  const fetchChangeControlData = async () => {
    try {
      const response = await fetch(
        "http://195.35.6.197:9091/changeControl/api/findAllDivision",
        {
          method: "GET",
          headers: {
            "access-control-allow-origin": "*",
            "Content-type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setChangeControl(result);
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    // fetchLabIncidentData();
    // fetchChangeControlData();
  }, []);
  return (
    <>
      <HeaderTop />

      <HeaderBottom />

      <div className="desktop-input-table-wrapper">
        <div className="input-wrapper">
          <div className="group-input-2">
            <label>eLog</label>
            <select>
              <option value="all_records">All Records</option>
              <option value="all_records">Diffrential Pressure Record</option>
              <option value="internal_audit">Area & Equipment Usage Log</option>
              <option value="external_audit">Equipment Cleaning Checklist</option>
            </select>
          </div>
          {/* <div className="group-input-2">
            <label>Criteria</label>
            <select>
              <option value="all_records">All Records</option>
              <option value="1">Closed Records</option>
              <option value="2">Opened Records</option>
              <option value="3">Cancelled Records</option>
              <option value="4">Overdue Records</option>
              <option value="5">Assigned To Me</option>
              <option value="6">Records Created Today</option>
            </select>
          </div> */}
          <button className="btn">Print</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Record</th>
                <th>Division</th>
                <th>eLog</th>
                <th>Short Description</th>
                <th>Date Opened</th>
                <th>Initiator</th>
                {/* <th>Due Date</th> */}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {labIncident &&
                labIncident.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/lab-incident-panel/${item.id}`}>{padNumber(item.id, 5)}</Link>
                    </td>
                    <td>{item.generalInformation[0].divisionCode}</td>
                    <td>{item.name}</td>
                    <td>{item.generalInformation[0].shortDescription}</td>
                    <td>{item.generalInformation[0].invocationType}</td>
                    <td>{item.generalInformation[0].assignedTo}</td>
                    <td>{convertDateFormat(item.generalInformation[0].dueDate)}</td>
                    <td></td>
                  </tr>
                ))}
              {changeControl &&
                changeControl.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/change-control-panel/${item.id}`}>{padNumber(item.id, 5)}</Link>
                    </td>
                    <td>{item.generalInfo[0].divisionCode}</td>
                    <td>{item.changeControlName}</td>
                    <td>{item.generalInfo[0].shortDescription}</td>
                    <td>{item.generalInfo[0].dueDate}</td>
                    <td>{item.generalInfo[0].assignedTo}</td>
                    <td>{convertDateFormat(item.generalInfo[0].dueDate)}</td>
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Desktop;
