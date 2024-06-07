import { useEffect, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import "../docPanel.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { NoteAdd } from "@mui/icons-material";
import axios from "axios";
import UserVerificationPopUp from "../../../components/UserVerificationPopUp/UserVerificationPopUp";

export default function DPRpanel() {
  // const editedData = useSelector((state) => state.dprPanelData.selectedRow);
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
  const [isSelectedDetails, setIsSelectedDetails] = useState(false);
  const location = useLocation();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const [editData, setEditData] = useState({
    initiator_name: "",
    status: "",
    description: "",
    department: "",
    compression_area: "",
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
    const data = {
      site_id: location.state?.site_id,
      form_id: location.state?.form_id,
      email: credentials?.email,
      password: credentials?.password,
      reviewComment: editData.reviewComment,
      approverComment: editData.approverComment,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    };

    if (popupAction === "sendFromOpenToReview") {
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
    } else if (popupAction === "sendFromApprovalToApproved") {
      axios
        .put("http://localhost:1000/differential-pressure/approve-DP-elog", data, config)
        .then(() => {
          toast.success("Elog successfully approved");
          navigate(-1);
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message || "Couldn't approve elog!!"
          );
        });
    } else if (popupAction === "sendFromApprovalToOpen") {
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
    }

    setIsPopupOpen(false);
    setPopupAction(null);
  };

  useEffect(() => {
    setEditData(location.state);
  }, [location.state]);

  const addRow = () => {
    if (
      location.state?.stage === 1 &&
      location.state?.initiator_id === userDetails.userId
    ) {
      const currentTime = new Date().toLocaleTimeString();
      const newRow = {
        unique_id: generateUniqueId(),
        time: currentTime,
        differential_pressure: "",
        remarks: "",
        checked_by: location?.state?.initiator_name,
        supporting_docs: null,
      };
      setEditData((prevState) => ({
        ...prevState,

        DifferentialPressureRecords: [
          ...prevState.DifferentialPressureRecords,
          newRow,
        ],
      }));
    }
  };

  const deleteRow = (index) => {
    if (
      location.state?.stage === 1 &&
      location.state?.initiator_id === userDetails.userId
    ) {
      const updatedGridData = [...editData.DifferentialPressureRecords];
      updatedGridData.splice(index, 1);
      setEditData((prevState) => ({
        ...prevState,
        DifferentialPressureRecords: updatedGridData,
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

  const handleFileChange = (index, file) => {
    const updatedGridData = [...editData.DifferentialPressureRecords];
    updatedGridData[index].supporting_docs = file;
    setEditData((prevState) => ({
      ...prevState,
      DifferentialPressureRecords: updatedGridData,
    }));
  };

  const handleSave = () => {
    if (parseFloat(editData.limit) < 0.6 || parseFloat(editData.limit) > 2.6) {
      toast.error("The limit value must be between 0.6 and 2.6.");
      return;
    }
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
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const generateUniqueId = () => {
    return `UU0${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
  };

  return (
    <>
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-page">
          <div className="top-block">
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
              <div className="sub-head-2">Differential Pressure Record</div>

              <div className="outerDiv5">
                <div className="btn-forms">
                  <div
                    className={`${
                      isSelectedGeneral === true
                        ? "btn-forms-isSelected"
                        : "btn-forms-select"
                    }`}
                    onClick={() => {
                      setIsSelectedGeneral(true), setIsSelectedDetails(false);
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
                      setIsSelectedDetails(true), setIsSelectedGeneral(false);
                    }}
                  >
                    Details
                  </div>
                </div>
                <div className="analytics-btn">
                  <button
                    className="btn-print"
                    onClick={() => navigate("/analytics")}
                  >
                    Analytics
                  </button>
                  {/* <PDFDownloadLink
                    document={<DynamicPdf elog={editData} />}
                    fileName="VidyaGxP.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? (
                        <button className="btn-print">Wait</button>
                      ) : (
                        <button className="btn-print">Print</button>
                      )
                    }
                  </PDFDownloadLink> */}
                </div>
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
                        value={editData?.date_of_initiation?.split("T")[0]}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="group-input">
                    <label className="color-label">Description</label>
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
                  <div className="group-input">
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
                  </div>

                  <div className="group-input">
                    <label className="color-label">Limit</label>
                    <div className="instruction"></div>
                    <input
                      name="limit"
                      type="number"
                      className={`${
                        editData?.limit < 0.6
                          ? "limit"
                          : editData?.limit > 2.6
                          ? "limit"
                          : ""
                      }`}
                      value={editData?.limit}
                      onChange={handleInputChange1}
                      readOnly={
                        location.state?.stage !== 1 ||
                        location.state?.initiator_id !== userDetails.userId
                      }
                    />
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
                        <th>S no.</th>
                        <th>Unique Id</th>
                        <th>Time</th>
                        <th>Differential Pressure</th>
                        <th>Remark</th>
                        <th>Checked By</th>
                        <th>Supporting Documents</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editData?.DifferentialPressureRecords.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.unique_id}</td>
                            <td>
                              <input value={item.time} readOnly />
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
                                readOnly={
                                  location.state?.stage !== 1 ||
                                  location.state?.initiator_id !==
                                    userDetails.userId
                                }
                              />
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
                                    ...editData.DifferentialPressureRecords,
                                  ];
                                  newData[index].checked_by = e.target.value;
                                  setEditData({
                                    ...editData,
                                    DifferentialPressureRecords: newData,
                                  });
                                }}
                                readOnly
                              />
                            </td>
                            <td style={{ width: "250px" }}>
                              <div className="d-flex">
                                <input
                                  // value={item.supporting_docs}
                                  type="file"
                                  name='supporting_docs'
                                  onChange={(e) =>
                                    handleFileChange(index, e.target.files[0])
                                  }
                                />

                                {item.supporting_docs && (
                                  <DeleteIcon
                                    style={{ color: "red" }}
                                    onClick={() => handleDeleteFile(index)}
                                  />
                                )}
                              </div>
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

                  <div className="group-input">
                    <label htmlFor="reviewComment">Review Comments</label>
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
                    <label htmlFor="approverComment">Approver Comments</label>
                    <input
                      id="approverComment"
                      name="approverComment"
                      value={editData.approverComment || ""}
                      onChange={handleInputChange1}
                      readOnly={
                        location.state?.stage !== 3 ||
                        location.state?.approver_id !== userDetails.userId
                      }
                    />
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
                        Send for Approval
                      </button>
                      <button
                        className="themeBtn"
                        onClick={() => {
                          setIsPopupOpen(true);
                          setPopupAction("sendFromReviewToOpen"); // Set the action when opening the popup
                        }}
                      >
                        Open Elog
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
                          setPopupAction("sendFromApprovalToApproved"); // Set the action when opening the popup
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
                        Open Elog
                      </button>
                    </>
                  )
                : null}
              {location.state?.stage === 1
                ? userDetails.userId === location.state?.initiator_id && (
                    <button
                      className="themeBtn"
                      onClick={() => {
                        handleSave();
                      }}
                    >
                      Save
                    </button>
                  )
                : null}
              {isSelectedGeneral === true ? (
                <button
                  className="themeBtn"
                  onClick={() => {
                    setIsSelectedDetails(true), setIsSelectedGeneral(false);
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  className="themeBtn"
                  onClick={() => {
                    setIsSelectedGeneral(true), setIsSelectedDetails(false);
                  }}
                >
                  Back
                </button>
              )}
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
