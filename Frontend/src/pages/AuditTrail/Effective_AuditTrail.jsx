import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderTop from "../../components/Header/HeaderTop";
import { useSelector } from "react-redux";


function Effective_AuditTrail() {
  const [auditTrails, setAuditTrails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [User, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAuditTrail = async () => {
      if (location.state?.process === "Differential Pressure") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/differential-pressure/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "Temperature Record") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/temprature-record/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "Loaded Quantity") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/loaded-quantity/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "Operation Of Sterilizer") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/operation-sterlizer/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "Media Record") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/media-record/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "Dispensing Of Materials") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/dispensing-material/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchAuditTrail();
  }, [location.state?.formId, location.state?.process]);

  const formId = location.state?.formId
  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);

useEffect(() => {
  const requestOptions = {
    method: "GET",
    url: `http://localhost:1000/user/get-a-user/${loggedInUser?.userId}`, 
    headers: {}, 
  };

  axios(requestOptions)
    .then((response) => {
      setUser(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);


const generateReport = async () => {

  const process = location.state?.process;
  if (!process) {
    console.error("Process is not defined.");
    return;
  }

  const processRouteMap = {
    "Differential Pressure": {
      type: "DifferentialPressureAuditTrail",
    },
    "Temperature Record": {
      type: "TemperatureRecordsAuditTrail",
    },
    "Loaded Quantity": {
      type: "LoadedQuantityProcessAuditTrail",
    },
    "Operation Of Sterilizer": {
      type: "OperationOfSterilizerProcessAuditTrail",
    },
    "Dispensing Of Materials": {
      type: "DispenseOfMatrialAuditTrail",
    },
    "Media Record": {
      type: "MediaRecordAuditTrail",
    },
  };

  const processDetails = processRouteMap[process];
  if (!processDetails) {
    console.error("Invalid process type.");
    return;
  }

  const {  type } = processDetails;

  setIsLoading(true);
  try {
    const response = await fetch(
      `http://localhost:1000/differential-pressure/get-audit-report/${formId}/${type}/${User.user_id}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch audit report: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${type}_audit_report.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading PDF:", error);
  } finally {
    setIsLoading(false);
  }
};



  return (
    <>
      <style>
        {`
          .scrollable-container {
            max-height: 800px; /* Adjust this height as needed */
            overflow-y: auto;
            margin: 0 auto;
            width: 100%; /* Adjust the width as needed */
          }

          .scrollable-container::-webkit-scrollbar {
            width: 16px; /* Increased width of the scrollbar */
          }

          .scrollable-container::-webkit-scrollbar-track {
            background: #f1f1f1; /* Track color */
          }

          .scrollable-container::-webkit-scrollbar-thumb {
            background: #888; /* Scrollbar color */
            border-radius: 8px; /* More rounded corners for scrollbar */
          }

          .scrollable-container::-webkit-scrollbar-thumb:hover {
            background: #555; /* Darker scrollbar on hover */
          }

          .back-button-container {
            text-align: center;
            margin-top: 20px;
            position: fixed;
            bottom: 20px;
            width: 100%;
          }
        `}
      </style>

      <div className="admin-dashboard">
        <HeaderTop />
        <div id="body-container" style={{ margin: "20px" }}>
        <div className="flex justify-between items-center bg-slate-300 p-2">
          <h3 style={{ textAlign: "center", fontSize: "2em",margin:"auto" }}>
            <strong>Audit Trail</strong>
          </h3>
          <div className="flex flex-col gap-3 items-center justify-center">
                
                {/* Generate Report Button */}
                <button
                  onClick={generateReport}
                  className="flex items-center justify-center relative px-4 py-2 border-none rounded-md bg-slate-400 text-sm  cursor-pointer text-black font-normal"
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
                </div>
          </div>
          <br />
          <hr />
          {auditTrails?.length === 0 ? (
            <>
              <p className="text-center mt-10">No audit trails Available</p>
            </>
          ) : (
            <div className="scrollable-container">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "#fff",
                  color: "#333",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.1)",
                }}
              >
                <thead>
                  <tr>
                    {/* <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Flow Changed From
                    </th> */}
                    {/* <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Flow Changed To
                    </th> */}
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      {/* Previous Value */}
                      Data Fields
                    </th>
                    {/* <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      Previous Value
                    </th> */}
                    {/* <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      New Value
                    </th> */}
                    {/* <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      Previous Status
                    </th> */}
                    {/* <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      New Status
                    </th> */}
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Declaration
                    </th>
                    {/* <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Date & Time
                    </th> */}
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Action Type
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Performer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auditTrails
                    .filter(
                      (auditTrail) =>
                        ![
                          "Approver Comment",
                          "initiatorComment",
                          "Stage Change",
                          "stage Change",
                          "Review Comment",
                          "approver",
                          "reviewer",
                          "department",
                          "description",
                          "compression_area",
                        ].includes(auditTrail.field_name)
                    )
                    .map((auditTrail, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                            width: "10%",
                            textWrap: "nowrap",
                          }}
                        >
                          <div className="mb-2">
                            <span>Field Name :</span>
                            <span className="font-normal">
                              {" "}
                              {auditTrail.field_name.charAt(0).toUpperCase() +
                                auditTrail.field_name.slice(1)}
                            </span>
                          </div>
                          <div className="mb-2">
                            Previous Value :{" "}
                            <span className="font-normal">
                              {" "}
                              {auditTrail.previous_value
                                ? auditTrail.previous_value
                                : "null"}
                            </span>
                          </div>
                          <div className="text-nowrap flex">
                            New Value :{" "}
                            <span
                              className="font-normal"
                              dangerouslySetInnerHTML={{
                                __html: auditTrail?.new_value,
                              }}
                            ></span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                            width: "15%",
                          }}
                        >
                          <span className="font-normal">
                            {auditTrail.declaration}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                            width: "15%",
                          }}
                        >
                          Action Name :{" "}
                          <span className="font-normal">
                            {auditTrail.action}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                            width: "15%",
                          }}
                        >
                          <div className="mb-2">
                            Performed By :{" "}
                            <span className="font-normal">
                              {auditTrail.User.name}
                            </span>
                          </div>
                          <div>
                            Performed On :{" "}
                            <span className="font-normal">
                              {" "}
                              {new Date(auditTrail.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="back-button-container">
            <button
              className="themeBtn"
              onClick={() => navigate(-1)}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Effective_AuditTrail;
