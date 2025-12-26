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
  const [
    isBatchFormulaAndMaterialIdentification,
    setIsBatchFormulaAndMaterialIdentification,
  ] = useState(false);
     const [isPersonMakingEntries, setIsPersonMakingEntries] = useState(false);
      const [isAbbreviations, setIsAbbreviations] = useState(false);
      const [isAPIAssay, setIsAPIAssay] = useState(false);
      const [isAPIDispensing, setIsAPIDispensing] = useState(false);
      const [isGeneralManufacturingPrecaution, setIsGeneralManufacturingPrecaution] = useState(false);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [isSelectedGeneralManufacturing, setIsSelectedGeneralManufacturing] =
    useState(false);
  const [isSelectedManufacturing, setIsSelectedManufacturing] = useState(false);
  const [isSelectedEquipmentClearance, setIsSelectedEquipmentClearance] =
    useState(false);
  const [initiatorRemarks, setInitiatorRemarks] = useState(false);
  const [reviewerRemarks, setReviewerRemarks] = useState(false);
  const [approverRemarks, setApproverRemarks] = useState(false);
  const [allTableData, setAllTableData] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [User, setUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [wc, setWc] = useState("");     // Water Content
    const [rc, setRc] = useState("");     // Residual Content
    const [theoreticalQty, setTheoreticalQty] = useState("");
    const [xValue, setXValue] = useState("");
    const [finalKg, setFinalKg] = useState("");
  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);
  const navigate = useNavigate();
  const location = useLocation();
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
      instruction:
        "Mention the sifted material weighing details in section No. 8.11",
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
      instruction:
        "Mention the sifted material weighing details in section No. 8.11",
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
      instruction:
        "Mention the sifted material weight details in section No. 8.11",
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
      instruction:
        "Mention the sifted material weight details in section No. 8.11",
      equipmentNo: "",
      startTime: "",
      endTime: "",
      pdoSign: "",
      qadSign: "",
    },
  ]);


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

  const [products, setProducts] = useState([]);
  console.log(products, "products");
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    productCode: "",
    expiryDate: "",
    mfgDate: "",
    market: "",
    batchSize: "",
    batchNo: "",
    strength: "",
    productSynonym: "",
    shelfLife: "",
    customerCode: "",
    refMfcNumber: "",
    motherBatchNo: "",
    batchStartedOn: "",
    batchCompletedOn: "",
  });
  const [bmrData, setBmrData] = useState({
    site_id: location.state?.site_id || "",
    initiator_id: loggedInUser?.userId || "",
    date_of_initiation: getCurrentDateTime(),
differentialPRecord:differentialPRecord|| [],
formData: formData || [],
    equipmentClearance: equipmentClearance || [],
    generalPrecautions: generalManufacturing || [],
    manufacturingPrecautions: manufacturingRows || [],
  });
  // 🔹 Fetch product list
  useEffect(() => {
    axios
      .get("http://localhost:1000/Pm-Meter/meter/get-all") // 🔁 API URL
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));
  }, [isProductInformation]);

  // 🔹 On product select
  const handleProductChange = (e) => {
    const selectedId = e.target.value;

    const selectedProduct = products.find(
      (item) => item.id.toString() === selectedId
    );

    if (!selectedProduct) return;

    const data = selectedProduct.pmMeterMasterData;

    setFormData((prev) => ({
      ...prev,
      productId: selectedId,
      productName: data.productName || "",
      productCode: data.productCode || "",
      expiryDate: data.expiryDate || "",
      mfgDate: data.mfgDate || "",
      market: data.market || "",
      batchSize: data.batchSize || "",
      batchNo: data.batchNo || "",
      strength: data.strength || "",
    }));
  };

  // 🔹 Generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    if (
      tempStatus?.status === "OUT_OF_LIMIT" ||
      rhStatus?.status === "OUT_OF_LIMIT"
    ) {
      alert(
        "⚠ One or more parameters are OUT OF LIMIT. Deviation must be recorded."
      );
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
      differentialPRecord: JSON.stringify(differentialPRecord),
      formData: JSON.stringify(formData),
      equipmentClearance: JSON.stringify(bmrData.equipmentClearance),
      generalPrecautions: JSON.stringify(bmrData.generalPrecautions),
      manufacturingPrecautions: JSON.stringify(
        bmrData.manufacturingPrecautions
      ),
    };

    axios
      .post("http://localhost:1000/equipment/equipments", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      .then(() => {
        toast.success("eLog Saved Successfully!");
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("There was an error creating eLog:", error);
        toast.error("There was an error creating eLog");
      });
  };

    const resetAll = () => {
setIsSelectedDetails(false),
                        setIsSelectedGeneral(false),
                        setInitiatorRemarks(false),
                        setReviewerRemarks(false),
                        setApproverRemarks(false),
                        setIsSelectedEquipmentClearance(false),
                        setIsSelectedGeneralManufacturing(false),
                        setIsSelectedManufacturing(false);
                        setIsProductInformation(false);
                        setIsBatchFormulaAndMaterialIdentification(false);
                        setIsPersonMakingEntries(false);
                        setIsAbbreviations(false);
                        setIsAPIAssay(false);
                        setIsAPIDispensing(false);
                        setIsGeneralManufacturingPrecaution(false);
  };

  return (
    <>
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-pages" className="min-w-full">
          <div className="document-form">
            <div className="details-form-data">
              <div className="sub-head-2">Master Formula Record</div>

               <div className="outerDiv4">
                <div className="flex gap-3 overflow-x-auto whitespace-nowrap scroll-smooth px-2 py-2">
                  <div
                    className={`${
                      isSelectedGeneral === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                   onClick={() => {
            resetAll();
            setIsSelectedGeneral(true);
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
            resetAll();
            setIsProductInformation(true);
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
            resetAll();
            setIsBatchFormulaAndMaterialIdentification(true);
          }}
                  >
                    Batch Formula and Material Identification
                  </div>
                  <div
                    className={`${
                      isPersonMakingEntries === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                   onClick={() => {
            resetAll();
            setIsPersonMakingEntries(true);
          }}
                  >
                    Persons making entries
                  </div>
                  <div
                    className={`${
                      isAbbreviations === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
            resetAll();
            setIsAbbreviations(true);
          }}
                  >
                    Abbreviations
                  </div>
                  
                  <div
                    className={`${
                      isAPIAssay === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
            resetAll();
            setIsAPIAssay(true);
          }}
                  >
                   API Assay as is basis calculation 
                  </div>
                  <div
                    className={`${
                      isAPIDispensing === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
            resetAll();
            setIsAPIDispensing(true);
          }}
                  >
                   API Dispensing calculation 
                  </div>
                  <div
                    className={`${
                      isGeneralManufacturingPrecaution === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
            resetAll();
            setIsGeneralManufacturingPrecaution(true);
          }}
                  >
                   General Manufacturing Precaution
                  </div>
                  
                  <div
                    className={`${
                      isSelectedEquipmentClearance === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                   onClick={() => {
            resetAll();
            setIsSelectedEquipmentClearance(true);
          }}
                  >
                  Equipment Clearance
                  </div>
                  <div
                    className={`${
                      isSelectedManufacturing === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
            resetAll();
            setIsSelectedManufacturing(true);
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
                            setDifferentialPRecord({
                              initiator: e.target.value,
                            })
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
                  <div className="grid grid-cols-2 gap-6">
                    {/* ================= LEFT BLOCK ================= */}
                    <div className="space-y-4">
                      {/* PRODUCT NAME (DROPDOWN) */}
                      <div>
                        <label className="font-medium text-sm">
                          Product Name
                        </label>
                        <select
                          value={formData.productId}
                          onChange={handleProductChange}
                          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
                        >
                          <option value="">Select Product</option>
                          {products.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.pmMeterMasterData?.productName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {[
                        // { label: "Product Synonym", name: "productSynonym" },
                        { label: "Shelf Life", name: "shelfLife" },
                        { label: "Customer Code", name: "customerCode" },
                        { label: "Ref. MFC Number", name: "refMfcNumber" },
                      ].map((f, i) => (
                        <div key={i}>
                          <label className="font-medium text-sm">
                            {f.label}
                          </label>
                          <input
                            type="text"
                            name={f.name}
                            value={formData[f.name]}
                            onChange={handleChange}
                            className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
                          />
                        </div>
                      ))}
                    </div>

                    {/* ================= RIGHT BLOCK ================= */}
                    <div className="space-y-4">
                      <div>
                        <label className="font-medium text-sm">
                          Product Code
                        </label>
                        <input
                          type="text"
                          value={formData.productCode}
                          readOnly
                          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="font-medium text-sm">
                          Manufacturing Date
                        </label>
                        <input
                          type="date"
                          value={formData.mfgDate}
                          readOnly
                          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="font-medium text-sm">
                          Expiry Date
                        </label>
                        <input
                          type="date"
                          value={formData.expiryDate}
                          readOnly
                          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="font-medium text-sm">
                          Mother Batch No.
                        </label>
                        <input
                          type="text"
                          name="motherBatchNo"
                          value={formData.motherBatchNo}
                          onChange={handleChange}
                          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
                        />
                      </div>
                    </div>

                    {/* ================= 3rd ROW ================= */}
                   
                  </div>

                  {/* ================= EXTRA AUTO DATA ================= */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {[
                      { label: "Market", value: formData.market },
                      { label: "Batch Size", value: formData.batchSize },
                      { label: "Batch No.", value: formData.batchNo },
                      { label: "Strength", value: formData.strength },
                    ].map((f, i) => (
                      <div key={i}>
                        <label className="font-medium text-sm">{f.label}</label>
                        <input
                          type="text"
                          value={f.value}
                          readOnly
                          className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm bg-gray-100"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                     <div>
                      <label className="font-medium text-sm">
                        Batch Started on Date
                      </label>
                      <input
                        type="date"
                        name="batchStartedOn"
                        value={formData.batchStartedOn}
                        onChange={handleChange}
                        className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
                      />
                    </div>

                    <div>
                      <label className="font-medium text-sm">
                        Batch Completed on Date
                      </label>
                      <input
                        type="date"
                        name="batchCompletedOn"
                        value={formData.batchCompletedOn}
                        onChange={handleChange}
                        className="w-full mt-1 border border-gray-400 px-3 py-2 rounded text-sm"
                      />
                    </div>
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
                        <th className="border p-2">
                          Material Code (As per SAP)
                        </th>
                        <th className="border p-2">Material Description</th>
                        <th className="border p-2">Vendor / mfg.</th>
                        <th className="border p-2">Quantity / Unit Quantity</th>
                        <th className="border p-2">UOM</th>
                        <th className="border p-2">LOT</th>
                        <th className="border p-2">
                          Quantity / Batch Quantity
                        </th>
                        <th className="border p-2">UOM</th>
                        <th className="border p-2">Retest Date</th>
                        <th className="border p-2">Exp. Date</th>
                        <th className="border p-2">A.R. No.</th>
                      </tr>
                    </thead>

                    <tbody></tbody>
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
                        <th className="border p-2">
                          Material Code (As per SAP)
                        </th>
                        <th className="border p-2">Material Description</th>
                        <th className="border p-2">Vendor / mfg.</th>
                        <th className="border p-2">Quantity / Unit Quantity</th>
                        <th className="border p-2">UOM</th>
                        <th className="border p-2">LOT</th>
                        <th className="border p-2">
                          Quantity / Batch Quantity
                        </th>
                        <th className="border p-2">UOM</th>
                        <th className="border p-2">Retest Date</th>
                        <th className="border p-2">Exp. Date</th>
                        <th className="border p-2">A.R. No.</th>
                      </tr>
                    </thead>

                    <tbody></tbody>
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
                        <th className="border p-2">
                          Material Code (As per SAP)
                        </th>
                        <th className="border p-2">Material Description</th>
                        <th className="border p-2">Vendor / mfg.</th>
                        <th className="border p-2">Quantity / Unit Quantity</th>
                        <th className="border p-2">UOM</th>
                        <th className="border p-2">LOT</th>
                        <th className="border p-2">
                          Quantity / Batch Quantity
                        </th>
                        <th className="border p-2">UOM</th>
                        <th className="border p-2">Retest Date</th>
                        <th className="border p-2">Exp. Date</th>
                        <th className="border p-2">A.R. No.</th>
                      </tr>
                    </thead>

                    <tbody></tbody>
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
                        <th className="border p-2">
                          Material Code (As per SAP)
                        </th>
                        <th className="border p-2">Material Description</th>
                        <th className="border p-2">Vendor / mfg.</th>
                        <th className="border p-2">Quantity / Unit Quantity</th>
                        <th className="border p-2">UOM</th>
                        <th className="border p-2">LOT</th>
                        <th className="border p-2">
                          Quantity / Batch Quantity
                        </th>
                        <th className="border p-2">UOM</th>
                        <th className="border p-2">Retest Date</th>
                        <th className="border p-2">Exp. Date</th>
                        <th className="border p-2">A.R. No.</th>
                      </tr>
                    </thead>

                    <tbody></tbody>
                  </table>
                  <div className="font-bold pt-5">
                    Film coating Material: (XX % w/w suspension / dispersion)
                  </div>
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
                        <th className="border p-2">
                          Material Code (As per SAP)
                        </th>
                        <th className="border p-2">Material Description</th>
                        <th className="border p-2">Vendor / mfg.</th>
                        <th className="border p-2">Quantity / Unit Quantity</th>
                        <th className="border p-2">UOM</th>
                        <th className="border p-2">LOT</th>
                        <th className="border p-2">
                          Quantity / Batch Quantity
                        </th>
                        <th className="border p-2">UOM</th>
                        <th className="border p-2">Retest Date</th>
                        <th className="border p-2">Exp. Date</th>
                        <th className="border p-2">A.R. No.</th>
                      </tr>
                    </thead>

                    <tbody></tbody>
                  </table>
                </div>
              ) : null}

{ isPersonMakingEntries === true ?
 (<>
 <div className="pt-5 font-bold text-xl">Persons making entries in the BMR</div>
 <p className="py-2">Note: Signature on this page indicates that I read the procedure given for listed activity and understand to perform the particular activity.</p>
 <table className="w-full border border-black border-collapse text-sm">
  <thead>
    <tr className="text-center font-semibold">
      <th className="border border-black p-2 w-20">Sr. No.</th>
      <th className="border border-black p-2">Employee Name</th>
      <th className="border border-black p-2">Employee Code</th>
      <th className="border border-black p-2">Department</th>
      <th className="border border-black p-2">Sign & Date</th>
    </tr>
  </thead>

  <tbody>
    {Array.from({ length: 10 }).map((_, i) => (
      <tr key={i} className="h-10">
        <td className="border border-black p-2 text-center">{i + 1}.</td>
        <td className="border border-black p-2"></td>
        <td className="border border-black p-2"></td>
        <td className="border border-black p-2"></td>
        <td className="border border-black p-2"></td>
      </tr>
    ))}
  </tbody>
</table>

</>)
 : null}
{ isAbbreviations === true ?
 (<>
 <div className="pt-5 font-bold text-xl">Abbreviations</div>
 <table className="w-full border border-black border-collapse text-sm">
  <thead>
    <tr>
      <th colSpan={4} className="border border-black p-2 font-semibold text-center">
        List of Abbreviation
      </th>
    </tr>
    <tr className="text-center font-semibold">
      <th className="border border-black p-2 w-28">Abbrev.</th>
      <th className="border border-black p-2">Meaning</th>
      <th className="border border-black p-2 w-28">Abbrev.</th>
      <th className="border border-black p-2">Meaning</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td className="border border-black p-2 text-center">%</td>
      <td className="border border-black p-2">Percentage</td>
      <td className="border border-black p-2 text-center">No.</td>
      <td className="border border-black p-2">Number</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">°C</td>
      <td className="border border-black p-2">Degree Centigrade</td>
      <td className="border border-black p-2 text-center">°C</td>
      <td className="border border-black p-2">Degree Centigrade</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">µ</td>
      <td className="border border-black p-2">Micron</td>
      <td className="border border-black p-2 text-center">Pa</td>
      <td className="border border-black p-2">Pascal</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">A.R</td>
      <td className="border border-black p-2">Analytical Reference</td>
      <td className="border border-black p-2 text-center">PD</td>
      <td className="border border-black p-2">Production</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">API</td>
      <td className="border border-black p-2">Active Pharmaceutical Ingredient</td>
      <td className="border border-black p-2 text-center">PDI</td>
      <td className="border border-black p-2">Production Injectable</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">BMR</td>
      <td className="border border-black p-2">Batch Manufacturing Record</td>
      <td className="border border-black p-2 text-center">PDO</td>
      <td className="border border-black p-2">Production Oral</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">cGMP</td>
      <td className="border border-black p-2">Current Good Manufacturing Practice</td>
      <td className="border border-black p-2 text-center">Ph.Eur.</td>
      <td className="border border-black p-2">European Pharmacopoeia</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">Ckd.</td>
      <td className="border border-black p-2">Checked</td>
      <td className="border border-black p-2 text-center">PSD</td>
      <td className="border border-black p-2">Particle Size Distribution</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">cm²</td>
      <td className="border border-black p-2">Square Centimetre</td>
      <td className="border border-black p-2 text-center">QA</td>
      <td className="border border-black p-2">Quality Assurance</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">Emp.</td>
      <td className="border border-black p-2">Employee</td>
      <td className="border border-black p-2 text-center">QAD</td>
      <td className="border border-black p-2">Quality Assurance Department</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">FBP</td>
      <td className="border border-black p-2">Fluid Bed Processor</td>
      <td className="border border-black p-2 text-center">Qty.</td>
      <td className="border border-black p-2">Quantity</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">FDD</td>
      <td className="border border-black p-2">Formulation Development Department</td>
      <td className="border border-black p-2 text-center">RH</td>
      <td className="border border-black p-2">Relative Humidity</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">g / gm</td>
      <td className="border border-black p-2">Gram</td>
      <td className="border border-black p-2 text-center">RLAF</td>
      <td className="border border-black p-2">Reverse Laminar Air Flow</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">HEPA</td>
      <td className="border border-black p-2">High Efficiency Particulate Air</td>
      <td className="border border-black p-2 text-center">RPM</td>
      <td className="border border-black p-2">Rotation Per Minute</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">I.D.</td>
      <td className="border border-black p-2">Identification Number</td>
      <td className="border border-black p-2 text-center">SBV</td>
      <td className="border border-black p-2">Split Butterfly Valve</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">IBC</td>
      <td className="border border-black p-2">In-process bulk container</td>
      <td className="border border-black p-2 text-center">Sign.</td>
      <td className="border border-black p-2">Signature</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">ID</td>
      <td className="border border-black p-2">Identification</td>
      <td className="border border-black p-2 text-center">SOP</td>
      <td className="border border-black p-2">Standard Operating Procedure</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">IH</td>
      <td className="border border-black p-2">In-house</td>
      <td className="border border-black p-2 text-center">Sr.No.</td>
      <td className="border border-black p-2">Serial Number</td>
    </tr>

    <tr>
      <td className="border border-black p-2 text-center">IPC</td>
      <td className="border border-black p-2">Intermediate Product Container</td>
      <td className="border border-black p-2 text-center">Temp.</td>
      <td className="border border-black p-2">Temperature</td>
    </tr>
  </tbody>
</table>


</>)
 : null}

 {
isAPIAssay === true ? (<>
  <div className="pt-5 font-bold text-xl">API Assay as is basis calculation </div>
      <div className="text-sm leading-relaxed">

      {/* ====== MAIN HEADING ====== */}
      <div className="font-bold mt-4">
        1. API Dispensing calculation
      </div>

      <div className="ml-6">
        Quantity of XXXXXXXX, in (Kg)
      </div>


      {/* ====== FORMULA SECTION ====== */}
      <div className="text-center mt-6">

        <div className="font-semibold">
          Theoretical qty. × 100 × 100 × 100
        </div>

        <div className="mt-2">
          [Assay on anhydrous basis and solvent free basis (%w/w)]
          × [100 − WC (%w/w)]
          × [100 − RC (%w/w)]
        </div>

        <div className="mt-4 font-bold">=</div>

        <div className="mt-2">
          x 100 × 100 × 100
        </div>

        <div className="mt-2">
          x (100 −
          <input
            type="text"
            value={wc}
            onChange={(e) => setWc(e.target.value)}
            className="border-b border-black outline-none w-16 text-center mx-1"
          />)
          × (100 −
          <input
            type="text"
            value={rc}
            onChange={(e) => setRc(e.target.value)}
            className="border-b border-black outline-none w-16 text-center mx-1"
          />)
        </div>

        <div className="mt-4 font-bold">=</div>

        <div className="mt-3">
          <input
            type="text"
            value={theoreticalQty}
            onChange={(e) => setTheoreticalQty(e.target.value)}
            className="border-b border-black outline-none w-24 text-center"
          />
          &nbsp;×&nbsp;
          <input
            type="text"
            value={xValue}
            onChange={(e) => setXValue(e.target.value)}
            className="border-b border-black outline-none w-24 text-center"
          />
        </div>

        <div className="mt-4 font-bold">=</div>

        <div className="mt-3">
          <input
            type="text"
            value={finalKg}
            onChange={(e) => setFinalKg(e.target.value)}
            className="border-b border-black outline-none w-28 text-center"
          />
          &nbsp;Kg
        </div>

      </div>


      {/* ====== SIGNATURE AREA ====== */}
      <div className="mt-6 flex flex-col gap-2">
        <div>
          Calculated by (WHD) (Sign & Date) __________________________
        </div>
        <div>
          Checked by (Production) (Sign & Date) ______________________
        </div>
        <div>
          Verified by (QAD) (Sign & Date) ____________________________
        </div>
      </div>


      {/* ====== NEXT SECTION HEADING ====== */}
      <div className="font-bold mt-6">
        2. Calculation for Multiple AR. No.:
      </div>

      <div className="font-bold mt-2">
        3. API Assay as is basis calculation
      </div>


      {/* ====== TABLE ====== */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border border-black border-collapse text-xs">

          <thead>
            <tr>
              <th rowSpan={2} className="border border-black p-2 text-center w-10">
                Sr. No.
              </th>

              <th colSpan={6} className="border border-black p-2 text-center font-semibold">
                Quantity
              </th>

              <th rowSpan={2} className="border border-black p-2 w-28 text-center">
                A.R. Number
              </th>

              <th rowSpan={2} className="border border-black p-2 w-32 text-center">
                Material GRN No.
              </th>

              <th rowSpan={2} className="border border-black p-2 w-44 text-center">
                Assay on anhydrous basis and solvent free basis (%w/w) (F)
              </th>

              <th rowSpan={2} className="border border-black p-2 w-44 text-center">
                Water content %w/w RC (Total residual solvent NMT 3000 ppm) (G)
              </th>

              <th rowSpan={2} className="border border-black p-2 w-32 text-center">
                Assay as is basis (H = F − G)
              </th>
            </tr>

            <tr>
              <th className="border border-black p-2 text-center">Required Qty. (A)</th>
              <th className="border border-black p-2 text-center">Available Qty. (B)</th>
              <th className="border border-black p-2 text-center">Qty. @ 100% Assay (C)</th>
              <th className="border border-black p-2 text-center">Issued Qty. (D)</th>
              <th className="border border-black p-2 text-center">Balance Qty. (E = A − C)</th>
              <th className="border border-black p-2 text-center">Batch No.</th>
            </tr>
          </thead>


          <tbody>

            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td className="border border-black text-center p-2">{i + 1}</td>
                <td className="border border-black p-2"><input/></td>
                <td className="border border-black p-2"><input/></td>
                <td className="border border-black p-2"><input/></td>
                <td className="border border-black p-2"><input/></td>
                <td className="border border-black p-2"><input/></td>
                <td className="border border-black p-2"><input/></td>
                <td className="border border-black p-2"><input/></td>
                <td className="border border-black p-2"><input/></td>
                <td className="border border-black p-2"><input/></td>
                <td className="border border-black p-2"><input/></td>
                <td className="border border-black p-2"><input/></td>

              </tr>
            ))}

            <tr className="font-semibold">
              <td className="border border-black p-2 text-right" colSpan={7}>
                Total issued Qty. :
              </td>
              <td className="border border-black p-2" colSpan={5}><input type="text" /></td>
            </tr>

          </tbody>

        </table>
      </div>

    </div>
</>) : null
 }
 {isAPIDispensing === true ? (<>
  <div className="pt-5 font-bold text-xl">	API Dispensing calculation                                                                        </div>
<div className="text-sm leading-relaxed">

    {/* Heading */}
    <div className="font-bold">
      1. API Dispensing calculation
    </div>

    <div className="ml-6">
      Quantity of XXXXXXXX, in (Kg)
    </div>

    {/* ==== FORMULA BOX ==== */}
    <div className="text-center mt-4">

      <div className="font-semibold">
        Theoretical Qty. × 100 × 100 × 100
      </div>

      <div className="mt-1">
        [Assay on anhydrous basis and solvent free basis (%w/w)] × [100 - WC (%w/w)] × [100 - RC (%w/w)]
      </div>

      <div className="mt-3 font-bold">=</div>

      <div className="mt-2">
        x 100 × 100 × 100
      </div>

      <div className="mt-1">
        x (100 − 
        <input 
          type="text"
          className="border-b border-black outline-none w-16 text-center mx-1"
        />) × (100 − 
        <input 
          type="text"
          className="border-b border-black outline-none w-16 text-center mx-1"
        />)
      </div>

      <div className="mt-3 font-bold">=</div>

      <div className="mt-2">
        x &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; x
      </div>

      <div className="mt-3 font-bold">=</div>

      <div className="mt-2">
        <input 
          type="text"
          className="border-b border-black outline-none w-24 text-center"
        /> 
        &nbsp; = &nbsp; 
        <input 
          type="text"
          className="border-b border-black outline-none w-28 text-center"
        /> Kg
      </div>

    </div>

    {/* ==== SIGNATURE LINES ==== */}
    <div className="mt-6">
      Calculated by (WHD) (Sign & Date) ____________________
      &nbsp;&nbsp;&nbsp;&nbsp;
      Checked by (Production) (Sign & Date) ____________________
      <br />
      <br />
      Verified by (QAD) (Sign & Date) ____________________
    </div>


    {/* ==== NEXT HEADING ==== */}
    <div className="font-bold mt-5">
      2. Calculation for Multiple AR. No.:
    </div>

    <div className="font-bold mt-1">
      3. API Assay as is basis calculation:
    </div>


    {/* ==== TABLE ==== */}
    <div className="mt-3 overflow-x-auto">
      <table className="w-full border border-black border-collapse text-xs">

        <thead>
          <tr>
            <th rowSpan={2} className="border border-black p-2 text-center w-10">
              Sr. No.
            </th>

            <th colSpan={6} className="border border-black p-2 text-center">
              Quantity
            </th>

            <th rowSpan={2} className="border border-black p-2 w-24 text-center">
              A.R. Number
            </th>

            <th rowSpan={2} className="border border-black p-2 w-28 text-center">
              Material GRN No.
            </th>

            <th rowSpan={2} className="border border-black p-2 w-36 text-center">
              Assay on anhydrous basis & solvent free basis (%w/w)(F)
            </th>

            <th rowSpan={2} className="border border-black p-2 w-32 text-center">
              Water content RC %w/w (ppm) (G)
            </th>

            <th rowSpan={2} className="border border-black p-2 w-28 text-center">
              Assay as is basis (H = F − G)
            </th>
          </tr>

          <tr>
            <th className="border border-black p-2 text-center w-24">
              Required Qty. (A)
            </th>
            <th className="border border-black p-2 text-center w-24">
              Available Qty. (B)
            </th>
            <th className="border border-black p-2 text-center w-28">
              Qty. as per 100% Assay (C)
            </th>
            <th className="border border-black p-2 text-center w-24">
              Issued Qty. (D)
            </th>
            <th className="border border-black p-2 text-center w-28">
              Balance Qty. (E = A − C)
            </th>
            <th className="border border-black p-2 text-center w-24">
              Batch No.
            </th>
          </tr>
        </thead>

        <tbody>

          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              <td className="border border-black p-2 text-center">{i + 1}</td>
              <td className="border border-black p-2"><input type="text" /></td>
              <td className="border border-black p-2"><input type="text" /></td>
              <td className="border border-black p-2"><input type="text" /></td>
              <td className="border border-black p-2"><input type="text" /></td>
              <td className="border border-black p-2"><input type="text" /></td>
              <td className="border border-black p-2"><input type="text" /></td>
              <td className="border border-black p-2"><input type="text" /></td>
              <td className="border border-black p-2"><input type="text" /></td>
              <td className="border border-black p-2"><input type="text" /></td>
              <td className="border border-black p-2"><input type="text" /></td>
              <td className="border border-black p-2"><input type="text" /></td>
            </tr>
          ))}

          <tr className="font-semibold">
            <td className="border border-black p-2 text-right" colSpan={7}>
              Total issued Qty. :
            </td>
            <td className="border border-black p-2" colSpan={5}><input type="text" /></td>
          </tr>

        </tbody>

      </table>
    </div>
    </div>
</>) : null
 }

{isGeneralManufacturingPrecaution === true ? (
  <div className="text-sm leading-relaxed">

    {/* Heading */}
    <div className="pt-5 font-bold text-xl">
      General Manufacturing Precaution
    </div>

    {/* Instruction */}
    <div className="mt-3">
      1. Record the environmental conditions of area, Differential pressure and Differential pressure of RLAF at start of the activity.
    </div>

    {/* Area & Room */}
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

    {/* TABLE */}
    <div className="mt-5 overflow-x-auto">
      <table className="w-full border border-black border-collapse text-xs text-center">

        <thead>

          <tr>
            <th rowSpan={2} className="border border-black p-2 w-20">
              Date
            </th>

            <th rowSpan={2} className="border border-black p-2 w-20">
              Time
            </th>

            <th rowSpan={2} className="border border-black p-2 w-24">
              <div className="">
                D.P. (mm of WC) NLT 1.0 mm of WC
              </div>
            </th>

            <th rowSpan={2} className="border border-black p-2 w-24">
              <div className="">
                Temp. (°C) 23°C ± 2°C
              </div>
            </th>

            <th rowSpan={2} className="border border-black p-2 w-20">
              <div className="">
                RH (%) NMT 55%
              </div>
            </th>

            {/* Group Header */}
            <th colSpan={3} className="border border-black p-2">
              Reverse LAF (mm of WC)
            </th>

            <th rowSpan={2} className="border border-black p-2 w-28">
              <div className="">
                Recorded by (WH/PD) Sign & Date
              </div>
            </th>

            <th rowSpan={2} className="border border-black p-2 w-28">
              <div className="">
                Checked by (QAD) Sign & Date
              </div>
            </th>
          </tr>

          <tr>
            <th className="border border-black p-2 w-24">
              <div className="">
                Intermediate 10.0 to 15.0 mm of WC
              </div>
            </th>

            <th className="border border-black p-2 w-24">
              <div className="">
                HEPA 7.0 to 15.0 mm of WC
              </div>
            </th>

            <th className="border border-black p-2 w-24">
              <div className="">
                Pre-Filter 0.1 to 2.0 mm of WC
              </div>
            </th>
          </tr>

        </thead>


        <tbody>

          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i}>

              <td className="border border-black p-2">
                <input className="w-full outline-none text-center" type="text" />
              </td>

              <td className="border border-black p-2">
                <input className="w-full outline-none text-center" type="text" />
              </td>

              <td className="border border-black p-2">
                <input className="w-full outline-none text-center" type="text" />
              </td>

              <td className="border border-black p-2">
                <input className="w-full outline-none text-center" type="text" />
              </td>

              <td className="border border-black p-2">
                <input className="w-full outline-none text-center" type="text" />
              </td>

              <td className="border border-black p-2">
                <input className="w-full outline-none text-center" type="text" />
              </td>

              <td className="border border-black p-2">
                <input className="w-full outline-none text-center" type="text" />
              </td>

              <td className="border border-black p-2">
                <input className="w-full outline-none text-center" type="text" />
              </td>

              <td className="border border-black p-2">
                <input className="w-full outline-none text-center" type="text" />
              </td>
              <td className="border border-black p-2">
                <input className="w-full outline-none text-center" type="text" />
              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>

  </div>
) : null}

              {isSelectedEquipmentClearance === true ? (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full border border-black text-sm border-collapse">
                    {/* ================= EQUIPMENT DETAILS ================= */}
                    <thead>
                      <tr className="bg-gray-100">
                        <th
                          className="border  border-black p-2 text-left"
                          colSpan={2}
                        >
                          Equipment Name / Accessories Name
                        </th>
                        <th
                          className="border border-black p-2 text-center"
                          colSpan={2}
                        >
                          Vibratory sifter
                        </th>
                        <th
                          className="border border-black p-2 text-center"
                          colSpan={2}
                        >
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
                          <th
                            className="border bg-white text-black border-black p-2 text-left"
                            colSpan={2}
                          >
                            {label}
                          </th>

                          {/* Vibratory Sifter input */}
                          <th
                            className="border bg-white text-black border-black p-2"
                            colSpan={2}
                          >
                            <input
                              className="w-full border border-gray-400 px-2 py-1 rounded text-sm"
                              type="text"
                            />
                          </th>

                          {/* SS Container input */}
                          <th
                            className="border bg-white text-black border-black p-2"
                            colSpan={2}
                          >
                            <input
                              className="w-full border border-gray-400 px-2 py-1 rounded text-sm"
                              type="text"
                            />
                          </th>
                        </tr>
                      ))}

                      {/* ================= CHECKLIST HEADER ================= */}
                      <tr className="bg-gray-100">
                        <th className="border border-black p-2 text-center">
                          Sr. No.
                        </th>
                        <th className="border border-black p-2 text-left">
                          Check points
                        </th>
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

                            <td className="border border-black p-2">{point}</td>

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
                            <td className="border p-2 font-semibold">
                              {row.section}
                            </td>

                            <td className="border p-2 whitespace-pre-wrap">
                              {row.instruction}
                            </td>

                            <td className="border p-2">
                              <input
                                className="w-full border px-2 py-1"
                                value={row.equipmentNo}
                                onChange={(e) =>
                                  updateRow(
                                    index,
                                    "equipmentNo",
                                    e.target.value
                                  )
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
