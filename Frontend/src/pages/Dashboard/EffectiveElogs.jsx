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
  const [role, setRole] = useState("All_Records");
  const [status, setStatus] = useState("All_Records");
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
  const [analyticalBalanceElogs, setAnalyticalBalanceElogs] = useState([]);
  const [karlFischerElogs, setKarlFischerElogs] = useState([]);
  const [hplcElogs, setHplcElogs] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

  useEffect(() => {
    const newConfig = {
      method: "get",
      url: "https://elog-api.mydemosoftware.com/differential-pressure/get-all-differential-pressure",
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
      url: "https://elog-api.mydemosoftware.com/temprature-record/get-all-temprature-record",
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
      url: "https://elog-api.mydemosoftware.com/loaded-quantity/get-all",
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
      url: "https://elog-api.mydemosoftware.com/media-record/get-all",
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
      url: "https://elog-api.mydemosoftware.com/dispensing-material/get-all",
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
      url: "https://elog-api.mydemosoftware.com/operation-sterlizer/get-all",
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
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    const newAnalyticalBalance = {
      method: "get",
      url: "https://elog-api.mydemosoftware.com/analytical-balance/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newAnalyticalBalance)
      .then((response) => {
        const temp = response.data.message;
        const allAnalyticalBalance = temp.filter(
          (log) => log.status === "Closed"
        );
        setAnalyticalBalanceElogs(allAnalyticalBalance);
        let filteredArray = allAnalyticalBalance.filter((elog) => {
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
    const newKarlFischer = {
      method: "get",
      url: "https://elog-api.mydemosoftware.com/karl-fischer/get-all-karl-fischer",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newKarlFischer)
      .then((response) => {
        console.log(response, "karl fischer");
        const temp = response.data.message;
        const allKarlFischer = temp.filter((log) => log.status === "Closed");
        setKarlFischerElogs(allKarlFischer);
        let filteredArray = allKarlFischer.filter((elog) => {
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
    const newHplc = {
      method: "get",
      url: "https://elog-api.mydemosoftware.com/hplc/get-all-hplc",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newHplc)
      .then((response) => {
        const temp = response.data.message;
        const allHplc = temp.filter((log) => log.status === "Closed");
        setHplcElogs(allHplc);
        let filteredArray = allHplc.filter((elog) => {
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
    ...analyticalBalanceElogs.filter((log) => log.status === "Closed"),
    ...karlFischerElogs.filter((log) => log.status === "Closed"),
    ...hplcElogs.filter((log) => log.status === "Closed"),
  ];

  const handleNavigation = (item) => {
    console.log(item, "itme");
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
    } else if (item.AnalyticalBalances) {
      navigate("/effective-analytical-balance", { state: item });
    } else if (item.DispenseOfMaterials) {
      navigate("/effective-dispensing-of-material", { state: item });
    } else if (item.karlFischerRecords) {
      navigate("/effective-karl-fischer", { state: item });
    } else if (item.hplcRecords) {
      navigate("/effective-hplc", { state: item });
    } else {
      // Handle default or fallback navigation if needed
    }
  };

  const filterRecord = (item) => {
    const roleMatch =
      role === "All_Records" ||
      (role === "analytical_balance" && item?.initiator_name) ||
      (role === "karl_fischer" && item?.reviewed_by);

    const statusMatch = status === "All_Records" || item.status === status;

    return roleMatch && statusMatch;
  };

  const getFilteredData = () => {
    if (eLogSelect === "analytical_balance") {
      return analyticalBalanceElogs?.filter(filterRecord);
    } else if (eLogSelect === "karl_fischer") {
      return karlFischerElogs?.filter(filterRecord);
    } else if (eLogSelect === "hplc") {
      return hplcElogs?.filter(filterRecord);
    } else {
      return combinedRecords
        ?.filter(filterRecord)
        ?.sort(
          (a, b) =>
            new Date(b.date_of_initiation) - new Date(a.date_of_initiation)
        );
    }
  };

  const filteredData = getFilteredData();

  const formatDate = (dateString) => {
    const utcDate = new Date(dateString);
    return utcDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getFormPrefix = (item) => {
    return item.DifferentialPressureRecords
      ? "DP"
      : item.TempratureRecords
      ? "TR"
      : item.LoadedQuantityRecords
      ? "LQ"
      : item.OperationOfSterilizerRecords
      ? "OF"
      : item.MediaRecords
      ? "MR"
      : item.DispenseOfMaterials
      ? "DM"
      : item.AnalyticalBalances
      ? "AB"
      : item.karlFischerRecords
      ? "KF"
      : item.hplcRecords
      ? "HP"
      : eLogSelect === "analytical_balance"
      ? "AB"
      : eLogSelect === "karl_fischer"
      ? "KF"
      : eLogSelect === "hplc"
      ? "HP"
      : "";
  };

  const getEquipmentType = (item) => {
    return item.DifferentialPressureRecords
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
      : item.AnalyticalBalances
      ? "Analytical Balance"
      : item.karlFischerRecords
      ? "KARL Fischer"
      : item.hplcRecords
      ? "HPLC"
      : eLogSelect === "analytical_balance"
      ? "Analytical Balance"
      : eLogSelect === "karl_fischer"
      ? "KARL Fischer"
      : eLogSelect === "hplc"
      ? "HPLC"
      : "NA";
  };

  return (
    <>
      <HeaderTop />
      <HeaderBottom />

      <div className="desktop-input-table-wrapper">
        {/* Filters */}
        <div
          className="filter-section"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "20px",
              flexWrap: "wrap",
              flex: 1,
            }}
          >
            {/* Equipment Filter */}
            <div
              className="group-input"
              style={{ marginBottom: "0", minWidth: "200px" }}
            >
              <label
                className="color-label"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                  padding: "0",
                }}
              >
                Instrument / Equipment
              </label>
              <select
                value={eLogSelect}
                onChange={(e) => setELogSelect(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <option value="All_Records">All Records</option>
                <option value="analytical_balance">Analytical Balance</option>
                <option value="karl_fischer">KARL Fischer</option>
                <option value="hplc">HPLC</option>
              </select>
            </div>

            {/* Role Filter */}
            {/* <div
              className="group-input"
              style={{ marginBottom: "0", minWidth: "200px" }}
            >
              <label
                className="color-label"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                  padding: "0",
                }}
              >
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <option value="All_Records">All Records</option>
                <option value="analytical_balance">Analytical Balance</option>
                <option value="karl_fischer">KARL Fischer</option>
              </select>
            </div> */}

            {/* Status Filter */}
            {/* <div
              className="group-input"
              style={{ marginBottom: "0", minWidth: "200px" }}
            >
              <label
                className="color-label"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#495057",
                  marginBottom: "8px",
                  padding: "0",
                }}
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <option value="All_Records">All Records</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* Table */}
        <table className="w-full border border-collapse">
          <thead>
            <tr>
              <th>S no</th>
              <th>E.Log no</th>
              <th>Instrument / Equipment</th>
              <th>Department</th>
              <th>Short description</th>
              {/* <th>Initiator</th> */}
              <th>Date of initiation</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item, index) => {
              const cleanHTML =
                item?.description?.replace(/^"|"$/g, "").trim() || "NA";
              return (
                <tr key={item.form_id || item.eLogId}>
                  <td>{index + 1}</td>
                  <td
                    style={{ cursor: "pointer", color: "black" }}
                    onClick={() => handleNavigation(item)}
                    onMouseEnter={(e) => (e.target.style.color = "blue")}
                    onMouseLeave={(e) => (e.target.style.color = "black")}
                  >
                    {`${getFormPrefix(item)}${item.form_id}`}
                  </td>
                  <td>{getEquipmentType(item)}</td>
                  <td>
                    {item.site_id === 1
                      ? "India"
                      : item.site_id === 2
                      ? "Malaysia"
                      : item.site_id === 3
                      ? "EMEA"
                      : item.site_id === 5
                      ? "IPC"
                      : "EU"}
                  </td>
                  <td dangerouslySetInnerHTML={{ __html: cleanHTML }}></td>
                  {/* <td>{item.initiator_name}</td> */}
                  <td>{formatDate(item.date_of_initiation)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EffectiveElogs;
