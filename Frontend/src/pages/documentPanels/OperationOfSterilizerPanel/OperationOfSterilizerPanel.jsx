import { useEffect, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import "../docPanel.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NoteAdd } from "@mui/icons-material";
import axios from "axios";
import UserVerificationPopUp from "../../../components/UserVerificationPopUp/UserVerificationPopUp";
import LaunchQMS from "../../../components/LaunchQMS/LaunchQMS";

const OperationOfSterilizerPanel = () => {
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const [initiatorRemarks, setInitiatorRemarks] = useState(false);
  const [reviewerRemarks, setReviewerRemarks] = useState(false);
  const [approverRemarks, setApproverRemarks] = useState(false);
  const location = useLocation();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const [editData, setEditData] = useState({
    initiator_name: "",
    status: "",
    description: "",
    OperationOfSterilizerRecords: [],
  });
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState(null);

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setPopupAction(null);
  };

  const handlePopupSubmit = (credentials) => {
    const data = {
      site_id: location.state?.site_id,
      form_id: location.state?.form_id,
      email: credentials?.email,
      password: credentials?.password,
      reviewComment: editData.reviewComment,
      approverComment: editData.approverComment,
    };
    data.initiatorDeclaration = credentials?.declaration;
    // if (
    //   parseFloat(editData.limit) < 0.6 ||
    //   parseFloat(editData.limit) > 2.6
    // ) {
    //   toast.error("The limit value must be between 0.6 and 2.6.");
    //   return;
    // }
    // editData.email = credentials.email;
    // editData.password = credentials.password;
    // editData.initiatorDeclaration = credentials?.declaration;
    // console.log(data, "datatatatatata");

    //   const requestOptions = {
    //     method: "PUT",
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("user-token")}`,
    //       "Content-Type": "multipart/form-data",
    //     },
    //     data: editData,
    //     url: "http://localhost:1000/operation-sterlizer/update",
    //   };

    //   axios(requestOptions)
    //     .then(() => {
    //       toast.success("Data saved successfully!");
    //       navigate("/dashboard");
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // };
    // console.log(editData, "editDataLoaded");

    // useEffect(() => {
    //   setEditData(location.state);
    // }, [location.state]);

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    if (popupAction === "sendFromOpenToReview") {
      data.initiatorDeclaration = credentials?.declaration;
      data.initiatorAttachment = editData?.initiatorAttachment;
      axios
        .put(
          "http://localhost:1000/operation-sterlizer/send-for-review",
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
          "http://localhost:1000/operation-sterlizer/send-review-to-approval",
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
          "http://localhost:1000/operation-sterlizer/send-review-to-open",
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
        .put("http://localhost:1000/operation-sterlizer/approve", data, config)
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
          "http://localhost:1000/operation-sterlizer/send-approval-to-open",
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
      if (editData.description === "") {
        toast.error("description is required");
        return;
      }
      if (
        editData?.DifferentialPressureRecords?.some(
          (record) =>
            record.differential_pressure === "" || record.remarks === ""
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
        url: "http://localhost:1000/operation-sterlizer/update",
      };

      axios(requestOptions)
        .then(() => {
          toast.success("Data saved successfully!");
          navigate("/dashboard");
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

  console.log(location.state.stage === 2);
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
  const addRow = () => {
    if (
      location.state?.stage === 1 &&
      location.state?.initiator_id === userDetails.userId
    ) {
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      };

      const currentTime = new Date().toLocaleTimeString("en-US", options);
      const newRow = {
        unique_id: generateUniqueId(),
        time: currentTime,
        date: date,
        air_pressure: "",
        steam_pressure: "",
        printer_ok: "",
        product_name: "",
        container_size: "",
        loaded_quantity: "",
        batch_no_lot_no: "",
        loading_time: "",
        d_well_period_start: "",
        d_well_period_end: "",
        unloading_time: "",
        cleaning_time_start: "",
        cleaning_time_end: "",
        cleaning_done_by: "",
        supporting_docs: null,
        checked_by: location?.state?.initiator_name,
      };
      setEditData((prevState) => ({
        ...prevState,

        OperationOfSterilizerRecords: [
          ...prevState.OperationOfSterilizerRecords,
          newRow,
        ],
      }));
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
      location.state?.stage === 1 &&
      location.state?.initiator_id === userDetails.userId
    ) {
      const updatedGridData = [...editData.OperationOfSterilizerRecords];
      updatedGridData.splice(index, 1);
      setEditData((prevState) => ({
        ...prevState,
        OperationOfSterilizerRecords: updatedGridData,
      }));
    }
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleDeleteFile = (index) => {
    if (
      location.state?.stage === 1 &&
      location.state?.initiator_id === userDetails.userId
    ) {
      const updatedGridData = editData.DifferentialPressureRecords.map(
        (item, i) => {
          if (i === index) {
            return { ...item, supporting_docs: null };
          }
          return item;
        }
      );
      setEditData((prevState) => ({
        ...prevState,
        DifferentialPressureRecords: updatedGridData,
      }));
    }
  };

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
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const handleFileChange = (index, file) => {
    const updatedGridData = [...editData.OperationOfSterilizerRecords];
    updatedGridData[index].supporting_docs = file;
    setEditData((prevState) => ({
      ...prevState,
      OperationOfSterilizerRecords: updatedGridData,
    }));
  };

  const handleInitiatorFileChange = (e) => {
    setEditData({ ...editData, initiatorAttachment: e.target.files[0] });
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
    ...editData,
  };

  async function generateReport() {
    // Create the confirmation popup container
    const confirmationContainer = document.createElement("div");
    confirmationContainer.style.position = "fixed";
    confirmationContainer.style.top = "20px"; // Adjusted top position
    confirmationContainer.style.left = "50%";
    confirmationContainer.style.transform = "translate(-50%, 0)";
    confirmationContainer.style.backgroundColor = "#ffffff";
    confirmationContainer.style.border = "1px solid #ccc";
    confirmationContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    confirmationContainer.style.padding = "20px";
    confirmationContainer.style.borderRadius = "5px";
    confirmationContainer.style.zIndex = "1000";
    confirmationContainer.style.width = "300px";

    // Create the confirmation message
    const confirmationMessage = document.createElement("div");
    confirmationMessage.textContent =
      "Are you sure you want to generate the PDF?";
    confirmationMessage.style.fontSize = "16px";
    confirmationMessage.style.marginBottom = "15px";

    // Create the buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.textAlign = "center";

    // Create the confirm button
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.style.padding = "10px 20px";
    confirmButton.style.margin = "0 10px";
    confirmButton.style.cursor = "pointer";
    confirmButton.style.border = "none";
    confirmButton.style.borderRadius = "5px";
    confirmButton.style.backgroundColor = "#4CAF50";
    confirmButton.style.color = "white";
    confirmButton.style.fontSize = "14px";

    // Create the cancel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.padding = "10px 20px";
    cancelButton.style.margin = "0 10px";
    cancelButton.style.cursor = "pointer";
    cancelButton.style.border = "none";
    cancelButton.style.borderRadius = "5px";
    cancelButton.style.backgroundColor = "#f44336";
    cancelButton.style.color = "white";
    cancelButton.style.fontSize = "14px";

    // Append buttons to the buttons container
    buttonsContainer.appendChild(confirmButton);
    buttonsContainer.appendChild(cancelButton);

    // Append message and buttons to the confirmation container
    confirmationContainer.appendChild(confirmationMessage);
    confirmationContainer.appendChild(buttonsContainer);

    // Append the confirmation container to the document body
    document.body.appendChild(confirmationContainer);

    // Add event listener to the confirm button
    confirmButton.addEventListener("click", async () => {
      try {
        // Close the confirmation popup
        confirmationContainer.remove();

        // Make API request to generate PDF
        const response = await axios({
          url: "http://localhost:1000/operation-sterlizer/generate-pdf",
          method: "POST",
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
          data: {
            reportData: reportData,
          },
        });

        // Create a blob URL for the PDF content
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create an anchor element to trigger the download
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `DP${reportData.form_id}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Clean up the blob URL
        window.URL.revokeObjectURL(url);

        // Display success message as styled popup
        const successMessage = document.createElement("div");
        successMessage.textContent = "PDF generated successfully!";
        successMessage.style.position = "fixed";
        successMessage.style.top = "20px";
        successMessage.style.left = "50%";
        successMessage.style.transform = "translateX(-50%)";
        successMessage.style.backgroundColor =
          "rgba(76, 175, 80, 0.8)"; /* Green for success */
        successMessage.style.color = "white";
        successMessage.style.padding = "15px";
        successMessage.style.borderRadius = "5px";
        successMessage.style.zIndex = "1000";
        successMessage.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        successMessage.style.fontSize = "14px";
        document.body.appendChild(successMessage);

        // Remove the success message after 3 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      } catch (error) {
        console.error("Error:", error);
        // Display error message as styled popup
        const errorMessage = document.createElement("div");
        errorMessage.textContent =
          "Failed to generate PDF. Please try again later.";
        errorMessage.style.position = "fixed";
        errorMessage.style.top = "20px";
        errorMessage.style.left = "50%";
        errorMessage.style.transform = "translateX(-50%)";
        errorMessage.style.backgroundColor =
          "rgba(244, 67, 54, 0.8)"; /* Red for error */
        errorMessage.style.color = "white";
        errorMessage.style.padding = "15px";
        errorMessage.style.borderRadius = "5px";
        errorMessage.style.zIndex = "1000";
        errorMessage.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        errorMessage.style.fontSize = "14px";
        document.body.appendChild(errorMessage);

        // Remove the error message after 3 seconds
        setTimeout(() => {
          errorMessage.remove();
        }, 3000);
      }
    });

    // Add event listener to the cancel button
    cancelButton.addEventListener("click", () => {
      // Close the confirmation popup
      confirmationContainer.remove();

      // Display cancel message as styled popup
      const cancelMessage = document.createElement("div");
      cancelMessage.textContent = "PDF generation canceled.";
      cancelMessage.style.position = "fixed";
      cancelMessage.style.top = "20px";
      cancelMessage.style.left = "50%";
      cancelMessage.style.transform = "translateX(-50%)";
      cancelMessage.style.backgroundColor =
        "rgba(183, 28, 28, 0.8)"; /* Dark red for cancel */
      cancelMessage.style.color = "white";
      cancelMessage.style.padding = "15px";
      cancelMessage.style.borderRadius = "5px";
      cancelMessage.style.zIndex = "1000";
      cancelMessage.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
      cancelMessage.style.fontSize = "14px";
      document.body.appendChild(cancelMessage);

      // Remove the cancel message after 3 seconds
      setTimeout(() => {
        cancelMessage.remove();
      }, 3000);
    });
  }

  return (
    <div>
      <HeaderTop />
      <LaunchQMS />
      <div id="main-form-container">
        <div id="config-form-document-page" className="min-w-full">
          <div className="top-block">
            <div>
              <strong> Record Name:&nbsp;</strong>Operation Of Sterilizer
            </div>
            <div>
              <strong> Site:&nbsp;</strong>
              {location.state?.site_id === 1
                ? "India"
                : location.state?.site_id === 2
                ? "Malaysia"
                : location.state?.site_id === 3
                ? "EMEA"
                : "EU"}
            </div>
            <div>
              <strong> Current Status:&nbsp;</strong>
              {location.state?.status}
            </div>
            <div>
              <strong> Initiated By:&nbsp;</strong>
              {location.state?.initiator_name}
            </div>
          </div>

          <div className="document-form">
            <div className="details-form-data">
              <div className="sop-type-header">
                <div className="logo">
                  <img src="/vidyalogo2.png" alt="..." />
                </div>
                <div className="main-head">
                  <div>VidyaGxP Private Limited</div>
                </div>
              </div>

              <div className="sub-head-2">Operation Of Sterilizer</div>
              <div className="outerDiv4">
                <div className="btn-forms">
                  <div
                    className={`${
                      location.state?.stage === 1
                        ? "btn-forms-isSelecteds"
                        : "btn-forms-selects"
                    }`}
                  >
                    OPENED
                  </div>
                  <div
                    className={`${
                      location.state?.stage === 2
                        ? "btn-forms-isSelecteds"
                        : "btn-forms-selects"
                    }`}
                  >
                    UNDER REVIEW
                  </div>
                  <div
                    className={`${
                      location.state?.stage === 3
                        ? "btn-forms-isSelecteds"
                        : "btn-forms-selects"
                    }`}
                  >
                    UNDER APPROVAL
                  </div>
                  <div
                    className={`${
                      location.state?.stage === 4
                        ? "btn-forms-isSelecteds"
                        : "btn-forms-selects"
                    }`}
                  >
                    CLOSED DONE
                  </div>
                </div>
              </div>
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
                        setApproverRemarks(false);
                    }}
                  >
                    General Information
                  </div>
                  <div
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
                  </div>
                  <div
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
                  </div>
                  <div
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
                  </div>
                </div>
                <button className="btn-forms-select" onClick={generateReport}>
                  Generate Report
                </button>
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

              {isSelectedGeneral === true ? (
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
                      <input
                        name="description"
                        type="text"
                        value={editData.description}
                        onChange={handleInputChange1}
                        readOnly={
                          location.state?.stage !== 1 ||
                          location.state?.initiator_id !== userDetails.userId
                        }
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
              ) : null}

              {isSelectedDetails === true ? (
                <>
                  <div>
                    <div className="AddRows d-flex">
                      <NoteAdd onClick={addRow} />
                      <div className="addrowinstruction"></div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                  <table>
                    <thead>
                      <tr>
                        <th rowSpan={2}>S no.</th>
                        <th rowSpan={2}>Unique Id</th>
                        <th rowSpan={2}>Date</th>
                        <th rowSpan={2}>Air Pressure (4-6 kg)</th>
                        <th rowSpan={2}>Steam Pressure (4-6 kg)</th>
                        <th rowSpan={2}>Printer Ok Yes/No</th>
                        <th rowSpan={2}>Product Name</th>
                        <th rowSpan={2}>Container size (ml)</th>
                        <th rowSpan={2}>Loaded quantity</th>
                        <th rowSpan={2}>Batch No.- Lot. No.</th>
                        <th rowSpan={2}>Loading Time</th>
                        <th rowSpan={1} colSpan={2}>
                          {" "}
                          D-well Period
                        </th>
                        <th rowSpan={2}>Unloading Time</th>
                        <th rowSpan={1} colSpan={2}>
                          Cleaning Time
                        </th>
                        <th rowSpan={2}>Cleaning Done By</th>
                        <th rowSpan={2}>Checked By</th>

                        {/* <th style={{ width: "300px" }}>Supporting Documents</th> */}
                        <th rowSpan={2}>Actions</th>
                      </tr>
                      <tr>
                        <th>Start</th>
                        <th>End</th>
                        <th>Start</th>
                        <th>End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editData?.OperationOfSterilizerRecords.map(
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
                              readOnly
                            />
                          </td>
                            <td>
                              <input
                                value={item.air_pressure}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].air_pressure = e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.steam_pressure}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].steam_pressure =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>

                            <td>
                              <input
                                value={item.printer_ok}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].printer_ok = e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.product_name}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].product_name = e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.container_size}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].container_size =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.loaded_quantity}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].loaded_quantity =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>

                            <td>
                              <input
                                value={item.batch_no_lot_no}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].batch_no_lot_no =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.loading_time}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].loading_time = e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.d_well_period_start}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].d_well_period_start =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.d_well_period_end}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].d_well_period_end =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.unloading_time}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].unloading_time =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.cleaning_time_start}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].cleaning_time_start =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.cleaning_time_end}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].cleaning_time_end =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.cleaning_done_by}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].cleaning_done_by =
                                    e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={item.checked_by}
                                onChange={(e) => {
                                  const newData = [
                                    ...editData.OperationOfSterilizerRecords,
                                  ];
                                  newData[index].checked_by = e.target.value;
                                  setEditData({
                                    ...editData,
                                    OperationOfSterilizerRecords: newData,
                                  });
                                }}
                                readOnly
                              />
                            </td>
                            <td>
                              <DeleteIcon onClick={() => deleteRow(index)} />
                            </td>
                          </tr>
                        )
                      )}
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
                </>
              ) : null}

              {reviewerRemarks === true ? (
                <>
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

                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label">Reviewer </label>
                      <div>
                        <input
                          type="text"
                          name="reviewer"
                          value={editData?.reviewer2?.name}
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
                </>
              ) : null}

              {approverRemarks === true ? (
                <>
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

                  <div className="form-flex">
                    <div className="group-input">
                      <label className="color-label">Approver </label>
                      <div>
                        <input
                          type="text"
                          name="approver"
                          value={editData?.approver2?.name}
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
                </>
              ) : null}
            </div>
            <div className="button-block" style={{ width: "100%" }}>
              {location.state?.stage === 1
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
                : null}
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
    </div>
  );
};

export default OperationOfSterilizerPanel;
