import { useEffect, useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import "../ConfigForms.css";
import "./BMR.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { NoteAdd } from "@mui/icons-material";
import axios from "axios";
import UserVerificationPopUp from "../../../components/UserVerificationPopUp/UserVerificationPopUp";
import TinyEditor from "../../../components/TinyEditor";
const userRole = "PDO";

export default function BMR() {
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isProductInformation, setIsProductInformation] = useState(false);
  const [isBatchFormulaAndMaterialIdentification, setIsBatchFormulaAndMaterialIdentification] = useState(false);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [isSelectedGeneralManufacturing, setIsSelectedGeneralManufacturing] = useState(false);
  const [isSelectedManufacturing, setIsSelectedManufacturing] = useState(false);
  const [isSelectedEquipmentClearance, setIsSelectedEquipmentClearance] = useState(false);
  const [initiatorRemarks, setInitiatorRemarks] = useState(false);
  const [reviewerRemarks, setReviewerRemarks] = useState(false);
  const [approverRemarks, setApproverRemarks] = useState(false);
  const [allTableData, setAllTableData] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [User, setUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);
  const navigate = useNavigate();
  const location =useLocation();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

  function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}
// const currentDate = getCurrentDateTime();
 const checkpoints = [
  "Check the updation of Status Label and Log book.",
  "Check the safety precautions are taken wherever required.",
  "Check the Calibrations, Validation and Preventive Maintenance status.",
  "Check the cleanliness of Upper Lid, Upper Hopper, Lower Hopper, Sieve Clamps, Gaskets, Discharge Opening.",
  "Check the cleanliness of Body.",
  "Check the cleanliness and dryness of overall equipment.",
  "Check the cleanliness of upper lid.",
  "Check the cleanliness Inner and outer surface.",
  "Check the equipment for proper assembly.",
  "Check absence of previous product/material on the equipment.",
  "Other if any specify ________",
];
const [equipmentClearance, setEquipmentClearance] = useState(
  checkpoints.map(() => ({
    pdoChecked: "",
    qadVerified: "",
    pdoChecked2: "",
    qadVerified2: "",
  }))
);

const [generalManufacturing, setGeneralManufacturing] = useState({
  date: "",
  time: "",
  dp: "",
  temp: "",
  rh: "",
  recordedByPDO: { name: "", date: "" },
  checkedByQAD: { name: "", date: "" },
});

