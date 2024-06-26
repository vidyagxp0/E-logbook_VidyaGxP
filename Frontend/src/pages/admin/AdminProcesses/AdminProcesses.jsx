import { useEffect, useState } from "react";
import axios from "axios";

function AdminProcesses() {
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    const url = "http://localhost:1000/differential-pressure/get-processes"; // Assuming the endpoint is corrected to "/user/get-all-users"
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`, // Include Bearer prefix with the token
        },
      })
      .then((response) => {
        setProcesses(response.data.message); // Access the response data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="admin-dashboard">
        <div className="main-content"></div>
        <div id="body-container" style={{ margin: "20px" }}>
          <h3 style={{ textAlign: "center" }}>
            <strong>Processes</strong>
          </h3>
          <br></br>
          <hr />
          {processes?.length === 0 ? (
            <>No Processes Available</>
          ) : (
            <table
              style={{
                marginLeft: '150px',
                width: "60%",
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
                    }}
                  >
                    Process Number
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    Process Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      {process.process_id}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      {process.process}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminProcesses;

  