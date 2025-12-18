import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import HeaderTop from "../../../components/Header/HeaderTop";
// import "../docPanel.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NoteAdd } from "@mui/icons-material";
import axios from "axios";
import UserVerificationPopUp from "../../../components/UserVerificationPopUp/UserVerificationPopUp";
import LaunchQMS from "../../../components/LaunchQMS/LaunchQMS";
import TinyEditor from "../../../components/TinyEditor";
import { Checkbox, DatePicker } from "antd";


export default function DPREffective() {
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(true);
  const [initiatorRemarks, setInitiatorRemarks] = useState(false);
  const [reviewerRemarks, setReviewerRemarks] = useState(false);
  const [approverRemarks, setApproverRemarks] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formId, setFormId] = useState(null);
  const [isLoading1, setIsLoading1] = useState(false);

  const location = useLocation();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const UserName = JSON.parse(localStorage.getItem("Username"));

  const [reviewed_by, setReviewed_by] = useState(UserName?.name);
  const [approved_by, setApproved_by] = useState(UserName?.name);
  const [dateRange, setDateRange] = useState(null);
  const [showReviewerCheckedOnly, setShowReviewerCheckedOnly] = useState(false);


  const { RangePicker } = DatePicker;
    dayjs.extend(isSameOrAfter);
    dayjs.extend(isSameOrBefore);

  useEffect(() => {
    setReviewed_by(UserName?.name);
  }, []);

  useEffect(() => {
    setApproved_by(UserName?.name);
  }, []);

  const navState = location.state ?? {};


  const [editData, setEditData] = useState({
    initiator_name: "",
    status: "",
    description: "",
    department: "",
    compression_area: "",
    additionalAttachment: "",
    additionalInfo: "",
    DifferentialPressureRecords: [],
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
    const cleanedData = editData.DifferentialPressureRecords.filter(
      (record) =>
        record.differential_pressure !== "" ||
        record.remarks.trim() !== ""
    );

    const updatedEditData = {
      ...editData,
      DifferentialPressureRecords: cleanedData,
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
          "http://localhost:1000/differential-pressure/send-DP-elog-for-review",
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
          "http://localhost:1000/differential-pressure/send-DP-from-review-to-approval",
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
          "http://localhost:1000/differential-pressure/send-DP-elog-from-review-to-open",
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
        .put(
          "http://localhost:1000/differential-pressure/approve-DP-elog",
          data,
          config
        )
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
          "http://localhost:1000/differential-pressure/send-DP-elog-from-approval-to-open",
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
        editData?.DifferentialPressureRecords?.some(
          (record) => record.differential_pressure === ""
        )
      ) {
        toast.error("Please provide grid details!");
        return;
      }

      editData.email = credentials.email;
      editData.password = credentials.password;
      editData.initiatorDeclaration = credentials?.declaration;

      const myHeaders = {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "multipart/form-data",
      };

      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        data: editData,
        url: "http://localhost:1000/differential-pressure/update-differential-pressure",
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

  const INITIATOR_LOCKED_FIELDS = [

  "differential_pressure",
];

const REVIEWER_LOCKED_FIELDS = [
 
  "remarks",
  "supporting_docs",
  "reviewed_by",
];

const APPROWER_LOCKED_FIELDS=[
  "additionalInfo",
  "additionalAttachment",
]

const originalData = location.state;
const isAdditionalDataSaved =
  Boolean(originalData?.additionalInfo) ||
  Boolean(originalData?.additionalAttachment);


// Identify new row
const isNewRow = (item) => {
  if (!item) return false; // no row, treat as non-new
  return !item.record_id;
};


  
  

  const canReviewerEdit = (item) => {
    // find original version of this record by record_id
    const original = originalData?.DifferentialPressureRecords?.find(
      (o) => o.record_id === item.record_id
    );

    
    // If we found the original row
    if (original) {
      // If original remarksType was OK → Lock it
      if (original.remarks) {
        return false;
      }
    }

    // Otherwise allow editing
    return true;
  };

// MAIN EDITABLE LOGIC
const isFieldEditable = (item, fieldName) => {
  const roleId = Number(userDetails?.roles?.[0]?.role_id);

  // New row → always editable
  if (isNewRow(item)) return true;

  if (!item) {

    //  SAVE ke baad initiator + reviewer lock
    if (
      (roleId === 1 || roleId === 2) &&
      ["additionalInfo", "additionalAttachment"].includes(fieldName) &&
      isAdditionalDataSaved
    ) {
      return false;
    }

    if (roleId === 1 && INITIATOR_LOCKED_FIELDS.includes(fieldName)) return false;
    if (roleId === 2 && REVIEWER_LOCKED_FIELDS.includes(fieldName)) return false;
    if (roleId === 3 && APPROWER_LOCKED_FIELDS.includes(fieldName)) return false;

    return true;
  }
};


 const addRow = () => {
  const roleId = Number(userDetails?.roles?.[0]?.role_id);

  // Only Initiator (1) and Approver (5) can add rows
  if (roleId === 1 || roleId === 5) {

    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    const nextIndex = editData?.DifferentialPressureRecords?.length || 0;

    const currentTime = new Date().toLocaleTimeString("en-US", options);

    const newRow = {
      date: formatDate(Date.now()),
      time: currentTime,
      unique_id: `DPR000${nextIndex + 1}`,
      differential_pressure: "",
      remarks: "",
      // reviewed_by: "",
       
      approver_remarks: "",
      done_by: location?.state?.initiator_name,
      approved_by: "",
      reviewed_by: "",
       checked_by: "",  
      supporting_docs: null,
      isNew: true,        // optional (helps if you want new-row editable logic)
    };

    setEditData((prev) => ({
      ...prev,
      DifferentialPressureRecords: [
        ...prev.DifferentialPressureRecords,
        newRow,
      ],
    }));

    return;
  }

  // If unauthorized user tries to add row
  console.warn("Only Initiator or Approver can add a new row.");
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
      const updatedGridData = [...editData.DifferentialPressureRecords];
      const rowToDelete = updatedGridData[index];

      if (rowToDelete?.record_id) {
        toast.warn("Record Can't be deleted ");

        return;
      }

      // Allow deletion of rows without a `record_id`
      updatedGridData.splice(index, 1);
      setEditData((prevState) => ({
        ...prevState,
        DifferentialPressureRecords: updatedGridData,
      }));
    }
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e?.target;
    setEditData({ ...editData, [name]: value });
  };

  // const handleDeleteFile = (index) => {
  //   if (
  //     location.state?.stage === 1 &&
  //     location.state?.initiator_id === userDetails.userId
  //   ) {
  //     const updatedGridData = editData.DifferentialPressureRecords.map(
  //       (item, i) => {
  //         if (i === index) {
  //           return { ...item, supporting_docs: null };
  //         }
  //         return item;
  //       }
  //     );
  //     setEditData((prevState) => ({
  //       ...prevState,
  //       DifferentialPressureRecords: updatedGridData,
  //     }));
  //   }
  // };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Return empty if the input is falsy

    const utcDate = new Date(dateString);
    // Check if the date is valid
    if (isNaN(utcDate.getTime())) {
      return "";
    }

    return utcDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
      // hour12: false,
    });
  };

  const handleFileChange = (index, file) => {
    const updatedGridData = [...editData.DifferentialPressureRecords];
    updatedGridData[index].supporting_docs = file;
    setEditData((prevState) => ({
      ...prevState,
      DifferentialPressureRecords: updatedGridData,
    }));
  };

 const handleInitiatorFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setEditData((prev) => ({
    ...prev,
    additionalAttachment: file,
  }));
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
    title: "Differential Pressure",
    status: navState.status,
    blankRows: 17,
    form_id: navState.form_id,
    DifferentialPressureRecords: [],
  };
  const generateEmptyReport = async () => {
    setIsLoading1(true);
    try {
      const response = await axios.post(
        `http://localhost:1000/differential-pressure/blank-report/${formId}`,
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
      navState.site_id === 1
        ? "India"
        : navState.site_id === 2
        ? "Malaysia"
        : navState.site_id === 3
        ? "EMEA"
        : "EU",
    status: navState.status,
    initiator_name: navState.initiator_name,
    title: "Differential Pressure Record",
    ...editData,
  };

  useEffect(() => {
    if (reportData && reportData.form_id) {
      setFormId(reportData.form_id);
    }
  }, [reportData]);

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:1000/differential-pressure/effective-chat-pdf/${formId}`,
        {
          reportData: reportData,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { filename } = response.data; // Access filename from response.data

      const reportUrl = `/effective-view-report?formId=${formId}&filename=${filename}`;

      // Open the report in a new tab
      window.open(reportUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error opening chat PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTinyContent = (content) => {
    setEditData((prevState) => ({
      ...prevState,
      description: content,
    }));
  };

const filteredDifferentialRecords = useMemo(() => {
  if (!Array.isArray(editData?.DifferentialPressureRecords)) return [];

  let rows = editData.DifferentialPressureRecords;

  // Date filter
  if (dateRange) {
    const [start, end] = dateRange;
    rows = rows.filter((row) => {
      if (!row.date) return false;
      const rowDate = dayjs(row.date, "DD-MM-YYYY");
      return (
        rowDate.isSameOrAfter(start, "day") &&
        rowDate.isSameOrBefore(end, "day")
      );
    });
  }

  // Reviewer checked filter
  if (showReviewerCheckedOnly) {
    rows = rows.filter(
      (row) =>
        row.reviewed_by !== null &&
        row.reviewed_by !== undefined &&
        row.reviewed_by !== ""
    );
  }

  return rows;
}, [
  editData?.DifferentialPressureRecords,
  dateRange,
  showReviewerCheckedOnly,
]);


// console.log(showReviewerCheckedOnly, "showReviewerCheckedOnly");


  return (
    <>
      <HeaderTop />
      <div id="three-col-layout">
        <div id="config-form-document-page" className="min-w-full">
          <div className="top-block" style={{  gridTemplateColumns:"repeat(3, 1fr)"}}>
            <div>
              <strong> Record Name:&nbsp;</strong>Differential Pressure
            </div>
            <div>
              <strong> Site:&nbsp;</strong>
              {location.state?.site_id === 1
                ? "India"
                : location.state?.site_id === 2
                ? "Malaysia"
                : location.state?.site_id === 3
                ? "Medicef"
                : "Medicef"}
            </div>
            {/* <div>
              <strong> Current Status:&nbsp;</strong>
              {location.state?.status}
            </div> */}
            <div>
              <strong> Initiated By:&nbsp;</strong>
              {location.state?.initiator_name}
            </div>
          </div>

          <div className="document-form">
            <div className="details-form-data">
              <div className="sop-type-header">
                <div className="logo">
                  <img src="/vidyalogo21.png" alt="..." />
                </div>
                <div className="main-head">
                  <div>VidyaGxP Private Limited</div>
                </div>
              </div>
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
                  Differential Pressure Record
                </span>

                <div className="flex flex-wrap gap-3 items-center justify-center">
                  {/* Audit Trail Button */}
                  <button
                    className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                    onClick={() =>
                      navigate("/effective-audit-trail", {
                        state: {
                          formId: location.state?.form_id,
                          process: "Differential Pressure",
                        },
                      })
                    }
                  >
                    Audit Trail
                  </button>

                  {/* Generate Empty Report Button
                  <button
                    onClick={generateEmptyReport}
                    className="flex items-center justify-center relative px-4 py-2 border-none rounded-md bg-white text-sm  cursor-pointer text-black font-normal"
                  >
                    {isLoading1 ? (
                      <>
                        <span>Blank Draft</span>
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
                      "Blank Draft"
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
                  <button
                    onClick={generateReport}
                    className="flex items-center justify-center relative px-4 py-2 border-none rounded-md bg-white text-sm  cursor-pointer text-black font-normal"
                  >
                    {isLoading ? (
                      <>
                        <span>Generate Report</span>
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
                    <style>
                      {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
                    </style>
                  </button>

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
                  <button
                    className="px-6 py-2 text-sm font-medium text-black bg-white border border-gray-300 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-black hover:border-gray-600 hover:shadow-lg"
                    onClick={() => {
                      setIsPopupOpen(true);
                      setPopupAction("updateElog");
                    }}
                  >
                    Save
                  </button>
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
                          process: "Differential Pressure",
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
                  {/* <div className="group-input">
                    <label className="color-label">Department</label>

                    <div className="instruction">&nbsp;</div>
                    <select
                      className="form-control"
                      name="department"
                      value={editData?.department}
                      onChange={handleInputChange1}
                      disabled={
                        location.state?.stage !== 1 ||
                        location.state?.initiator_id !== userDetails.userId
                      }
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

                    <div className="instruction">&nbsp;</div>
                    <select
                      className="form-control"
                      name="compression_area"
                      value={editData?.compression_area}
                      onChange={handleInputChange1}
                      disabled={
                        location.state?.stage !== 1 ||
                        location.state?.initiator_id !== userDetails.userId
                      }
                    >
                      <option value="Select a value">Select a value</option>
                      <option value="Area 1">Area 1</option>
                      <option value="Area 2">Area 2</option>
                      <option value="Area 3">Area 3</option>
                      <option value="Area 4">Area 4</option>
                      <option value="Area 5">Area 5</option>
                      <option value="Area 6">Area 6</option>
                    </select>
                  </div> */}
                  
                  

                    <div className="flex flex-wrap items-end gap-6 mt-4 p-4 bg-white border border-blue-500 rounded-lg shadow-sm filter-input">

                      {/* Date Range */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-800 mb-1">
                          Date Range
                        </label>
                        <RangePicker
                          onChange={(dates) => setDateRange(dates)}
                          className="w-[260px]"
                          placeholder={["Start Date", "End Date"]}
                        />
                      </div>

                      {/* Reviewer Checked */}
                      <div className="flex flex-col items-start h-[56px]">
                        <span className="text-sm font-medium text-gray-800 mb-2">
                          Reviewed Elogs
                        </span>
                        <Checkbox
                          checked={showReviewerCheckedOnly}
                          onChange={(e) => setShowReviewerCheckedOnly(e.target.checked)}
                        />
                      </div>

                    </div>
                    <div className="group-input">

  {/* ROW 1 */}
  <div className="grid grid-cols-2 gap-6 mt-4">
    <div className="flex flex-col">
      <label className="color-label text-lg">Area Name</label>
      <input
        type="text"
        className="border border-gray-500 rounded-md p-2 w-full"
        name="area_name"
        value={editData?.area_name || ""}
      />
    </div>

    <div className="flex flex-col">
      <label className="color-label text-lg">Acceptance Criteria</label>
      <input
        type="text"
        className="border border-gray-500 rounded-md p-2 w-full"
        name="acceptance_criteria"
        value={editData?.acceptance_criteria || ""}
      />
    </div>
  </div>

  {/* ROW 2 */}
  <div className="grid grid-cols-2 gap-6 mt-2">
    <div className="flex flex-col">
      <label className="color-label text-lg">Differential Pressure</label>
      <input
        type="text"
        className="border border-gray-500 rounded-md p-2 w-full"
        name="differential_pressure"
        value={editData?.differential_pressure || ""}
      />
    </div>

    <div className="flex flex-col">
      <label className="color-label text-lg">Instrument ID No</label>
      <input
        type="text"
        className="border border-gray-500 rounded-md p-2 w-full"
        name="instrument_id_no"
        value={editData?.instrument_id_no || ""}
      />
    </div>
  </div>

  {/* ROW 3 */}
  <div className="grid grid-cols-2 gap-6 mt-2">
    <div className="flex flex-col">
      <label className="color-label text-lg">Department</label>
      <select
        className="form-control"
        disabled
        name="department"
        value={(editData?.department || "").trim()}
        onChange={handleInputChange1}
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
        <option value="Plasma Sourcing Group">
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

    <div className="flex flex-col">
      <label className="color-label text-lg">
        Compression Area with respect to Corridor
      </label>
      <select
        className="form-control"
        name="compression_area"
        value={(editData?.compression_area || "").trim()}
        onChange={handleInputChange1}
        disabled
      >
        <option value="">Select a value</option>
        <option value="Area 1">Area 1</option>
        <option value="Area 2">Area 2</option>
        <option value="Area 3">Area 3</option>
        <option value="Area 4">Area 4</option>
        <option value="Area 5">Area 5</option>
        <option value="Area 6">Area 6</option>
      </select>
    </div>
  </div>

  {/* ROW 4 */}
  <div className="grid grid-cols-2 gap-6 mt-2">
    <div className="flex flex-col">
      <label className="color-label text-lg">Limit</label>
      <input
        name="limit"
        type="number"
        disabled
        value={editData?.limit || ""}
        readOnly={[2, 3, 4].includes(
          userDetails.roles[0].role_id
        )}
      />
    </div>
  </div>

</div>

                  <div>
                    <div className="AddRows d-flex">
                      <NoteAdd onClick={addRow} />
                      <div className="addrowinstruction"></div>
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Sr no.</th>
                        <th>Unique ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Differential Pressure</th>
                        <th>Done By</th>
                        <th>Checked By</th>
                        <th>Supporting Docs</th>
                        <th>Remark</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDifferentialRecords.map(
                        (item, index) => (
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
                                value={item?.differential_pressure}
                                disabled={!isFieldEditable(item, "differential_pressure")}
                                className={`${
                                  Number(item?.differential_pressure) <=
                                  Number(editData?.limit)
                                    ? "text-green-500"
                                    : Number(item?.differential_pressure) >
                                      Number(editData?.limit)
                                    ? "text-red-600"
                                    : ""
                                }`}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.DifferentialPressureRecords,
                                  ];
                                  newData[index].differential_pressure =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    DifferentialPressureRecords: newData,
                                  });
                                }}
                                readOnly={[3, 2, 4].includes(
                                  userDetails.roles[0].role_id
                                )}
                              />
                            </td>
                            <td>
                            <input
                              value={item.done_by}
                              onChange={(e) => {
                                const newData = [...editData.DifferentialPressureRecords];
                                newData[index].done_by = e.target.value;
                                setEditData({
                                  ...editData,
                                  DifferentialPressureRecords: newData,
                                });

                                
                              }}
                              disabled
                            />
                          </td>
                           <td>
  <div>
    <div className="flex text-nowrap items-center gap-x-2 justify-center">
      <input
        className="h-4 w-4 cursor-pointer"
        type="checkbox"
        checked={!!item.reviewed_by}
        onChange={(e) => {
          const newData = [...editData.DifferentialPressureRecords];
          if (e.target.checked) {
            newData[index].reviewed_by = reviewed_by;
          } else {
            newData[index].reviewed_by = "";
          }
          setEditData({
            ...editData,
            DifferentialPressureRecords: newData,
          });
        }}
        disabled={
          !!item.reviewed_by || // already checked hone par disable
          [1, 3].includes(userDetails.roles[0].role_id) || 
          !canReviewerEdit(item)
        }
      />
      {item.reviewed_by && <p>{item.reviewed_by}</p>}
    </div>
  </div>
</td>

                            {/* <td>
                              <input
                                value={item.approver_remarks}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.DifferentialPressureRecords,
                                  ];
                                  newData[index].approver_remarks =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    DifferentialPressureRecords: newData,
                                  });
                                }}
                                disabled={[1, 2].includes(
                                  userDetails.roles[0].role_id
                                )}
                              />
                            </td>
                            <td>
                              <div>
                                <div className="flex text-nowrap items-center gap-x-2 justify-center">
                                  <input
                                    className="h-4 w-4 cursor-pointer"
                                    type="checkbox"
                                    checked={!!item.approved_by}
                                    onChange={(e) => {
                                      const newData = [
                                        ...editData.DifferentialPressureRecords,
                                      ];
                                      if (e.target.checked) {
                                        newData[index].approved_by =
                                          approved_by;
                                      } else {
                                        newData[index].approved_by = "";
                                      }
                                      setEditData({
                                        ...editData,
                                        DifferentialPressureRecords: newData,
                                      });
                                    }}
                                    disabled={[1, 2].includes(
                                      userDetails.roles[0].role_id
                                    )}
                                  />
                                  {item.approved_by && (
                                    <p>{item.approved_by}</p>
                                  )}
                                </div>
                              </div>
                            </td>

                          */}  
                            
                            
                            <td style={{ width: "250px" }}>
                              <div className="d-flex">
                                {item.supporting_docs ? (
                                  <div className="file-upload-wrapper">
                                    <button
                                      type="button"
                                      className="btn-upload"
                                       disabled={!isFieldEditable( item, "supporting_docs")}
                                      onClick={() =>
                                        document
                                          .getElementsByName("supporting_docs")
                                          [index].click()
                                      }
                                      readOnly={
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
                                        href={item.supporting_docs}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View File
                                      </a>
                                      <DeleteIcon
                                    style={{ color: "red", cursor: "pointer" }}
                                    onClick={() => handleDeleteFile(index)}
                                  /> 
                                     </h3>
                                  </div>
                                ) : (
                                  <div className="file-upload-wrapper">
                                    <button
                                      type="button"
                                      className="btn-upload"
                                      onClick={() =>
                                        document
                                          .getElementsByName("supporting_docs")
                                          [index].click()
                                      }
                                      readOnly={[3, 2, 4].includes(
                                        userDetails.roles[0].role_id
                                      )}
                                    >
                                      Select File
                                    </button>
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
                              <input
                                value={item.remarks}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.DifferentialPressureRecords,
                                  ];
                                  newData[index].remarks = e.target.value;
                                  setEditData({
                                    ...editData,
                                    DifferentialPressureRecords: newData,
                                  });
                                }}
                                disabled={
                                        [1, 3].includes(
                                          userDetails.roles[0].role_id
                                        ) || !canReviewerEdit(item)
                                      }
                              />
                            </td>

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
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                  <div className="group-input flex flex-col gap-4 mt-4 items-start">
                    <div className="group-input mt-4">
                      <label
                      // htmlFor="additionalAttachment"
                      // className="color-label"
                      // name="additionalAttachment"
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
                              disabled={!isFieldEditable( null, "additionalAttachment")}
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
                        disabled={!isFieldEditable( null, "additionalInfo")}
                        onChange={handleInputChange1}
                      ></textarea>
                    </div>
                  </div>
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
              <button
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
