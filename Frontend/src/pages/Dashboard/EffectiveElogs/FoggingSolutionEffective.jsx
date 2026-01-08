import { useEffect, useMemo, useRef, useState } from "react";
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
import { Autocomplete, TextField } from "@mui/material";
import HeaderTop from "../../../components/Header/HeaderTop";

const FoggingSolutionEffective = () => {
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(true);
  const [initiatorRemarks, setInitiatorRemarks] = useState(false);
  const [reviewerRemarks, setReviewerRemarks] = useState(false);
  const [approverRemarks, setApproverRemarks] = useState(false);
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
    instrument_name: "Fogging Solution",
    instrument_no: location?.state?.instrument_no,
    factorValue: "",
    performance: "",
    status: "",
    description: "",
    department: "",
    compression_area: "",
    additionalAttachment: "",
    additionalInfo: "",
    FoggingSolutionRecords: [],
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
    const cleanedData = editData?.FoggingSolutionRecords.filter((record) => {
      const hasRequiredFields =
        record.nameOfArea?.trim() !== "" &&
        record.AHUNo?.trim() !== "" &&
        record.ahuOffDateAndTime?.trim() !== "";
      return hasRequiredFields;
    });

    // Check if any empty rows will be removed
    const emptyRowsCount =
      editData?.FoggingSolutionRecords.length - cleanedData.length;
    if (emptyRowsCount > 0) {
      toast.warn(
        `${emptyRowsCount} empty row(s) will be removed before saving.`
      );
    }

    const updatedEditData = {
      ...editData,
      FoggingSolutionRecords: cleanedData,
    };

    // Check if there are any valid records to save
    if (cleanedData.length === 0) {
      toast.error(
        "Please add at least one record with required fields before saving."
      );
      return;
    }
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
          "http://localhost:1000/analytical-balance/send-for-review",
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
          "http://localhost:1000/analytical-balance/send-review-to-approval",
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
          "http://localhost:1000/analytical-balance/send-review-to-open",
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
        .put("http://localhost:1000/analytical-balance/approve", data, config)
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
          "http://localhost:1000/analytical-balance/send-approval-to-open",
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
        updatedEditData?.FoggingSolutionRecords?.some(
          (record) => record.analytical_balance === ""
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

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        data: updatedEditData,
        url: "http://localhost:1000/fogging-solution/update-fogging-solution",
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
    const records = editData?.FoggingSolutionRecords || [];

    console.log(records, "records");
    // Function to check if a row is filled
    const isRowComplete = (row) => {
      console.log(row, "ro");
      return (
        row.reg_no?.trim() !== "" &&
        row.sample_name?.trim() !== "" &&
        row.weight_taken?.trim() !== "" &&
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
      if (lastRow.factorValue === "Calibration/Verification") {
        toast.warn(
          "Machine is under maintenance/Calibration/Verification. Please contact responsible person."
        );
        return;
      }
      if (
        lastRow.performanceEndDateTime === null &&
        lastRow.performance !== "OK"
      ) {
        toast.warn(
          `Machine is under maintenance (${lastRow.performance}). Please contact responsible person.`
        );
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
      const nextIndex = editData?.FoggingSolutionRecords?.length || 0;

      const newRow = {
        date: dayjs().toISOString(),
        nameOfArea: "",
        AHUNo: "",
        ahuOffDateAndTime: "",
        volumeOfArea: "",
        foggingSolutionQty: "",
        foggingStartTime: "",
        foggingEndTime: "",
        performedBy: location?.state?.initiator_name || "",
        ahuOnDateAndTime: "",
        instrument_name: "Fogging Solution",
        done_by: location?.state?.initiator_name || "",
        reviewed_by: "",
        checked_by: "",
        remarks: "",
        status: "Open",
      };
      console.log(newRow, "newRoe");
      setEditData((prevState) => ({
        ...prevState,
        FoggingSolutionRecords: [...prevState?.FoggingSolutionRecords, newRow],
      }));
    } else if (location.state.reviewer_id) {
      toast.warn("Only Initiator can add new Row here");
    } else if (location.state.approver_id) {
      toast.warn("Only Initiator can add new Row here");
    }
  };
  console.log(editData, "editDataa");
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
      const updatedGridData = [...editData.FoggingSolutionRecords];
      const rowToDelete = updatedGridData[index];

      if (rowToDelete?.record_id) {
        toast.warn("Record Can't be deleted ");

        return;
      }

      // Allow deletion of rows without a `record_id`
      updatedGridData.splice(index, 1);
      setEditData((prevState) => ({
        ...prevState,
        FoggingSolutionRecords: updatedGridData,
      }));
    }
  };

  /*************  ✨ Windsurf Command ⭐  *************/
  /**

/*******  ee311324-3a4d-4383-9f12-6368df95e116  *******/
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
    const records = editData?.FoggingSolutionRecords || [];
    console.log(records, "records");
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
    editData?.FoggingSolutionRecords,
    selectedInitiator,
    selectedReviewer,
    selectedStatus,
  ]);

  console.log(filteredGridData, "filteredGridData");
  // const handleDeleteFile = (index) => {
  //   if (
  //     location.state?.stage === 1 &&
  //     location.state?.initiator_id === userDetails.userId
  //   ) {
  //     const updatedGridData = editData.FoggingSolutionRecords.map(
  //       (item, i) => {
  //         if (i === index) {
  //           return { ...item, supporting_docs: null };
  //         }
  //         return item;
  //       }
  //     );
  //     setEditData((prevState) => ({
  //       ...prevState,
  //       FoggingSolutionRecords: updatedGridData,
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
      second: "2-digit",
      hour12: false,
    });
  };

  const handleFileChange = (index, file) => {
    const updatedGridData = [...editData.FoggingSolutionRecords];
    updatedGridData[index].supporting_docs = file;
    setEditData((prevState) => ({
      ...prevState,
      FoggingSolutionRecords: updatedGridData,
    }));
  };

  const handleDeleteFile = async (index) => {
    const record = editData.FoggingSolutionRecords[index];

    if (!record?.record_id) {
      console.error("Record ID not found for deletion");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:1000/analytical-balance/delete-analytical-balance/attachment/${record.record_id}`
      );

      if (res.data?.error === false) {
        // Clear file from UI state
        const newData = [...editData.FoggingSolutionRecords];
        newData[index].supporting_docs = null;

        setEditData((prev) => ({
          ...prev,
          FoggingSolutionRecords: newData,
        }));
      } else {
        alert(res.data?.message || "Failed to delete attachment.");
      }
    } catch (err) {
      console.error("Error deleting attachment:", err);
      alert("Something went wrong while deleting the attachment.");
    }
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
    title: "Fogging Solution",
    status: location?.state?.status,
    blankRows: 17,
    form_id: location?.state?.form_id,
    FoggingSolutionRecords: [],
  };
  const generateEmptyReport = async () => {
    setIsLoading1(true);
    try {
      const response = await axios.post(
        `http://localhost:1000/analytical-balance/blank-report/${formId}`,
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
      location?.state?.site_id === 1
        ? "India"
        : location?.state?.site_id === 2
        ? "Malaysia"
        : location?.state?.site_id === 3
        ? "EMEA"
        : "EU",
    status: location?.state?.status,
    initiator_name: location?.state?.initiator_name,
    title: "Fogging Solution",
    ...editData,
  };

  useEffect(() => {
    if (reportData && reportData.form_id) {
      setFormId(reportData.form_id);
    }
  }, [reportData]);

  // const generateReport = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:1000/analytical-balance/effective-chat-pdf/${formId}`,
  //       {
  //         reportData: reportData,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("user-token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const { filename } = response.data; // Access filename from response.data

  //     const reportUrl = `/effective-view-report?formId=${formId}&filename=${filename}`;

  //     // Open the report in a new tab
  //     window.open(reportUrl, "_blank", "noopener,noreferrer");
  //   } catch (error) {
  //     console.error("Error opening chat PDF:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const allRecordDates = editData?.FoggingSolutionRecords?.map(
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
        filteredData.FoggingSolutionRecords =
          editData.FoggingSolutionRecords.filter((record) => {
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
        `http://localhost:1000/analytical-balance/effective-chat-pdf/${formId}`,
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
    const isInitiator = userDetails.userId === location.state?.initiator_id;
    const isNewRow = !item.form_id;

    // New rows → only initiator can edit
    if (isNewRow) {
      return isInitiator;
    }

    // Existing rows → only initiator can edit
    return isInitiator;
  };

  const originalData = location.state;

  // Check if reviewer can edit a record (prevent changes after saving)
  const canReviewerEdit = (item) => {
    // find original version of this record by record_id
    const original = originalData?.FoggingSolutionRecords?.find(
      (o) => o.record_id === item.record_id
    );

    // If we found the original row
    if (original) {
      // If original remarksType was OK → Lock it
      if (original.remarks !== "" || original.reviewed_by !== null) {
        return false;
      }
    }

    // Otherwise allow editing
    return true;
  };

  const disableFieldMap = {
    "Incorrect Sample Name": ["sample_name"],
    "Incorrect Reg No./ Lot No.": ["reg_no"],
    "Incorrect Weight Taken": ["weight_taken"],
    "Incorrect UOM": ["uom"],

    // Others → enable ALL these fields
    Others: ["sample_name", "reg_no", "weight_taken", "uom"],
  };

  const getReviewerMarkedField = (item) => {
    return disableFieldMap[item.remarksSubType] || [];
  };

  const isAfterOneHour = (offTime, currentTime) => {
    console.log(offTime, "offtime");
    console.log(currentTime, "currentTimee");
    if (!offTime || !currentTime) return false;

    return dayjs(currentTime).diff(dayjs(offTime), "minute") >= 3;
  };

  const isFieldEnabledByFlow = (item, fieldName) => {
    // Nothing after OffTime is allowed until OffTime exists
    if (!item.ahuOffDateAndTime) {
      const lockedFields = [
        "volumeOfArea",
        "foggingSolutionQty",
        "foggingStartTime",
        "foggingEndTime",
        "reviewed_by",
        "ahuOnDateAndTime",
        "supporting_docs",
        "remarks",
      ];

      if (lockedFields.includes(fieldName)) return false;
    }

    // Enforce 1-hour rule for AHU ON
    if (fieldName === "ahuOnDateAndTime") {
      return isAfterOneHour(
        dayjs(item.ahuOffDateAndTime).format("YYYY-MM-DD HH:mm:ss"),
        dayjs().format("YYYY-MM-DD HH:mm:ss")
      );
    }

    return true;
  };

  const isFieldEditable = (item, fieldName) => {
    const originalRecord = originalData?.FoggingSolutionRecords?.find(
      (o) => o.record_id === item.record_id
    );

    // If we don't have original data, allow editing
    if (!originalRecord) return true;

    const currentValue = item[fieldName];
    const originalValue = originalRecord[fieldName];

    // If value is same as original → disable
    if (String(currentValue ?? "") === String(originalValue ?? "")) {
      return false;
    }

    return isRowEditable(item);
  };

  const ifAhuOnDateAndTimeEditable = (item) => {
    const originalRecord = originalData?.FoggingSolutionRecords?.find(
      (o) => o.record_id === item.record_id
    );

    if (!originalRecord) return true;

    const currentValue = item.ahuOnDateAndTime ?? "";
    const originalValue = originalRecord.ahuOnDateAndTime ?? "";

    // If both empty → allow editing
    if (!currentValue && !originalValue) {
      return isRowEditable(item);
    }

    // If same value → lock
    if (String(currentValue) === String(originalValue)) {
      return false;
    }

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
    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }, [filteredGridData]);

  const allowInitiator = (item, field) => {
    if (userDetails.roles[0].role_id !== 3) return false; // only initiator

    if (item.remarksType !== "action-needed") return false;

    // if (field === "adjustPH" && item.remarksSubType === "Adjusted pH")
    //   return true;

    if (field === "factorValue" && item.remarksSubType === "Factor Value")
      return true;

    // if (field === "remarksOther" && item.remarksSubType === "Others")
    //   return true;

    return false;
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
          <div className="top-block !grid !grid-cols-3">
            {/* <div>
               <strong> Record Name:&nbsp;</strong>Analytical Balance
             </div> */}
            <div>
              <strong style={{ fontSize: "16px", color: "#ffff" }}>
                {" "}
                Department :&nbsp;
              </strong>
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
              <strong> Current Status:&nbsp;</strong>
              {location.state?.status}
            </div>
            <div>
              <strong> Initiated By:&nbsp;</strong>
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
                  Fogging Solution
                </span>

                <div className="flex flex-wrap gap-3 items-center justify-center">
                  {/* Audit Trail Button */}
                  <button
                    className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                    onClick={() =>
                      navigate("/effective-audit-trail", {
                        state: {
                          formId: location?.state?.form_id,
                          process: "Fogging Solution",
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

                  {/* Conditional Buttons Based on Stages */}
                  {/* {location.state?.stage === 1 &&
                     location.state?.initiator_id === userDetails.userId && (
                       <button
                         className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                         onClick={() => {
                           setIsPopupOpen(true);
                           setPopupAction("sendFromOpenToReview");
                         }}
                       >
                         Send for Review
                       </button>
                     )} */}

                  {/* {location.state?.stage === 2 &&
                     location.state?.reviewer_id === userDetails.userId && (
                       <>
                         <button
                           className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                           onClick={() => {
                             setIsPopupOpen(true);
                             setPopupAction("sendFromReviewToApproval");
                           }}
                         >
                           Review Completed
                         </button>
                         <button
                           className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                           onClick={() => {
                             setIsPopupOpen(true);
                             setPopupAction("sendFromReviewToOpen");
                           }}
                         >
                           More Info Required
                         </button>
                       </>
                     )} */}

                  {/* {location.state?.stage === 3 &&
                     location.state?.approver_id === userDetails.userId && (
                       <>
                         <button
                           className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                           onClick={() => {
                             setIsPopupOpen(true);
                             setPopupAction("sendFromApprovalToClosedDone");
                           }}
                         >
                           Approve elog
                         </button>
                         <button
                           className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                           onClick={() => {
                             setIsPopupOpen(true);
                             setPopupAction("sendFromApprovalToOpen");
                           }}
                         >
                           More Info Required
                         </button>
                       </>
                     )} */}

                  {/* {location.state?.stage === 3 &&
                     userDetails.userId === location.state?.reviewer_id && ( */}
                  {/* <button
                     className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                     onClick={() => {
                       setIsPopupOpen(true);
                       setPopupAction("updateElog");
                     }}
                   >
                     Save
                   </button> */}
                  {/* ) */}
                </div>
              </div>
              {/* <div className="outerDiv4 bg-slate-300 py-4">
                 <div className="flex gap-3 ">
                   <div
                     className={`px-6 py-2 rounded-lg font-semibold text-center transition-all ${
                       location.state?.stage > 1
                         ? "bg-green-500 text-white"
                         : location.state?.stage === 1
                         ? "bg-orange-500 text-white"
                         : "bg-gray-200 text-gray-700"
                     }`}
                   >
                     OPENED
                   </div>
 
                   <div
                     className={`px-6 py-2 rounded-lg font-semibold text-center transition-all ${
                       location.state?.stage > 2
                         ? "bg-green-500 text-white"
                         : location.state?.stage === 2
                         ? "bg-orange-500 text-white"
                         : "bg-gray-200 text-gray-700"
                     }`}
                   >
                     UNDER REVIEW
                   </div>
 
                   <div
                     className={`px-6 py-2 rounded-lg font-semibold text-center transition-all ${
                       location.state?.stage > 3
                         ? "bg-green-500 text-white"
                         : location.state?.stage === 3
                         ? "bg-orange-500 text-white"
                         : "bg-gray-200 text-gray-700"
                     }`}
                   >
                     UNDER APPROVAL
                   </div>
 
                   <div
                     className={`px-6 py-2 rounded-lg font-semibold text-center transition-all ${
                       location.state?.stage > 4
                         ? "bg-green-500 text-white"
                         : location.state?.stage === 4
                         ? "bg-red-500 text-white"
                         : "bg-gray-200 text-gray-700"
                     }`}
                   >
                     CLOSED DONE
                   </div>
                 </div>
               </div> */}
              <div className="">
                <div className="btn-forms">
                  {/* <div
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
                         setApproverRemarks(false);
                     }}
                   >
                     General Information
                   </div> */}
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
                         setApproverRemarks(false);
                     }}
                   >
                     Details
                   </div> */}
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
                   </div>
                   <div
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
                  {/* <div
                     className="btn-forms-select"
                     onClick={() =>
                       navigate("/audit-trail", {
                         state: {
                           formId: location.state?.form_id,
                           process: "Analytical Balance",
                         },
                       })
                     }
                   >
                     Audit Trail
                   </div> */}
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
              {/* <div className="flex gap-2">
               <div className="flex gap-2">
                
                 <div >
                 <label> Start Date</label>
                 <input  type="date" />
                 </div>
                 <div >
                 <label> End Date</label>
                 <input  type="date" />
                 </div>
               
                 
               </div>
               <div className="flex gap-2">
                
                 <div >
                 <label> Start Date and Time</label>
                 <input  type="datetime-local" />
                 </div>
                 <div >
                 <label> End Date and Time</label>
                 <input  type="datetime-local" />
                 </div>
               </div>
               <div>
               <label htmlFor="">Shift Vise</label>
               <input type="text" />
               </div>
               </div> */}

              {/* {isSelectedGeneral === true ? (
                 <>
                   <div className="group-input">
                     <label className="color-label">Initiator </label>
                     <div>
                       <input
                         type="text"
                         name="initiator"
                         value={editData.initiator_name}
                         readOnly
                       />
                     </div>
                   </div>
 
                   <div className="group-input">
                     <label className="color-label">Date of Initiation</label>
                     <div>
                       <input
                         type="text"
                         value={formatDate(editData.date_of_initiation)}
                         readOnly
                       />
                     </div>
                   </div>
 
                   <div className="group-input">
                     <label className="color-label">
                       Description{" "}
                       <span className="required-asterisk text-red-500">*</span>
                     </label>
                     <div>
                     
 
                       <TinyEditor
                         editorContent={editData.description}
                         setEditorContent={setTinyContent}
                         tinyNo={1}
                       />
                     </div>
                   </div>
 
                   <div className="group-input">
                     <label className="color-label">Status</label>
                     <div>
                       <input
                         name="status"
                         type="text"
                         value={editData?.status}
                         readOnly
                       />
                     </div>
                   </div>
                 </>
               ) : null} */}

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
                          transform: showFilter ? "scale(1.15)" : "scale(1.1)",
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
                              {[
                                ...new Set(
                                  editData?.FoggingSolutionRecords?.map(
                                    (r) => r.done_by
                                  )
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
                              {[
                                ...new Set(
                                  editData?.FoggingSolutionRecords?.map(
                                    (r) => r.reviewed_by
                                  )
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
                    )}
                  </div>
                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label">
                        Name of fogging solution
                      </label>
                      <div>
                        <input
                          type="text"
                          value={editData?.nameOfFoggingSolution}
                          onChange={handleInputChange1}
                          disabled
                          style={{ backgroundColor: "#fafafa" }}
                          className="shadow-xl"
                        />
                      </div>
                    </div>
                    <div className="group-input">
                      <label className="color-label">
                        Qty of fogging solution
                      </label>
                      <div>
                        <input
                          type="text"
                          value={editData?.quantityOfFoggingSolution}
                          onChange={(e) =>
                            setAnalyticalBalance({ initiator: e.target.value })
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
                        Qty of purified water
                      </label>
                      <div>
                        <input
                          type="text"
                          value={editData?.quantityOfPurifiedWater}
                          onChange={handleInputChange1}
                          // disabled
                          style={{ backgroundColor: "#fafafa" }}
                          className="shadow-xl"
                        />
                      </div>
                    </div>
                    <div className="group-input">
                      <label className="color-label">Total Qty</label>
                      <div>
                        <input
                          type="text"
                          value={editData?.totalQuantity}
                          // onChange={(e) =>
                          //   setAnalyticalBalance({ initiator: e.target.value })
                          // }
                          // disabled
                          style={{ backgroundColor: "#fafafa" }}
                          className="shadow-xl"
                        />
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
                  <div className="tableBottomStart max-h-[350px] w-full overflow-x-auto overflow-y-auto flex flex-col-reverse">
                    <table className="min-w-max w-full border-collapse text-center">
                      <thead>
                        <tr>
                          <th className="sticky top-0 z-10 text-center !text-wrap ">
                            S no.
                          </th>

                          <th className="sticky top-0 z-10 text-center w-40 !text-wrap">
                            Date and Time
                          </th>
                          {/* <th className="sticky top-0 z-10 text-center">
                            Instrument/Equipment Name
                          </th> */}
                          <th className="sticky top-0 w-36 z-10 text-center">
                            Name of area & No.
                          </th>

                          <th className="sticky top-0 z-10 w-36 text-center !text-wrap ">
                            AHU No.
                          </th>
                          <th className="sticky top-0 z-10 text-center !text-wrap ">
                            AHU off date & time
                          </th>
                          <th className="sticky top-0 z-10 w-36 text-center !text-wrap ">
                            Volume of area (ft.³)
                          </th>
                          <th className="sticky top-0 z-10 text-center !text-wrap ">
                            Fogging solution qty. (ml)
                          </th>
                          <th className="sticky top-0 z-10 text-center">
                            Fogging Start time
                          </th>
                          <th className="sticky top-0 z-10 text-center">
                            Fogging End time
                          </th>
                          <th className="sticky top-0 z-10 text-center !text-wrap ">
                            Performed by (sign/date)
                          </th>
                          <th className="sticky top-0 z-10 text-center !text-wrap ">
                            AHU on date & time
                          </th>
                          <th className="sticky top-0 z-10 text-center !text-wrap ">
                            Verified by (sign/date)
                          </th>
                          <th className="sticky top-0 z-10 text-center !text-wrap ">
                            Remarks
                          </th>
                          <th className="sticky top-0 z-10 text-center !text-wrap ">
                            Attachment
                          </th>
                          <th className="sticky top-0 z-10 text-center !text-wrap ">
                            Status
                          </th>
                          {/* <th  className="text-center">Supporting Documents</th> */}
                          {/* <th  className="text-center">Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGridData.length > 0 ? (
                          filteredGridData?.map((item, index) => (
                            <tr key={index} className="!text-center">
                              <td className="relative group">
                                {index + 1}
                                <DeleteIcon
                                  className="absolute right-1 top-1 text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  onClick={() => deleteRow(index)}
                                />{" "}
                              </td>
                              <td>
                                <input
                                  value={
                                    dayjs(item?.date).format(
                                      "DD-MM-YYYY hh:mm:ss a"
                                    ) || ""
                                  }
                                  type="text"
                                  readOnly
                                />
                              </td>

                              <td className="!text-center !justify-center">
                                <select
                                  className="form-control"
                                  name="nameOfArea"
                                  value={item?.nameOfArea}
                                  onChange={(e) => {
                                    const newData = [
                                      ...editData.FoggingSolutionRecords,
                                    ];
                                    newData[index].nameOfArea = e.target.value;
                                    setEditData({
                                      ...editData,
                                      FoggingSolutionRecords: newData,
                                    });
                                  }}
                                  style={{
                                    padding: "8px 12px",
                                    border: "1px solid #ced4da",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                    // backgroundColor: "white",
                                    width: "100%",
                                  }}
                                  disabled={
                                    [3, 2, 4].includes(
                                      userDetails.roles[0].role_id
                                    ) || !isFieldEditable(item, "nameOfArea")
                                  }
                                >
                                  <option value="Select Area">
                                    Select Area
                                  </option>
                                  <option value="Area 1">Area 1</option>
                                  <option value="Area 2">Area 2</option>
                                  <option value="Area 3">Area 3</option>
                                </select>
                              </td>

                              <td>
                                <input
                                  value={item.AHUNo}
                                  onChange={(e) => {
                                    const newData = [
                                      ...editData.FoggingSolutionRecords,
                                    ];
                                    newData[index].AHUNo = e.target.value;
                                    setEditData({
                                      ...editData,
                                      FoggingSolutionRecords: newData,
                                    });
                                  }}
                                  readOnly={
                                    [3, 2, 4].includes(
                                      userDetails.roles[0].role_id
                                    ) || !isFieldEditable(item, "AHUNo")
                                  }
                                />
                              </td>

                              <td>
                                <div className="flex text-nowrap items-center gap-x-2 justify-center">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer"
                                    style={{ marginLeft: "8px" }}
                                    checked={!!item.ahuOffDateAndTime}
                                    onChange={(e) => {
                                      const newData = [
                                        ...editData.FoggingSolutionRecords,
                                      ];

                                      if (e.target.checked) {
                                        newData[index].ahuOffDateAndTime =
                                          dayjs().toISOString();
                                      } else {
                                        newData[index].ahuOffDateAndTime = "";
                                      }

                                      setEditData({
                                        ...editData,
                                        FoggingSolutionRecords: newData,
                                      });
                                    }}
                                    disabled={
                                      [3, 2, 4].includes(
                                        userDetails.roles[0].role_id
                                      ) ||
                                      !isFieldEditable(
                                        item,
                                        "ahuOffDateAndTime"
                                      )
                                    }
                                  />
                                  <input
                                    value={
                                      item.ahuOffDateAndTime
                                        ? dayjs(item?.ahuOffDateAndTime).format(
                                            "DD-MM-YYYY hh:mm:ss a"
                                          )
                                        : ""
                                    }
                                    readOnly={true}
                                  />
                                </div>
                              </td>

                              <td>
                                <input
                                  value={item.volumeOfArea}
                                  // disabled
                                  onChange={(e) => {
                                    const newData = [
                                      ...editData.FoggingSolutionRecords,
                                    ];
                                    newData[index].volumeOfArea =
                                      e.target.value;
                                    setEditData({
                                      ...editData,
                                      FoggingSolutionRecords: newData,
                                    });
                                  }}
                                  readOnly={
                                    [3, 2, 4].includes(
                                      userDetails.roles[0].role_id
                                    ) ||
                                    !isFieldEnabledByFlow(
                                      item,
                                      "volumeOfArea"
                                    ) ||
                                    !isFieldEditable(item, "volumeOfArea")
                                  }
                                />
                              </td>

                              <td className="relative align-middle">
                                <input
                                  value={item.foggingSolutionQty}
                                  // disabled
                                  onChange={(e) => {
                                    const newData = [
                                      ...editData.FoggingSolutionRecords,
                                    ];
                                    newData[index].foggingSolutionQty =
                                      e.target.value;
                                    setEditData({
                                      ...editData,
                                      FoggingSolutionRecords: newData,
                                    });
                                  }}
                                  readOnly={
                                    [3, 2, 4].includes(
                                      userDetails.roles[0].role_id
                                    ) ||
                                    !isFieldEnabledByFlow(
                                      item,
                                      "foggingSolutionQty"
                                    ) ||
                                    !isFieldEditable(item, "foggingSolutionQty")
                                  }
                                />
                              </td>
                              <td className="!text-center !justify-center">
                                <div className="flex text-nowrap items-center gap-x-2 justify-center">
                                  <input
                                    type="checkbox"
                                    checked={!!item.foggingStartTime}
                                    className="h-4 w-4 cursor-pointer"
                                    style={{ marginLeft: "8px" }}
                                    onChange={(e) => {
                                      const newData = [
                                        ...editData.FoggingSolutionRecords,
                                      ];

                                      if (e.target.checked) {
                                        newData[index].foggingStartTime =
                                          dayjs().toISOString();
                                      } else {
                                        newData[index].foggingStartTime = "";
                                      }

                                      setEditData({
                                        ...editData,
                                        FoggingSolutionRecords: newData,
                                      });
                                    }}
                                    disabled={
                                      [3, 2, 4].includes(
                                        userDetails.roles[0].role_id
                                      ) ||
                                      !isFieldEditable(
                                        item,
                                        "foggingStartTime"
                                      ) ||
                                      !isFieldEnabledByFlow(
                                        item,
                                        "foggingStartTime"
                                      )
                                    }
                                  />
                                  <input
                                    value={
                                      item?.foggingStartTime
                                        ? dayjs(item?.foggingStartTime).format(
                                            "DD-MM-YYYY hh:mm:ss a"
                                          )
                                        : ""
                                    }
                                    readOnly={true}
                                  />
                                </div>
                              </td>

                              <td className="!text-center !justify-center">
                                <div>
                                  <div className="flex text-nowrap items-center gap-x-2 justify-center">
                                    <input
                                      className="h-4 w-4 cursor-pointer"
                                      type="checkbox"
                                      checked={!!item.foggingEndTime}
                                      style={{ marginLeft: "8px" }}
                                      onChange={(e) => {
                                        const newData = [
                                          ...editData.FoggingSolutionRecords,
                                        ];

                                        if (e.target.checked) {
                                          newData[index].foggingEndTime =
                                            dayjs().toISOString();
                                        } else {
                                          newData[index].foggingEndTime = "";
                                        }

                                        setEditData({
                                          ...editData,
                                          FoggingSolutionRecords: newData,
                                        });
                                      }}
                                      disabled={
                                        [3, 2, 4].includes(
                                          userDetails.roles[0].role_id
                                        ) ||
                                        !isFieldEditable(
                                          item,
                                          "foggingEndTime"
                                        ) ||
                                        !isFieldEnabledByFlow(
                                          item,
                                          "foggingEndTime"
                                        )
                                      }
                                    />
                                    <input
                                      value={
                                        item?.foggingEndTime
                                          ? dayjs(item?.foggingEndTime).format(
                                              "DD-MM-YYYY hh:mm:ss a"
                                            )
                                          : ""
                                      }
                                      readOnly={true}
                                    />
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <div className="flex text-nowrap items-center gap-x-2 justify-center">
                                    <input
                                      className="h-4 w-4 cursor-pointer"
                                      type="checkbox"
                                      checked={!!item.checked_by}
                                      onChange={(e) => {
                                        const newData = [
                                          ...editData.FoggingSolutionRecords,
                                        ];
                                        if (e.target.checked) {
                                          newData[index].checked_by =
                                            location?.state?.initiator_name;
                                        }else{
                                          newData[index].checked_by = "";
                                        }
                                        setEditData({
                                          ...editData,
                                          FoggingSolutionRecords: newData,
                                        });
                                      }}
                                      disabled={
                                        [3, 2, 4].includes(
                                          userDetails.roles[0].role_id
                                        ) ||
                                        !isFieldEditable(
                                          item,
                                          "checked_by"
                                        ) ||
                                        !isFieldEnabledByFlow(
                                          item,
                                          "checked_by"
                                        )
                                      }
                                    />
                                    {item.checked_by && (
                                      <p>{item.checked_by}</p>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <div className="flex text-nowrap items-center gap-x-2 justify-center">
                                    <input
                                      className="h-4 w-4 cursor-pointer"
                                      type="checkbox"
                                      style={{ marginLeft: "8px" }}
                                      checked={!!item.ahuOnDateAndTime}
                                      onChange={(e) => {
                                        if (
                                          !isFieldEnabledByFlow(
                                            item,
                                            "ahuOnDateAndTime"
                                          )
                                        ) {
                                          toast.warn(
                                            "AHU can only be turned ON after 3 Minutes of OFF time."
                                          );
                                          return;
                                        }
                                        const newData = [
                                          ...editData.FoggingSolutionRecords,
                                        ];

                                        if (e.target.checked) {
                                          newData[index].ahuOnDateAndTime =
                                            dayjs().toISOString();
                                        } else {
                                          newData[index].ahuOnDateAndTime = "";
                                        }

                                        setEditData({
                                          ...editData,
                                          FoggingSolutionRecords: newData,
                                        });
                                      }}
                                      disabled={
                                        [2, 3, 4].includes(
                                          userDetails.roles[0].role_id
                                        ) || !ifAhuOnDateAndTimeEditable(item)
                                      }
                                    />
                                    <input
                                      value={
                                        item.ahuOnDateAndTime
                                          ? dayjs(item.ahuOnDateAndTime).format(
                                              "DD-MM-YYYY hh:mm:ss a"
                                            )
                                          : ""
                                      }
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div>
                                  <div className="flex text-nowrap items-center gap-x-2 justify-center">
                                    <input
                                      className="h-4 w-4 cursor-pointer"
                                      type="checkbox"
                                      checked={!!item.reviewed_by}
                                      onChange={(e) => {
                                        const newData = [
                                          ...editData.FoggingSolutionRecords,
                                        ];
                                        if (e.target.checked) {
                                          newData[index].reviewed_by =
                                            reviewed_by;
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
                                          FoggingSolutionRecords: newData,
                                        });
                                      }}
                                      disabled={
                                        [1, 3].includes(
                                          userDetails.roles[0].role_id
                                        ) ||
                                        !canReviewerEdit(item) ||
                                        !isFieldEnabledByFlow(
                                          item,
                                          "reviewed_by"
                                        )
                                      }
                                    />
                                    {item.reviewed_by && (
                                      <p>{item.reviewed_by}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={item.remarks}
                                  onChange={(e) => {
                                    const newData = [
                                      ...editData.FoggingSolutionRecords,
                                    ];
                                    newData[index].remarks = e.target.value;
                                    setEditData({
                                      ...editData,
                                      FoggingSolutionRecords: newData,
                                    });
                                  }}
                                  disabled={
                                    [1, 3].includes(
                                      userDetails.roles[0].role_id
                                    ) ||
                                    !canReviewerEdit(item) ||
                                    !isFieldEnabledByFlow(item, "remarks")
                                  }
                                />
                              </td>
                              <td style={{ width: "200px" }}>
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
                                      ) ||
                                      !isRowEditable(item) ||
                                      !isFieldEnabledByFlow(
                                        item,
                                        "supporting_docs"
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td>
                                {item.reviewed_by
                                  ? "Closed"
                                  : "Open"}
                              </td>
                              {/*  
                             <td>
                               <DeleteIcon onClick={() => deleteRow(index)} />
                               {item.limit !== "" &&
                                 (item.limit < 0.6 || item.limit > 2.6) && (
                                   <button
                                     className="deviation-btn"
                                     onClick={() => {
                                       navigate("/chart");
                                     }}
                                   >
                                     Launch Deviation
                                   </button>
                                 )}
                             </td> */}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="14" className="!text-center">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* <div className="group-input flex flex-col gap-4 mt-4 items-start">
                     <div className="group-input mt-4">
                       <label
                       htmlFor="additionalAttachment"
                       className="color-label"
                       name="additionalAttachment"
                       >
                         Additional Attachment{" "}
                         <span className="text-sm text-zinc-600">
                           (If / Any)
                         </span>{" "}
                         :
                       </label>
                       <div>
                         {editData.additionalAttachment ? (
                           <div className="flex items-center gap-x-4 ml-3">
                             <button
                               className="py-1 bg-blue-500 hover:bg-blue-600 text-white px-3 rounded"
                               type="button"
                               onClick={() =>
                                 document
                                   .getElementById("additionalAttachment")
                                   .click()
                               }
                             >
                               Change File
                             </button>
                             <h3 className="flex items-center">
                               <span className="py-1 bg-zinc-300 px-2 rounded-md mr-3">
                                 Selected File:
                               </span>
                               <a
                                 href={
                                   editData.additionalAttachment instanceof File
                                     ? URL.createObjectURL(
                                         editData.additionalAttachment
                                       )
                                     : editData.additionalAttachment
                                 }
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-600 underline mr-1"
                               >
                                 {editData?.additionalAttachment?.name?.slice(
                                   0,
                                   30
                                 ) || editData?.additionalAttachment?.slice(46)}
                               </a>
                               {editData.additionalAttachment.name && (
                                 <button
                                   className="text-red-500 hover:text-red-700 text-lg"
                                   type="button"
                                   onClick={() =>
                                     setEditData({
                                       ...editData,
                                       additionalAttachment: null,
                                     })
                                   }
                                 >
                                   ✖
                                 </button>
                               )}
                             </h3>
                           </div>
                         ) : (
                           <div>
                             <button
                               className="py-1 bg-[#0C5FC6] hover:bg-blue-600 text-white ml-3 px-3 rounded"
                               type="button"
                               onClick={() =>
                                 document
                                   .getElementById("additionalAttachment")
                                   .click()
                               }
                             >
                               Select File
                             </button>
                           </div>
                         )}
                         <input
                           type="file"
                           name="additionalAttachment"
                           id="additionalAttachment"
                           onChange={handleInitiatorFileChange}
                           style={{ display: "none" }}
                         />
                       </div>
                     </div>
 
                     <div className="flex flex-col w-full">
                       <label className="text-sm font-medium text-gray-900 mb-1">
                         Additional Info{" "}
                         <span className="text-sm text-zinc-600">
                           (If / Any)
                         </span>{" "}
                       </label>
                       <textarea
                         className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                         rows="4"
                         name="additionalInfo"
                         value={editData?.additionalInfo}
                         onChange={handleInputChange1}
                       ></textarea>
                     </div>
                   </div> */}
                </>
              ) : null}

              {/* {initiatorRemarks === true ? (
                 <>
                   <div className="form-flex">
                     <div className="group-input">
                       <label className="color-label">Initiator </label>
                       <div>
                         <input
                           type="text"
                           name="initiator"
                           value={editData.initiator_name}
                           readOnly
                         />
                       </div>
                     </div>
                     <div className="group-input">
                       <label className="color-label">Date of Initiation</label>
                       <div>
                         <input
                           type="text"
                           value={formatDate(editData.date_of_initiation)}
                           readOnly
                         />
                       </div>
                     </div>
                   </div>
                   <div className="form-flex">
                     <div className="group-input">
                       <label className="color-label">
                         Initiator Comment
                         {location.state?.stage === 1 &&
                           location.state?.initiator_id ===
                             userDetails.userId && (
                             <span style={{ color: "red", marginLeft: "2px" }}>
                               *
                             </span>
                           )}
                       </label>
                       <div className="instruction"></div>
                       <input
                         name="initiatorComment"
                         value={editData?.initiatorComment}
                         onChange={handleInputChange1}
                         readOnly={
                           location.state?.stage !== 1 ||
                           location.state?.initiator_id !== userDetails.userId
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
                       <div>
                         {editData.initiatorAttachment ? (
                           <div>
                             <button
                               type="button"
                               onClick={() =>
                                 document
                                   .getElementById("initiatorAttachment")
                                   .click()
                               }
                               disabled={
                                 location.state?.stage !== 1 ||
                                 location.state?.initiator_id !==
                                   userDetails.userId
                               }
                             >
                               Change File
                             </button>
                             <h3>
                               Selected File:{" "}
                               <a
                                 href={editData.initiatorAttachment}
                                 target="_blank"
                                 rel="noopener noreferrer"
                               >
                                 View File
                               </a>
                             </h3>
                           </div>
                         ) : (
                           <div>
                             <button
                               type="button"
                               onClick={() =>
                                 document
                                   .getElementById("initiatorAttachment")
                                   .click()
                               }
                               disabled={
                                 location.state?.stage !== 1 ||
                                 location.state?.initiator_id !==
                                   userDetails.userId
                               }
                             >
                               Select File
                             </button>
                           </div>
                         )}
                         <input
                           type="file"
                           name="initiatorAttachment"
                           id="initiatorAttachment"
                           onChange={handleInitiatorFileChange}
                           style={{ display: "none" }}
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
                       <label className="color-label">Reviewer </label>
                       <div>
                         <input
                           type="text"
                           name="reviewer"
                           value={editData?.reviewer?.name}
                           readOnly
                         />
                       </div>
                     </div>
                     <div className="group-input">
                       <label className="color-label">Date of Review</label>
                       <div>
                         <input
                           type="text"
                           value={formatDate(editData.date_of_review)}
                           readOnly
                         />
                       </div>
                     </div>
                   </div>
                   <div className="form-flex">
                     <div className="group-input">
                       <label className="color-label" htmlFor="reviewComment">
                         Review Comment
                         {location.state?.stage === 2 &&
                           location.state?.reviewer_id ===
                             userDetails.userId && (
                             <span style={{ color: "red", marginLeft: "2px" }}>
                               *
                             </span>
                           )}
                       </label>
                       <input
                         id="reviewComment"
                         name="reviewComment"
                         value={editData.reviewComment || ""}
                         onChange={handleInputChange1}
                         readOnly={
                           location.state?.stage !== 2 ||
                           location.state?.reviewer_id !== userDetails.userId
                         }
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
                       <div>
                         {editData.reviewerAttachment ? (
                           <div>
                             <button
                               type="button"
                               onClick={() =>
                                 document
                                   .getElementById("reviewerAttachment")
                                   .click()
                               }
                               disabled={
                                 location.state?.stage !== 2 ||
                                 location.state?.reviewer_id !==
                                   userDetails.userId
                               }
                             >
                               Change File
                             </button>
                             <h3>
                               Selected File:{" "}
                               <a
                                 href={editData.reviewerAttachment}
                                 target="_blank"
                                 rel="noopener noreferrer"
                               >
                                 View File
                               </a>
                             </h3>
                           </div>
                         ) : (
                           <div>
                             <button
                               type="button"
                               onClick={() =>
                                 document
                                   .getElementById("reviewerAttachment")
                                   .click()
                               }
                               disabled={
                                 location.state?.stage !== 2 ||
                                 location.state?.reviewer_id !==
                                   userDetails.userId
                               }
                             >
                               Select File
                             </button>
                           </div>
                         )}
                         <input
                           type="file"
                           name="reviewerAttachment"
                           id="reviewerAttachment"
                           onChange={handleReviewerFileChange}
                           style={{ display: "none" }}
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
                       <label className="color-label">Approver </label>
                       <div>
                         <input
                           type="text"
                           name="approver"
                           value={editData?.approver?.name}
                           readOnly
                         />
                       </div>
                     </div>
                     <div className="group-input">
                       <label className="color-label">Date of Approval</label>
                       <div>
                         <input
                           type="text"
                           value={formatDate(editData.date_of_approval)}
                           readOnly
                         />
                       </div>
                     </div>
                   </div>
                   <div className="form-flex">
                     <div className="group-input">
                       <label className="color-label" htmlFor="approverComment">
                         Approver Comment
                         {location.state?.stage === 3 &&
                           location.state?.approver_id ===
                             userDetails.userId && (
                             <span style={{ color: "red", marginLeft: "2px" }}>
                               *
                             </span>
                           )}
                       </label>
                       <input
                         id="approverComment"
                         name="approverComment"
                         value={editData.approverComment || ""}
                         onChange={handleInputChange1}
                         disabled={
                           location.state?.stage !== 3 ||
                           location.state?.approver_id !== userDetails.userId
                         }
                       />
                     </div>
                     <div className="group-input">
                       <label
                         htmlFor="approverAttachment"
                         className="color-label"
                         name="approverAttachment"
                       >
                         Approver Attachment
                       </label>
                       <div>
                         {editData.approverAttachment ? (
                           <div>
                             <button
                               type="button"
                               onClick={() =>
                                 document
                                   .getElementById("approverAttachment")
                                   .click()
                               }
                               disabled={
                                 location.state?.stage !== 3 ||
                                 location.state?.approver_id !==
                                   userDetails.userId
                               }
                             >
                               Change File
                             </button>
                             <h3>
                               Selected File:{" "}
                               <a
                                 href={editData.approverAttachment}
                                 target="_blank"
                                 rel="noopener noreferrer"
                               >
                                 View File
                               </a>
                             </h3>
                           </div>
                         ) : (
                           <div>
                             <button
                               type="button"
                               onClick={() =>
                                 document
                                   .getElementById("approverAttachment")
                                   .click()
                               }
                               disabled={
                                 location.state?.stage !== 3 ||
                                 location.state?.approver_id !==
                                   userDetails.userId
                               }
                             >
                               Select File
                             </button>
                           </div>
                         )}
                         <input
                           type="file"
                           name="approverAttachment"
                           id="approverAttachment"
                           onChange={handleApproverFileChange}
                           style={{ display: "none" }}
                         />
                       </div>
                     </div>
                   </div>
                 </>
               ) : null} */}
            </div>
            <div className="button-block" style={{ width: "100%" }}>
              {/* {location.state?.stage === 1
                 ? location.state?.initiator_id === userDetails.userId && (
                     <button
                       className="themeBtn"
                       onClick={() => {
                         setIsPopupOpen(true);
                         setPopupAction("sendFromOpenToReview"); // Set the action when opening the popup
                       }}
                     >
                       Send for Review
                     </button>
                   )
                 : location.state?.stage === 2
                 ? location.state?.reviewer_id === userDetails.userId && (
                     <>
                       <button
                         className="themeBtn"
                         onClick={() => {
                           setIsPopupOpen(true);
                           setPopupAction("sendFromReviewToApproval"); // Set the action when opening the popup
                         }}
                       >
                         Review Completed
                       </button>
                       <button
                         className="themeBtn"
                         onClick={() => {
                           setIsPopupOpen(true);
                           setPopupAction("sendFromReviewToOpen"); // Set the action when opening the popup
                         }}
                       >
                         More Info Required
                       </button>
                     </>
                   )
                 : location.state?.stage === 3
                 ? location.state?.approver_id === userDetails.userId && (
                     <>
                       <button
                         className="themeBtn"
                         onClick={() => {
                           setIsPopupOpen(true);
                           setPopupAction("sendFromApprovalToClosedDone"); // Set the action when opening the popup
                         }}
                       >
                         Approve elog
                       </button>
                       <button
                         className="themeBtn"
                         onClick={() => {
                           setIsPopupOpen(true);
                           setPopupAction("sendFromApprovalToOpen"); // Set the action when opening the popup
                         }}
                       >
                         More Info Required
                       </button>
                     </>
                   )
                 : null}
               {location.state?.stage === 1
                 ? userDetails.userId === location.state?.initiator_id && (
                     <button
                       className="themeBtn"
                       onClick={() => {
                         setIsPopupOpen(true);
                         setPopupAction("updateElog");
                       }}
                     >
                       Save
                     </button>
                   )
                 : null} */}
              {/* <button
                 className="themeBtn"
                 onClick={() => {
                   if (!deepEqual(location.state, editData)) {
                     alert("Please Save the data before exiting");
                   } else {
                     navigate(-1);
                   }
                 }}
               >
                 Exit
               </button> */}
            </div>
            {isPopupOpen && (
              <UserVerificationPopUp
                onClose={handlePopupClose}
                onSubmit={handlePopupSubmit}
              />
            )}
          </div>

          {/* {showFactorErrorModal && (
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
          )} */}
        </div>
      </div>
    </>
  );
};
export default FoggingSolutionEffective;
