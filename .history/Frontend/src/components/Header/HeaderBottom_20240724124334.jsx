import { useState } from "react";
import "./HeaderBottom.css";
import { Link } from "react-router-dom";
import CreateRecordModal from "../Modals/CreateRecordModal/CreateRecordModal";
import { useSelector } from "react-redux";

function HeaderBottom() {
  const [recordModal, setRecordModal] = useState(false);
  const closeRecordModal = () => setRecordModal(false);
  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);

  return (
    <>
      <div className="Header_Bottom">
      <div className="input-wrapper">
          <div className="group-input-2">
            <label>ELog</label>
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
          </div>
        </div>
        <div className="headerBottomInner">
          {loggedInUser.roles?.some(
            (itm) => itm.role_id === 5 || itm.role_id === 1
          ) ? (
            <div className="headerBottomRgt">
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