const [manufacturingRows, setManufacturingRows] = useState([
  {
    section: "8.7",
    instruction: "Intragranular materials Sifting of Lot-A",
    equipmentNo: "",
    startTime: "",
    endTime: "",
    pdoSign: "",
    qadSign: "",
  },
  {
    section: "8.7.1",
    instruction:
      "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
    equipmentNo: "",
    startTime: "",
    endTime: "",
    pdoSign: "",
    qadSign: "",
  },
  {
    section: "8.7.2",
    instruction:
      "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
    equipmentNo: "",
    startTime: "",
    endTime: "",
    pdoSign: "",
    qadSign: "",
  },
  {
    section: "8.7.3",
    instruction:
      "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
    equipmentNo: "",
    startTime: "",
    endTime: "",
    pdoSign: "",
    qadSign: "",
  },
  {
    section: "8.7.4",
    instruction: "Mention the sifted material weighing details in section No. 8.11",
    equipmentNo: "",
    startTime: "",
    endTime: "",
    pdoSign: "",
    qadSign: "",
  },

  // ===== LOT-B =====
  {
    section: "8.8",
    instruction: "Intragranular materials Sifting of Lot-B",
    equipmentNo: "",
    startTime: "",
    endTime: "",
    pdoSign: "",
    qadSign: "",
  },
  {
    section: "8.8.1",
    instruction:
      "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
    equipmentNo: "",
    startTime: "",
    endTime: "",
    pdoSign: "",
    qadSign: "",
  },
  {
    section: "8.8.2",
    instruction:
      "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
    equipmentNo: "",
    startTime: "",
    endTime: "",
    pdoSign: "",
    qadSign: "",
  },
  {
    section: "8.8.3",
    instruction:
      "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
    equipmentNo: "",
    startTime: "",
    endTime: "",
    pdoSign: "",
    qadSign: "",
  },
  {
    section: "8.8.4",
    instruction: "Mention the sifted material weighing details in section No. 8.11",
    equipmentNo: "",
    startTime: "",
    endTime: "",
    pdoSign: "",
    qadSign: "",
  },
  {
  section: "8.9",
  instruction: "Intragranular materials Sifting of Lot-C",
  equipmentNo: "",
  startTime: "",
  endTime: "",
  pdoSign: "",
  qadSign: "",
},
{
  section: "8.9.1",
  instruction:
    "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
  equipmentNo: "",
  startTime: "",
  endTime: "",
  pdoSign: "",
  qadSign: "",
},
{
  section: "8.9.2",
  instruction:
    "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
  equipmentNo: "",
  startTime: "",
  endTime: "",
  pdoSign: "",
  qadSign: "",
},
{
  section: "8.9.3",
  instruction:
    "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
  equipmentNo: "",
  startTime: "",
  endTime: "",
  pdoSign: "",
  qadSign: "",
},
{
  section: "8.9.4",
  instruction: "Mention the sifted material weight details in section No. 8.11",
  equipmentNo: "",
  startTime: "",
  endTime: "",
  pdoSign: "",
  qadSign: "",
},

// ===== EXTRAGRANULAR MATERIALS =====
{
  section: "8.10",
  instruction: "Extragrangular materials Sifting",
  equipmentNo: "",
  startTime: "",
  endTime: "",
  pdoSign: "",
  qadSign: "",
},
{
  section: "8.10.1",
  instruction:
    "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
  equipmentNo: "",
  startTime: "",
  endTime: "",
  pdoSign: "",
  qadSign: "",
},
{
  section: "8.10.2",
  instruction:
    "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
  equipmentNo: "",
  startTime: "",
  endTime: "",
  pdoSign: "",
  qadSign: "",
},
{
  section: "8.10.3",
  instruction:
    "Sift the XXXXXXXX Qty. ____ through mesh #30 fitted on vibratory sifter. Collect the sifted material into SS container lined with double polyethylene bag and affix “sifted by” label with sign & date on Dispensing label.",
  equipmentNo: "",
  startTime: "",
  endTime: "",
  pdoSign: "",
  qadSign: "",
},
{
  section: "8.10.4",
  instruction: "Mention the sifted material weight details in section No. 8.11",
  equipmentNo: "",
  startTime: "",
  endTime: "",
  pdoSign: "",
  qadSign: "",
},
]);
 const [bmrData, setBmrData] = useState({
  site_id: location.state?.site_id || "",
  initiator_id: loggedInUser?.userId || "",
  date_of_initiation: getCurrentDateTime(),
 
  equipmentClearance: equipmentClearance||[],
  generalPrecautions: generalManufacturing||[],
    manufacturingPrecautions: manufacturingRows||[]
});

 
  useEffect(() => {
    const config = {
      method: "post",
      url: "http://localhost:1000/differential-pressure/get-user-roleGroups",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
      data: {
        site_id: location.state?.site_id,
        role_id: 2,
        process_id: 1,
      },
    };

    axios(config)
      .then((response) => {
        setReviewers(response.data.message);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfig = {
      method: "post",
      url: "http://localhost:1000/differential-pressure/get-user-roleGroups",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
      data: {
        site_id: location.state?.site_id,
        role_id: 3,
        process_id: 1,
      },
    };

    axios(newConfig)
      .then((response) => {
        setApprovers(response.data.message);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      url: `http://localhost:1000/user/get-a-user/${loggedInUser?.userId}`, // Ensure you use the correct URL format including 'http://'
      headers: {}, // You can add any necessary headers here
    };

    axios(requestOptions)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handlePopupSubmit = (credentials) => {
    if (
      differentialPRecord.site_id === null
      //  ||
      // differentialPRecord.approver_id === null ||
      // differentialPRecord.reviewer_id === null
    ) {
      toast.error(
        "Please select an approver and a reviewer before saving e-log!"
      );
      return;
    }

    // if (differentialPRecord.initiatorComment === "") {
    //   toast.error("Please provide an initiator comment!");
    //   return;
    // }
    // if (differentialPRecord.description === "") {
    //   toast.error("Please provide a short description!");
    //   return;
    // }
    if (
      differentialPRecord?.FormRecordsArray?.some(
        (record) => record.differential_pressure === "" || record.remarks === ""
      )
    ) {
      toast.error("Please provide grid details!");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    differentialPRecord.email = credentials?.email;
    differentialPRecord.password = credentials?.password;
    differentialPRecord.initiatorDeclaration = credentials?.declaration;

   const payload = {
  ...bmrData,
  equipmentClearance: JSON.stringify(bmrData.equipmentClearance),
  generalPrecautions: JSON.stringify(bmrData.generalPrecautions),
  manufacturingPrecautions: JSON.stringify(bmrData.manufacturingPrecautions)
};

axios.post(
  "http://localhost:1000/equipment/equipments",
  payload,
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
)

      .then(() => {
        toast.success("eLog Saved Successfully!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("There was an error creating eLog:", error);
        toast.error("There was an error creating eLog");
      });
  };

 
  console.log(allTableData, "allTableData");
  const addRow = () => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use 24-hour format
    };

    const currentTime = new Date().toLocaleTimeString("en-us", options);
    const newRow = {
      unique_id: generateUniqueId(),
      date: date,
      time: currentTime,
      differential_pressure: "",
      remarks: "",
      checked_by: User?.name,
      supporting_docs: null,
    };
    setAllTableData([...allTableData, newRow]);
  };

  const deleteRow = (index) => {
    const updatedData = [...allTableData];
    updatedData.splice(index, 1);
    setAllTableData(updatedData);
  };

  // const currentDate = new Date();
  // const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  const generateUniqueId = () => {
    return `UU0${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
  };


  const [differentialPRecord, setDifferentialPRecord] = useReducer(
    (prev, next) => ({
      ...prev,
      
      ...next,
    }),
    {
      site_id: location.state?.site_id,
      reviewer_id: null,
      approver_id: null,
      description: "",
      department: "",
      review_comments: "",
      compression_area: "",
      additionalAttachment: "",
      additionalInfo: "",
      limit: null,
      initiatorComment: "",
      initiatorAttachment: null,
      initiatorDeclaration: "",
    }
  );

 
  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setDifferentialPRecord({ ...differentialPRecord, [name]: value });
  };

  const handleReviewerFileChange = (e) => {
    setDifferentialPRecord({
      ...differentialPRecord,
      reviewerAttachment: e.target.files[0],
    });
  };
  const handleApproverFileChange = (e) => {
    setDifferentialPRecord({
      ...differentialPRecord,
      approverAttachment: e.target.files[0],
    });
  };

  useEffect(() => {
    setDifferentialPRecord({ FormRecordsArray: allTableData });
  }, [allTableData]);

  const handleDeleteFile = (index) => {
    const updatedData = [...allTableData];
    updatedData[index].supporting_docs = null; // This should remove the file
    setAllTableData(updatedData);
  };

  const handleFileChange = (index, file) => {
    const updatedData = [...allTableData];
    updatedData[index].supporting_docs = file;
    setAllTableData(updatedData);
  };
  const handleFileChangeAttachment = (e) => {
    setDifferentialPRecord({
      ...differentialPRecord,
      additionalAttachment: e.target.files[0],
    });
  };

  const handleInitiatorFileChange = (e) => {
    setDifferentialPRecord({
      ...differentialPRecord,
      initiatorAttachment: e.target.files[0],
    });
  };

  const setTinyContent = (content) => {
    setDifferentialPRecord({
      description: content,
    });
  };

 
const Dropdown = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border rounded px-2 py-1 text-sm w-full"
  >
    <option value="">Select</option>
    <option value="YES">✔ Yes</option>
    <option value="NO">✖ No</option>
    <option value="NA">NA</option>
  </select>
);

  

// ===== ROLE (demo / prod me backend se aayega) =====
const userRole = "PDO"; // "PDO" | "QAD"

// ===== STATE =====


// ===== TEMP VALIDATION (23 ± 2 °C → 21–25) =====
const getTempStatus = (temp) => {
  if (temp === "" || temp === null) return null;
  const v = Number(temp);
  if (isNaN(v)) return null;

  if (v < 21 || v > 25) {
    return {
      status: "OUT_OF_LIMIT",
      color: "bg-red-100 border-red-500 text-red-700",
      label: "Out of Limit (21–25°C)",
    };
  }

  return {
    status: "WITHIN_LIMIT",
    color: "bg-green-100 border-green-500 text-green-700",
    label: "Within Limit",
  };
};

// ===== RH VALIDATION (NMT 55%) =====
const getRHStatus = (rh) => {
  if (rh === "" || rh === null) return null;
  const v = Number(rh);
  if (isNaN(v)) return null;

  if (v > 55) {
    return {
      status: "OUT_OF_LIMIT",
      color: "bg-red-100 border-red-500 text-red-700",
      label: "Out of Limit (≤ 55%)",
    };
  }

  return {
    status: "WITHIN_LIMIT",
    color: "bg-green-100 border-green-500 text-green-700",
    label: "Within Limit",
  };
};

// ===== SIGN HANDLER =====
const handleSign = () => {
  const today = new Date().toISOString().split("T")[0];

  if (userRole === "PDO") {
    setGeneralManufacturing((p) => ({
      ...p,
      recordedByPDO: { name: "PDO USER", date: today },
    }));
  }

  if (userRole === "QAD") {
    setGeneralManufacturing((p) => ({
      ...p,
      checkedByQAD: { name: "QAD USER", date: today },
    }));
  }
};

// ===== SAVE HANDLER =====
const handleSave = () => {
  const tempStatus = getTempStatus(generalManufacturing.temp);
  const rhStatus = getRHStatus(generalManufacturing.rh);

  if (
    !generalManufacturing.date ||
    !generalManufacturing.time ||
    !generalManufacturing.dp ||
    !generalManufacturing.temp ||
    !generalManufacturing.rh
  ) {
    alert("Please fill all mandatory fields");
    return;
  }

  if (userRole === "PDO" && !generalManufacturing.recordedByPDO.name) {
    alert("PDO must sign before saving");
    return;
  }

  if (userRole === "QAD" && !generalManufacturing.checkedByQAD.name) {
    alert("QAD must sign before saving");
    return;
  }

  if (tempStatus?.status === "OUT_OF_LIMIT" || rhStatus?.status === "OUT_OF_LIMIT") {
    alert("⚠ One or more parameters are OUT OF LIMIT. Deviation must be recorded.");
  }

  const payload = {
    ...generalManufacturing,
    tempStatus: tempStatus?.status || "NA",
    rhStatus: rhStatus?.status || "NA",
  };

  console.log("FINAL PAYLOAD:", payload);

  // axios.post("/api/general-manufacturing", payload);
};

// ===== ROLE =====
// const userRole = "PDO"; // "PDO" | "QAD"

// ===== TABLE DATA (BOTH LOT-A & LOT-B) =====


// ===== UPDATE HANDLER =====

const updateRow = (index, key, value) => {
  const copy = [...manufacturingRows];
  copy[index][key] = value;
  setManufacturingRows(copy);
};

// ===== SIGN HANDLER =====
const handleRowSign = (index) => {
  const today = new Date().toISOString().split("T")[0];
  const copy = [...manufacturingRows];

  if (userRole === "PDO") {
    copy[index].pdoSign = `PDO (${today})`;
  }
  if (userRole === "QAD") {
    copy[index].qadSign = `QAD (${today})`;
  }
  setManufacturingRows(copy);
};

// ===== SAVE =====
const handleManufacturingSave = () => {
  console.log("FINAL MANUFACTURING PAYLOAD:", manufacturingRows);
  alert("Manufacturing data saved (check console)");
};



  return (
    <>
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-pages" className="min-w-full">

          <div className="document-form">
            <div className="details-form-data">
              <div className="sub-head-2">eBMR</div>

              <div className="outerDiv4">
                <div className="btn-forms">
                  <div
                    className={`${
                      isSelectedGeneral === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false),
                        setIsSelectedGeneral(true),
                        setInitiatorRemarks(false),
                        setReviewerRemarks(false),
                        setApproverRemarks(false),
                        setIsSelectedEquipmentClearance(false),
                        setIsSelectedGeneralManufacturing(false),
                        setIsSelectedManufacturing(false);
                        setIsProductInformation(false);
                        setIsBatchFormulaAndMaterialIdentification(false);
                    }}
                  >
                    General Information
                  </div>
                  <div
                    className={`${
                      isProductInformation === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false),
                      setIsProductInformation(true);
                        setIsSelectedGeneral(false),
                        setInitiatorRemarks(false),
                        setReviewerRemarks(false),
                        setApproverRemarks(false),
                        setIsSelectedEquipmentClearance(false),
                        setIsSelectedGeneralManufacturing(false),
                        setIsSelectedManufacturing(false);
                        setIsBatchFormulaAndMaterialIdentification(false);

                    }}
                  >
                    Product Information
                  </div>
                  <div
                    className={`${
                      isBatchFormulaAndMaterialIdentification === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false),
                      setIsProductInformation(false);
                      setIsBatchFormulaAndMaterialIdentification(true);
                        setIsSelectedGeneral(false),
                        setInitiatorRemarks(false),
                        setReviewerRemarks(false),
                        setApproverRemarks(false),
                        setIsSelectedEquipmentClearance(false),
                        setIsSelectedGeneralManufacturing(false),
                        setIsSelectedManufacturing(false);

                    }}
                  >
                    Batch Formula and Material Identification
                  </div>
                  
                  <div
                    className={`${
                      isSelectedEquipmentClearance === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false),
                        setIsSelectedGeneral(false),
                         setIsSelectedEquipmentClearance(true),
                        setInitiatorRemarks(false),
                        setReviewerRemarks(false),
                        setApproverRemarks(false),
                        setIsSelectedGeneralManufacturing(false),
                        setIsSelectedManufacturing(false);
                        setIsProductInformation(false);
                        setIsBatchFormulaAndMaterialIdentification(false);
                    }}
                  >
                  Equipment Clearance
                  </div>
                  <div
                    className={`${
                      isSelectedGeneralManufacturing === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false),
                        setIsSelectedGeneral(false),
                        setIsSelectedGeneralManufacturing(true),
                        setInitiatorRemarks(false),
                        setReviewerRemarks(false),
                        setApproverRemarks(false),
                        setIsSelectedEquipmentClearance(false),
                        setIsSelectedManufacturing(false);
                        setIsProductInformation(false);
                        setIsBatchFormulaAndMaterialIdentification(false);
                    }}
                  >
                    General & Manufacturing precautions
                  </div>
                  <div
                    className={`${
                      isSelectedManufacturing === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false),
                        setIsSelectedGeneral(false),
                       setIsSelectedManufacturing(true),
                        setInitiatorRemarks(false),
                        setReviewerRemarks(false),
                        setApproverRemarks(false),
                        setIsSelectedEquipmentClearance(false),
                        setIsSelectedGeneralManufacturing(false);
                        setIsProductInformation(false);
                        setIsBatchFormulaAndMaterialIdentification(false);
                    }}
                  >
                    Manufacturing Instructions
                  </div>
                 
                </div>
              </div>

              {isSelectedGeneral === true ? (
                <>
                <div className="form-flex">
                  <div className="group-input">
                    <label className="color-label">Initiator</label>
                    <div>
                      <input
                        type="text"
                        value={User?.name}
                        onChange={(e) =>
                          setDifferentialPRecord({ initiator: e.target.value })
                        }
                        disabled
                        style={{ backgroundColor: "#fafafa" }}
                        className="shadow-xl"
                      />
                    </div>
                  </div>

                  <div className="group-input">
                    <label className="color-label">Date of Initiation</label>
                    <div>
                      <input
                        type="text"
                        value={bmrData.date_of_initiation}
                        onChange={(e) =>
                          setDifferentialPRecord({
                            dateOfInitiation: e.target.value,
                          })
                        }
                        disabled
                        style={{ backgroundColor: "#fafafa" }}
                        className="shadow-xl"
                      />
                    </div>
                  </div>
                  </div>
<div className="form-flex">
                    <div className="group-input">
                      <label className="color-label">
                        Reviewer
                        <span style={{ color: "red", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <div>
                        <select
                          value={differentialPRecord.reviewer_id}
                          onChange={(e) => {
                            setDifferentialPRecord({
                              reviewer_id: e.target.value,
                            });
                          }}
                        >
                          <option value="">Select a reviewer</option>
                          {[
                            ...new Map(
                              reviewers.map((reviewer) => [
                                reviewer.user_id,
                                reviewer,
                              ])
                            ).values(),
                          ].map((reviewer, index) => (
                            <option key={index} value={reviewer.user_id}>
                              {reviewer.User.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="group-input">
                      <label className="color-label">
                        Approver
                        <span style={{ color: "red", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <div>
                        <select
                          value={differentialPRecord.approver_id}
                          onChange={(e) => {
                            setDifferentialPRecord({
                              approver_id: e.target.value,
                            });
                          }}
                        >
                          <option value="">Select an approver</option>
                          {[
                            ...new Map(
                              approvers.map((approver) => [
                                approver.user_id,
                                approver,
                              ])
                            ).values(),
                          ].map((approver, index) => (
                            <option key={index} value={approver.user_id}>
                              {approver.User.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="group-input">
                    <label className="color-label">
                      Description{" "}
                      <span className="required-asterisk text-red-500">*</span>
                    </label>
                    <div>
                      {/* <input
                        type="text"
                        value={differentialPRecord.description}
                        onChange={(e) =>
                          setDifferentialPRecord({
                            description: e.target.value,
                          })
                        }
                        required // HTML5 attribute to enforce field requirement
                      /> */}

                      <TinyEditor
                        editorContent={differentialPRecord.description}
                        setEditorContent={setTinyContent}
                        tinyNo={1}
                      />
                    </div>
                  </div>

                  <div className="group-input">
                    <label className="color-label">Status</label>
                    <div>
                      <input
                        type="text"
                        value="Under Initiation"
                        onChange={(e) =>
                          setDifferentialPRecord({ status: e.target.value })
                        }
                        disabled
                        style={{ backgroundColor: "#fafafa" }}
                        className="shadow-xl"
                      />
                    </div>
                  </div>
                </>
              ) : null}
          {isProductInformation === true ? (
  <div className="mt-4 border border-black p-4">

    {/* MAIN GRID */}
    <div className="grid grid-cols-2 gap-6">

      {/* ================= LEFT BLOCK ================= */}
      <div className="space-y-4">

        {[
          "Label Claim",
          "Product Synonym",
          "Shelf Life",
          "Customer Code",
          "Ref. MFC Number",
          
        ].map((label, i) => (
          <div key={i}>
            <label className="font-medium text-sm">{label}</label>
            <input
              type="text"
              className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
            />
          </div>
        ))}

      </div>

      {/* ================= RIGHT BLOCK ================= */}
      <div className="space-y-4">

        <div>
          <label className="font-medium text-sm">
            Supersedes BMR / Document No.
          </label>
          <input
            type="text"
            className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
          />
        </div>

        

      <div>
        <label className="font-medium text-sm">Manufacturing Date</label>
        <input
          type="date"
          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="font-medium text-sm">Expiry Date</label>
        <input
          type="date"
          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="font-medium text-sm">Signature & Date (QAD)</label>
        <input
          type="text"
          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
        />
      </div>
      <div>
        <label className="font-medium text-sm">Reference Change Control No.</label>
        <input
          type="text"
          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
        />
      </div>
      
      </div>


      {/* ================= 3rd ROW ================= */}
      <div>
        <label className="font-medium text-sm">Batch Started on Date</label>
        <input
          type="date"
          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="font-medium text-sm">Batch Completed on Date</label>
        <input
          type="date"
          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="font-medium text-sm">
          Production (Sign & Date)
        </label>
        <input
          type="text"
          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="font-medium text-sm">
          QAD (Sign & Date)
        </label>
        <input
          type="text"
          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="font-medium text-sm">Mother Batch No.</label>
        <input
          type="text"
          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
        />
      </div>

    </div>
     
  <div className="font-bold  pt-5">
          Reconciliation of Executed BMR pages
        </div>
<div className="grid grid-cols-2 gap-6">
        {[
          "No. of pages issued in first issue",
          "No. of additional pages issued",
          "Total No. of pages issued"
        ].map((label, i) => (
          <div key={i}>
            <label className="font-medium text-sm">{label}</label>
            <input
              type="text"
              className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
            />
          </div>
        ))}
</div>
  </div>
) : null}
{isBatchFormulaAndMaterialIdentification === true ? (
  <div className="overflow-x-auto mt-4">
<div className="font-bold">Intragranular Material</div>
 <div className="AddRows d-flex">
                      <NoteAdd
                      // onClick={addRow}
                      />
                      <div className="addrowinstruction"></div>
                    </div>
    <table className="w-full  border border-black text-xs border-collapse">

      {/* HEADER */}
      <thead className="text-center h-[50px] font-semibold">
        <tr>
          <th className="border p-2">Sr. No.</th>
          <th className="border p-2">Material Code (As per SAP)</th>
          <th className="border p-2">Material Description</th>
          <th className="border p-2">Vendor / mfg.</th>
          <th className="border p-2">Quantity / Unit Quantity</th>
          <th className="border p-2">UOM</th>
          <th className="border p-2">LOT</th>
          <th className="border p-2">Quantity / Batch Quantity</th>
          <th className="border p-2">UOM</th>
          <th className="border p-2">Retest Date</th>
          <th className="border p-2">Exp. Date</th>
          <th className="border p-2">A.R. No.</th>
        </tr>
      </thead>

      <tbody>
      </tbody>
    </table>
<div className="font-bold pt-5">Granulating Agent</div>
 <div className="AddRows d-flex">
                      <NoteAdd
                      // onClick={addRow}
                      />
                      <div className="addrowinstruction"></div>
                    </div>
    <table className="w-full border border-black text-xs border-collapse">

      {/* HEADER */}
      <thead className="text-center h-[50px] font-semibold">
        <tr>
          <th className="border p-2">Sr. No.</th>
          <th className="border p-2">Material Code (As per SAP)</th>
          <th className="border p-2">Material Description</th>
          <th className="border p-2">Vendor / mfg.</th>
          <th className="border p-2">Quantity / Unit Quantity</th>
          <th className="border p-2">UOM</th>
          <th className="border p-2">LOT</th>
          <th className="border p-2">Quantity / Batch Quantity</th>
          <th className="border p-2">UOM</th>
          <th className="border p-2">Retest Date</th>
          <th className="border p-2">Exp. Date</th>
          <th className="border p-2">A.R. No.</th>
        </tr>
      </thead>

      <tbody>
      </tbody>
    </table>
<div className="font-bold pt-5">Extragranular Material</div>
 <div className="AddRows d-flex">
                      <NoteAdd
                      // onClick={addRow}
                      />
                      <div className="addrowinstruction"></div>
                    </div>
    <table className="w-full border border-black text-xs border-collapse">

      {/* HEADER */}
      <thead className="text-center h-[50px] font-semibold">
        <tr>
          <th className="border p-2">Sr. No.</th>
          <th className="border p-2">Material Code (As per SAP)</th>
          <th className="border p-2">Material Description</th>
          <th className="border p-2">Vendor / mfg.</th>
          <th className="border p-2">Quantity / Unit Quantity</th>
          <th className="border p-2">UOM</th>
          <th className="border p-2">LOT</th>
          <th className="border p-2">Quantity / Batch Quantity</th>
          <th className="border p-2">UOM</th>
          <th className="border p-2">Retest Date</th>
          <th className="border p-2">Exp. Date</th>
          <th className="border p-2">A.R. No.</th>
        </tr>
      </thead>

      <tbody>
      </tbody>
    </table>
<div className="font-bold pt-5">Lubricant</div>
 <div className="AddRows d-flex">
                      <NoteAdd
                      // onClick={addRow}
                      />
                      <div className="addrowinstruction"></div>
                    </div>
    <table className="w-full border border-black text-xs border-collapse">

      {/* HEADER */}
      <thead className="text-center h-[50px] font-semibold">
        <tr>
          <th className="border p-2">Sr. No.</th>
          <th className="border p-2">Material Code (As per SAP)</th>
          <th className="border p-2">Material Description</th>
          <th className="border p-2">Vendor / mfg.</th>
          <th className="border p-2">Quantity / Unit Quantity</th>
          <th className="border p-2">UOM</th>
          <th className="border p-2">LOT</th>
          <th className="border p-2">Quantity / Batch Quantity</th>
          <th className="border p-2">UOM</th>
          <th className="border p-2">Retest Date</th>
          <th className="border p-2">Exp. Date</th>
          <th className="border p-2">A.R. No.</th>
        </tr>
      </thead>

      <tbody>
      </tbody>
    </table>
<div className="font-bold pt-5">Film coating Material: (XX % w/w suspension / dispersion)</div>
     <div className="AddRows d-flex">
                      <NoteAdd
                      // onClick={addRow}
                      />
                      <div className="addrowinstruction"></div>
                    </div>
    <table className="w-full border border-black text-xs border-collapse">

      {/* HEADER */}
      <thead className="text-center h-[50px] font-semibold">
        <tr>
          <th className="border p-2">Sr. No.</th>
          <th className="border p-2">Material Code (As per SAP)</th>
          <th className="border p-2">Material Description</th>
          <th className="border p-2">Vendor / mfg.</th>
          <th className="border p-2">Quantity / Unit Quantity</th>
          <th className="border p-2">UOM</th>
          <th className="border p-2">LOT</th>
          <th className="border p-2">Quantity / Batch Quantity</th>
          <th className="border p-2">UOM</th>
          <th className="border p-2">Retest Date</th>
          <th className="border p-2">Exp. Date</th>
          <th className="border p-2">A.R. No.</th>
        </tr>
      </thead>

      <tbody>
      </tbody>
    </table>


  </div>
) : null}


     {isSelectedEquipmentClearance === true ? (
  <div className="overflow-x-auto mt-4">
    <table className="w-full border border-black text-sm border-collapse">

      {/* ================= EQUIPMENT DETAILS ================= */}
      <thead>
        <tr className="bg-gray-100">
          <th className="border  border-black p-2 text-left" colSpan={2}>
            Equipment Name / Accessories Name
          </th>
          <th className="border border-black p-2 text-center" colSpan={2}>
            Vibratory sifter
          </th>
          <th className="border border-black p-2 text-center" colSpan={2}>
            SS Container
          </th>
        </tr>

        {[
          "Equipment ID. / Accessories ID.",
          "Previous Product / Material",
          "Batch No. / A.R. No.",
          "Type of cleaning",
        ].map((label, i) => (
          <tr key={i}>
            <th className="border bg-white text-black border-black p-2 text-left" colSpan={2}>
              {label}
            </th>

            {/* Vibratory Sifter input */}
            <th className="border bg-white text-black border-black p-2" colSpan={2}>
              <input
                className="w-full border border-gray-400 px-2 py-1 rounded text-sm"
                type="text"
              />
            </th>

            {/* SS Container input */}
            <th className="border bg-white text-black border-black p-2" colSpan={2}>
              <input
                className="w-full border border-gray-400 px-2 py-1 rounded text-sm"
                type="text"
              />
            </th>
          </tr>
        ))}

        {/* ================= CHECKLIST HEADER ================= */}
        <tr className="bg-gray-100">
          <th className="border border-black p-2 text-center">Sr. No.</th>
          <th className="border border-black p-2 text-left">Check points</th>
          <th className="border border-black p-2 text-center">
            Checked by (PDO)
          </th>
          <th className="border border-black p-2 text-center">
            Verified by (QAD)
          </th>
          <th className="border border-black p-2 text-center">
            Checked by (PDO)
          </th>
          <th className="border border-black p-2 text-center">
            Verified by (QAD)
          </th>
        </tr>
      </thead>

      {/* ================= CHECKLIST BODY ================= */}
      <tbody>
        {checkpoints.map((point, index) => {
          const ssContainerNA = [2, 3, 4].includes(index);

          return (
            <tr key={index}>
              <td className="border border-black p-2 text-center">
                {index + 1}
              </td>

              <td className="border border-black p-2">
                {point}
              </td>

              <td className="border border-black p-2">
                <Dropdown
                  value={equipmentClearance[index].pdoChecked}
                  onChange={(val) => {
                    const data = [...equipmentClearance];
                    data[index].pdoChecked = val;
                    setEquipmentClearance(data);
                  }}
                />
              </td>

              <td className="border border-black p-2">
                <Dropdown
                  value={equipmentClearance[index].qadVerified}
                  onChange={(val) => {
                    const data = [...equipmentClearance];
                    data[index].qadVerified = val;
                    setEquipmentClearance(data);
                  }}
                />
              </td>

              <td
                className={`border border-black p-2 ${
                  ssContainerNA ? "bg-gray-200" : ""
                }`}
              >
                <Dropdown
                  value={equipmentClearance[index].pdoChecked2}
                  onChange={(val) => {
                    const data = [...equipmentClearance];
                    data[index].pdoChecked2 = val;
                    setEquipmentClearance(data);
                  }}
                  disabled={ssContainerNA}
                />
              </td>

              <td
                className={`border border-black p-2 ${
                  ssContainerNA ? "bg-gray-200" : ""
                }`}
              >
                <Dropdown
                  value={equipmentClearance[index].qadVerified2}
                  onChange={(val) => {
                    const data = [...equipmentClearance];
                    data[index].qadVerified2 = val;
                    setEquipmentClearance(data);
                  }}
                  disabled={ssContainerNA}
                />
              </td>
            </tr>
          );
        })}

        {/* ================= SIGN ================= */}
        <tr>
          <td
            className="border border-black p-3 font-medium text-center"
            colSpan={2}
          >
            Sign & Date / Time
          </td>
          {[1, 2, 3, 4].map((_, i) => (
            <td key={i} className="border border-black p-2">
              <input
                type="text"
                className="w-full border border-gray-400 px-2 py-1 rounded text-sm"
              />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
) : null}


{isSelectedGeneralManufacturing === true ? (
  <>
    <div className="mt-4 overflow-x-auto">
      <div className="grid grid-cols-2 gap-4">
<div className="group-input">
                    <label className="color-label">Area Name</label>
                    <div className="instruction"></div>
                    <input
                      type="text"
                      // className={`${
                      //   differentialPRecord.limit < 0.6
                      //     ? "limit"
                      //     : differentialPRecord.limit > 2.6
                      //     ? "limit"
                      //     : ""
                      // }`}
                      
                    />
                  </div>
                  <div className="group-input">
                    <label className="color-label">Room No</label>
                    <div className="instruction"></div>
                    <input
                      type="text"
                      // className={`${
                      //   differentialPRecord.limit < 0.6
                      //     ? "limit"
                      //     : differentialPRecord.limit > 2.6
                      //     ? "limit"
                      //     : ""
                      // }`}
                   
                    />
                  </div>
      </div>
      <table className="w-full border border-black text-sm">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">
              D.P. (mm WC)<br />NLT 1.0
            </th>
            <th className="border p-2">
              Temp (°C)<br />23 ± 2
            </th>
            <th className="border p-2">
              R.H. (%)<br />NMT 55
            </th>
            <th className="border p-2">Recorded by (PDO)</th>
            <th className="border p-2">Checked by (QAD)</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            {/* DATE */}
            <td className="border p-2">
              <input type="date" className="w-full border px-2 py-1"
                value={generalManufacturing.date}
                onChange={(e) => setGeneralManufacturing({ ...generalManufacturing, date: e.target.value })}
              />
            </td>

            {/* TIME */}
            <td className="border p-2">
              <input type="time" className="w-full border px-2 py-1"
                value={generalManufacturing.time}
                onChange={(e) => setGeneralManufacturing({ ...generalManufacturing, time: e.target.value })}
              />
            </td>

            {/* DP */}
            <td className="border p-2">
              <input className="w-full border px-2 py-1"
                value={generalManufacturing.dp}
                onChange={(e) => setGeneralManufacturing({ ...generalManufacturing, dp: e.target.value })}
              />
            </td>

            {/* TEMP */}
            <td className="border p-2">
              <input type="number"
                className={`w-full border px-2 py-1 ${getTempStatus(generalManufacturing.temp)?.color || ""}`}
                value={generalManufacturing.temp}
                onChange={(e) => setGeneralManufacturing({ ...generalManufacturing, temp: e.target.value })}
              />
              {getTempStatus(generalManufacturing.temp) && (
                <div className={`text-xs font-semibold mt-1 ${
                  getTempStatus(generalManufacturing.temp).status === "OUT_OF_LIMIT"
                    ? "text-red-600"
                    : "text-green-600"
                }`}>
                  {getTempStatus(generalManufacturing.temp).label}
                </div>
              )}
            </td>

            {/* RH */}
            <td className="border p-2">
              <input type="number"
                className={`w-full border px-2 py-1 ${getRHStatus(generalManufacturing.rh)?.color || ""}`}
                value={generalManufacturing.rh}
                onChange={(e) => setGeneralManufacturing({ ...generalManufacturing, rh: e.target.value })}
              />
              {getRHStatus(generalManufacturing.rh) && (
                <div className={`text-xs font-semibold mt-1 ${
                  getRHStatus(generalManufacturing.rh).status === "OUT_OF_LIMIT"
                    ? "text-red-600"
                    : "text-green-600"
                }`}>
                  {getRHStatus(generalManufacturing.rh).label}
                </div>
              )}
            </td>

            {/* PDO */}
            <td className="border p-2 text-center">
              <input  className="w-full border px-2 py-1 "
                
              />
             
            </td>

            {/* QAD */}
            <td className="border p-2 text-center">
              <input  className="w-full border px-2 py-1 "
               
              />
             
            </td>
          </tr>
        </tbody>
      </table>

     
    </div>
  </>
) : null}

{isSelectedManufacturing === true ? (
  <>
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border border-black text-sm">
        <thead className="bg-gray-300">
          <tr>
            <th className="border p-2">Section No.</th>
            <th className="border p-2">Process Instructions</th>
            <th className="border p-2">Equipment No.</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
            <th className="border p-2">Done by (PDO)</th>
            <th className="border p-2">Checked by (QAD)</th>
          </tr>
        </thead>

        <tbody>
          {manufacturingRows.map((row, index) => (
            <tr key={index}>
              <td className="border p-2 font-semibold">{row.section}</td>

              <td className="border p-2 whitespace-pre-wrap">
                {row.instruction}
              </td>

              <td className="border p-2">
                <input
                  className="w-full border px-2 py-1"
                  value={row.equipmentNo}
                  onChange={(e) =>
                    updateRow(index, "equipmentNo", e.target.value)
                  }
                />
              </td>

              <td className="border p-2">
                <input
                  type="time"
                  className="w-full border px-2 py-1"
                  value={row.startTime}
                  onChange={(e) =>
                    updateRow(index, "startTime", e.target.value)
                  }
                />
              </td>

              <td className="border p-2">
                <input
                  type="time"
                  className="w-full border px-2 py-1"
                  value={row.endTime}
                  onChange={(e) =>
                    updateRow(index, "endTime", e.target.value)
                  }
                />
              </td>

              {/* PDO */}
              <td className="border p-2 text-center">
                <input
                  
                  className="w-full border px-2 py-1"
                  // value={row.pdoSign}
                />
                
              </td>

              {/* QAD */}
              <td className="border p-2 text-center">
                <input
                  
                  className="w-full border px-2 py-1"
                  // value={row.qadSign}
                />
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  </>
) : null}

              {initiatorRemarks === true ? (
                <>
                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label">
                        Initiator Comment
                        <span style={{ color: "red", marginLeft: "2px" }}>
                          *
                        </span>
                      </label>
                      <div className="instruction"></div>
                      <input
                        name="initiatorComment"
                        onChange={(e) =>
                          setDifferentialPRecord({
                            initiatorComment: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="group-input">
                      <label
                        htmlFor="initiatorAttachment"
                        className="color-label"
                        name="initiatorAttachment"
                      >
                        Initiator Attachment
                      </label>
                      <input
                        type="file"
                        name="initiatorAttachment"
                        id="initiatorAttachment"
                        onChange={handleInitiatorFileChange}
                      />
                    </div>
                  </div>

                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label">Initiator </label>
                      <div>
                        <input
                          type="text"
                          name="initiator"
                          value={User?.name}
                          disabled
                          style={{ backgroundColor: "#fafafa" }}
                          className="shadow-xl"
                        />
                      </div>
                    </div>
                    <div className="group-input">
                      <label className="color-label">Date of Initiation</label>
                      <div>
                        <input
                          type="text"
                          value={date}
                          disabled
                          style={{ backgroundColor: "#fafafa" }}
                          className="shadow-xl"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              {reviewerRemarks === true ? (
                <>
                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label" htmlFor="reviewComment">
                        Review Comment
                      </label>
                      <input
                        id="reviewComment"
                        name="reviewComment"
                        value={User?.reviewComment || ""}
                        onChange={handleInputChange1}
                        disabled
                        style={{ backgroundColor: "#fafafa" }}
                        className="shadow-xl"
                      />
                    </div>
                    <div className="group-input">
                      <label
                        htmlFor="reviewerAttachment"
                        className="color-label"
                        name="reviewerAttachment"
                      >
                        Reviewer Attachment
                      </label>
                      <input
                        type="file"
                        name="reviewerAttachment"
                        id="reviewerAttachment"
                        onChange={handleReviewerFileChange}
                        disabled
                        style={{ backgroundColor: "#fafafa" }}
                        className="shadow-xl"
                      />
                      {User?.reviewerAttachment && (
                        <div>
                          <h3>
                            Selected File:{" "}
                            <a
                              href={User.reviewerAttachment}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View File
                            </a>
                          </h3>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label">Reviewer </label>
                      <div>
                        <input
                          type="text"
                          name="reviewer"
                          value={User?.reviewer?.name}
                          disabled
                          style={{ backgroundColor: "#fafafa" }}
                          className="shadow-xl"
                        />
                      </div>
                    </div>
                    <div className="group-input">
                      <label className="color-label">Date of Review</label>
                      <div>
                        <input
                          type="text"
                          value={User?.date_of_review?.split("T")[0]}
                          disabled
                          style={{ backgroundColor: "#fafafa" }}
                          className="shadow-xl"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {approverRemarks === true ? (
                <>
                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label" htmlFor="approverComment">
                        Approver Comment
                      </label>
                      <input
                        id="approverComment"
                        name="approverComment"
                        value={User?.approverComment || ""}
                        onChange={handleInputChange1}
                        disabled
                        style={{ backgroundColor: "#fafafa" }}
                        className="shadow-xl"
                      />
                    </div>
                    <div className="group-input">
                      <label
                        htmlFor="approverAttachment"
                        className="color-label"
                        name="aproverAttachment"
                      >
                        Approver Attachment
                      </label>
                      <input
                        type="file"
                        name="approverAttachment"
                        id="approverAttachment"
                        onChange={handleApproverFileChange}
                        disabled
                        style={{ backgroundColor: "#fafafa" }}
                        className="shadow-xl"
                      />
                      {User?.approverAttachment && (
                        <div>
                          <h3>
                            Selected File:{" "}
                            <a
                              href={User.approverAttachment}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View File
                            </a>
                          </h3>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label">Approver </label>
                      <div>
                        <input
                          type="text"
                          name="approver"
                          value={User?.approver?.name}
                          disabled
                          style={{ backgroundColor: "#fafafa" }}
                          className="shadow-xl"
                        />
                      </div>
                    </div>
                    <div className="group-input">
                      <label className="color-label">Date of Approval</label>
                      <div>
                        <input
                          type="text"
                          value={User?.date_of_approval?.split("T")[0]}
                          disabled
                          style={{ backgroundColor: "#fafafa" }}
                          className="shadow-xl"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            <div className="button-block" style={{ width: "100%" }}>
              <button
                className="themeBtn"
                onClick={() => {
                  setIsPopupOpen(true);
                }}
              >
                Save
              </button>
              <button
                className="themeBtn"
                onClick={() => navigate("/dashboard")}
              >
                Exit
              </button>
            </div>
            {isPopupOpen && (
              <UserVerificationPopUp
                onClose={handlePopupClose}
                onSubmit={handlePopupSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

