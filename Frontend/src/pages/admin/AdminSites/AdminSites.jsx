import { useEffect, useState } from "react";
import axios from "axios";

function AdminSites() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const url = "https://elogbookapi.vidyagxp.com/site/get-sites"; // Assuming the endpoint is corrected to "/user/get-all-users"
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`, // Include Bearer prefix with the token
        },
      })
      .then((response) => {
        setSites(response.data.message); // Access the response data
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <div className="admin-dashboard">
        {/* <div className="main-content"></div> */}
        <div id="body-container" style={{ margin: "20px" }}>
          <h3 style={{ textAlign: "center" }}>
            <strong>Sites</strong>
          </h3>
          <br></br>
          <hr />
          {sites?.length === 0 ? (
            <>No Sites Available</>
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
                    Site Number
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    Site Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      {site.site_id}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      {site.site}
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

export default AdminSites;
