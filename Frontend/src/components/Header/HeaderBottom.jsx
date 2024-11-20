import { useState } from "react";
import "./HeaderBottom.css";
import { Link } from "react-router-dom";
import CreateRecordModal from "../Modals/CreateRecordModal/CreateRecordModal";
import { useSelector } from "react-redux";

function HeaderBottom() {
  const [eLogSelect, setELogSelect] = useState("All_Records");
  const [recordModal, setRecordModal] = useState(false);
  const closeRecordModal = () => setRecordModal(false);
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

  return (
    <>
      <div className="Header_Bottom">
        <div className="headerBottomInner">
          <div className="input-wrapper ">
            {/* <div className="group-input-2">
            <div className="text-2xl font-extrabold">ELog</div>
            <select 
              value={eLogSelect}
              onChange={(e) => setELogSelect(e.target.value)}
            >
              <option value="All_Records">All Records</option>
              <option value="diffrential_pressure">Diffrential Pressure Record</option>
              <option value="area_and_equipment">Area & Equipment Usage Log</option>
              <option value="equipment_cleaning">Equipment Cleaning Checklist</option>
              <option value="temperature_records">Temperature Records</option>
            </select>
          </div> */}
            <div className="tabs flex items-center justify-center space-x-6">
              <Link
                to="/dashboard"
                className={`tab py-2 px-4 rounded-md  ${
                  window.location.pathname === "/dashboard"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-500 border border-blue-500"
                } hover:bg-blue-600 transition duration-300 hover:text-white`}
              >
                Dashboard
              </Link>
              <Link
                to="/analytics2"
                className={`tab py-2 px-4 rounded-md  ${
                  window.location.pathname === "/dashboard2"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-500 border border-blue-500 "
                } hover:bg-blue-600 transition duration-300  hover:text-white `}
              >
                Analytics
              </Link>
            </div>
          </div>

          {userDetails.roles?.some(
            (itm) => itm.role_id === 5 || itm.role_id === 1
          ) ? (
            <div className="headerBottomRgt" >
              <div className="themeBtn" onClick={() => setRecordModal(true)}>
                Initiate eLog
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {recordModal && <CreateRecordModal closeModal={closeRecordModal} />}
    </>
  );
}

export default HeaderBottom;
