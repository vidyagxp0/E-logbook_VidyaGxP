import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderTop from "../../components/Header/HeaderTop";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

function Effective_AuditTrail() {
  const [auditTrails, setAuditTrails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [reviewer, setReviewer] = useState("All");
  const [initiator, setInitiator] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      } else if (location.state?.process === "Analytical Balance") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/analytical-balance/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "KARL Fischer") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/karl-fischer/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "HPLC") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/hplc/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "pH Meter OP/Cal") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/op-and-calParameter/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "UV-Vis Calibration") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/uv-vis-calib/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "SDS PAGE") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/sds-page/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "Gel Doc iGene") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/gel-doc-igene/get-audit-trail-for-elog/${location.state?.formId}`,
            {
              headers: myHeaders,
            }
          );
          setAuditTrails(response.data.auditTrail);
        } catch (error) {
          console.error(error);
        }
      } else if (location.state?.process === "VO Calibration") {
        const myHeaders = {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        };

        try {
          const response = await axios.get(
            `http://localhost:1000/vo-cal/get-audit-trail-for-elog/${location.state?.formId}`,
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

  const formId = location.state?.formId;
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
      "Analytical Balance": {
        type: "AnalyticalBalanceAuditTrail",
      },
      HPLC: {
        type: "hplcAuditTrail",
      },
      "KARL Fischer": {
        type: "karlFischerAuditTrail",
      },
      "pH Meter OP/Cal": {
        type: "pHMeterOPCalAuditTrail",
      },
    };

    const processDetails = processRouteMap[process];
    if (!processDetails) {
      console.error("Invalid process type.");
      return;
    }

    const { type } = processDetails;

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

  const filteredAuditTrails = auditTrails.filter((item) => {
    // Search text filter
    const searchMatch =
      item.field_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.previous_value?.toLowerCase().includes(search.toLowerCase()) ||
      item.new_value?.toLowerCase().includes(search.toLowerCase()) ||
      item.User?.name?.toLowerCase().includes(search.toLowerCase());

    // Reviewer filter
    const reviewerMatch = reviewer === "All" || item.User?.name === reviewer;
    // Initiator filter
    const initiatorMatch = initiator === "All" || item.User?.name === initiator;

    // Date filter
    const created = dayjs(item.createdAt).format("YYYY-MM-DD");
    const start = startDate ? dayjs(startDate).format("YYYY-MM-DD") : null;
    const end = endDate ? dayjs(endDate).format("YYYY-MM-DD") : null;
    const startMatch = start ? created >= start : true;
    const endMatch = end ? created <= end : true;

    return (
      searchMatch && reviewerMatch && initiatorMatch && startMatch && endMatch
    );
  });

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
          <div className="flex justify-between items-center bg-slate-300 p-2 mb-3">
            <h3
              className="font-semibold text-black flex items-center gap-2"
              style={{ textAlign: "center", fontSize: "1.5em", margin: "auto" }}
            >
            <p className="">
  {location.state?.process}
</p>
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
          {/* <hr /> */}

          <div className="flex justify-between gap-4 items-center mb-4">
            {/* Search */}
            <div className="flex flex-col min-w-[300px] mb-0">
              <label
                style={labelStyle}
                className="!flex items-center gap-2 w-fit text-[14px] font-semibold text-[#495057] mb-1 select-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#0c5fc6"
                  className="h-[20px] w-[20px]"
                >
                  <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                </svg>
                Search
              </label>
              <input
                type="text"
                placeholder="Search..."
                className="border px-3 py-2 rounded-md w-[300px] focus:outline-none 
    focus:ring-2 focus:ring-[#ced4da] 
    focus:border-[#ced4da]
    focus:px-3 focus:py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Initiator */}
            <div className="flex flex-col min-w-[260px] mb-0">
              <label
                style={labelStyle}
                className="!flex items-center gap-2 w-fit text-[14px] font-semibold text-[#495057] mb-1 select-none"
              >
                Initiator
              </label>
              <select
                className="border px-3 py-2 rounded-md"
                value={initiator}
                onChange={(e) => setInitiator(e.target.value)}
              >
                <option value="All">All Initiators</option>
                {[
                  ...new Set(
                    auditTrails
                      .filter((t) =>
                        t.User?.UserRoles?.some((r) => r.role_id === 1)
                      )
                      .map((t) => t.User?.name)
                  ),
                ].map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reviewer */}
            <div className="flex flex-col min-w-[260px] mb-0">
              <label
                style={labelStyle}
                className="!flex items-center gap-2 w-fit text-[14px] font-semibold text-[#495057] mb-1 select-none"
              >
                Reviewer
              </label>
              <select
                className="border px-3 py-2 rounded-md"
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)}
              >
                <option value="All">All Reviewers</option>
                {[
                  ...new Set(
                    auditTrails
                      .filter((t) =>
                        t.User?.UserRoles?.some((r) => r.role_id === 2)
                      )
                      .map((t) => t.User?.name)
                  ),
                ].map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="flex flex-col min-w-[260px] mb-0">
              <label
                style={labelStyle}
                className="!flex items-center gap-2 w-fit text-[14px] font-semibold text-[#495057] mb-1 select-none"
              >
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border px-3 py-2 rounded-md"
              />
            </div>
            <div className="flex flex-col min-w-[260px] mb-0">
              <label
                style={labelStyle}
                className="!flex items-center gap-2 w-fit text-[14px] font-semibold text-[#495057] mb-1 select-none"
              >
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border px-3 py-2 rounded-md"
              />
            </div>
          </div>

          {filteredAuditTrails?.length === 0 ? (
            <>
              <p className="text-lg font-semibold text-center pt-10 border-t-2">
                Data Not Found
              </p>
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
                    {/* <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Declaration
                    </th> */}
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
                  {filteredAuditTrails
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
                        {/* <td
                          style={{
                            padding: "10px",
                            borderBottom: "1px solid #ccc",
                            width: "15%",
                          }}
                        >
                          <span className="font-normal">
                            {auditTrail.declaration}
                          </span>
                        </td> */}
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
