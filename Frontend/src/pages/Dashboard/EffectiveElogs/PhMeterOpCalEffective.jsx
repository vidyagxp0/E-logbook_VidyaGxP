import { useEffect, useRef, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
// import "../docPanel.css";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NoteAdd } from "@mui/icons-material";
import axios from "axios";
import UserVerificationPopUp from "../../../components/UserVerificationPopUp/UserVerificationPopUp";
import LaunchQMS from "../../../components/LaunchQMS/LaunchQMS";
import TinyEditor from "../../../components/TinyEditor";
import dayjs from "dayjs";
import { useMemo } from "react";
const PhMeterOpCalEffective = () => {
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(true);
  const [initiatorRemarks, setInitiatorRemarks] = useState(false);
  const [reviewerRemarks, setReviewerRemarks] = useState(false);
  const [approverRemarks, setApproverRemarks] = useState(false);
  const [selectedInitiator, setSelectedInitiator] = useState("All Records");
  const [selectedReviewer, setSelectedReviewer] = useState("All Records");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formId, setFormId] = useState(null);
  const [User, setUser] = useState(null);
  const [isLoading1, setIsLoading1] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [reportType, setReportType] = useState("quick");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
const [showFactorErrorModal, setShowFactorErrorModal] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const object = getCurrentDateTime();
  let date = object.currentDate;
  const location = useLocation();
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
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const UserName = JSON.parse(localStorage.getItem("Username"));

  const [reviewed_by, setReviewed_by] = useState(UserName?.name);
  const [approved_by, setApproved_by] = useState(UserName?.name);

  useEffect(() => {
    setReviewed_by(UserName?.name);
  }, []);

  useEffect(() => {
    setApproved_by(UserName?.name);
  }, []);

  const [editData, setEditData] = useState({
    initiator_name: "",
    status: "",
    description: "",
    department: "",
    compression_area: "",
    additionalAttachment: "",
    additionalInfo: "",
    OpAndCalMultiParameterProcessRecords: [],
    limit: "",
  });

  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState(null);
  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setPopupAction(null);
  };


  const handlePopupSubmit = (credentials) => {
      const hasMissingFactor = editData.OpAndCalMultiParameterProcessRecords.some(
    (row) => !row.factorValue || row.factorValue.trim() === ""
  );

  if (hasMissingFactor) {
    setIsPopupOpen(false);
    setShowFactorErrorModal(true); // open modal
    return; // stop submit
  }
    const cleanedData = editData?.OpAndCalMultiParameterProcessRecords.filter(
      (record) => {
        // Check if ANY of the key fields are non-empty (treat numbers and strings correctly)
        const isNotCompletelyEmpty =
          !!record.nameOfSolution?.toString().trim() ||
          !!record.adjustPH?.toString().trim();

        return isNotCompletelyEmpty;
      }
    );

    // Calculate empty row count
    const emptyRowsCount =
      editData?.OpAndCalMultiParameterProcessRecords.length -
      cleanedData.length;

    // Show toast ONLY if truly empty rows are being removed
    if (emptyRowsCount > 0) {
      toast.warn(
        `${emptyRowsCount} empty row(s) will be removed before saving.`
      );
      console.log(
        "Original records:",
        editData?.OpAndCalMultiParameterProcessRecords
      );
      console.log("Cleaned records:", cleanedData);
    }
    const updatedEditData = {
      ...editData,
      OpAndCalMultiParameterProcessRecords: cleanedData,
    };

    const data = {
      ...updatedEditData,
      site_id: location.state?.site_id,
      form_id: location.state?.form_id,
      email: credentials?.email,
      password: credentials?.password,
      additionalInfo: credentials?.additionalInfo,
      additionalAttachment: credentials?.additionalAttachment,
      reviewComment: editData.reviewComment,
      approverComment: editData.approverComment,
      initiatorComment: editData.initiatorComment,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    if (popupAction === "sendFromOpenToReview") {
      data.initiatorDeclaration = credentials?.declaration;
      data.initiatorAttachment = editData?.initiatorAttachment;

      if (!data.initiatorComment || data.initiatorComment.trim() === "") {
        toast.error("Please provide an initiator comment!");
        return;
      }
      axios
        .put(
          "http://localhost:1000/op-and-calParameter/send-for-review",
          data,
          config
        )
        .then(() => {
          toast.success("Elog successfully sent for review");
          navigate(-1);
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message || "Couldn't send elog for review!!"
          );
        });
    } else if (popupAction === "sendFromReviewToApproval") {
      data.reviewerDeclaration = credentials?.declaration;
      data.reviewerAttachment = editData.reviewerAttachment;
      axios
        .put(
          "http://localhost:1000/op-and-calParameter/send-from-review-to-approval",
          data,
          config
        )
        .then(() => {
          toast.success("Elog successfully sent for approval");
          navigate(-1);
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message ||
              "Couldn't send elog for approval!!"
          );
        });
    } else if (popupAction === "sendFromReviewToOpen") {
      data.reviewerDeclaration = credentials?.declaration;
      data.reviewerAttachment = editData.reviewerAttachment;
      axios
        .put(
          "http://localhost:1000/op-and-calParameter/send-from-review-to-open",
          data,
          config
        )
        .then(() => {
          toast.success("Elog successfully opened");
          navigate(-1);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Couldn't open elog!!");
        });
    } else if (popupAction === "sendFromApprovalToClosedDone") {
      data.approverDeclaration = credentials?.declaration;
      data.approverAttachment = editData.approverAttachment;
      axios
        .put("http://localhost:1000/op-and-calParameter/approve", data, config)
        .then(() => {
          toast.success("Elog successfully Closed Done");
          navigate(-1);
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message || "Couldn't approve elog!!"
          );
        });
    } else if (popupAction === "sendFromApprovalToOpen") {
      data.approverAttachment = editData.approverAttachment;
      data.approverDeclaration = credentials?.declaration;
      axios
        .put(
          "http://localhost:1000/op-and-calParameter/send-from-approval-to-open",
          data,
          config
        )
        .then(() => {
          toast.success("Elog successfully opened");
          navigate(-1);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Couldn't open elog!!");
        });
    } else if (popupAction === "updateElog") {
      data.initiatorDeclaration = credentials?.declaration;
      // if (
      //   parseFloat(editData.limit) < 0.6 ||
      //   parseFloat(editData.limit) > 2.6
      // ) {
      //   toast.error("The limit value must be between 0.6 and 2.6.");
      //   return;
      // }
      // if (editData.description === "") {
      //   toast.error("description is required");
      //   return;
      // }
      if (
        updatedEditData?.OpAndCalMultiParameterProcessRecords?.some(
          (record) => record.differential_pressure === ""
        )
      ) {
        toast.error("Please provide grid details!");
        return;
      }

      updatedEditData.email = credentials.email;
      updatedEditData.password = credentials.password;
      updatedEditData.initiatorDeclaration = credentials?.declaration;

      const myHeaders = {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "multipart/form-data",
      };
      console.log(updatedEditData, "updatedEditData");
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        data: updatedEditData,
        url: "http://localhost:1000/op-and-calParameter/update",
      };

      axios(requestOptions)
        .then(() => {
          toast.success("Data saved successfully!");
          navigate("/effectiveElogs");
        })
        .catch((error) => {
          console.error(error);
        });
    }

    setIsPopupOpen(false);
    setPopupAction(null);
  };

   useEffect(() => {
     if (location.state) {
       const cloned = JSON.parse(JSON.stringify(location.state));
       setEditData(cloned);
     }
   }, [location.state]);
  const addRow = () => {

     const records = editData?.OpAndCalMultiParameterProcessRecords || [];

  // Function to check if a row is filled
  const isRowComplete = (row) => {
    return (
      row.nameOfSolution?.trim() !== "" &&
      row.adjustPH?.trim() !== "" &&
      row.reviewed_by !== null
    );
  };

  // 1️⃣ Check if there is at least 1 row
  if (records.length > 0) {
    const lastRow = records[records.length - 1];

    // 2️⃣ If last row is empty → block adding a new row
    if (!isRowComplete(lastRow)) {
      toast.warn("Please fill the current row before adding a new one.");
      return;
    }
  }
    if (
      userDetails.roles[0].role_id === 1 ||
      userDetails.roles[0].role_id === 5
    ) {
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Use 12-hour format
      };
      const nextIndex =
        editData?.OpAndCalMultiParameterProcessRecords?.length || 0;
      const newRow = {
        date: dayjs().format("DD-MM-YYYY hh:mm:ss a"),
        nameOfSolution: "",
        adjustPH: "",
        instrument_name:"pH Meter",
        instrument_no:location.state.instrument_no,
        done_by: location?.state?.initiator_name || "",
        checked_by: location?.state?.initiator_name || "",
        remarks: "",
        reviewed_by: "",
        remarksOther: "",
        remarksType: "",
        remarksSubType: "",
        status: "Open",
      };
      setEditData((prevState) => ({
        ...prevState,
        OpAndCalMultiParameterProcessRecords: [
          ...prevState?.OpAndCalMultiParameterProcessRecords,
          newRow,
        ],
      }));
    } else if (location.state.reviewer_id == 4) {
      toast.warn("Only the Initiator has permission to add a new row.");
    } else if (location.state.approver_id == 5) {
      toast.warn("Only the Initiator has permission to add a new row.");
    }
  };

  function deepEqual(object1, object2) {
    // First, check if they are the same object (reference equality)
    if (object1 === object2) {
      return true;
    }

    // Ensure both are objects and neither is null
    if (
      typeof object1 !== "object" ||
      object1 === null ||
      typeof object2 !== "object" ||
      object2 === null
    ) {
      return false;
    }

    // Compare their own properties
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    // Check if they have the same number of properties
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Check each property in object1 to see if it exists and equals the one in object2
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);

      // Recursively evaluate objects, or check primitive values for equality
      if (
        (areObjects && !deepEqual(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }

    return true;
  }

  function isObject(object) {
    return object != null && typeof object === "object";
  }

  const deleteRow = (index) => {
    if (
      userDetails.roles[0].role_id === 1 ||
      userDetails.roles[0].role_id === 5
    ) {
      const updatedGridData = [
        ...editData.OpAndCalMultiParameterProcessRecords,
      ];
      const rowToDelete = updatedGridData[index];

      if (rowToDelete?.record_id) {
        toast.warn("Record Can't be deleted ");

        return;
      }

      // Allow deletion of rows without a `record_id`
      updatedGridData.splice(index, 1);
      setEditData((prevState) => ({
        ...prevState,
        OpAndCalMultiParameterProcessRecords: updatedGridData,
      }));
    }
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;

    const val = value === "All Records" ? "" : value;

    if (name === "initiator") {
      setSelectedInitiator(val);
      setSelectedReviewer("");
      setSelectedStatus("All Records");
    }
    if (name === "reviewer") {
      setSelectedReviewer(val);
      setSelectedInitiator("");
      setSelectedStatus("All Records");
    }

    if (name === "status") {
      setSelectedStatus(value);
      setSelectedInitiator("");
      setSelectedReviewer("");
    }

    setEditData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  

  const filteredGridData = useMemo(() => {
    const records = editData?.OpAndCalMultiParameterProcessRecords || [];

    return records.filter((record) => {
      const matchInitiator =
        selectedInitiator && selectedInitiator !== "All Records"
          ? record.done_by === selectedInitiator
          : true;

      const matchReviewer =
        selectedReviewer && selectedReviewer !== "All Records"
          ? record.reviewed_by === selectedReviewer
          : true;

      const matchStatus =
        selectedStatus === "Open"
          ? record.status === "Open"
          : selectedStatus === "Closed"
          ? record.status === "Closed"
          : selectedStatus === "Returned"
          ? record.status === "Returned"
          : true;

      return matchInitiator && matchReviewer && matchStatus;
    });
  }, [
    editData?.OpAndCalMultiParameterProcessRecords,
    selectedInitiator,
    selectedReviewer,
    selectedStatus,
  ]);

  // const handleDeleteFile = (index) => {
  //   if (
  //     location.state?.stage === 1 &&
  //     location.state?.initiator_id === userDetails.userId
  //   ) {
  //     const updatedGridData = editData.OpAndCalMultiParameterProcessRecords.map(
  //       (item, i) => {
  //         if (i === index) {
  //           return { ...item, supporting_docs: null };
  //         }
  //         return item;
  //       }
  //     );
  //     setEditData((prevState) => ({
  //       ...prevState,
  //       OpAndCalMultiParameterProcessRecords: updatedGridData,
  //     }));
  //   }
  // };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Returned empty if the input is falsy

    const utcDate = new Date(dateString);
    // Check if the date is valid
    if (isNaN(utcDate.getTime())) {
      return "";
    }

    return utcDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleFileChange = (index, file) => {
    const updatedGridData = [...editData.OpAndCalMultiParameterProcessRecords];
    updatedGridData[index].supporting_docs = file;
    setEditData((prevState) => ({
      ...prevState,
      OpAndCalMultiParameterProcessRecords: updatedGridData,
    }));
  };

  const handleInitiatorFileChange = (e) => {
    setEditData({
      ...editData,
      // initiatorAttachment: e.target.files[0],
      additionalAttachment: e.target.files[0],
    });
  };
  const handleReviewerFileChange = (e) => {
    setEditData({ ...editData, reviewerAttachment: e.target.files[0] });
  };
  const handleApproverFileChange = (e) => {
    setEditData({ ...editData, approverAttachment: e.target.files[0] });
  };

  const generateUniqueId = () => {
    return `UU0${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
  };

  const EmptyreportData = {
    title: "pH Meter OP/Cal",
    status: location.state.status,
    blankRows: 17,
    form_id: location.state.form_id,
    OpAndCalMultiParameterProcessRecords: [],
  };
  const generateEmptyReport = async () => {
    setIsLoading1(true);
    try {
      const response = await axios.post(
        `http://localhost:1000/op-and-calParameter/blank-report/${formId}`,
        {
          reportData: EmptyreportData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { filename } = response.data;
      const reportUrl = `/effective-view-report?formId=${formId}&filename=${filename}`;

      // Open the report in a new tab
      window.open(reportUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening chat PDF:", error);
    } finally {
      setIsLoading1(false);
    }
  };

  const reportData = {
    site:
      location.state.site_id === 1
        ? "India"
        : location.state.site_id === 2
        ? "Malaysia"
        : location.state.site_id === 3
        ? "EMEA"
        : location.state.site_id === 4
        ? "EU"
        : "Biologics",
    status: location.state.status,
    initiator_name: location.state.initiator_name,
    title: "pH Meter OP/Cal Record",
    ...editData,
  };

  useEffect(() => {
    if (reportData && reportData.form_id) {
      setFormId(reportData.form_id);
    }
  }, [reportData]);

  const allRecordDates = editData?.OpAndCalMultiParameterProcessRecords?.map(
    (r) => new Date(r.date)
  );
  const firstRecordDate = allRecordDates?.length
    ? new Date(Math.min(...allRecordDates))
    : null;
  const formattedFirstDate = firstRecordDate;


  const generateReport = async () => {
  setIsLoading(true);

  try {
    let filteredData = { ...editData };
    let start = null;
    let end = new Date();

    if (reportType !== "full" && reportType !== "custom") {
      const today = new Date();

      switch (reportType) {
        case "1day":
          start = new Date(today.setDate(today.getDate() - 1));
          break;
        case "1week":
          start = new Date(today.setDate(today.getDate() - 7));
          break;
        case "1month":
          start = new Date(today.setMonth(today.getMonth() - 1));
          break;
        case "quarterly":
          start = new Date(today.setMonth(today.getMonth() - 3));
          break;
        case "annually":
          start = new Date(today.setFullYear(today.getFullYear() - 1));
          break;
        default:
          start = null;
      }
    }

    if (reportType === "custom") {
      if (!fromDate || !toDate) {
        alert("Please select both From and To dates.");
        setIsLoading(false);
        return;
      }
      start = new Date(fromDate);
      end = new Date(toDate);
    }

    if (start) {
      filteredData.OpAndCalMultiParameterProcessRecords = editData.OpAndCalMultiParameterProcessRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate <= end;
      });
    }

    const payload = {
      reportData: filteredData,
      reportType,
      ...(reportType === "custom" && { fromDate, toDate }),
    };

    const response = await axios.post(
      `http://localhost:1000/op-and-calParameter/effective-chat-pdf/${formId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { filename } = response.data;
    const reportUrl = `/effective-view-report?formId=${formId}&filename=${filename}`;
    window.open(reportUrl, "_blank", "noopener,noreferrer");

  } catch (error) {
    console.error("Error opening chat PDF:", error);
  } finally {
    setIsLoading(false);
    setShowOptions(false);
  }
};
  const setTinyContent = (content) => {
    setEditData((prevState) => ({
      ...prevState,
      description: content,
    }));
  };

  const handleDeleteFile = async (index) => {
    const record = editData.OpAndCalMultiParameterProcessRecords[index];

    if (!record?.record_id) {
      console.error("Record ID not found for deletion");
      return;
    }
    [];
    try {
      const res = await axios.delete(
        `http://localhost:1000/op-and-calParameter/delete/attachment/${record.record_id}`
      );

      if (res.data?.error === false) {
        // Clear file from UI state
        const newData = [...editData.OpAndCalMultiParameterProcessRecords];
        newData[index].supporting_docs = null;

        setEditData((prev) => ({
          ...prev,
          OpAndCalMultiParameterProcessRecords: newData,
        }));
      } else {
        alert(res.data?.message || "Failed to delete attachment.");
      }
    } catch (err) {
      console.error("Error deleting attachment:", err);
      alert("Something went wrong while deleting the attachment.");
    }
  };

    const isRowEditable = (item) => {
    const isInitiator = userDetails.userId == location.state?.initiator_id;
    const isNewRow = !item.form_id; // ya item.isNew === true if you manually add it
    return isInitiator ? isNewRow : true;
  };

    const originalData = location.state;
 const canReviewerEdit = (item) => {
    // find original version of this record by record_id
    const original = originalData?.OpAndCalMultiParameterProcessRecords?.find(
      (o) => o.record_id === item.record_id
    );

    // If we found the original row
    if (original) {
      // If original remarksType was OK → Lock it
      if (original.remarksType === "OK") {
        return false;
      }
    }

    // Otherwise allow editing
    return true;
  };

  const disableFieldMap = {
  "Incorrect Name of Solution": ["nameOfSolution"],
  "Incorrect Adjust pH": ["adjustPH"],

  // Others → enable ALL these fields
  "Others": ["nameOfSolution", "adjustPH" ],
};

const getReviewerMarkedField = (item) => {
  return disableFieldMap[item.remarksSubType] || [];
};

const isFieldEditable = (item, fieldName) => {
  const allowedFields = getReviewerMarkedField(item);

  // If reviewer marked a specific issue
  if (allowedFields.length > 0) {
    return allowedFields.includes(fieldName);
  }

  // Else fallback default
  return isRowEditable(item);
};


  const [showFilter, setShowFilter] = useState(true);

  // Common Label Style
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
  
useEffect(() => {
  const box = document.querySelector(".tableBottomStart");
  box.scrollTop = box.scrollHeight;
}, [filteredGridData]);

const allowInitiator = (item, field) => {
  if (userDetails.roles[0].role_id !== 3) return false; // only initiator

  if (item.remarksType !== "action-needed") return false;

  if (field === "adjustPH" && item.remarksSubType === "Adjusted pH")
    return true;

  if (field === "factorValue" && item.remarksSubType === "Factor Value")
    return true;

  // if (field === "remarksOther" && item.remarksSubType === "Others")
  //   return true;

  return false;
};

console.log(location?.state,"stateeee")


  return (
    <div>
      <HeaderTop />
      <LaunchQMS
        onClick={() => {
          setIsPopupOpen(true);
          setPopupAction("updateElog");
        }}
        onExit={() => {
          if (!deepEqual(location.state, editData)) {
            toast.warn("Please Save the data before exiting");
          } else {
            navigate(-1);
          }
        }}
      />
      <div id="main-form-container">
        <div id="config-form-document-page" className="min-w-full">
          <div className="top-block !grid !grid-cols-2">
            {/* <div>
                <strong> Record Name:&nbsp;</strong>KARL Fischer
              </div> */}
            <div>
  <strong style={{ fontSize: "16px", color: "#ffff" }}>Department :&nbsp;</strong>
  <span
    style={{
      fontWeight: "700",
      fontSize: "16px",
      letterSpacing: "0.5px",
      color: "#ffff",
      fontFamily: "Segoe UI, Roboto, sans-serif",
    }}
  >
    {location.state?.site_id === 1
      ? "India"
      : location.state?.site_id === 2
      ? "Malaysia"
      : location.state?.site_id === 3
      ? "EMEA"
      : location.state?.site_id === 4
      ? "EU"
      : "Biologics"}
  </span>
</div>
            {/* <div>
                <strong> Initiated By :&nbsp;</strong>
                {location.state?.initiator_name}
              </div> */}
          </div>

          <div className="document-form">
            <div className="details-form-data">
              {/* <div className="sop-type-header">
                  <div className="logo">
                    <img src="/vidyalogo21.png" alt="..." />
                  </div>
                  <div className="main-head">
                    <div>Indian Pharmacopoeia Commission</div>
                  </div>
                </div> */}
              {/* <div className="sop-type-header">
                    <div className="logo">
                      <img src="/vidyalogo21.png" alt="..." />
                    </div>
                    <div className="main-head">
                      <div>VidyaGxP Private Limited</div>
                    </div>
                  </div> */}

              <div className="sub-head-2 p-4 bg-white rounded-md shadow-md flex flex-col sm:flex-row justify-between items-center">
                <span className="text-lg font-semibold text-white mb-4 sm:mb-0">
                  pH Meter (Multiparameter)
                </span>

                <div className="flex flex-wrap gap-3 items-center justify-center">
                  {/* Audit Trail Button */}
                  <button
                    className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                    onClick={() =>
                      navigate("/effective-audit-trail", {
                        state: {
                          formId: location.state?.form_id,
                          process: "pH Meter OP/Cal",
                        },
                      })
                    }
                  >
                    Audit Trail
                  </button>

                  {/* Generate Empty Report Button */}
                  {/* <button
                      onClick={generateEmptyReport}
                      className="flex items-center justify-center relative px-4 py-2 border-none rounded-md bg-white text-sm  cursor-pointer text-black font-normal"
                    >
                      {isLoading1 ? (
                        <>
                          <span>Offline Entry</span>
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              border: "3px solid #f3f3f3",
                              borderTop: "3px solid black",
                              borderRadius: "50%",
                              animation: "spin 1s linear infinite",
                              marginLeft: "10px",
                            }}
                          ></div>
                        </>
                      ) : (
                        "Offline Entry"
                      )}
                      <style>
                        {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
                      </style>
                    </button> */}

                  {/* Generate Report Button */}
                <div
  className="relative inline-block text-left"
  ref={modalRef}
>
  <button
    onClick={() => setShowOptions(!showOptions)}
    className="flex items-center justify-center relative px-4 py-2 border-none rounded-md bg-white text-sm cursor-pointer text-black font-normal"
  >
    {isLoading ? (
      <>
        <span>Generating</span>
        <div
          style={{
            width: "20px",
            height: "20px",
            border: "3px solid #f3f3f3",
            borderTop: "3px solid black",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginLeft: "10px",
          }}
        ></div>
      </>
    ) : (
      "Generate Report"
    )}
  </button>

  <style>
    {`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}
  </style>

  {showOptions && (
    <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-2xl bg-white border border-gray-300 z-50 p-5 text-black transition-all duration-200">

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
          📄 Generate Report
        </h2>
      </div>

      <div className="space-y-3 text-sm text-gray-700">

        {[
          { label: "Since Beginning", value: "full" },
          { label: "Last 1 Day", value: "1day" },
          { label: "Last 1 Week", value: "1week" },
          { label: "Last 1 Month", value: "1month" },
          { label: "Quarterly (Last 3 Months)", value: "quarterly" },
          { label: "Annually (Last 1 Year)", value: "annually" },
        ].map((item) => (
          <div key={item.value} className="flex items-center space-x-3">
            <input
              type="radio"
              name="reportType"
              value={item.value}
              checked={reportType === item.value}
              onChange={() => setReportType(item.value)}
              className="accent-blue-600 w-4 h-4"
            />
            <label className="cursor-pointer font-medium">{item.label}</label>
          </div>
        ))}

        {/* Custom Date */}
        <div className="flex items-start space-x-3">
          <input
            type="radio"
            name="reportType"
            value="custom"
            checked={reportType === "custom"}
            onChange={() => setReportType("custom")}
            className="accent-blue-600 w-4 h-4 mt-1"
          />
          <div className="w-full">
            <label className="cursor-pointer font-medium">Custom Date Range</label>

            {reportType === "custom" && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    min={formattedFirstDate}
                    max={toDate || undefined}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setToDate("");
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    min={fromDate || formattedFirstDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={generateReport}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition duration-150 text-white font-semibold text-sm py-2 rounded-md"
        >
          {isLoading ? "Generating..." : "Generate Report"}
        </button>
      </div>
    </div>
  )}
</div>

                  
                </div>
              </div>
            
              <div className="">
                <div className="btn-forms">
                  
                </div>
                {/* <button className="btn-forms-select" onClick={generateReport}>
                      Generate Report
                    </button> */}
                {/* <div className="analytics-btn">
                      <button
                        className="btn-print"
                        onClick={() =>
                          navigate("/analytics", {
                            state: { records: location.state, processId: 1 },
                          })
                        }
                      >
                        Analytics
                      </button>
                    </div> */}
              </div>
             
              {isSelectedDetails === true ? (
                <>
                     <div
      style={{
        marginBottom: showFilter ? "20px" : "10px",
        padding: showFilter ? "15px" : "8px 12px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
        transition: "0.3s ease",
      }}
    >
      {/* Only Icon */}
      <div
        style={{
          display: "flex",
          justifyContent: "",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setShowFilter(!showFilter)}
        title={showFilter ? "Collapse Filters" : "Expand Filters"}
        className="h-[10px]"
      >
        <span
         style={{
  fontSize: "28px",
  fontWeight: "800",
  color: "#111",
  userSelect: "none",
  cursor: "pointer",
  transition: "0.2s",
  transform: showFilter ? "scale(1.15)" : "scale(1.1)"
}}

        >
          {showFilter ? "−" : "+"}
        </span>
      </div>

      {/* Collapsible Content */}
      {showFilter && (
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
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
            {/* Status */}
            <div style={{ marginBottom: "0", minWidth: "200px" }}>
              <label style={labelStyle}>Status</label>
              <select
                className="form-control"
                name="status"
                value={selectedStatus}
                onChange={handleInputChange1}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <option value="All Records">All</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            {/* Initiator */}
            <div style={{ marginBottom: "0", minWidth: "200px" }}>
              <label style={labelStyle}>Initiator</label>
              <select
                className="form-control"
                name="initiator"
                value={selectedInitiator}
                onChange={handleInputChange1}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <option value="All Records">All</option>
                {[...new Set(editData?.OpAndCalMultiParameterProcessRecords?.map(r => r.done_by))].map(
                  (done_by, index) =>
                    done_by && (
                      <option key={index} value={done_by}>
                        {done_by}
                      </option>
                    )
                )}
              </select>
            </div>

            {/* Reviewer */}
            <div style={{ marginBottom: "0", minWidth: "200px" }}>
              <label style={labelStyle}>Reviewer</label>
              <select
                className="form-control"
                name="reviewer"
                value={selectedReviewer}
                onChange={handleInputChange1}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <option value="All Records">All</option>
                {[...new Set(editData?.OpAndCalMultiParameterProcessRecords?.map(r => r.reviewed_by))].map(
                  (reviewed_by, index) =>
                    reviewed_by && (
                      <option key={index} value={reviewed_by}>
                        {reviewed_by}
                      </option>
                    )
                )}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>

                  <div>
                    <div className="AddRows d-flex items-center">
                      <NoteAdd onClick={addRow} className="cursor-pointer" />
                      <div className="add-row-instruction text-sm">
                        Click the icon to add a row
                      </div>
                    </div>
                  </div>
<div className="w-full overflow-x-auto overflow-y-hidden">
  <div className="tableBottomStart max-h-[350px] overflow-y-auto flex flex-col-reverse">
    <table className="min-w-max w-full border-collapse text-center">
                    <thead>
                      <tr>
                        <th className="sticky top-0 z-10 text-center">S no.</th>
                        <th className="sticky top-0 z-10 text-center">Date and Time</th>
                        <th className="sticky top-0 z-10 text-center">Instrument/Equipment Name</th>
                        <th className="sticky top-0 z-10 text-center">Instrument/Equipment No.</th>

                        <th className="sticky top-0 z-10 text-center">
                          Name of Solution/Buffer/Sample Solution
                        </th>
                        <th className="sticky top-0 z-10 text-center">Adjusted pH</th>
                        <th className="sticky top-0 z-10 text-center">Factor Value</th>
                        <th className="sticky top-0 z-10 text-center">Done by</th>
                        <th className="sticky top-0 z-10 text-center">Checked By</th>
                        <th className="sticky top-0 z-10 text-center">Remarks</th>
                        <th className="sticky top-0 z-10 text-center">Attachment</th>
                        <th className="sticky top-0 z-10 text-center">Status</th>
                        {/* <th className="text-center">Supporting Documents</th> */}
                        {/* <th className="text-center">Actions</th> */}
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {filteredGridData.length > 0 ? (
                        filteredGridData?.map((item, index) => (
                          <tr key={index}>
                            <td  className="relative group">
                              {item.record_id || index+1}
                              <DeleteIcon
                                className="absolute right-1 top-1 text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => deleteRow(index)}
                              />
                            </td>
                            <td  className="!text-center !justify-center">
                              <input
                                value={item?.date || ""}
                                type="text"
                                readOnly
                              />
                            </td>
{/* Instrument / Equipment Name */}
<td className="!text-center !justify-center">
  <input
    value={item.instrument_name || ""}
    readOnly
    // className="bg-gray-100 cursor-not-allowed"
  />
</td>

{/* Instrument / Equipment No. */}
<td className="!text-center !justify-center">
  <input
    value={item.instrument_no || ""}
    readOnly
    // className="bg-gray-100 cursor-not-allowed"
  />
</td>


                            <td  className="!text-center !justify-center">
                              <input
                                value={item.nameOfSolution}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OpAndCalMultiParameterProcessRecords,
                                  ];
                                  newData[index].nameOfSolution =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OpAndCalMultiParameterProcessRecords:
                                      newData,
                                  });
                                }}
                                readOnly={
                                  [3, 2, 4].includes(
                                    userDetails.roles[0].role_id
                                  ) || !isFieldEditable(item, "nameOfSolution")
                                }
                              />
                            </td>

                            <td  className="!text-center">
                              <input
                                value={item.adjustPH}
                                // disabled
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OpAndCalMultiParameterProcessRecords,
                                  ];
                                  newData[index].adjustPH = e.target.value;
                                  setEditData({
                                    ...editData,
                                    OpAndCalMultiParameterProcessRecords:
                                      newData,
                                  });
                                }}
                                readOnly={
                                  [3, 2, 4].includes(
                                    userDetails.roles[0].role_id
                                  ) || !isFieldEditable(item, "adjustPH")
                                }
                              />
                            </td>
                                 
     <td className="!text-center !justify-center">
  <select
    value={item.factorValue || ""}
    onChange={(e) => {
      const newData = [...editData.OpAndCalMultiParameterProcessRecords];
      newData[index].factorValue = e.target.value;
      setEditData({
        ...editData,
        OpAndCalMultiParameterProcessRecords: newData,
      });
    }}
    disabled={
       !allowInitiator(item, "factorValue") &&
 [3, 2, 4].includes(userDetails.roles[0].role_id) || !isRowEditable(item)
    }
    className="border px-2 py-1 rounded w-full"
  >
    <option value="">Select</option>
    <option value="Calibration/Verification">Calibration / Verification</option>
  </select>
</td>

 
                            <td  className="!text-center">
                              <input
                                value={item.done_by}
                                // disabled
                                // onChange={(e) => {
                                //   const newData = [
                                //     ...editData.OpAndCalMultiParameterProcessRecords,
                                //   ];
                                //   newData[index].done_by = e.target.value;
                                //   setEditData({
                                //     ...editData,
                                //     OpAndCalMultiParameterProcessRecords: newData,
                                //   });
                                // }}
                                readOnly={true}
                              />
                            </td>

                            <td >
                              <div>
                                <div className="flex text-nowrap items-center gap-x-2 justify-center">
                                 <input
  className="h-5 w-5 cursor-pointer accent-blue-600"
  type="checkbox"
  checked={!!item.reviewed_by}
  onChange={(e) => {
    const newData = [...editData.OpAndCalMultiParameterProcessRecords];
    if (e.target.checked) {
      newData[index].reviewed_by = reviewed_by;
      newData[index].status = "Closed";
    } else {
      newData[index].reviewed_by = "";
      newData[index].status = "Open";
      newData[index].remarks = "";  
      newData[index].remarksType = "";
      newData[index].remarksOther = "";
      newData[index].remarksSubType = "";
    }
    setEditData({
      ...editData,
      OpAndCalMultiParameterProcessRecords: newData,
    });
  }}
  disabled={
    [1, 3].includes(userDetails.roles[0].role_id) || !canReviewerEdit(item)
  }
/>
                                  {item.reviewed_by && (
                                    <p className="text-blue-700">{item.reviewed_by}</p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td >
                              {item.reviewed_by && (
                                <div className="flex items-center gap-2">
                                  <select
                                    value={item.remarksType || ""}
                                    onChange={(e) => {
                                      const newData = [
                                        ...editData.OpAndCalMultiParameterProcessRecords,
                                      ];
                                      newData[index].remarksType =
                                        e.target.value;

                                      // clear other if not selected
                                      if (e.target.value === "OK") {
                                          newData[index].status = "Closed";
                                        } else if(e.target.value === "action-needed") {
                                          newData[index].status = "Returned";
                                        }
                                      if (e.target.value !== "action-needed") {
                                        newData[index].remarksSubType = "";
                                        newData[index].remarksOther = "";
                                        newData[index].remarks = e.target.value;
                                      } else {
                                        newData[index].remarks = "";
                                      }

                                      setEditData({
                                        ...editData,
                                        OpAndCalMultiParameterProcessRecords:
                                          newData,
                                      });
                                    }}
                                    className="border rounded px-2 py-1 w-auto"
                                    disabled={
                                      [1, 3].includes(
                                        userDetails.roles[0].role_id
                                      ) || !canReviewerEdit(item)
                                    }
                                  >
                                    <option value="Select">--Select--</option>
                                    <option value="OK">OK</option>
                                    <option value="action-needed">
                                      Action Needed
                                    </option>
                                  </select>

                                  {item.remarksType === "action-needed" && (
                                    <div className="flex flex-col gap-2">
                                      <select
                                        value={item.remarksSubType || ""}
                                        onChange={(e) => {
                                          const newData = [
                                            ...editData.OpAndCalMultiParameterProcessRecords,
                                          ];
                                          newData[index].remarksSubType =
                                            e.target.value;

                                          if (e.target.value !== "Others") {
                                            newData[index].remarksOther = "";
                                            newData[index].remarks =
                                              e.target.value;
                                          } else {
                                            newData[index].remarks =
                                              newData[index].remarksOther || "";
                                          }

                                          setEditData({
                                            ...editData,
                                            OpAndCalMultiParameterProcessRecords:
                                              newData,
                                          });
                                        }}
                                        className="border rounded px-2 py-1 w-auto"
                                        disabled={
                                          [1, 3].includes(
                                            userDetails.roles[0].role_id
                                          ) || !isRowEditable(item)
                                        }
                                      >
                                        <option value="">Select Issue</option>
                                          <option value="Incorrect Name of Solution">Incorrect Name of Solution</option>
                                        <option value="Incorrect Adjust pH">Incorrect Adjust pH</option>
                                        <option value="Others">Others</option>
                                        
                                      </select>

                                      {/* Show Input if "Others" is selected */}
                                      {item.remarksSubType && (
                                        <input
                                          type="text"
                                          placeholder="Enter custom remark"
                                          value={item.remarksOther || ""}
                                          onChange={(e) => {
                                            const newData = [
                                              ...editData.OpAndCalMultiParameterProcessRecords,
                                            ];
                                            newData[index].remarksOther =
                                              e.target.value;
                                            newData[index].remarks =
                                              e.target.value;

                                            setEditData({
                                              ...editData,
                                              OpAndCalMultiParameterProcessRecords:
                                                newData,
                                            });
                                          }}
                                          className="border rounded px-2 py-1 w-auto"
                                          readOnly={
                                            [1, 3].includes(
                                              userDetails.roles[0].role_id
                                            ) || !canReviewerEdit(item)
                                          }
                                        />
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            <td  style={{ width: "200px" }}>
                              <div className="d-flex">
                                {(() => {
                                  const isDisabled =
                                    [3, 4].includes(
                                      userDetails.roles[0].role_id
                                    ) || !isRowEditable(item);

                                  return item.supporting_docs ? (
                                    <div className="file-upload-wrapper">
                                      <button
                                        type="button"
                                        className="btn-upload"
                                        onClick={() =>
                                          !isDisabled &&
                                          document
                                            .getElementsByName(
                                              "supporting_docs"
                                            )
                                            [index].click()
                                        }
                                        disabled={isDisabled}
                                      >
                                        Change File
                                      </button>
                                      <h3>
                                        Selected File:{" "}
                                        <a
                                          href={item.supporting_docs}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View File
                                        </a>
                                        {!isDisabled && (
                                          <CloseIcon
                                            style={{
                                              color: "black",
                                              cursor: "pointer",
                                              marginLeft: 5,
                                            }}
                                            onClick={() =>
                                              handleDeleteFile(index)
                                            }
                                          />
                                        )}
                                      </h3>
                                    </div>
                                  ) : (
                                    <div className="file-upload-wrapper">
                                      <button
                                        type="button"
                                        className="btn-upload"
                                        onClick={() =>
                                          !isDisabled &&
                                          document
                                            .getElementsByName(
                                              "supporting_docs"
                                            )
                                            [index].click()
                                        }
                                        disabled={isDisabled}
                                      >
                                        Select File
                                      </button>
                                    </div>
                                  );
                                })()}
                                <input
                                  type="file"
                                  name="supporting_docs"
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    handleFileChange(index, e.target.files[0])
                                  }
                                  disabled={
                                    [3, 4].includes(
                                      userDetails.roles[0].role_id
                                    ) || !isRowEditable(item)
                                  }
                                />
                              </div>
                             </td>

                            <td >
                              {item.remarksSubType
                                ? "Returned"
                                : item.remarks?.toLowerCase() === "ok"
                                ? "Closed"
                                : "Open"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td  colSpan={10} className="!text-center">
                            Data Not Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  </div>
</div>
                </>
              ) : null}

            </div>
            <div className="button-block" style={{ width: "100%" }}>
             
            </div>
            {isPopupOpen && (
              <UserVerificationPopUp
                onClose={handlePopupClose}
                onSubmit={handlePopupSubmit}
              />
            )}
          </div>
        </div>
        {showFactorErrorModal && (
  <div
    className="
      fixed inset-0 bg-black/30 backdrop-blur-sm 
      flex justify-center items-center z-[999]
      animate-fadeIn
    "
  >
    <div
      className="
        bg-white text-center p-6 w-[360px]
        rounded-xl shadow-2xl border border-gray-200
        animate-scaleUp
      "
    >
      <h2 className="text-xl font-semibold mb-3 text-red-600">
        ⚠ Missing Required Field
      </h2>

      <p className="text-gray-700 mb-6">
        Calibration/Verification Factor is required before proceeding.
      </p>

      <button
        className="
          bg-blue-600 hover:bg-blue-700 transition-all
          text-white px-5 py-2.5 rounded-lg font-medium shadow-md
          hover:shadow-lg
        "
        onClick={() => setShowFactorErrorModal(false)}
      >
        OK
      </button>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default PhMeterOpCalEffective;
