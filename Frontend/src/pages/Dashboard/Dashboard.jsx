import { useEffect, useState } from "react";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";
import "./Dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { hasAccess } from "../../components/userAuth/userAuth";

function Dashboard() {
  const navigate = useNavigate();
  const [eLogSelect, setELogSelect] = useState("All_Records");
  const [eLogStatus, setELogStatus] = useState("All_Records");
  const [differentialPressureElogs, setDifferentialPressureElogs] = useState(
    []
  );
  differentialPressureElogs?.map((item, index) => {
    console.log(item,"item")
  })
  // console.log(differentialPressureElogs, "differentialPressureElogs");
  
  const [tempratureRecordElogs, setTempratureRecordElogs] = useState([]);
  const [analyticalBalanceElogs, setAnalyticalBalanceElogs] = useState([]);
  const [karlFischerElogs, setKarlFischerElogs] = useState([]);
  const [hplcElogs, setHplcElogs] = useState([]);
  // const [areaAndERecordElogs, setAreaAndERecordElogs] = useState([]);
  const [equipmentUsageElogs, setEquipmentUsageElogs] = useState([]);
  const [mediaRecordElogs, setMediaRecordElogs] = useState([]);
  const [dispensingOfMaterialsElogs, setDispensingOfMaterialsElogs] = useState(
    []
  );
  const [pHMeterOPCalElogs, setPHMeterOPCalElogs] = useState([]);
  const [UVVisCalibElogs, setUVVisCalibElogs] = useState([]);
  const [sdsPage, setSdsPage] = useState([]);
  const [gelDociGene, setGelDociGene] = useState([]);
  const [uVWhiteLightTrans, setUVWlTrans] = useState([]);
  const [voCalibElogs, setVOCalibElogs] = useState([]);
  const [operationOfSterilizerElogs, setOperationOfSterilizerElogs] = useState(
    []
  );
  const [filteredRecords, setFilteredRecords] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
// const location = useLocation();
// const selectedProcess = location.state?.selectedProcess;

const location = useLocation();
const [selectedProcess, setSelectedProcess] = useState(null);

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
        
        let filteredArray = allDifferentialPressureElogs.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 1)
          );
        });
        setDifferentialPressureElogs(allDifferentialPressureElogs);
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
        setTempratureRecordElogs(allTempratureRecordElogs);
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
        setEquipmentUsageElogs(allLoadedQuantityElogs);
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
        setMediaRecordElogs(allMediaRecordElogs);
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
        setDispensingOfMaterialsElogs(allDispensingMaterialElogs);
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
        setOperationOfSterilizerElogs(allOperationOfSterelizer);
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
        const allAnalyticalBalance = response.data.message;
        let filteredArray = allAnalyticalBalance.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setAnalyticalBalanceElogs(allAnalyticalBalance);
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
        const allKarlFischer = response.data.message;
        let filteredArray = allKarlFischer.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setKarlFischerElogs(allKarlFischer);
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
        const allHplc = response.data.message;
        let filteredArray = allHplc.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setHplcElogs(allHplc);
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
        let filteredArray = pHMeterOPCal.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setPHMeterOPCalElogs(pHMeterOPCal);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    const newUVvisCal = {
      method: "get",
      url: "http://localhost:1000/uv-vis-calib/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newUVvisCal)
      .then((response) => {
        const UVvisCalib = response.data.message;
        let filteredArray = UVvisCalib.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setUVVisCalibElogs(UVvisCalib);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    const newSdSPage = {
      method: "get",
      url: "http://localhost:1000/sds-page/get-all",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };
    axios(newSdSPage)
      .then((response) => {
        const sDsPage = response.data.message;
        let filteredArray = sDsPage.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setSdsPage(sDsPage);
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
        let filteredArray = gelDociGene.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setGelDociGene(gelDociGene);
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
        let filteredArray = uvWlTrans.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setUVWlTrans(uvWlTrans);
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
        let filteredArray = voCalib.filter((elog) => {
          const userId = userDetails.userId;

          return (
            userId === elog.reviewer_id ||
            userId === elog.initiator_id ||
            userId === elog.approver_id ||
            hasAccess(4, elog.site_id, 4)
          );
        });
        setVOCalibElogs(voCalib);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  const [combinedRecords, setCombinedRecords] = useState([]);
  const handleNavigation = (item) => {
    if (item.DifferentialPressureRecords) {
      navigate("/dpr-panel", { state: item });
      // } else if (item.process === "Area and equipment") {
      //   navigate("/area-and-equipment-panel", { state: item });
    } else if (item.TempratureRecords) {
      navigate("/temperature-record-panel", { state: item });
    } else if (item.process === "Equipment cleaning checklist") {
      navigate("/ecc-panel", { state: item });
    } else if (item.EquipmentUsageRecords) {
      navigate("/equipment-usage-panel", { state: item });
    } else if (item.MediaRecords) {
      navigate("/media-record-panel", { state: item });
    } else if (item.OperationOfSterilizerRecords) {
      navigate("/operation-of-sterilizer-panel", { state: item });
    } else if (item.DispenseOfMaterials) {
      navigate("/dispensing-of-material-panel", { state: item });
    } else if (item.AnalyticalBalances) {
      navigate("/analytical-balance-panel", { state: item });
    } else if (item.karlFischerRecords) {
      navigate("/karl-fischer-panel", { state: item });
    } else if (item.hplcRecords) {
      navigate("/hplc-panel", { state: item });
    } else if (item.OpAndCalMultiParameterProcessRecords) {
      navigate("/PhMeterOpCal-panel", { state: item });
    } else if (item.UvVisRecords) {
      navigate("/uv-vis-calibration-panel", { state: item });
    } else if (item.sdsPageRecords) {
      navigate("/sds-page-panel", { state: item });
    } else if (item.gelDocIGeneRecords) {
      navigate("/gel-doc-igene-panel", { state: item });
    } else if (item.uvWhiteLightRecords) {
      navigate("/uv-wl-transilluminator-panel", { state: item });
    } else if (item.voCalibRecords) {
      navigate("/vo-calibration-panel", { state: item });
    } else {
      // Handle default or fallback navigation if needed
    }
  };

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

  const [searchTerm, setSearchTerm] = useState("");


  const processKey = {
  1: "DifferentialPressureRecords",
  2: "TempratureRecords",
  3: "EquipmentUsageRecords",
  4: "OperationOfSterilizerRecords",
  5: "MediaRecords",
  6: "DispenseOfMaterials",
  7: "AnalyticalBalances",
  8: "karlFischerRecords",
  9: "hplcRecords",
  10: "OpAndCalMultiParameterProcessRecords",
  11: "UvVisRecords",
  12: "sdsPageRecords",
  13: "gelDocIGeneRecords",
  14: "uvWhiteLightRecords",
};

const processShortName = {
  1: "DP",       // Differential Pressure
  2: "TR",       // Temperature Record
  3: "EU",       // Equipment Usage
  4: "OS",       // Operation of Sterilizer
  5: "MR",       // Media Record
  6: "DM",       // Dispensing Material
  7: "AB",       // Analytical Balance
  8: "KF",       // Karl Fischer
  9: "HPLC",
  10: "PH",
  11: "UVVIS",
  12: "SDS",
  13: "GDI",     // Gel Doc iGene
  14: "UVWL",    // UV White Light
};
const [eLogInstrument, setELogInstrument] = useState("All");


const getElogNumber = (item) => {
  // detect process ID based on object key
  const processId = Object.keys(processKey).find(
    (pid) => item[processKey[pid]]
  );

  const shortName = processShortName[processId];
  const index = String(item.form_id).padStart(3, "0");
  
  return `MED/${shortName}/${index}`;
  
};

    

// const getElogNumber = (item) => {
//   const processId = item.process_id;
//   if (!processId) return "IPC/BIOS/NA/000";

//   const shortName = processShortName[processId] || "NA";
//   const index = String(item.form_id).padStart(3, "0");

//   return `IPC/BIOS/${shortName}/${index}`;
// };


useEffect(() => {
  let allData = [
    ...differentialPressureElogs.map(r => ({ ...r, process_id: 1 })),
    ...tempratureRecordElogs.map(r => ({ ...r, process_id: 2 })),
    ...equipmentUsageElogs.map(r => ({ ...r, process_id: 3 })),
    ...operationOfSterilizerElogs.map(r => ({ ...r, process_id: 4 })),
    ...mediaRecordElogs.map(r => ({ ...r, process_id: 5 })),
    ...dispensingOfMaterialsElogs.map(r => ({ ...r, process_id: 6 })),
    ...analyticalBalanceElogs.map(r => ({ ...r, process_id: 7 })),
    ...karlFischerElogs.map(r => ({ ...r, process_id: 8 })),
    ...hplcElogs.map(r => ({ ...r, process_id: 9 })),
    ...pHMeterOPCalElogs.map(r => ({ ...r, process_id: 10 })),
    ...UVVisCalibElogs.map(r => ({ ...r, process_id: 11 })),
    ...sdsPage.map(r => ({ ...r, process_id: 12 })),
    ...gelDociGene.map(r => ({ ...r, process_id: 13 })),
    ...uVWhiteLightTrans.map(r => ({ ...r, process_id: 14 })),
    ...voCalibElogs.map(r => ({ ...r, process_id: 15 })),
  ];

  // ⭐ FILTER BY SELECTED PROCESS  
  if (selectedProcess) {
    allData = allData.filter((item) => item.process_id === selectedProcess);
  }

  // ⭐ FILTER FINAL  
  const finalFiltered = allData.filter((item) => {
    const elogNo = getElogNumber(item);

    const instrumentMatch =
      eLogInstrument === "All" || elogNo === eLogInstrument;

    const searchMatch =
      item?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.initiator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      elogNo.toLowerCase().includes(searchTerm.toLowerCase())
      
    const statusMatch =
      eLogStatus === "All_Records" ||
      item.status?.toLowerCase() === eLogStatus.toLowerCase();

    return searchMatch && statusMatch && instrumentMatch;
  });

  setCombinedRecords(finalFiltered);
}, [
  selectedProcess,
  searchTerm,
  eLogStatus,
  eLogInstrument,
  differentialPressureElogs,
  tempratureRecordElogs,
  equipmentUsageElogs,
  mediaRecordElogs,
  dispensingOfMaterialsElogs,
  operationOfSterilizerElogs,
  analyticalBalanceElogs,
  karlFischerElogs,
  hplcElogs,
  pHMeterOPCalElogs,
  UVVisCalibElogs,
  sdsPage,
  gelDociGene,
  uVWhiteLightTrans,
  voCalibElogs
]);



  useEffect(() => {
    const filteredData = [
      ...differentialPressureElogs,
      ...tempratureRecordElogs,
      ...equipmentUsageElogs,
      ...mediaRecordElogs,
      ...dispensingOfMaterialsElogs,
      ...operationOfSterilizerElogs,
      ...analyticalBalanceElogs,
      ...karlFischerElogs,
      ...hplcElogs,
      ...pHMeterOPCalElogs,
      ...UVVisCalibElogs,
      ...sdsPage,
      ...gelDociGene,
      ...uVWhiteLightTrans,
    ].filter((item) => {
      const matchesSearchTerm =
        item.date_of_initiation
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.initiator_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item?.eLogId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item?.TempratureRecords
          ? `TR${item.form_id}`
          : item?.LoadedQuantityRecords
          ? `LQ${item.form_id}`
          : item?.OperationOfSterilizerRecords
          ? `OF${item.form_id}`
          : item?.MediaRecords
          ? `MR${item.form_id}`
          : item?.DispenseOfMaterials
          ? `DM${item.form_id}`
          : item?.DifferentialPressureRecords
          ? `DP${item.form_id}`
          : item?.AnalyticalBalances
          ? `AB${item.form_id}`
          : item?.karlFischerRecords
          ? `KF${item.form_id}`
          : `HP${item.form_id}`
        )
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Check if the status matches
      const matchesStatus =
        eLogStatus === "All_Records" || // Match all records
        item.status.toLowerCase() === eLogStatus.toLowerCase();

      return matchesSearchTerm && matchesStatus;
    });

    setCombinedRecords(filteredData);
  }, [
    searchTerm,
    eLogStatus,
    differentialPressureElogs,
    tempratureRecordElogs,
    equipmentUsageElogs,
    mediaRecordElogs,
    dispensingOfMaterialsElogs,
    operationOfSterilizerElogs,
    analyticalBalanceElogs,
    karlFischerElogs,
    hplcElogs,
    pHMeterOPCalElogs,
    UVVisCalibElogs,
    sdsPage,
    gelDociGene,
    uVWhiteLightTrans,
  ]);

  return (
    <>
      <HeaderTop />
      <HeaderBottom />

      <div className="desktop-input-table-wrapper"> 
        <div className="flex  items-center  gap-10 p-4   border-gray-300">
          {/* Search Input and Button */}
          <div className="flex items-center h-[40px] border border-gray-300 rounded-md shadow-sm w-full max-w-md p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#0c5fc6"
              width={"25"}
              height={"25"}
            >
              <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
            </svg>
            <input
              type="search"
              placeholder="Search..."
              className="flex-grow outline-none border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dropdown */}
           <div className="w-full max-w-md ">
            <select
              value={eLogSelect}
              onChange={(e) => setELogSelect(e.target.value)}
              className="w-full h-[38px] border border-gray-300 rounded-md p-2 shadow-sm"
              style={{ border: "1px solid gray", padding: "2px 0px" }}
            >
              <option value="All_Records">All Records</option> 
               <option value="diffrential_pressure">
                Differential Pressure Record
              </option>
              {/* <option value="equipment_cleaning">
                Equipment Cleaning Checklist
              </option> */}
              <option value="temperature_records">Temperature Records</option>
              {/* <option value="loaded_quantity">Equipment Usage</option>
              <option value="media_record">Media Record</option>
              <option value="operation_of_sterilizer">
                Operation Of Sterilizer
              </option>
              <option value="dispensing_of_material">
                Dispensing Of Materials
              </option> 
               <option value="analytical_balance">Analytical Balance</option>
              <option value="karl_fischer">KARL Fischer</option>
              <option value="hplc">hplc</option>
              <option value="pH Meter OP/CAL">pH Meter OP/CAL</option>
              <option value="SDS Page">SDS PAGE</option>
              <option value="Gel Doc iGene">Gel Doc iGene</option>
              <option value="UV-Vis Calibration">UV-Vis Calibration</option>
              <option value="UV/White Light Transilluminator">UV/White Light Transilluminator</option>
              <option value="Vacuum Oven Calibration">Vacuum Oven Calibration</option> */}
            </select>
          </div> 

          {/* <div className="w-full max-w-md ">
            <select
              value={eLogInstrument}
              onChange={(e) => setELogInstrument(e.target.value)}
              className="w-full h-[38px] border border-gray-300 rounded-md p-2 shadow-sm"
              style={{ border: "1px solid gray", padding: "2px 0px" }}
            >
              <option value="All">All Instruments</option>

              {combinedRecords
                .map((item) => getElogNumber(item))
                .filter((value, index, self) => self.indexOf(value) === index) // unique
                .map((instNo, index) => (
                  <option key={index} value={instNo}>
                    {instNo}
                  </option>
                ))}
            </select>
          </div> */}

          <div className="w-full max-w-md ">
            <select
              value={eLogStatus}
              onChange={(e) => setELogStatus(e.target.value)}
              className="w-full h-[38px] border border-gray-300 rounded-md p-2 shadow-sm"
              style={{ border: "1px solid gray", padding: "2px 0px" }}
            >
              <option value="All_Records">All</option>
              <option value="opened">Opened</option>
              <option value="underReview">Under Review</option>
              <option value="underApproval">Under Approval</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sr no</th>
              <th>Instrument No.</th>
              <th>Name</th>
              <th>Department</th>
              <th>Compression Area</th>
              <th>Short description</th>
              <th>Created By</th>
              <th>Date of Creation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {eLogSelect === "diffrential_pressure"
              ? differentialPressureElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td>{index + 1}</td>
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
                        {getElogNumber(item)}
                      </td>
                      <td>Differential Pressure</td>
                      <td>
                        {item.site_id === 1
                          ? "India"
                          : item.site_id === 2
                          ? "Malaysia"
                          : item.site_id === 3
                          ? "EMEA"
                          : item.site_id === 4
                          ? "Medicef"
                          : item.site_id === 5
                          ? "Medicef"
                          : "Medicef"}
                      </td>
                      <td>
                        {item.compression_area}
                      </td>
                      
                      <td
                        dangerouslySetInnerHTML={{
                          __html: cleanHTML,
                        }}
                      ></td>
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item?.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "area_and_equipment"
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
              : null}

           

            {eLogSelect === "temperature_records"
              ? tempratureRecordElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() => navigate("/temperature-record-panel", { state: item })}
                        onMouseEnter={(e) => {
                          e.target.style.color = "blue";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "black";
                        }}
                      >
                        {getElogNumber(item)}
                      </td>
                      <td>Temperature Records</td>
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
                          : "EU"}
                      </td>
                      <td>
                        {item.compression_area}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "equipment_usage"
              ? equipmentUsageElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/equipment-usage-panel", { state: item })
                        }
                        onMouseEnter={(e) => {
                          e.target.style.color = "blue";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "black";
                        }}
                      >
                        {getElogNumber(item)}
                      </td>
                      <td>Equipment Usage</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "operation_of_sterilizer"
              ? operationOfSterilizerElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
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
                         {getElogNumber(item)}
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
                            __html: item.cleanHTML,
                          }}
                        ></td>
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
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
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
                        {getElogNumber(item)}
                      </td>
                      <td>Media Record</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "dispensing_of_material"
              ? dispensingOfMaterialsElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
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
                        {getElogNumber(item)}
                      </td>
                      <td>Dispensing of Material </td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "analytical_balance"
              ? analyticalBalanceElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/analytical-balance-panel", {
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
                       {getElogNumber(item)}
                      </td>
                      <td>Analytical Balance</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "karl_fischer"
              ? karlFischerElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/analytical-balance-panel", {
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
                        {getElogNumber(item)}
                      </td>
                      <td>KARL Fischer</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "hplc"
              ? hplcElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/hplc-panel", {
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
                        {getElogNumber(item)}
                      </td>
                      <td>HPLC</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}

            {eLogSelect === "pH Meter OP/CAL"
              ? pHMeterOPCalElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/PhMeterOpCal-panel", {
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
                        {getElogNumber(item)}
                      </td>
                      <td>pH Meter OP/Cal</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "UV-Vis Calibration"
              ? UVVisCalibElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/uv-vis-calibration-panel", {
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
                        {getElogNumber(item)}
                      </td>
                      <td>pH Meter OP/Cal</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "SDS Page"
              ? sdsPage?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/sds-page-panel", {
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
                        {getElogNumber(item)}
                      </td>
                      <td>SDS PAGE</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "Gel Doc iGene"
              ? gelDociGene?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/gel-doc-igene-panel", {
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
                        {getElogNumber(item)}
                      </td>
                      <td>Gel Doc iGene</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "UV/White Light Transilluminator"
              ? uVWhiteLightTrans?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/uv-wl-transilluminator-panel", {
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
                        {getElogNumber(item)}
                      </td>
                      <td>UV/WL Transilluminator</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
                      ></td>{" "}
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
                    </tr>
                  );
                })
              : null}
            {eLogSelect === "Vacuum Oven Calibration"
              ? voCalibElogs?.map((item, index) => {
                  const cleanHTML =
                    item?.description.replace(/^"|"$/g, "").trim() || "NA";
                  return (
                    <tr key={item.index}>
                      <td> {index + 1}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                        }}
                        onClick={() =>
                          navigate("/vo-cal-panel", {
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
                        {getElogNumber(item)}
                      </td>
                      <td>VO CAL</td>
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
                          : "EU"}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: item.cleanHTML,
                        }}
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
                )

                .map((item, index) => {
                  const cleanHTML = (html) =>
                    html?.replace(/^"|"$/g, "").trim() || "NA";

                  return (
                    <tr key={item.eLogId}>
                      <td>{index + 1}</td>
                      <td
                        style={{ cursor: "pointer", color: "black" }}
                        onClick={() => handleNavigation(item)}
                        onMouseEnter={(e) => (e.target.style.color = "blue")}
                        onMouseLeave={(e) => (e.target.style.color = "black")}
                      >
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
                          // ? `AB${item.form_id}`
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
                          : item.voCalibRecords
                          ? getElogNumber(item)
                          : null}
                      </td>
                      <td>
                        {item.DifferentialPressureRecords
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
                          ? "pH Meter OP/Cal"
                          : item.UvVisRecords
                          ? "UV-VIS Spectrophotometer"
                          : item.sdsPageRecords
                          ? "SDS PAGE"
                          : item.gelDocIGeneRecords
                          ? "Gel Doc iGene"
                          : item.uvWhiteLightRecords
                          ? "UV/WL Transilluminator"
                          : item.voCalibRecords
                          ? "VO Calibration"
                          : null}
                      </td>
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
                          : "EU"}
                      </td>
                      <td>
                        {item.compression_area}
                      </td>
                      <td
                        dangerouslySetInnerHTML={{
                          __html: cleanHTML(item.description),
                        }}
                      ></td>
                      <td>{item.initiator_name}</td>
                      <td>{formatDate(item.date_of_initiation)}</td>
                      <td>{item.status}</td>
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
