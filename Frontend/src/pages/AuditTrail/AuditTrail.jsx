import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderTop from "../../components/Header/HeaderTop";

function AuditTrail() {
  const [auditTrails, setAuditTrails] = useState([]);
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
      } else if (location.state?.process === "Temperature Records") {
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
      }
    };

    fetchAuditTrail();
  }, [location.state?.formId, location.state?.process]);

  return (
    <>
      <div className="admin-dashboard">
        <HeaderTop />
        <div id="body-container" style={{ margin: "20px" }}>
          <h3 style={{ textAlign: "center" }}>
            <strong>Audit Trail</strong>
          </h3>
          <br></br>
          <hr />
          {auditTrails?.length === 0 ? (
            <>No audit trails Available</>
          ) : (
            <div
              style={{
                maxHeight: "500px", // Adjust this height as needed
                overflowY: "auto",
                margin: "0 auto",
                width: "100%", // Adjust the width as needed
              }}
            >
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
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Checked By
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Field Name
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      Previous Value
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      New Value
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      Previous Status
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      New Status
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Declaration
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auditTrails.map((auditTrail, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "15%",
                        }}
                      >
                        {auditTrail.User.name}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "15%",
                        }}
                      >
                        {auditTrail.field_name}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "10%",
                        }}
                      >
                        {auditTrail.previous_value
                          ? auditTrail.previous_value
                          : "null"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "10%",
                        }}
                      >
                        {auditTrail.new_value}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "10%",
                        }}
                      >
                        {auditTrail.previous_status}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "10%",
                        }}
                      >
                        {auditTrail.new_status}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "15%",
                        }}
                      >
                        {auditTrail.declaration}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "15%",
                        }}
                      >
                        {new Date(auditTrail.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
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

export default AuditTrail;
