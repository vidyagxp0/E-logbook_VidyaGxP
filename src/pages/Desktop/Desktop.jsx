import { useEffect, useReducer, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import "./Desktop.css";
import { convertDateFormat } from "../../components/DateReturners";
import { Link } from "react-router-dom";
import DiffrentialPressure from "../configForms/DiffrentialPressureRecord/DiffrentialPressure";
import { useSelector } from "react-redux";


function Desktop() {


  const differentialPRecordHistory = useSelector((state) => state.objects.objects);
  const equipmentCRecordHistory = useSelector((state) => state.equipment.EquipmentCleaningData);
  const areaAndERecordHistory = useSelector((state) => state.area.areaAndEquipmentData)
  const [labIncident, setLabIncident] = useState();
  const [changeControl, setChangeControl] = useState();
  const [eLogSelect, setELogSelect] = useState("All_Records")
console.log(eLogSelect,"eLogSelect")
  function padNumber(number, width) {
    number = number + "";
    return number.length >= width ? number : new Array(width - number.length + 1).join("0") + number;
  }
  const fetchLabIncidentData = async () => {
    try {
      const response = await fetch("http://195.35.6.197:9091/LabIncident/api/findAllDivision");
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
      const response = await fetch("http://195.35.6.197:9091/changeControl/api/findAllDivision", {
        method: "GET",
        headers: {
          "access-control-allow-origin": "*",
          "Content-type": "application/json",
        },
      });
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

  const combinedRecords = [
    ...differentialPRecordHistory,
    ...equipmentCRecordHistory,
    ...areaAndERecordHistory,
  ]
  return (
    <>

      <HeaderTop />
      <HeaderBottom />
      <div className="desktop-input-table-wrapper">
        <div className="input-wrapper">
          <div className="group-input-2">
            <label>eLog</label>
            <select value={eLogSelect} onChange={(e) => setELogSelect(e.target.value)}>
              <option value="All_Records" >All Records</option>
              <option value="diffrential_pressure">Diffrential Pressure Record</option>
              <option value="area_and_equipment">Area & Equipment Usage Log</option>
              <option value="equipment_cleaning">Equipment Cleaning Checklist</option>
            </select>
          </div>
          <button className="btn">Print</button>
        </div>
        {/* <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>s no</th>
                <th>uniqueId</th>
                <th>Date</th>
                <th>Time</th>
                <th>Differential Pressure</th>
                <th>Remark</th>
                <th>Checked by</th>
                <th>Department</th>
                <th>Compression Area</th>
              </tr>
            </thead>
            <tbody>
              {differentialPRecordHistory &&
                differentialPRecordHistory.map((doc) => (
                  <>
                    <tr key={doc.gridData[0]}>
                      {doc.gridData[0] && doc.gridData[0].cells.map((item) => <td>{item}</td>)}
                      {!doc.gridData[0] && (
                        <>
=                          <td>null</td> <td>null</td> <td>null</td> <td>null</td> <td>null</td> <td>null</td>{" "}
                          <td>null</td>{" "}
                        </>
                      )}
                      <td>{doc.department}</td>
                      <td>{doc.compressionArea}</td>
                    </tr>
                    {doc.gridData[1] && (
                      <tr key={doc.gridData[1]}>
                        {doc.gridData[1] && doc.gridData[1].cells.map((item) => <td>{item}</td>)}
                        <td>{doc.department}</td>
                        <td>{doc.compressionArea}</td>
                      </tr>
                    )}
                    {doc.gridData[2] && (
                      <tr key={doc.gridData[2]}>
                        {doc.gridData[2] && doc.gridData[2].cells.map((item) => <td>{item}</td>)}
                        <td>{doc.department}</td>
                        <td>{doc.compressionArea}</td>
                      </tr>
                    )}
                    {doc.gridData[3] && (
                      <tr key={doc.gridData[3]}>
                        {doc.gridData[3] && doc.gridData[3].cells.map((item) => <td>{item}</td>)}
                        <td>{doc.department}</td>
                        <td>{doc.compressionArea}</td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
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
        </div> */}

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
            {eLogSelect === "diffrential_pressure" ? differentialPRecordHistory?.map((item, index) => {
              return <tr key={item.index}>
                <td> {index + 1}</td>
                <td>{item.eLogId}</td>
                <td>{item.initiator}</td>
                <td>{item.dateOfInitiation}</td>
                <td>{item.shortDescription}</td>
                <td>{item.process}</td>
              </tr>
            }) : null}

            {eLogSelect === "area_and_equipment" ? areaAndERecordHistory?.map((item, index) => {
              return <tr key={item.index}>
                <td> {index + 1}</td>
                <td>{item.eLogId}</td>
                <td>{item.initiator}</td>
                <td>{item.dateOfInitiation}</td>
                <td>{item.shortDescription}</td>
                <td>{item.process}</td>
              </tr>
            }) : null}

            {eLogSelect === "equipment_cleaning" ? equipmentCRecordHistory?.map((item, index) => {
              return <tr key={item.index}>
                <td> {index + 1}</td>
                <td>{item.eLogId}</td>
                <td>{item.initiator}</td>
                <td>{item.dateOfInitiation}</td>
                <td>{item.shortDescription}</td>
                <td>{item.process}</td>
              </tr>
            }) : null}

 {eLogSelect === "All_Records" && combinedRecords?.map((item, index) => {
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
    })}
           
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Desktop;
