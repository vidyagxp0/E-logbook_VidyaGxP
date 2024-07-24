import { useEffect, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hasAccess } from "../../components/userAuth/userAuth";

function Dashboard() {
  const navigate = useNavigate();
  const [eLogSelect, setELogSelect] = useState("All_Records");
  
  const [differentialPressureElogs, setDifferentialPressureElogs] = useState([]);
  const [tempratureRecordElogs, setTempratureRecordElogs] = useState([]);
  const [areaAndERecordElogs, setAreaAndERecordElogs] = useState([]);
  const [equipmentCRecordElogs, setEquipmentCRecordElogs] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newConfig = {
          method: "get",
          url: "http://localhost:1000/differential-pressure/get-all-differential-pressure",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        };

        const response = await axios(newConfig);
        const allDifferentialPressureElogs = response.data.message;
        const filteredArray = allDifferentialPressureElogs.filter((elog) => {
          const userId = userDetails.userId;
          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 1)
          );
        });
        setDifferentialPressureElogs(filteredArray);

        const newConfigTemp = {
          method: "get",
          url: "http://localhost:1000/temprature-record/get-all-temprature-record",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        };

        const responseTemp = await axios(newConfigTemp);
        const allTempratureRecordElogs = responseTemp.data.message;
        const filteredArrayTemp = allTempratureRecordElogs.filter((elog) => {
          const userId = userDetails.userId;
          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setTempratureRecordElogs(filteredArrayTemp);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchData();
  }, []);

  const combinedRecords = [
    ...differentialPressureElogs,
    ...areaAndERecordElogs,
    ...equipmentCRecordElogs,
    ...tempratureRecordElogs,
  ];

  const handleNavigation = (item) => {
    if (item.DifferentialPressureRecords) {
      navigate("/dpr-panel", { state: item });
    } else if (item.process === "Area and equipment") {
      navigate("/area-and-equipment-panel", { state: item });
    } else if (item.TempratureRecords) {
      navigate("/tpr-panel", { state: item });
    } else if (item.process === "Equipment cleaning checklist") {
      navigate("/ecc-panel", { state: item });
    } else {
      // Handle default or fallback navigation if needed
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return combinedRecords.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(combinedRecords.length / itemsPerPage);

  return (
    <>
      <HeaderTop />
      <HeaderBottom />

      <div className="desktop-input-table-wrapper">
        <div className="input-wrapper">
          <div className="group-input-2">
            <label>ELog</label>
            <select
              value={eLogSelect}
              onChange={(e) => setELogSelect(e.target.value)}
            >
              <option value="All_Records">All Records</option>
              <option value="diffrential_pressure">Diffrential Pressure Record</option>
              <option value="area_and_equipment">Area & Equipment Usage Log</option>
              <option value="equipment_cleaning">Equipment Cleaning Checklist</option>
              <option value="temperature_records">Temperature Records</option>
            </select>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>S no</th>
              <th>E.Log no</th>
              <th>Initiator</th>
              <th>Date of initiation</th>
              <th>Short description</th>
              <th>Status</th>
              <th>Site</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedData().map((item, index) => (
              <tr key={item.eLogId}>
                <td> {index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td
                  style={{
                    cursor: "pointer",
                    color: "black",
                  }}
                  onClick={() => handleNavigation(item)}
                  onMouseEnter={(e) => {
                    e.target.style.color = "blue";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "black";
                  }}
                >
                  {item.DifferentialPressureRecords
                    ? `DP${item.form_id}`
                    : item.TempratureRecords
                    ? `TR${item.form_id}`
                    : null}
                </td>
                <td>{item.initiator_name}</td>
                <td>{item.date_of_initiation.split("T")[0]}</td>
                <td>{item.description}</td>
                <td>{item.status}</td>
                <td>
                  {item.site_id === 1
                    ? "India"
                    : item.site_id === 2
                    ? "Malaysia"
                    : item.site_id === 3
                    ? "EMEA"
                    : "EU"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div> */}
      </div>
    </>
  );
}

export default Dashboard;
