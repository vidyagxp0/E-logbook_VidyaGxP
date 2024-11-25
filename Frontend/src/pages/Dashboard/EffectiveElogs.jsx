import { useEffect, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hasAccess } from "../../components/userAuth/userAuth";

function EffectiveElogs() {
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
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

  useEffect(() => {
    const newConfig = {
      method: "get",
      url: "https://elog-backend.mydemosoftware.com/differential-pressure/get-all-differential-pressure",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfig)
      .then((response) => {
        const temp = response.data.message;
        const allDifferentialPressureElogs = temp.filter(
          (log) => log.status === "Closed"
        );
        setDifferentialPressureElogs(allDifferentialPressureElogs);

        let filteredArray = allDifferentialPressureElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 1)
          );
        });
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfigTemp = {
      method: "get",
      url: "https://elog-backend.mydemosoftware.com/temprature-record/get-all-temprature-record",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfigTemp)
      .then((response) => {
        const temp = response.data.message;
        const allTempratureRecordElogs = temp.filter(
          (log) => log.status === "Closed"
        );
        setTempratureRecordElogs(allTempratureRecordElogs);
        let filteredArray = allTempratureRecordElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfigloaded = {
      method: "get",
      url: "https://elog-backend.mydemosoftware.com/loaded-quantity/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfigloaded)
      .then((response) => {
        const temp = response.data.message;
        const allLoadedQuantityElogs = temp.filter(
          (log) => log.status === "Closed"
        );
        setLoadedQuantityElogs(allLoadedQuantityElogs);
        let filteredArray = allLoadedQuantityElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfigMedia = {
      method: "get",
      url: "https://elog-backend.mydemosoftware.com/media-record/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfigMedia)
      .then((response) => {
        const temp = response.data.message;
        const allMediaRecordElogs = temp.filter(
          (log) => log.status === "Closed"
        );
        setMediaRecordElogs(allMediaRecordElogs);
        let filteredArray = allMediaRecordElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfigDispensing = {
      method: "get",
      url: "https://elog-backend.mydemosoftware.com/dispensing-material/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfigDispensing)
      .then((response) => {
        const temp = response.data.message;
        const allDispensingMaterialElogs = temp.filter(
          (log) => log.status === "Closed"
        );
        setDispensingOfMaterialsElogs(allDispensingMaterialElogs);
        let filteredArray = allDispensingMaterialElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    const newOperationSterelizer = {
      method: "get",
      url: "https://elog-backend.mydemosoftware.com/operation-sterlizer/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newOperationSterelizer)
      .then((response) => {
        const temp = response.data.message;
        const allOperationOfSterelizer = temp.filter(
          (log) => log.status === "Closed"
        );
        setOperationOfSterilizerElogs(allOperationOfSterelizer);
        let filteredArray = allOperationOfSterelizer.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        console.log(filteredArray, "filteredArray");
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  const combinedRecords = [
    ...differentialPressureElogs.filter((log) => log.status === "Closed"),
    // ...areaAndERecordElogs.filter(log => log.status === "Closed"), // Uncomment if needed
    ...equipmentCRecordElogs.filter((log) => log.status === "Closed"),
    ...tempratureRecordElogs.filter((log) => log.status === "Closed"),
    ...loadedQuantityElogs.filter((log) => log.status === "Closed"),
    ...mediaRecordElogs.filter((log) => log.status === "Closed"),
    ...dispensingOfMaterialsElogs.filter((log) => log.status === "Closed"),
    ...operationOfSterilizerElogs.filter((log) => log.status === "Closed"),
  ];

  const handleNavigation = (item) => {
    if (item.DifferentialPressureRecords) {
      navigate("/effective-dpr", { state: item });
      // } else if (item.process === "Area and equipment") {
      //   navigate("/area-and-equipment-panel", { state: item });
    } else if (item.TempratureRecords) {
      navigate("/effective-tpr", { state: item });
    } else if (item.process === "Equipment cleaning checklist") {
      navigate("/effective-ecc", { state: item });
    } else if (item.LoadedQuantityRecords) {
      navigate("/effective-loaded-quantity", { state: item });
    } else if (item.MediaRecords) {
      navigate("/effective-media-record", { state: item });
    } else if (item.OperationOfSterilizerRecords) {
      navigate("/effective-operation-of-sterilizer", { state: item });
    } else if (item.DispenseOfMaterials) {
      navigate("/effective-dispensing-of-material", { state: item });
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
              <option value="effective_diffrential_pressure">
                Diffrential Pressure Record
              </option>
              {/* <option value="area_and_equipment">
                Area & Equipment Usage Log
              </option> */}
              <option value="effective_equipment_cleaning">
                Equipment Cleaning Checklist
              </option>
              <option value="effective_temperature_records">
                Temperature Records
              </option>
              <option value="effective_loaded_quantity">Loaded Quantity</option>
              <option value="effective_media_record">Media Record</option>
              <option value="effective_operation_of_sterilizer">
                Operation Of Sterilizer
              </option>
              <option value="effective_dispensing_of_material">
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
            {eLogSelect === "effective_diffrential_pressure"
              ? differentialPressureElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/effective-dpr", { state: item })
                        }
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
                      <td
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                      ></td>
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

            {eLogSelect === "effective_equipment_cleaning"
              ? equipmentCRecordElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td onClick={() => navigate("/effective-ecc")}>
                        {item.eLogId}
                      </td>
                      <td>{item.process}</td>
                      <td>{item.initiator}</td>
                      <td>{item.dateOfInitiation}</td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item?.shortDescription,
                        }}
                      ></td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "effective_temperature_records"
              ? tempratureRecordElogs?.map((item, index) => {
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/effective-tpr", { state: item })
                        }
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
                      <td
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                      ></td>
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "effective_loaded_quantity"
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
                          navigate("/effective-loaded-quantity", {
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
                      <td
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                      ></td>
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "effective_operation_of_sterilizer"
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
                            navigate("/effective-operation-of-sterilizer", {
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
                        <td
                          dangerouslySetInnerHTML={{
                            __html: item?.description,
                          }}
                        ></td>{" "}
                        <td>{item.initiator_name}</td>
                        <td>{formatDate(item.date_of_initiation)}</td>
                        <td>{item.status}</td>
                      </tr>
                    </>
                  );
                })
              : null}

            {eLogSelect === "effective_media_record"
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
                          navigate("/effective-media-record", { state: item })
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
                      <td
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "effective_dispensing_of_material"
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
                          navigate("/effective-dispensing-of-material", {
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
                      <td
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                      ></td>{" "}
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
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                      ></td>{" "}
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

export default EffectiveElogs;
