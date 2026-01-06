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
const [searchTerm, setSearchTerm] = useState("");

const parseJSON = (value) => {
try {
return value ? JSON.parse(value) : {};
} catch (error) {
return {};
}
};

const stripHtml = (html) => {
if (!html) return "";
const div = document.createElement("div");
div.innerHTML = html;
return div.textContent || div.innerText || "";
};

useEffect(() => {
axios
.get("http://localhost:1000/equipment/equipments/get-all")
.then((res) => {
setEquipments(res.data?.data || []);
})
.catch((err) => {
console.log("API error", err);
});
}, []);

// 🔍 SEARCH FILTER
const filteredEquipments = equipments.filter((item) => {
const formData = item.formData;
const dpRecord = item.differentialPRecord;

const productName = formData.productName || "";
const description = dpRecord.description;
const mfrId = `MFR${item.id}`;

return (
  productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  mfrId.toLowerCase().includes(searchTerm.toLowerCase())
);
});
console.log(filteredEquipments,"filter")

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
          placeholder="Search by MFR / Product / Description..."
          className="flex-grow outline-none border-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
            Oral Solid Dosage
          </option>
        </select>
      </div>
    </div>

    {/* TABLE */}
    <table>
      <thead>
        <tr>
          <th>Sr. No.</th>
          {/* <th>Product Name</th> */}
          <th>Short Description</th>
          <th>Product Type</th>
          <th>Created By</th>
          <th>Date of Creation</th>
        </tr>
      </thead>

      <tbody>
        {filteredEquipments.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: "center" }}>
              No records found
            </td>
          </tr>
        ) : (
          filteredEquipments.map((item, index) => {
            const formData = item.formData;
            const dpRecord = item.differentialPRecord;

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

                {/* <td>{formData.productName || "-"}</td> */}

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

                <td>Oral Solid Dosage</td>
                <td>Initiator</td>

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