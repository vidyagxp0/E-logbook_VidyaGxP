import { useEffect, useState } from "react";
import "./Dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderTop from "../../components/Header/HeaderTop";
import HeaderBottom from "../../components/Header/HeaderBottom";

function EbmrDashboard() {
  const navigate = useNavigate();

  const [equipments, setEquipments] = useState([]);
  const [eLogSelect, setELogSelect] = useState("All_Records");
  const parseJSON = (value) => {
    try {
      return value ? JSON.parse(value) : {};
    } catch (error) {
      return {};
    }
  };
  const location = useLocation();

  const { mfrId } = location.state || {};

  console.log(equipments, "equipments");
  useEffect(() => {
    axios
      .get("http://localhost:1000/equipment/equipments/get-all")
      .then((res) => {
        // backend response: { data: [...] }
        setEquipments(res.data?.data || []);
      })
      .catch((err) => {
        console.log("API error", err);
      });
  }, []);

  return (
    <>
      <HeaderTop />
      <HeaderBottom />

      <div className="desktop-input-table-wrapper">
        {/* SEARCH + FILTER */}
        <div className="flex items-center gap-10 p-4 border-gray-300">
          <div className="flex items-center h-[40px] border border-gray-300 rounded-md shadow-sm w-full max-w-md p-1">
            <input
              type="search"
              placeholder="Search..."
              className="flex-grow outline-none border-none"
            />
          </div>

          <div className="w-full max-w-md">
            <select
              value={eLogSelect}
              onChange={(e) => setELogSelect(e.target.value)}
              className="w-full h-[38px] border border-gray-300 rounded-md p-2 shadow-sm"
            >
              <option value="All_Records">All Records</option>
              <option value="diffrential_pressure">
                Differential Pressure Record
              </option>
              <option value="temperature_records">Temperature Records</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              {/* <th>Instrument No.</th> */}
              <th>Product Name</th>
              {/* <th>Department</th> */}
              <th>Short Description</th>
              <th>Created By</th>
              <th>Date of Creation</th>
            </tr>
          </thead>

          <tbody>
            {equipments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            ) : (
              equipments.map((item, index) => {
                const formData = parseJSON(item.formData);
                const dpRecord = parseJSON(item.differentialPRecord);

                return (
                  <tr key={item.id || index}>
                    <td
                      style={{
                        color: "#0c5fc6",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                      onClick={() =>
                        navigate("/bmr-panel", {
                          state: { mfrId: item.id },
                        })
                      }
                    >
                      MFR{item.id}
                    </td>

                    {/* Instrument No */}
                    {/* <td>{item.id}</td> */}

                    {/* Product Name */}
                    <td>{formData.productName || "-"}</td>

                    {/* Department */}
                    {/* <td>{dpRecord.department || "-"}</td> */}

                    {/* Short Description */}
                    <td>
                      {dpRecord.description ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: dpRecord.description,
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Created By */}
                    <td> {item.initiator_id}</td>

                    {/* Date */}
                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EbmrDashboard;
