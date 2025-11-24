import { useEffect, useMemo, useRef, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NoteAdd } from "@mui/icons-material";
import axios from "axios";
import UserVerificationPopUp from "../../../components/UserVerificationPopUp/UserVerificationPopUp";
import LaunchQMS from "../../../components/LaunchQMS/LaunchQMS";
import dayjs from "dayjs";
const HplcEffective = () => {
  const [isSelectedDetails, setIsSelectedDetails] = useState(true);
  const [selectedInitiator, setSelectedInitiator] = useState("All Records");
  const [selectedReviewer, setSelectedReviewer] = useState("All Records");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [reportType, setReportType] = useState("quick");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
  const [isLoading, setIsLoading] = useState(false);
  const [formId, setFormId] = useState(null);
  const [isLoading1, setIsLoading1] = useState(false);
  const [User, setUser] = useState(null);
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
    hplcRecords: [],
    limit: "",
  });
  console.log(editData, "editdata");

  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState(null);
  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setPopupAction(null);
  };

  const handlePopupSubmit = (credentials) => {
    const cleanedData = editData?.hplcRecords.filter((record) => {
      const hasRequiredFields = record.start_time?.trim() !== "";
      return hasRequiredFields;
    });

    console.log("Cleaned records:", cleanedData);

    const emptyRowsCount = editData?.hplcRecords.length - cleanedData.length;
    if (emptyRowsCount > 0) {
      toast.warn(
        `${emptyRowsCount} empty row(s) will be removed before saving.`
      );
      console.log("Original records:", editData?.hplcRecords);
      console.log("Cleaned records:", cleanedData);
    }

    const updatedEditData = {
      ...editData,
      hplcRecords: cleanedData,
    };

    console.log(updatedEditData, "updatedEditData");

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
        .put("http://localhost:1000/hplc/send-HP-elog-for-review", data, config)
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
          "http://localhost:1000/hplc/send-HP-from-review-to-approval",
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
          "http://localhost:1000/hplc/send-HP-elog-from-review-to-open",
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
        .put("http://localhost:1000/hplc/approve-HP-elog", data, config)
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
          "http://localhost:1000/hplc/send-HP-elog-from-approval-to-open",
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
      if (
        updatedEditData?.hplcRecords?.some(
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

      console.log("Updated Edit Data:", updatedEditData);

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        data: updatedEditData,
        url: "http://localhost:1000/hplc/update-hplc",
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
    const records = editData?.hplcRecords || [];

    // Function to check if a row is filled
    const isRowComplete = (row) => {
      return (
        row.sample_name?.trim() !== "" &&
        row.reg_no?.trim() !== "" &&
        row.method_used?.trim() !== "" &&
        row.parameter_or_activity?.trim() !== "" &&
        row.column_no?.trim() !== "" &&
        row.start_time?.trim() !== "" &&
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
      const newRow = {
        date: dayjs().format("DD-MM-YYYY hh:mm:ss a"),
        instrument_name: "HPLC",
        instrument_no: location.state.instrument_no,
        sample_name: "",
        reg_no: "",
        method_used: "",
        parameter_or_activity: "",
        column_no: "",
        start_time: "",
        end_time: "",
        no_of_injections: "",
        done_by: location?.state?.initiator_name || "",
        checked_by: location?.state?.initiator_name,
        remarks: "",
        remarksType: "",
        remarksSubType: "",
        remarksOther: "",
        status: "Open",
      };
      setEditData((prevState) => ({
        ...prevState,
        hplcRecords: [...prevState?.hplcRecords, newRow],
      }));
    } else if (location.state.approver_id == 4) {
      toast.warn("Only Initiator can add new Row here");
    } else if (location.state.approver_id == 5) {
      toast.warn("Only Initiator can add new Row here");
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
      const updatedGridData = [...editData.hplcRecords];
      const rowToDelete = updatedGridData[index];

      if (rowToDelete?.record_id) {
        toast.warn("Record Can't be deleted ");

        return;
      }

      // Allow deletion of rows without a `record_id`
      updatedGridData.splice(index, 1);
      setEditData((prevState) => ({
        ...prevState,
        hplcRecords: updatedGridData,
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
    const records = editData?.hplcRecords || [];

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
          : selectedStatus === "Return"
          ? record.status === "Return"
          : true;

      return matchInitiator && matchReviewer && matchStatus;
    });
  }, [
    editData?.hplcRecords,
    selectedInitiator,
    selectedReviewer,
    selectedStatus,
  ]);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty if the input is falsy

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
      second: "2-digit",
      hour12: false,
    });
  };

  console.log(location.state, "location.state");
  const handleFileChange = (index, file) => {
    const updatedGridData = [...editData.hplcRecords];
    updatedGridData[index].supporting_docs = file;
    setEditData((prevState) => ({
      ...prevState,
      hplcRecords: updatedGridData,
    }));
  };

  const EmptyreportData = {
    title: "HPLC",
    status: location.state.status,
    blankRows: 17,
    form_id: location.state.form_id,
    hplcRecords: [],
  };
  const generateEmptyReport = async () => {
    setIsLoading1(true);
    try {
      const response = await axios.post(
        `http://localhost:1000/hplc/blank-report/${formId}`,
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
        : "EU",
    status: location.state.status,
    initiator_name: location.state.initiator_name,
    title: "HPLC Record",
    ...editData,
  };

  useEffect(() => {
    if (reportData && reportData.form_id) {
      setFormId(reportData.form_id);
    }
  }, [reportData]);

  const allRecordDates = editData?.hplcRecords?.map((r) => new Date(r.date));
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
        filteredData.hplcRecords = editData.hplcRecords.filter((record) => {
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
        `http://localhost:1000/hplc/effective-chat-pdf/${formId}`,
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

  const isRowEditable = (item) => {
    const isInitiator = userDetails.userId == location.state?.initiator_id;
    const isNewRow = !item.form_id;
    return isInitiator ? isNewRow : true;
  };

  const originalData = location.state;

  // Check if reviewer can edit a record (prevent changes after saving)
  const canReviewerEdit = (item) => {
    // find original version of this record by record_id
    const original = originalData?.hplcRecords?.find(
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
    "Incorrect Sample Name": ["sample_name"],
    "Incorrect Reg No./ Lot No.": ["reg_no"],
    "Incorrect Method Used": ["method_used"],
    "Incorrect Parameter/Activity": ["parameter_or_activity"],
    "Incorrect Column No.": ["column_no"],
    "Incorrect No. of Injections": ["no_of_injections"],

    Others: [
      "sample_name",
      "reg_no",
      "method_used",
      "parameter_or_activity",
      "column_no",
      "no_of_injections",
    ],
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

  const handleDeleteFile = async (index) => {
    const record = editData.hplcRecords[index];

    if (!record?.record_id) {
      console.error("Record ID not found for deletion");
      return;
    }
    [];
    try {
      const res = await axios.delete(
        `http://localhost:1000/hplc/delete-hplc/attachment/${record.record_id}`
      );

      if (res.data?.error === false) {
        // Clear file from UI state
        const newData = [...editData.hplcRecords];
        newData[index].supporting_docs = null;

        setEditData((prev) => ({
          ...prev,
          hplcRecords: newData,
        }));
      } else {
        alert(res.data?.message || "Failed to delete attachment.");
      }
    } catch (err) {
      console.error("Error deleting attachment:", err);
      alert("Something went wrong while deleting the attachment.");
    }
  };

  return (
    <>
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
          <div className="top-block">
            <div>
              <strong> Department :&nbsp;</strong>
              {location.state?.site_id === 1
                ? "India"
                : location.state?.site_id === 2
                ? "Malaysia"
                : location.state?.site_id === 3
                ? "EMEA"
                : location.state?.site_id === 4
                ? "EU"
                : "Biologics"}
            </div>
          </div>

          <div className="document-form">
            <div className="details-form-data">
              <div className="sub-head-2 p-4 bg-white rounded-md shadow-md flex flex-col sm:flex-row justify-between items-center">
                <span className="text-lg font-semibold text-white mb-4 sm:mb-0">
                  HPLC Record
                </span>

                <div className="flex flex-wrap gap-3 items-center justify-center">
                  {/* Audit Trail Button */}
                  <button
                    className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                    onClick={() =>
                      navigate("/effective-audit-trail", {
                        state: {
                          formId: location.state?.form_id,
                          process: "HPLC",
                        },
                      })
                    }
                  >
                    Audit Trail
                  </button>

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
                            {
                              label: "Quarterly (Last 3 Months)",
                              value: "quarterly",
                            },
                            {
                              label: "Annually (Last 1 Year)",
                              value: "annually",
                            },
                          ].map((item) => (
                            <div
                              key={item.value}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="radio"
                                name="reportType"
                                value={item.value}
                                checked={reportType === item.value}
                                onChange={() => setReportType(item.value)}
                                className="accent-blue-600 w-4 h-4"
                              />
                              <label className="cursor-pointer font-medium">
                                {item.label}
                              </label>
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
                              <label className="cursor-pointer font-medium">
                                Custom Date Range
                              </label>

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
                                      onChange={(e) =>
                                        setToDate(e.target.value)
                                      }
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
                <div className="btn-forms"></div>
              </div>

              {isSelectedDetails === true ? (
                <>
                  <div
                    className="filter-section"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                      marginBottom: "20px",
                      padding: "15px",
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
                          Status
                        </label>
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
                          }}
                        >
                          <option value="All Records">All Records</option>
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                          <option value="Return">Return</option>
                        </select>
                      </div>

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
                          Initiator
                        </label>
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
                          }}
                        >
                          <option value="All Records">All Records</option>
                          {[
                            ...new Set(
                              editData?.hplcRecords?.map((r) => r.done_by)
                            ),
                          ].map(
                            (done_by, index) =>
                              done_by && (
                                <option key={index} value={done_by}>
                                  {done_by}
                                </option>
                              )
                          )}
                        </select>
                      </div>

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
                          Reviewer
                        </label>
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
                          }}
                        >
                          <option value="All Records">All Records</option>
                          {[
                            ...new Set(
                              editData?.hplcRecords?.map((r) => r.reviewed_by)
                            ),
                          ].map(
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

                  <div>
                    <div className="AddRows d-flex items-center">
                      <NoteAdd onClick={addRow} className="cursor-pointer" />
                      <div className="add-row-instruction text-sm">
                        Click the icon to add a row
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table>
                      <thead>
                        <tr>
                          <th>S.No.</th>
                          <th className="!text-nowrap px-8">Date</th>
                          <th className="sticky top-0 z-10 text-center">
                            Instrument/Equipment Name
                          </th>
                          <th className="sticky top-0 z-10 text-center">
                            Instrument/Equipment No.
                          </th>
                          <th className="!text-nowrap">Sample Name</th>
                          <th className="!text-nowrap">Reg No./ Lot No.</th>
                          <th className="!text-nowrap">Method Used</th>
                          <th className="!text-nowrap">Parameter/Activity</th>
                          <th className="!text-nowrap">Column No.</th>
                          <th className="text-nowrap">Start Time</th>
                          <th className="text-nowrap">End Time</th>
                          <th className="!text-nowrap">No. of Injections</th>
                          <th className="!text-nowrap">Done by</th>
                          <th className="!text-nowrap">Checked By</th>
                          <th className="!text-nowrap">Remarks</th>
                          <th className="text-center">Attachment</th>
                          {/* <th>Supporting Documents</th> */}
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGridData?.map((item, index) => (
                          <tr key={index}>
                            <td className="relative group">
                              {item.record_id || index + 1}
                              <DeleteIcon
                                className="absolute right-1 top-1 text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => deleteRow(index)}
                              />
                            </td>

                            <td className="w-24">
                              <input
                                value={item?.date || ""}
                                type="text"
                                readOnly
                              />
                            </td>

                            <td className="!text-center !justify-center">
                              <input
                                value={item.instrument_name || ""}
                                readOnly
                                // className="bg-gray-100 cursor-not-allowed"
                              />
                            </td>
                            <td className="!text-center !justify-center">
                              <input
                                value={item.instrument_no || ""}
                                readOnly
                                // className="bg-gray-100 cursor-not-allowed"
                              />
                            </td>

                            <td>
                              <input
                                value={item.sample_name}
                                onChange={(e) => {
                                  const newData = [...editData.hplcRecords];
                                  newData[index].sample_name = e.target.value;
                                  setEditData({
                                    ...editData,
                                    hplcRecords: newData,
                                  });
                                }}
                                readOnly={
                                  [3, 2, 4].includes(
                                    userDetails.roles[0].role_id
                                  ) || !isFieldEditable(item, "sample_name")
                                }
                              />
                            </td>

                            <td>
                              <input
                                value={item.reg_no}
                                onChange={(e) => {
                                  const newData = [...editData.hplcRecords];
                                  newData[index].reg_no = e.target.value;
                                  setEditData({
                                    ...editData,
                                    hplcRecords: newData,
                                  });
                                }}
                                readOnly={
                                  [3, 2, 4].includes(
                                    userDetails.roles[0].role_id
                                  ) || !isFieldEditable(item, "reg_no")
                                }
                              />
                            </td>

                            <td>
                              <input
                                value={item.method_used}
                                onChange={(e) => {
                                  const newData = [...editData.hplcRecords];
                                  newData[index].method_used = e.target.value;
                                  setEditData({
                                    ...editData,
                                    hplcRecords: newData,
                                  });
                                }}
                                readOnly={
                                  [3, 2, 4].includes(
                                    userDetails.roles[0].role_id
                                  ) || !isFieldEditable(item, "method_used")
                                }
                              />
                            </td>

                            <td>
                              <input
                                value={item.parameter_or_activity}
                                onChange={(e) => {
                                  const newData = [...editData.hplcRecords];
                                  newData[index].parameter_or_activity =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    hplcRecords: newData,
                                  });
                                }}
                                readOnly={
                                  [3, 2, 4].includes(
                                    userDetails.roles[0].role_id
                                  ) ||
                                  !isFieldEditable(
                                    item,
                                    "parameter_or_activity"
                                  )
                                }
                              />
                            </td>

                            <td>
                              <input
                                value={item.column_no}
                                onChange={(e) => {
                                  const newData = [...editData.hplcRecords];
                                  newData[index].column_no = e.target.value;
                                  setEditData({
                                    ...editData,
                                    hplcRecords: newData,
                                  });
                                }}
                                readOnly={
                                  [3, 2, 4].includes(
                                    userDetails.roles[0].role_id
                                  ) || !isFieldEditable(item, "column_no")
                                }
                              />
                            </td>

                            {/* ✅ Start Time */}
                            <td>
                              <input
                                type="checkbox"
                                checked={!!item.start_time}
                                disabled={
                                  [3, 2, 4].includes(
                                    userDetails.roles[0].role_id
                                  ) || !isRowEditable(item)
                                }
                                onChange={(e) => {
                                  const newData = [...editData.hplcRecords];
                                  if (e.target.checked) {
                                    newData[index].start_time =
                                      new Date().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false,
                                      });
                                  } else {
                                    newData[index].start_time = "";
                                    newData[index].end_time = "";
                                    newData[index].reviewed_by = "";
                                    newData[index].status = "Open";
                                    newData[index].remarks = "";
                                    newData[index].remarksType = "";
                                    newData[index].remarksOther = "";
                                    newData[index].remarksSubType = "";
                                  }
                                  setEditData({
                                    ...editData,
                                    hplcRecords: newData,
                                  });
                                }}
                              />
                              {item.start_time && (
                                <span className="ml-2">{item.start_time}</span>
                              )}
                            </td>

                            {/* ✅ End Time */}
                            <td>
                              <input
                                type="checkbox"
                                checked={!!item.end_time}
                                disabled={
                                  [3, 2, 4].includes(
                                    userDetails.roles[0].role_id
                                  ) || !isRowEditable(item)
                                }
                                onChange={(e) => {
                                  if (!item.start_time) {
                                    toast.warn(
                                      "Please mark the Start Time first before setting End Time."
                                    );
                                    return;
                                  }

                                  const startParts = item.start_time
                                    .split(":")
                                    .map(Number); // [HH, MM, SS]
                                  const now = new Date();
                                  const start = new Date(now);
                                  start.setHours(
                                    startParts[0],
                                    startParts[1],
                                    startParts[2] || 0,
                                    0
                                  );

                                  const diffInMs = now - start;
                                  const diffInMinutes = diffInMs / 60000;

                                  if (e.target.checked) {
                                    if (diffInMinutes < 1) {
                                      toast.warn(
                                        "Please wait at least 1 minute before marking End Time."
                                      );
                                      return;
                                    }

                                    const newData = [...editData.hplcRecords];
                                    newData[index].end_time =
                                      now.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false,
                                      });

                                    setEditData({
                                      ...editData,
                                      hplcRecords: newData,
                                    });
                                  } else {
                                    const newData = [...editData.hplcRecords];
                                    newData[index].end_time = "";
                                    newData[index].reviewed_by = "";
                                    newData[index].status = "Open";
                                    newData[index].remarks = "";
                                    newData[index].remarksType = "";
                                    newData[index].remarksOther = "";
                                    newData[index].remarksSubType = "";

                                    setEditData({
                                      ...editData,
                                      hplcRecords: newData,
                                    });
                                  }
                                }}
                              />
                              {item.end_time && (
                                <span className="ml-2">{item.end_time}</span>
                              )}
                            </td>

                            <td>
                              <input
                                value={item.no_of_injections}
                                onChange={(e) => {
                                  const newData = [...editData.hplcRecords];
                                  newData[index].no_of_injections =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    hplcRecords: newData,
                                  });
                                }}
                                readOnly={
                                  [3, 2, 4].includes(
                                    userDetails.roles[0].role_id
                                  ) ||
                                  !isFieldEditable(item, "no_of_injections")
                                }
                              />
                            </td>

                            <td>
                              <input value={item.done_by} readOnly={true} />
                            </td>

                            {/* ✅ Reviewer Checkbox with Validation */}
                            <td>
                              <div className="flex text-nowrap items-center gap-x-2 justify-center">
                                <input
                                  className="h-4 w-4 cursor-pointer"
                                  type="checkbox"
                                  checked={!!item.reviewed_by}
                                  onChange={(e) => {
                                    if (!item.end_time) {
                                      toast.warn(
                                        "Initiator must mark the End Time before reviewer action."
                                      );
                                      return;
                                    }
                                    const newData = [...editData.hplcRecords];
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
                                      hplcRecords: newData,
                                    });
                                  }}
                                  disabled={
                                    [1, 3].includes(
                                      userDetails.roles[0].role_id
                                    ) || !canReviewerEdit(item)
                                  }
                                />
                                {item.reviewed_by && <p>{item.reviewed_by}</p>}
                              </div>
                            </td>

                            {/* ✅ Remarks if reviewed */}
                            <td>
                              {item.reviewed_by && (
                                <div className="flex flex-col gap-2">
                                  {/* First Dropdown: OK / Action Needed */}
                                  <select
                                    value={item.remarksType || ""}
                                    onChange={(e) => {
                                      const newData = [...editData.hplcRecords];
                                      newData[index].remarksType =
                                        e.target.value;

                                      // Reset other fields on change
                                      if (e.target.value === "OK") {
                                          newData[index].status = "Closed";
                                        } else if(e.target.value === "action-needed") {
                                          newData[index].status = "Return";
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
                                        hplcRecords: newData,
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

                                  {/* Second Dropdown: Only visible if 'Action Needed' */}
                                  {item.remarksType === "action-needed" && (
                                    <div className="flex flex-col gap-2">
                                      <select
                                        value={item.remarksSubType || ""}
                                        onChange={(e) => {
                                          const newData = [
                                            ...editData.hplcRecords,
                                          ];
                                          newData[index].remarksSubType =
                                            e.target.value;

                                          if (e.target.value !== "Others") {
                                            newData[index].remarksOther = "";
                                            newData[index].remarks =
                                              e.target.value;
                                          } else {
                                            newData[index].remarks = "";
                                          }

                                          setEditData({
                                            ...editData,
                                            hplcRecords: newData,
                                          });
                                        }}
                                        className="border rounded px-2 py-1 w-auto"
                                        disabled={
                                          [1, 3].includes(
                                            userDetails.roles[0].role_id
                                          ) || !canReviewerEdit(item)
                                        }
                                      >
                                        <option value="">Select Issue</option>
                                        <option value="Incorrect Sample Name">
                                          Incorrect Sample Name
                                        </option>
                                        <option value="Incorrect Reg No./ Lot No.">
                                          Incorrect Reg No./ Lot No.
                                        </option>
                                        <option value="Incorrect Method Used">
                                          Incorrect Method Used
                                        </option>
                                        <option value="Incorrect Parameter/Activity">
                                          Incorrect Parameter/Activity
                                        </option>
                                        <option value="Incorrect Column No.">
                                          Incorrect Column No.
                                        </option>
                                        <option value="Incorrect No. of Injections">
                                          Incorrect No. of Injections
                                        </option>
                                        <option value="Others">Others</option>
                                      </select>

                                      {/* Custom Remark Input if 'Others' selected */}
                                      {item.remarksSubType && (
                                        <input
                                          type="text"
                                          placeholder="Enter remark"
                                          value={item.remarksOther || ""}
                                          onChange={(e) => {
                                            const newData = [
                                              ...editData.hplcRecords,
                                            ];
                                            newData[index].remarksOther =
                                              e.target.value;
                                            newData[index].remarks =
                                              e.target.value;

                                            setEditData({
                                              ...editData,
                                              hplcRecords: newData,
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

                            <td style={{ width: "200px" }}>
                              <div className="d-flex">
                                {(() => {
                                  const isDisabled =
                                    [3, 4].includes(
                                      userDetails.roles[0].role_id
                                    ) ||
                                    !isRowEditable(item) ||
                                    !canReviewerEdit(item);

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

                            <td>
                              {item.remarksSubType
                                ? "Return"
                                : item.remarks?.toLowerCase() === "ok"
                                ? "Closed"
                                : "Open"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : null}
            </div>
            <div className="button-block" style={{ width: "100%" }}></div>
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
};

export default HplcEffective;
