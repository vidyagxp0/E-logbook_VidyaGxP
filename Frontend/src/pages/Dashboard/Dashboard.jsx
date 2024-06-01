import { useEffect, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [eLogSelect, setELogSelect] = useState("All_Records");
  const [differentialPressureElogs, setDifferentialPressureElogs] = useState(
    []
  );
  const dispatch = useDispatch();

  const equipmentCRecordHistory = useSelector(
    (state) => state.equipment.EquipmentCleaningData
  );
  const areaAndERecordHistory = useSelector(
    (state) => state.area.areaAndEquipmentData
  );
  const temperatureRecordHistory = useSelector(
    (state) => state.temperature.temperatureRecordData
  );

  useEffect(() => {
    const newConfig = {
      method: "get",
      url: "http://localhost:1000/process/get-all-differential-pressure",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfig)
      .then((response) => {
        setDifferentialPressureElogs(response.data.message);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  const handleRowClick = (row) => {
    dispatch({ type: "SELECT_ROW", payload: row });
  };

  const combinedRecords = [
    ...differentialPressureElogs,
    ...areaAndERecordHistory,
    ...equipmentCRecordHistory,
    ...temperatureRecordHistory,
  ];

  const handleNavigation = (item) => {
    handleRowClick(item);
    if (item.DifferentialPressureRecords) {
      navigate("/dpr-panel", { state: item });
    } else if (item.process === "Area and equipment") {
      navigate("/area-and-equipment-panel", { state: item });
    } else if (item.process === "Temperature Records") {
      navigate("/tpr-panel", { state: item });
    } else if (item.process === "Equipment cleaning checklist") {
      navigate("/ecc-panel", { state: item });
    } else {
      // Handle default or fallback navigation if needed
    }
  };

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
              <option value="temperature_records">Temperature Records</option>
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
              ? differentialPressureElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() => navigate("/dpr-panel", { state: item })}
                        onMouseEnter={(e) => {
                          e.target.style.color = "blue";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "black";
                        }}
                      >
                        {`DP${item.form_id}`}
                      </td>
                      <td>{item.initiator_name}</td>
                      <td>{item.date_of_initiation.split("T")[0]}</td>
                      <td>{item.description}</td>
                      <td>Differential Pressure</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "area_and_equipment"
              ? areaAndERecordHistory?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td onClick={() => navigate("/area-and-equipment-panel")}>
                        {item.eLogId}
                      </td>
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
                      <td onClick={() => navigate("/ecc-panel")}>
                        {item.eLogId}
                      </td>
                      <td>{item.initiator}</td>
                      <td>{item.dateOfInitiation}</td>
                      <td>{item.shortDescription}</td>
                      <td>{item.process}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "temperature_records"
              ? temperatureRecordHistory?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td onClick={() => navigate("/tpr-panel")}>
                        {item.eLogId}
                      </td>
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
                  <tr key={item.eLogId}>
                    <td> {index + 1}</td>
                    <td
                      style={{
                        cursor: "pointer",
                        color: "black",
                      }}
                      onClick={() => {
                        handleNavigation(item);
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "blue";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "black";
                      }}
                    >
                      {item.DifferentialPressureRecords
                        ? `DP${item.form_id}`
                        : null}
                    </td>
                    <td>{item.initiator_name}</td>
                    <td>{item.date_of_initiation.split("T")[0]}</td>
                    <td>{item.description}</td>
                    <td>
                      {item.DifferentialPressureRecords
                        ? "Differential Pressure"
                        : null}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
