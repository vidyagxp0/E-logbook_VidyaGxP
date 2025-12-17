import { useEffect, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import "./Dashboard.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { hasAccess } from "../../components/userAuth/userAuth";
import dayjs from "dayjs";

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
  const [equipmentRecordElogs, setEquipmentRecordElogs] = useState([]);
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
  const [pHMeterOPCalElogs, setPHMeterOPCalElogs] = useState([]);
  const [uVVisCalibElogs, setUVVisCalibElogs] = useState([]);
  const [sdsPage, setSdsPage] = useState([]);
  const [gelDociGene, setGelDociGene] = useState([]);
  const [uVWhiteLightTrans, setUVWlTrans] = useState([]);
  const [voCalibElogs, SetVOCalibElogs] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const location = useLocation();
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("All");

  useEffect(() => {
    // Get from location if available
    if (location.state?.selectedProcess) {
      setSelectedProcess(location.state.selectedProcess);
      sessionStorage.setItem("selectedProcess", location.state.selectedProcess);
    } else {
      const storedProcess = sessionStorage.getItem("selectedProcess");
      if (storedProcess) {
        setSelectedProcess(Number(storedProcess));
      }
    }
  }, [location.state]);

  const getElogNumber = (item) => {
    const processId = item.process_id;
    if (!processId) return "IPC/BIOS/NA/000";

    const shortName = processShortName[processId] || "NA";
    const index = String(item.form_id).padStart(3, "0");

    return `MED/${shortName}/${index}`;
  };

  const [instrumentFilter, setInstrumentFilter] = useState("All");
  const processShortName = {
    1: "DP",
    2: "TR",
    3: "EU",
    4: "OS",
    5: "MR",
    6: "DM",
    7: "AB",
    8: "KF",
    9: "HPLC",
    10: "PH",
    11: "UVVIS",
    12: "SDS",
    13: "GDI",
    14: "UVWL",
    15: "VOCAL",
  };

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
      url: "http://localhost:1000/temprature-record/get-all-temprature-record",
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
      url: "http://localhost:1000/equipment-usage/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(newConfigloaded)
      .then((response) => {
        const temp = response.data.message;
        const allEquipmentRecordsElogs = temp.filter(
          (log) => log.status === "Closed"
        );
        setEquipmentRecordElogs(allEquipmentRecordsElogs);
        let filteredArray = allEquipmentRecordsElogs.filter((elog) => {
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
      url: "http://localhost:1000/media-record/get-all",
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
      url: "http://localhost:1000/dispensing-material/get-all",
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
      url: "http://localhost:1000/operation-sterlizer/get-all",
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
      url: "http://localhost:1000/analytical-balance/get-all",
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
      url: "http://localhost:1000/karl-fischer/get-all-karl-fischer",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newKarlFischer)
      .then((response) => {
        const temp = response.data.message;
        const allKarlFischer = temp.filter((log) => log.status === "Closed");
        setKarlFischerElogs(allKarlFischer);
        let filteredArray = allKarlFischer.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
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
      url: "http://localhost:1000/hplc/get-all-hplc",
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
    const newpHMeterOPCal = {
      method: "get",
      url: "http://localhost:1000/op-and-calParameter/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newpHMeterOPCal)
      .then((response) => {
        const pHMeterOPCal = response.data.message;
        const allPhMeterOPCal = pHMeterOPCal.filter(
          (log) => log.status === "Closed"
        );
        let filteredArray = pHMeterOPCal.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setPHMeterOPCalElogs(allPhMeterOPCal);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    const newuVVisCalibElogs = {
      method: "get",
      url: "http://localhost:1000/uv-vis-calib/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newuVVisCalibElogs)
      .then((response) => {
        const uVVisCalib = response.data.message;
        const allUVVisCalibElogs = uVVisCalib.filter(
          (log) => log.status === "Closed"
        );
        let filteredArray = uVVisCalib.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setUVVisCalibElogs(allUVVisCalibElogs);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    const newSdsPageElogs = {
      method: "get",
      url: "http://localhost:1000/sds-page/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newSdsPageElogs)
      .then((response) => {
        const sDsPage = response.data.message;
        const allSdsPage = sDsPage.filter((log) => log.status === "Closed");
        let filteredArray = sDsPage.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setSdsPage(allSdsPage);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newGelDociGene = {
      method: "get",
      url: "http://localhost:1000/gel-doc-igene/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newGelDociGene)
      .then((response) => {
        const gelDociGene = response.data.message;
        const allGelDociGene = gelDociGene.filter(
          (log) => log.status === "Closed"
        );
        let filteredArray = gelDociGene.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setGelDociGene(allGelDociGene);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newUVwlTrans = {
      method: "get",
      url: "http://localhost:1000/uv-wl-transi/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newUVwlTrans)
      .then((response) => {
        const uvWlTrans = response.data.message;
        const allUVWlTrans = uvWlTrans.filter((log) => log.status === "Closed");
        let filteredArray = uvWlTrans.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setUVWlTrans(allUVWlTrans);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    const newVOCalib = {
      method: "get",
      url: "http://localhost:1000/vo-cal/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newVOCalib)
      .then((response) => {
        const voCalib = response.data.message;
        const allVoCalib = voCalib.filter((log) => log.status === "Closed");
        let filteredArray = voCalib.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        SetVOCalibElogs(allVoCalib);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  // const combinedRecords = [
  //   ...differentialPressureElogs.filter((log) => log.status === "Closed"),
  //   ...areaAndERecordElogs.filter(log => log.status === "Closed"),
  //   ...equipmentCRecordElogs.filter((log) => log.status === "Closed"),
  //   ...tempratureRecordElogs.filter((log) => log.status === "Closed"),
  //   ...loadedQuantityElogs.filter((log) => log.status === "Closed"),
  //   ...mediaRecordElogs.filter((log) => log.status === "Closed"),
  //   ...dispensingOfMaterialsElogs.filter((log) => log.status === "Closed"),
  //   ...operationOfSterilizerElogs.filter((log) => log.status === "Closed"),
  //   ...analyticalBalanceElogs.filter((log) => log.status === "Closed"),
  //   ...karlFischerElogs.filter((log) => log.status === "Closed"),
  //   ...hplcElogs.filter((log) => log.status === "Closed"),
  //   ...pHMeterOPCalElogs.filter((log) => log.status === "Closed"),
  //   ...uVVisCalibElogs.filter((log) => log.status === "Closed"),
  //   ...sdsPage.filter((log) => log.status === "Closed"),
  //   ...gelDociGene.filter((log) => log.status === "Closed"),
  //   ...uVWhiteLightTrans.filter((log) => log.status === "Closed"),
  // ];

  const combinedRecords = [
    ...differentialPressureElogs.map((r) => ({ ...r, process_id: 1 })),
    ...tempratureRecordElogs.map((r) => ({ ...r, process_id: 2 })),
    ...equipmentRecordElogs.map((r) => ({ ...r, process_id: 3 })),
    ...operationOfSterilizerElogs.map((r) => ({ ...r, process_id: 4 })),
    ...mediaRecordElogs.map((r) => ({ ...r, process_id: 5 })),
    ...dispensingOfMaterialsElogs.map((r) => ({ ...r, process_id: 6 })),
    ...analyticalBalanceElogs.map((r) => ({ ...r, process_id: 7 })),
    ...karlFischerElogs.map((r) => ({ ...r, process_id: 8 })),
    ...hplcElogs.map((r) => ({ ...r, process_id: 9 })),
    ...pHMeterOPCalElogs.map((r) => ({ ...r, process_id: 10 })),
    ...uVVisCalibElogs.map((r) => ({ ...r, process_id: 11 })),
    ...sdsPage.map((r) => ({ ...r, process_id: 12 })),
    ...gelDociGene.map((r) => ({ ...r, process_id: 13 })),
    ...uVWhiteLightTrans.map((r) => ({ ...r, process_id: 14 })),
    ...voCalibElogs.map((r) => ({ ...r, process_id: 15 })),
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
    } else if (item.EquipmentUsageRecords) {
      navigate("/effective-equipment-usage", { state: item });
    } else if (item.MediaRecords) {
      navigate("/effective-media-record", { state: item });
    } else if (item.OperationOfSterilizerRecords) {
      navigate("/effective-operation-of-sterilizer", { state: item });
    } else if (item.AnalyticalBalances) {
      navigate("/effective-analytical-balance", {
        state: {
          ...item,
          instrument_no: getElogNumber(item),
        },
      });
    } else if (item.DispenseOfMaterials) {
      navigate("/effective-dispensing-of-material", { state: item });
    } else if (item.karlFischerRecords) {
      navigate("/effective-karl-fischer", {
        state: {
          ...item,
          instrument_no: getElogNumber(item),
        },
      });
    } else if (item.hplcRecords) {
      navigate("/effective-hplc", {
        state: {
          ...item,
          instrument_no: getElogNumber(item),
        },
      });
    } else if (item.OpAndCalMultiParameterProcessRecords) {
      // navigate("/effective-pHMeterOpCal", { state: item });
      navigate("/effective-pHMeterOpCal", {
        state: {
          ...item,
          instrument_no: getElogNumber(item),
        },
      });
    } else if (item.UvVisRecords) {
      navigate("/effective-uv-vis-calibration", { state: item });
    } else if (item.sdsPageRecords) {
      navigate("/effective-sds-page", { state: item });
    } else if (item.gelDocIGeneRecords) {
      navigate("/effective-gel-doc-igene", { state: item });
    } else if (item.uvWhiteLightRecords) {
      navigate("/effective-uv-wl-transilluminator", { state: item });
    } else if (item.voCalibRecords) {
      navigate("/effective-vo-calibration", { state: item });
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

  //   const getFilteredData = () => {
  //     const applyInstrumentFilter = (data) => {
  //   if (instrumentFilter === "All") return data;
  //   return data.filter((item) => getElogNumber(item) === instrumentFilter);
  // };

  //     if (eLogSelect === "analytical_balance") {
  //       // return analyticalBalanceElogs?.filter(filterRecord);
  //       return applyInstrumentFilter(analyticalBalanceElogs?.filter(filterRecord));

  //     } else if (eLogSelect === "karl_fischer") {
  //       // return karlFischerElogs?.filter(filterRecord);
  //       return applyInstrumentFilter(karlFischerElogs?.filter(filterRecord));
  //     } else if (eLogSelect === "hplc") {
  //       // return hplcElogs?.filter(filterRecord);
  //       return applyInstrumentFilter(hplcElogs?.filter(filterRecord));
  //     } else if (eLogSelect === "pH Meter OP/Cal") {
  //       // return pHMeterOPCalElogs?.filter(filterRecord);
  //       return applyInstrumentFilter(pHMeterOPCalElogs?.filter(filterRecord));

  //     } else if (eLogSelect === "UV-Vis Calibration") {
  //       // return uVVisCalibElogs?.filter(filterRecord);
  //       return applyInstrumentFilter(uVVisCalibElogs?.filter(filterRecord));

  //     } else if (eLogSelect === "SDS PAGE") {
  //       // return sdsPage?.filter(filterRecord);
  //       return applyInstrumentFilter(sdsPage?.filter(filterRecord));
  //     } else if (eLogSelect === "Gel Doc iGene") {
  //       // return gelDociGene?.filter(filterRecord);
  //       return applyInstrumentFilter(gelDociGene?.filter(filterRecord));
  //     } else if (eLogSelect === "UV/WL Transilluminator") {
  //       // return uVWhiteLightTrans?.filter(filterRecord);
  //       return applyInstrumentFilter(uVWhiteLightTrans?.filter(filterRecord));
  //     } else if (eLogSelect === "VO Calibration") {
  //       // return voCalibElogs?.filter(filterRecord);
  //             return applyInstrumentFilter(voCalibElogs?.filter(filterRecord));
  //     } else {
  //       // return combinedRecords
  //       //   ?.filter(filterRecord)
  //       //   ?.sort(
  //       //     (a, b) =>
  //       //       new Date(b.date_of_initiation) - new Date(a.date_of_initiation)
  //       //   );
  //       return applyInstrumentFilter(
  //   combinedRecords
  //     ?.filter(filterRecord)
  //     ?.sort(
  //       (a, b) =>
  //         new Date(b.date_of_initiation) - new Date(a.date_of_initiation)
  //     )
  // );

  //     }
  //   };

  // const checkReviewStatus = (item, type) => {
  //   console.log(item, "item>>>>");
  //   const key = Object.keys(item).find((k) =>
  //     ("records")
  //   );
  //   console.log(key, "key>>>>");

  //   if (!key || !Array.isArray(item[key])) return false;

  //   const records = item[key];

  //   if (records.length === 0) {
  //     return type === "PendingForCreate";
  //   }

  //   if (type === "Pending") {
  //     return records.some((rec) => !rec?.reviewed_by);
  //   }

  //   if (type === "Complete") {
  //     return records.every((rec) => rec?.reviewed_by);
  //   }

  //   return false;
  // };

  const checkReviewStatus = (item, type) => {
    // find the key where value is an array of record objects
    const key = Object.keys(item).find(
      (k) => Array.isArray(item[k]) && item[k]?.length >= 0
    );
    console.log(key, "filter key");
    if (!key) return false;

    const records = item[key];

    // If empty rows = Pending For Create
    if (records.length === 0) {
      return type === "PendingForCreate";
    }

    // Pending → at least one empty reviewed_by
    if (type === "Pending") {
      return records.some((rec) => !rec?.reviewed_by);
    }

    // Complete → every row has reviewed_by
    if (type === "Complete") {
      return records.every((rec) => rec?.reviewed_by);
    }

    return false;
  };

  const getFilteredData = () => {
    let data = [...combinedRecords];

    // ⭐ Apply selected process filter (if user selected DP/TR/etc.)
    if (selectedProcess) {
      data = data.filter((item) => item.process_id === selectedProcess);
    }

    // ⭐ Apply Review Filter GENERICALLY for ALL processes
    if (reviewStatusFilter === "Pending") {
      data = data.filter((item) => checkReviewStatus(item, "Pending"));
    }
    if (reviewStatusFilter === "PendingForCreate") {
      data = data.filter((item) => checkReviewStatus(item, "PendingForCreate"));
    }

    if (reviewStatusFilter === "Complete") {
      data = data.filter((item) => checkReviewStatus(item, "Complete"));
    }

    // ⭐ Instrument filter wrapper
    const applyInstrumentFilter = (rows) => {
      if (instrumentFilter === "All") return rows;
      return rows.filter((item) => getElogNumber(item) === instrumentFilter);
    };

    // ⭐ Individual instrument filters
    if (eLogSelect === "analytical_balance") {
      return applyInstrumentFilter(
        analyticalBalanceElogs.filter(
          (item) =>
            reviewStatusFilter === "All" ||
            checkReviewStatus(item, reviewStatusFilter)
        )
      );
    }

    if (eLogSelect === "karl_fischer") {
      return applyInstrumentFilter(
        karlFischerElogs.filter(
          (item) =>
            reviewStatusFilter === "All" ||
            checkReviewStatus(item, reviewStatusFilter)
        )
      );
    }

    if (eLogSelect === "hplc") {
      return applyInstrumentFilter(
        hplcElogs.filter(
          (item) =>
            reviewStatusFilter === "All" ||
            checkReviewStatus(item, reviewStatusFilter)
        )
      );
    }

    if (eLogSelect === "pH Meter OP/Cal") {
      return applyInstrumentFilter(
        pHMeterOPCalElogs.filter(
          (item) =>
            reviewStatusFilter === "All" ||
            checkReviewStatus(item, reviewStatusFilter)
        )
      );
    }

    if (eLogSelect === "UV-Vis Calibration") {
      return applyInstrumentFilter(
        uVVisCalibElogs.filter(
          (item) =>
            reviewStatusFilter === "All" ||
            checkReviewStatus(item, reviewStatusFilter)
        )
      );
    }

    if (eLogSelect === "SDS PAGE") {
      return applyInstrumentFilter(
        sdsPage.filter(
          (item) =>
            reviewStatusFilter === "All" ||
            checkReviewStatus(item, reviewStatusFilter)
        )
      );
    }

    if (eLogSelect === "Gel Doc iGene") {
      return applyInstrumentFilter(
        gelDociGene.filter(
          (item) =>
            reviewStatusFilter === "All" ||
            checkReviewStatus(item, reviewStatusFilter)
        )
      );
    }

    if (eLogSelect === "UV/WL Transilluminator") {
      return applyInstrumentFilter(
        uVWhiteLightTrans.filter(
          (item) =>
            reviewStatusFilter === "All" ||
            checkReviewStatus(item, reviewStatusFilter)
        )
      );
    }

    if (eLogSelect === "VO Calibration") {
      return applyInstrumentFilter(
        voCalibElogs.filter(
          (item) =>
            reviewStatusFilter === "All" ||
            checkReviewStatus(item, reviewStatusFilter)
        )
      );
    }

    // ⭐ All Records + instrument filter + sorting
    return applyInstrumentFilter(
      data
        ?.filter(filterRecord)
        ?.sort(
          (a, b) =>
            new Date(b.date_of_initiation) - new Date(a.date_of_initiation)
        )
    );
  };

  const getEquipmentType = (item) => {
    return item.DifferentialPressureRecords
      ? "Differential Pressure"
      : item.TempratureRecords
      ? "Temperature Records"
      : item.EquipmentUsageRecords
      ? "Equipment Usage"
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
      : item.OpAndCalMultiParameterProcessRecords
      ? "pH Meter"
      : item.UvVisRecords
      ? "UV-Vis Calibration"
      : item.sdsPageRecords
      ? "SDS PAGE"
      : item.gelDocIGeneRecords
      ? "Gel Doc iGene"
      : item.uvWhiteLightRecords
      ? "UV/WL Transilluminator"
      : item.voCalibRecords
      ? "VO Calibration"
      : eLogSelect === "analytical_balance"
      ? "Analytical Balance"
      : eLogSelect === "karl_fischer"
      ? "KARL Fischer"
      : eLogSelect === "hplc"
      ? "HPLC"
      : eLogSelect === "pH Meter OP/Cal"
      ? "pHOPCAL"
      : eLogSelect === "UV-Vis Calibration"
      ? "UVVIS"
      : eLogSelect === "SDS PAGE"
      ? "SDS PAGE"
      : eLogSelect === "Gel Doc iGene"
      ? "Gel Doc iGene"
      : eLogSelect === "UV/WL Transilluminator"
      ? "UV/WL Transilluminator"
      : eLogSelect === "VO Calibration"
      ? "VO-CAL"
      : "NA";
  };
  // const filteredData = getFilteredData();
  const filteredData = getFilteredData()?.filter((item) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();

    const instrument = getElogNumber(item)?.toLowerCase() || "";
    const name = getEquipmentType(item)?.toLowerCase() || "";
    const dept =
      item.site_id === 1
        ? "india"
        : item.site_id === 2
        ? "malaysia"
        : item.site_id === 3
        ? "emea"
        : item.site_id === 5
        ? "Medicef"
        : item.site_id === 6
        ? "ar&d"
        : "Medicef";
    const creator = item.initiator_name?.toLowerCase() || "";

    return (
      instrument.includes(term) ||
      name.includes(term) ||
      dept.includes(term) ||
      creator.includes(term)
    );
  });

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

  const getFormPrefix = (item) => {
    return item.DifferentialPressureRecords
      ? "DP"
      : item.TempratureRecords
      ? "TR"
      : item.EquipmentUsageRecords
      ? "EU"
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
      : item.OpAndCalMultiParameterProcessRecords
      ? "pHOPCAL"
      : item.UvVisRecords
      ? "UVVIS"
      : item.sdsPageRecords
      ? "SDSPAGE"
      : item.gelDocIGeneRecords
      ? "GELDOCIGENE"
      : item.uvWhiteLightRecords
      ? "UV-WLTI"
      : item.uvWhiteLightRecords
      ? "UV-WLTI"
      : item.voCalibRecords
      ? "VO-CAL"
      : eLogSelect === "analytical_balance"
      ? "AB"
      : eLogSelect === "karl_fischer"
      ? "KF"
      : eLogSelect === "hplc"
      ? "HP"
      : eLogSelect === "pH Meter OP/Cal"
      ? "pHOPCAL"
      : eLogSelect === "UV-Vis Calib"
      ? "UVVIS"
      : eLogSelect === "SDS PAGE"
      ? "SDS PAGE"
      : eLogSelect === "Gel Doc iGene"
      ? "GELDOCIGENE"
      : eLogSelect === "UV/WL Transilluminator"
      ? "UV-WLTI"
      : eLogSelect === "VO Calibration"
      ? "VO-CAL"
      : "";
  };

  const labelStyle = {
    display: "inline-block",
    padding: "4px 12px",
    paddingLeft: "18px",
    borderRadius: "50px",
    backgroundColor: "#e9ecef",
    fontSize: "13px",
    fontWeight: "600",
    color: "#000000",
    marginBottom: "6px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  };
  return (
    <>
      <HeaderTop />
      <HeaderBottom />

      <div className="desktop-input-table-wrapper">
        {/* Filters */}

        {/* Search Bar */}

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
          <div className="flex flex-col min-w-[280px] mb-0">
            <label
              style={labelStyle}
              className="!flex items-center gap-2 w-fit text-[14px] font-semibold text-[#495057] mb-1 select-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#0c5fc6"
                className="h-[20px] w-[20px]"
              >
                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
              </svg>
              Search
            </label>

            <input
              type="text"
              placeholder="Search Instrument, Name, Dept, Creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
    h-[38px] px-3 
    border border-[#ced4da] rounded-md 
    text-[14px] placeholder:text-gray-500 bg-white 
    focus:outline-none 
    focus:ring-2 focus:ring-[#ced4da] 
    focus:border-[#ced4da]
    focus:px-3
  "
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "20px",
              flexWrap: "wrap",
              flex: 1,
            }}
          >
            <div
              className="group-input"
              style={{ marginBottom: "0", minWidth: "200px" }}
            >
              <label style={labelStyle}>Status</label>

              <select
                value={reviewStatusFilter}
                onChange={(e) => setReviewStatusFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <option value="All">All</option>
                <option value="PendingForCreate">Pending For Create</option>
                <option value="Pending">Pending For Review</option>
                <option value="Complete">Complete </option>
              </select>
            </div>

            <div
              className="group-input"
              style={{ marginBottom: "0", minWidth: "200px" }}
            >
              <label style={labelStyle}>All Instruments/Equipment ID's</label>

              <select
                value={instrumentFilter}
                onChange={(e) => setInstrumentFilter(e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <option value="All">All</option>

                {/* {combinedRecords
      .map((item) => getElogNumber(item))
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((instNo, index) => (
        <option key={index} value={instNo}>
          {instNo}
        </option>
      ))} */}
                {filteredData
                  ?.map((item) => getElogNumber(item))
                  .filter((value, index, self) => self.indexOf(value) === index) // unique only
                  .map((instNo, index) => (
                    <option key={index} value={instNo}>
                      {instNo}
                    </option>
                  ))}
              </select>
            </div>

            {/* Equipment Filter */}
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
                <option value="pH Meter OP/Cal">pH Meter OP/Cal</option>
                <option value="UV-Vis Calibration">UV-Vis Calibration</option>
                <option value="SDS PAGE">SDS PAGE</option>
                <option value="Gel Doc iGene">Gel Doc iGene</option>
                <option value="UV/WL Transilluminator">
                  UV/WL Transilluminator
                </option>
                <option value="VO Calibration">
                  VO Calibration
                </option>
              </select>
            </div> */}

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
            </div>*/}
          </div>
        </div> 

        {/* Table */}
        <table className="w-full border border-collapse text-center">
          <thead>                                                                               
            <tr>
              <th className="text-center">S no</th>
              {/* <th className="text-center">E.Log no</th> */}
              <th className="text-center">Instrument No.</th>
              {/* <th className="text-center">Instrument / Equipment</th> */}
              <th className="text-center">Name</th>
              <th className="text-center">Department</th>
              <th className="text-center">Short description</th>
              <th className="text-center">Created By</th>
              {/* <th className="text-center">Initiator</th> */}
              <th className="text-center">Date of Creation</th>
              {/* <th className="text-center">Status</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item, index) => {
              const cleanHTML =
                item?.description?.replace(/^"|"$/g, "").trim() || "NA";
              return (
                <tr key={`${item.form_id || item.eLogId}-${item.id || index}`}>
                  <td>{index + 1}</td>

                  <td
                    onClick={() => handleNavigation(item)}
                    className="relative group cursor-pointer text-black hover:text-blue-600"
                  >
                    {/* Tooltip */}
                   <span
                    className="absolute -bottom-4 left-0 
                      bg-slate-300 border border-black/40 
                      text-black text-xs px-2 py-1 rounded 
                      opacity-0 group-hover:opacity-100 pointer-events-none
                      transition-opacity duration-150"
                  >
                    Click to select
                  </span>
                      {item.DifferentialPressureRecords
                      ? getElogNumber(item)
                      : item.TempratureRecords
                      ? getElogNumber(item)
                      : item.EquipmentUsageRecords
                      ? getElogNumber(item)
                      : item.OperationOfSterilizerRecords
                      ? getElogNumber(item)
                      : item.MediaRecords
                      ? getElogNumber(item)
                      : item.DispenseOfMaterials
                      ? getElogNumber(item)
                      : item.AnalyticalBalances
                      ? getElogNumber(item)
                      : item.karlFischerRecords
                      ? getElogNumber(item)
                      : item.hplcRecords
                      ? getElogNumber(item)
                      : item.OpAndCalMultiParameterProcessRecords
                      ? getElogNumber(item)
                      : item.UvVisRecords
                      ? getElogNumber(item)
                      : item.sdsPageRecords
                      ? getElogNumber(item)
                      : item.gelDocIGeneRecords
                      ? getElogNumber(item)
                      : item.uvWhiteLightRecords
                      ? getElogNumber(item)
                      : null}
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
                      ? "Medicef"
                      : item.site_id === 6
                      ? "AR&D"
                      : "Medicef"}
                  </td>
                  <td dangerouslySetInnerHTML={{ __html: cleanHTML }} style={{
    verticalAlign: "top",
    textAlign: "left",
  }}></td>
                  <td>{item.initiator_name}</td>
                  <td>{dayjs(item.date_of_initiation).format("DD-MM-YYYY hh:mm a")}</td>
                  {/* <td>{item.status}</td> */}
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
