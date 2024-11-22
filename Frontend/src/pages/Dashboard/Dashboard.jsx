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
  const [differentialPressureElogs, setDifferentialPressureElogs] = useState(
    []
  );
  const [tempratureRecordElogs, setTempratureRecordElogs] = useState([]);
  // const [areaAndERecordElogs, setAreaAndERecordElogs] = useState([]);
  const [equipmentCRecordElogs, setEquipmentCRecordElogs] = useState([]);
  const [loadedQuantityElogs, setLoadedQuantityElogs] = useState([]);
  const [mediaRecordElogs, setMediaRecordElogs] = useState([]);
  const [dispensingOfMaterialsElogs, setDispensingOfMaterialsElogs] = useState(
    []
  );
  const [operationOfSterilizerElogs, setOperationOfSterilizerElogs] = useState(
    []
  );
  console.log(operationOfSterilizerElogs, "operationOfSterilizerElogs");
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

  useEffect(() => {
    const newConfig = {
      method: "get",
      url: "http://localhost:1000/differential-pressure/get-all-differential-pressure",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfig)
      .then((response) => {
        const allDifferentialPressureElogs = response.data.message;
        console.log(
          allDifferentialPressureElogs,
          "allDifferentialPressureElogs"
        );
        let filteredArray = allDifferentialPressureElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 1)
          );
        });
        setDifferentialPressureElogs(filteredArray);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfigTemp = {
      method: "get",
      url: "http://localhost:1000/temprature-record/get-all-temprature-record",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfigTemp)
      .then((response) => {
        const allTempratureRecordElogs = response.data.message;
        let filteredArray = allTempratureRecordElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setTempratureRecordElogs(filteredArray);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfigloaded = {
      method: "get",
      url: "http://localhost:1000/loaded-quantity/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfigloaded)
      .then((response) => {
        const allLoadedQuantityElogs = response.data.message;
        let filteredArray = allLoadedQuantityElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setLoadedQuantityElogs(allLoadedQuantityElogs);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfigMedia = {
      method: "get",
      url: "http://localhost:1000/media-record/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfigMedia)
      .then((response) => {
        const allMediaRecordElogs = response.data.message;
        let filteredArray = allMediaRecordElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setMediaRecordElogs(filteredArray);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfigDispensing = {
      method: "get",
      url: "http://localhost:1000/dispensing-material/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfigDispensing)
      .then((response) => {
        const allDispensingMaterialElogs = response.data.message;
        let filteredArray = allDispensingMaterialElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setDispensingOfMaterialsElogs(filteredArray);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    const newOperationSterelizer = {
      method: "get",
      url: "http://localhost:1000/operation-sterlizer/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newOperationSterelizer)
      .then((response) => {
        const allOperationOfSterelizer = response.data.message;
        let filteredArray = allOperationOfSterelizer.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setOperationOfSterilizerElogs(filteredArray);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  const combinedRecords = [
    ...differentialPressureElogs,
    // ...areaAndERecordElogs,
    ...equipmentCRecordElogs,
    ...tempratureRecordElogs,
    ...loadedQuantityElogs,
    ...mediaRecordElogs,
    ...dispensingOfMaterialsElogs,
    ...operationOfSterilizerElogs,
  ];

  const handleNavigation = (item) => {
    if (item.DifferentialPressureRecords) {
      navigate("/dpr-panel", { state: item });
      // } else if (item.process === "Area and equipment") {
      //   navigate("/area-and-equipment-panel", { state: item });
    } else if (item.TempratureRecords) {
      navigate("/tpr-panel", { state: item });
    } else if (item.process === "Equipment cleaning checklist") {
      navigate("/ecc-panel", { state: item });
    } else if (item.LoadedQuantityRecords) {
      navigate("/loaded-quantity-panel", { state: item });
    } else if (item.MediaRecords) {
      navigate("/media-record-panel", { state: item });
    } else if (item.OperationOfSterilizerRecords) {
      navigate("/operation-of-sterilizer-panel", { state: item });
    } else if (item.DispenseOfMaterials) {
      navigate("/dispensing-of-material-panel", { state: item });
    } else {
      // Handle default or fallback navigation if needed
    }
  };

  const formatDate = (dateString) => {
    const utcDate = new Date(dateString);
    return utcDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <HeaderTop />
      <HeaderBottom />

      <div className="desktop-input-table-wrapper">
        <div
          className="input-wrapper"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            className="group-input-2"
            style={{ width: "70%", display: "flex", justifyContent: "center" }}
          >
            {/* <label>eLog</label> */}
            <select
              value={eLogSelect}
              onChange={(e) => setELogSelect(e.target.value)}
              style={{ height: "40px" }}
            >
              <option value="All_Records">All Records</option>
              <option value="diffrential_pressure">
                Diffrential Pressure Record
              </option>
              {/* <option value="area_and_equipment">
                Area & Equipment Usage Log
              </option> */}
              <option value="equipment_cleaning">
                Equipment Cleaning Checklist
              </option>
              <option value="temperature_records">Temperature Records</option>
              <option value="loaded_quantity">Loaded Quantity</option>
              <option value="media_record">Media Record</option>
              <option value="operation_of_sterilizer">
                Operation Of Sterilizer
              </option>
              <option value="dispensing_of_material">
                Dispensing Of Materials
              </option>
            </select>
          </div>
          {/* <button className="btn">Print</button> */}
        </div>

        <table>
          <thead>
            <tr>
              <th>S no</th>
              <th>E.Log no</th>
              <th>Process</th>
              <th>Site</th>
              <th>Short description</th>
              <th>Initiator</th>
              <th>Date of initiation</th>
              <th>Status</th>
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
                      <td>Differential Pressure</td>
                      <td>
                        {item.site_id === 1
                          ? "India"
                          : item.site_id === 2
                          ? "Malaysia"
                          : item.site_id === 3
                          ? "EMEA"
                          : "EU"}
                      </td>
                      <td>{item.description}</td>
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {/* {eLogSelect === "area_and_equipment"
              ? areaAndERecordElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td onClick={() => navigate("/area-and-equipment-panel")}>
                        {item.eLogId}
                      </td>
                      <td>{item.process}</td>
                      <td>{item.shortDescription}</td>
                      <td>{item.initiator}</td>
                      <td>{item.dateOfInitiation}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null} */}

            {eLogSelect === "equipment_cleaning"
              ? equipmentCRecordElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td onClick={() => navigate("/ecc-panel")}>
                        {item.eLogId}
                      </td>
                      <td>{item.process}</td>
                      <td>{item.initiator}</td>
                      <td>{item.dateOfInitiation}</td>
                      <td>{item.shortDescription}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "temperature_records"
              ? tempratureRecordElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() => navigate("/tpr-panel", { state: item })}
                        onMouseEnter={(e) => {
                          e.target.style.color = "blue";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "black";
                        }}
                      >
                        {`TR${item.form_id}`}
                      </td>
                      <td>Temperature Records</td>
                      <td>
                        {item.site_id === 1
                          ? "India"
                          : item.site_id === 2
                          ? "Malaysia"
                          : item.site_id === 3
                          ? "EMEA"
                          : "EU"}
                      </td>
                      <td>{item.description}</td>
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "loaded_quantity"
              ? loadedQuantityElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/loaded-quantity-panel", { state: item })
                        }
                        onMouseEnter={(e) => {
                          e.target.style.color = "blue";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "black";
                        }}
                      >
                        {`LQ${item?.form_id}`}
                      </td>
                      <td>Loaded Quantity</td>
                      <td>
                        {item.site_id === 1
                          ? "India"
                          : item.site_id === 2
                          ? "Malaysia"
                          : item.site_id === 3
                          ? "EMEA"
                          : "EU"}
                      </td>
                      <td>{item.description}</td>
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "operation_of_sterilizer"
              ? operationOfSterilizerElogs?.map((item, index) => {
                  return (
                    <>
                      <tr key={item.index}>
                        <td> {index + 1}</td>
                        <td
                          style={{
                            cursor: "pointer",
                            color: "black",
                          }}
                          onClick={() =>
                            navigate("/operation-of-sterilizer-panel", {
                              state: item,
                            })
                          }
                          onMouseEnter={(e) => {
                            e.target.style.color = "blue";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = "black";
                          }}
                        >
                          {`OF${item.form_id}`}
                        </td>
                        <td>Operation of sterilizer</td>
                        <td>
                          {item.site_id === 1
                            ? "India"
                            : item.site_id === 2
                            ? "Malaysia"
                            : item.site_id === 3
                            ? "EMEA"
                            : "EU"}
                        </td>
                        <td>{item.description}</td>
                        <td>{item.initiator_name}</td>
                        <td>{formatDate(item.date_of_initiation)}</td>
                        <td>{item.status}</td>
                      </tr>
                    </>
                  );
                })
              : null}

            {eLogSelect === "media_record"
              ? mediaRecordElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/media-record-panel", { state: item })
                        }
                        onMouseEnter={(e) => {
                          e.target.style.color = "blue";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "black";
                        }}
                      >
                        {`MR${item.form_id}`}
                      </td>
                      <td>Media Record</td>
                      <td>
                        {item.site_id === 1
                          ? "India"
                          : item.site_id === 2
                          ? "Malaysia"
                          : item.site_id === 3
                          ? "EMEA"
                          : "EU"}
                      </td>
                      <td>{item.description}</td>
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "dispensing_of_material"
              ? dispensingOfMaterialsElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/dispensing-of-material-panel", {
                            state: item,
                          })
                        }
                        onMouseEnter={(e) => {
                          e.target.style.color = "blue";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "black";
                        }}
                      >
                        {`DM${item.form_id}`}
                      </td>
                      <td>Dispensing of Material </td>
                      <td>
                        {item.site_id === 1
                          ? "India"
                          : item.site_id === 2
                          ? "Malaysia"
                          : item.site_id === 3
                          ? "EMEA"
                          : "EU"}
                      </td>
                      <td>{item.description}</td>
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "All_Records" &&
              combinedRecords
                ?.sort(
                  (a, b) =>
                    new Date(b.date_of_initiation) -
                    new Date(a.date_of_initiation)
                ) // Sorting in descending order
                .map((item, index) => (
                  <>
                    {/* {console.log(item, "item")} */}
                    <tr key={item.eLogId}>
                      <td>{index + 1}</td>
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
                          : item.LoadedQuantityRecords
                          ? `LQ${item.form_id}`
                          : item.OperationOfSterilizerRecords
                          ? `OF${item.form_id}`
                          : item.MediaRecords
                          ? `MR${item.form_id}`
                          : item.DispenseOfMaterials
                          ? `DM${item.form_id}`
                          : null}
                      </td>
                      <td>
                        {item.DifferentialPressureRecords
                          ? "Differential Pressure"
                          : item.TempratureRecords
                          ? "Temperature Records"
                          : item.LoadedQuantityRecords
                          ? "Loaded Quantity"
                          : item.OperationOfSterilizerRecords
                          ? "Operation of Sterilizer"
                          : item.MediaRecords
                          ? "Media Record"
                          : item.DispenseOfMaterials
                          ? "Dispensing of Material"
                          : null}
                      </td>

                      <td>
                        {item.site_id === 1
                          ? "India"
                          : item.site_id === 2
                          ? "Malaysia"
                          : item.site_id === 3
                          ? "EMEA"
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      ></td>

                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  </>
                ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
