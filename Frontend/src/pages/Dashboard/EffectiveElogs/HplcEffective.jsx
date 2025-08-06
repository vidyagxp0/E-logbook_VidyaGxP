import { useEffect, useMemo, useState } from "react";
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
const HplcEffective = () => {
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
      const hasRequiredFields =
        record.sample_name?.trim() !== "" &&
        record.reg_no.trim() !== "" &&
        record.no_of_injections?.trim() !== "" &&
        record.end_time?.trim() !== ""&&
        record.start_time?.trim() !== "";
      return hasRequiredFields;
    });

    console.log("Cleaned records:", cleanedData);

        const emptyRowsCount =
          editData?.hplcRecords.length - cleanedData.length;
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
    setEditData(location.state);
  }, [location.state]);

  const addRow = () => {
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
      const nextIndex = editData?.hplcRecords?.length || 0;

      const currentTime = new Date().toLocaleTimeString("en-US", options);
      const newRow = {
        date: dayjs().format("YYYY-MM-DD"),
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
        remarksOther: "",
        status: "Open",
      };
      setEditData((prevState) => ({
        ...prevState,
        hplcRecords: [...prevState?.hplcRecords, newRow],
      }));
    } else if (location.state == reviewer_id) {
      toast.warn("Only Initiator can add new Row here");
    } else if (location.state == approver_id) {
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
          : true;

      return matchInitiator && matchReviewer && matchStatus;
    });
  }, [
    editData?.hplcRecords,
    selectedInitiator,
    selectedReviewer,
    selectedStatus,
  ]);

  // const handleDeleteFile = (index) => {
  //   if (
  //     location.state?.stage === 1 &&
  //     location.state?.initiator_id === userDetails.userId
  //   ) {
  //     const updatedGridData = editData.hplcRecords.map(
  //       (item, i) => {
  //         if (i === index) {
  //           return { ...item, supporting_docs: null };
  //         }
  //         return item;
  //       }
  //     );
  //     setEditData((prevState) => ({
  //       ...prevState,
  //       hplcRecords: updatedGridData,
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
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const handleFileChange = (index, file) => {
    const updatedGridData = [...editData.hplcRecords];
    updatedGridData[index].supporting_docs = file;
    setEditData((prevState) => ({
      ...prevState,
      hplcRecords: updatedGridData,
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

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:1000/hplc/effective-chat-pdf/${formId}`,
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

  const isRowEditable = (item) => {
    const isInitiator = userDetails.userId == location.state?.initiator_id;
    const isNewRow = !item.form_id;
    return isInitiator ? isNewRow : true;
  };

   // Check if reviewer can edit a record (prevent changes after saving)
  const canReviewerEdit = (item) => {
    if (item.record_id && item.reviewed_by) {
      return true;
    }
    return true;
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
                : "IPC"}
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
                  <div>VidyaGxP Private Limited</div>
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

                  {/* Generate Empty Report Button */}
                  {/* <button
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
                             process: "HPLC",
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
                  <div>
                    <label> Start Date</label>
                    <input type="date" />
                  </div>
                  <div>
                    <label> End Date</label>
                    <input type="date" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div>
                    <label> Start Date and Time</label>
                    <input type="datetime-local" />
                  </div>
                  <div>
                    <label> End Date and Time</label>
                    <input type="datetime-local" />
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
                          <th>Date</th>
                          <th>Sample Name</th>
                          <th>Reg No./ Lot No.</th>
                          <th>Method Used</th>
                          <th>Parameter/Activity</th>
                          <th>Column No.</th>
                          <th className="text-nowrap">Start Time</th>
                          <th className="text-nowrap">End Time</th>
                          <th>No. of Injections</th>
                          <th>Done by</th>
                          <th>Checked By</th>
                          <th>Remarks</th>
                          <th className="text-center">Attachment</th>
                          {/* <th>Supporting Documents</th> */}
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}.</td>

                            <td className="w-24">
                              <input value={item?.date} type="text" readOnly />
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
                                  ) || !isRowEditable(item)
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
                                  ) || !isRowEditable(item)
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
                                  ) || !isRowEditable(item)
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
                                  ) || !isRowEditable(item)
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
                                  ) || !isRowEditable(item)
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
                                  const newData = [...editData.hplcRecords];
                                  if (e.target.checked) {
                                    newData[index].end_time =
                                      new Date().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: false,
                                      });
                                  } else {
                                    newData[index].end_time = "";
                                    newData[index].reviewed_by = "";
                                    newData[index].status = "Open";
                                    newData[index].remarks = "";
                                    newData[index].remarksType = "";
                                    newData[index].remarksOther = "";
                                  }
                                  setEditData({
                                    ...editData,
                                    hplcRecords: newData,
                                  });
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
                                  ) || !isRowEditable(item)
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
                                <div className="flex items-center gap-2">
                                  <select
                                    value={item.remarksType || ""}
                                    onChange={(e) => {
                                      const newData = [...editData.hplcRecords];
                                      newData[index].remarksType =
                                        e.target.value;
                                      if (e.target.value !== "Others") {
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
                                    <option value="OK">OK</option>
                                    <option value="Others">Others</option>
                                  </select>

                                  {item.remarksType === "Others" && (
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
                                        newData[index].remarks = e.target.value;
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
                            </td>

                            <td style={{ width: "200px" }}>
                                                          <div className="d-flex">
                                                            {(() => {
                                                              const isDisabled =
                                                                [3, 2, 4].includes(
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
                                                                [3, 2, 4].includes(
                                                                  userDetails.roles[0].role_id
                                                                ) || !isRowEditable(item)
                                                              }
                                                            />
                                                          </div>
                                                        </td>

                            <td>
                              {editData?.hplcRecords?.find(
                                (r) => r.record_id === item.record_id
                              )?.reviewed_by
                                ? "Closed"
                                : "Open"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* <div className="group-input flex flex-col gap-4 mt-4 items-start">
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
                    toast.warn("Please Save the data before exiting");
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
        </div>
      </div>
    </>
  );
};

export default HplcEffective;
