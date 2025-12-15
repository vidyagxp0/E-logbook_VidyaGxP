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
  const location = useLocation();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

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

    axios
      .post(
        "http://localhost:1000/equipment/equipments",
        bmrData,
        config
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

  const object = getCurrentDateTime();
  let date = object.currentDate;
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(0);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const currentDate = `${year}/${month}/${day}`;
    return {
      currentDate: currentDate,
    };
  }
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
 const [bmrData, setBmrData] = useState(
   (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
    site_id:location.state?.site_id,
    initiator_id:"",
    initiator_name:"",
    date_of_initiation:"",
    equipmentName:"",
    equipmentID:"",
    equipmentClearance:"",
    generalPrecautions:"",
    manufacturingPrecautions:""
    }
 );

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

  const [equipmentClearance, setEquipmentClearance] = useState(
  checkpoints.map(() => ({
    pdoChecked: "",
    qadVerified: "",
    pdoChecked2: "",
    qadVerified2: "",
  }))
);

// ===== ROLE (demo / prod me backend se aayega) =====
const userRole = "PDO"; // "PDO" | "QAD"

// ===== STATE =====
const [generalManufacturing, setGeneralManufacturing] = useState({
  date: "",
  time: "",
  dp: "",
  temp: "",
  rh: "",
  recordedByPDO: { name: "", date: "" },
  checkedByQAD: { name: "", date: "" },
});

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
          {/* <div className="top-blocks">
            <div>
              <strong> Record Name:&nbsp;</strong>Differential Pressure
            </div>
            <div>
              <strong> Site:&nbsp;</strong>
              {location.state?.site}
            </div>
            <div>
              <strong> Current Status:&nbsp;</strong>Under Initiation
            </div>
            <div>
              <strong> Initiated By:&nbsp;</strong>
              {User?.name}
            </div>
          </div> */}

          <div className="document-form">
            <div className="details-form-data">
              {/* <div className="sop-type-header">
                <div className="logo">
                  <img src="/vidyalogo21.png" alt="..." />
                </div>
                <div className="main-head">
                  <div>VidyaGxP Private Limited</div>
                </div>
              </div> */}
              {/* <div className="sop-type-header">
                <div className="logo">
                  <img src="/vidyalogo21.png" alt="..." width={20} />
                </div>
                <div className="main-head">
                  <div>VidyaGxP Private Limited</div>
                </div>
              </div> */}
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

                    }}
                  >
                    General Information
                  </div>
                    {/* <div
                      className={`${
                        isSelectedDetails === true
                          ? "btn-forms-isSelected"
                          : "btn-forms-select"
                      }`}
                      onClick={() => {
                        setIsSelectedDetails(true),
                          setIsSelectedGeneral(false),
                          setInitiatorRemarks(false),
                          setReviewerRemarks(false),
                          setApproverRemarks(false),
                          setIsSelectedEquipmentClearance(false),
                          setIsSelectedGeneralManufacturing(false),
                          setIsSelectedManufacturing(false);
                      }}
                    >
                      Details
                    </div> */}
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
                    }}
                  >
                    Manufacturing Instructions
                  </div>
                  {/* <div
                    className={`${
                      initiatorRemarks === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false),
                        setIsSelectedGeneral(false),
                        setInitiatorRemarks(true),
                        setReviewerRemarks(false),
                        setApproverRemarks(false);
                    }}
                  >
                    Initiator Remarks
                  </div> */}
                  {/* <div
                    className={`${
                      reviewerRemarks === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false),
                        setIsSelectedGeneral(false),
                        setInitiatorRemarks(false),
                        setReviewerRemarks(true),
                        setApproverRemarks(false);
                    }}
                  >
                    Reviewer Remarks
                  </div>
                  <div
                    className={`${
                      approverRemarks === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedDetails(false),
                        setIsSelectedGeneral(false),
                        setInitiatorRemarks(false),
                        setReviewerRemarks(false),
                        setApproverRemarks(true);
                    }}
                  >
                    Approver Remarks
                  </div> */}
                </div>
              </div>

              {isSelectedGeneral === true ? (
                <>
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
                        value={date}
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

              {/* {isSelectedDetails === true ? (
                <>
                  <div className="group-input">
                    <label className="color-label">Department</label>
                    <select
                      className="form-control"
                      name="assign_to"
                      value={differentialPRecord.department}
                      onChange={(e) =>
                        setDifferentialPRecord({
                          department: e.target.value,
                        })
                      }
                      disabled={[3, 2, 4].includes(
                        userDetails.roles[0].role_id
                      )}
                    >
                      <option value="">-- Select --</option>
                      <option value="Corporate Quality Assurance">
                        Corporate Quality Assurance
                      </option>
                      <option value="Quality Assurance Bio-Pharma">
                        Quality Assurance Bio-Pharma
                      </option>
                      <option value="Central Quality Control">
                        Central Quality Control
                      </option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Plasma Sourcing Grou">
                        Plasma Sourcing Group
                      </option>
                      <option value="Central Stores">Central Stores</option>
                      <option value="Information Technology Group">
                        Information Technology Group
                      </option>
                      <option value="Molecular Medicine">
                        Molecular Medicine
                      </option>
                      <option value="Central Laboratory">
                        Central Laboratory
                      </option>
                      <option value="Tech team">Tech team</option>
                    </select>
                  </div>

                  <div className="group-input">
                    <label className="color-label">
                      Compression Area with respect to Corridor
                    </label>
                    <select
                      className="form-control"
                      name="assign_to"
                      value={differentialPRecord.compression_area}
                      onChange={(e) =>
                        setDifferentialPRecord({
                          compression_area: e.target.value,
                        })
                      }
                      disabled={[3, 2, 4].includes(
                        userDetails.roles[0].role_id
                      )}
                    >
                      <option value="Select a value">Select a value</option>
                      <option value="Area 1">Area 1</option>
                      <option value="Area 2">Area 2</option>
                      <option value="Area 3">Area 3</option>
                      <option value="Area 4">Area 4</option>
                      <option value="Area 5">Area 5</option>
                      <option value="Area 6">Area 6</option>
                    </select>
                  </div>

                  <div className="group-input">
                    <label className="color-label">Limit</label>
                    <div className="instruction"></div>
                    <input
                      type="number"
                      // className={`${
                      //   differentialPRecord.limit < 0.6
                      //     ? "limit"
                      //     : differentialPRecord.limit > 2.6
                      //     ? "limit"
                      //     : ""
                      // }`}
                      value={differentialPRecord.limit}
                      onChange={(e) =>
                        setDifferentialPRecord({ limit: e.target.value })
                      }
                      disabled={[3, 2, 4].includes(
                        userDetails.roles[0].role_id
                      )}
                    />
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

                  <div>
                    <div className="AddRows d-flex">
                      <NoteAdd
                      // onClick={addRow}
                      />
                      <div className="addrowinstruction"></div>
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>S no.</th>
                        <th>Unique Id</th>
                        <th>Time</th>
                        <th>Differential Pressure</th>
                        <th>Reviewer Remark</th>
                        <th>Checked By Reviewer</th>
                        <th>Approver Remark</th>
                        <th>Checked By Approver</th>
                        <th>Supporting Documents</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTableData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.unique_id}</td>
                          <td>
                            <input
                              value={item.date}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].date = e.target.value;
                                setAllTableData(newData);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              value={item.time}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].time = e.target.value;
                                setAllTableData(newData);
                              }}
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.differential_pressure}
                              className={`${
                                item.differential_pressure < 0.6
                                  ? "limit"
                                  : item.differential_pressure > 2.6
                                  ? "limit"
                                  : ""
                              }`}
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].differential_pressure =
                                  e.target.value;
                                setAllTableData(newData);
                              }}
                              required
                            />
                          </td>
                          <td>
                            <input
                              value={item.remarks}
                              disabled
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].remarks = e.target.value;
                                setAllTableData(newData);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              value={item.checked_by}
                              disabled
                              onChange={(e) => {
                                const newData = [...allTableData];
                                newData[index].checked_by = e.target.value;
                                setAllTableData(newData);
                              }}
                              readOnly
                            />
                          </td>
                          <td style={{ width: "250px" }}>
                            <div className="d-flex align-items-center">
                              <button
                                type="button"
                                className="btn-upload"
                                onClick={() =>
                                  document
                                    .getElementsByName("supporting_docs")
                                    [index].click()
                                }
                                style={{ marginRight: "10px" }}
                              >
                                {item.supporting_docs
                                  ? "Change File"
                                  : "Select File"}
                              </button>
                              {item.supporting_docs && (
                                <div>
                                  <a
                                    href={item.supporting_docs}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginRight: "10px" }}
                                  >
                                    View File
                                  </a>
                                  <DeleteIcon
                                    style={{ color: "red", cursor: "pointer" }}
                                    onClick={() => handleDeleteFile(index)}
                                  />
                                </div>
                              )}
                              <input
                                type="file"
                                name="supporting_docs"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  handleFileChange(index, e.target.files[0])
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <DeleteIcon onClick={() => deleteRow(index)} />
                            {item.differential_pressure !== "" &&
                              (item.differential_pressure < 0.6 ||
                                item.differential_pressure > 2.6) && (
                                <button
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  className="deviation-btn"
                                  onClick={() => {
                                    window.location.href =
                                      "https://naveen.vidyagxp.com/deviation";
                                  }}
                                >
                                  Deviation
                                </button>
                              )}
                            {item.differential_pressure !== "" &&
                              (item.differential_pressure < 0.6 ||
                                item.differential_pressure > 2.6) && (
                                <button
                                  className="deviation-btn"
                                  onClick={() => {
                                    navigate("/chart");
                                  }}
                                >
                                  Action item
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="group-input flex flex-col gap-4 mt-4 items-start">
                    <div className="flex flex-col w-full">
                      <label className="text-sm font-medium text-gray-900 mb-1">
                        Additional Attachment{" "}
                        <span className="text-sm text-zinc-600">
                          (If / Any)
                        </span>{" "}
                        :
                      </label>
                      <input
                        type="file"
                        name="additionalAttachment"
                        className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        onChange={handleFileChangeAttachment}
                        disabled
                      />
                    </div>

                    <div className="flex flex-col w-full">
                      <label className="text-sm font-medium text-gray-900 mb-1">
                        Additional Info{" "}
                        <span className="text-sm text-zinc-600">
                          (If / Any)
                        </span>{" "}
                        :
                      </label>
                      <textarea
                        className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        value={differentialPRecord.additionalInfo}
                        disabled
                        onChange={(e) => {
                          setDifferentialPRecord({
                            additionalInfo: e.target.value,
                          });
                        }}
                      ></textarea>
                    </div>
                  </div>
                </>
              ) : null} */}
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

