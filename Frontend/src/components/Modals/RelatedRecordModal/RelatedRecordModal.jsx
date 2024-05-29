import { useEffect, useState } from "react";
import "../General.css";
import "./RelatedRecordModal.css";
import { toast } from "react-toastify";
import { convertDateFormat } from "../../DateReturners";

function RelatedRecordModal(_props) {
  const [records, setRecords] = useState([]);
  const [data, setData] = useState();
  function padNumber(number, width) {
    number = number + "";
    return number.length >= width ? number : new Array(width - number.length + 1).join("0") + number;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://195.35.6.197:9091/LabIncident/api/findAllDivision");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchData();
  }, []);
  function handleRecord(recordNumber) {
    setRecords((prevRecords) => {
      const exists = prevRecords.includes(recordNumber);
      return exists ? prevRecords.filter((record) => record !== recordNumber) : [...prevRecords, recordNumber];
    });
  }
  const handleAdd = () => {
    _props.returnData(records);
    _props.closeModal();
  };
  return (
    <>
      <div className="custom-modal" id="related-record-modal">
        <div className="modal-container">
          <div className="modal-top">
            <div className="head">Related Records</div>
            <div className="close-modal" onClick={_props.closeModal}>
              x
            </div>
          </div>

          <div className="modal-middle">
            <div className="modal-top-block">
              <div className="search-bar">
                <label>
                  <svg width="24.75" height="24" viewBox="0 0 33 32" xmlns="http://www.w3.org/2000/svg">
                    <g fill="#006fc0">
                      <path d="M1.5 32h21c.827 0 1.5-.673 1.5-1.5V23c0-.01-.005-.018-.006-.028c.055-.035.112-.068.166-.105l7.986 7.986a.5.5 0 1 0 .708-.706l-7.913-7.913A6.479 6.479 0 0 0 27 17.5a6.494 6.494 0 0 0-3.006-5.472c.001-.01.006-.018.006-.028V9.5c0-.017-.008-.031-.009-.047c-.002-.023-.008-.043-.013-.065a.488.488 0 0 0-.09-.191c-.007-.009-.006-.02-.013-.029l-8-9c-.003-.003-.007-.003-.01-.006a.49.49 0 0 0-.223-.134c-.019-.006-.036-.008-.056-.011C15.557.012 15.53 0 15.5 0h-14C.673 0 0 .673 0 1.5v29c0 .827.673 1.5 1.5 1.5M26 17.5c0 3.033-2.468 5.5-5.5 5.5S15 20.533 15 17.5s2.468-5.5 5.5-5.5s5.5 2.467 5.5 5.5M16 1.815L22.387 9H16.5c-.22 0-.5-.42-.5-.75zM1 1.5a.5.5 0 0 1 .5-.5H15v7.25c0 .809.655 1.75 1.5 1.75H23v1.501A6.475 6.475 0 0 0 15.821 13H5.5a.5.5 0 0 0 0 1h9.532a6.442 6.442 0 0 0-1.006 3H5.5a.5.5 0 0 0 0 1h8.525a6.454 6.454 0 0 0 1.006 3H5.5a.5.5 0 0 0 0 1h10.25c.021 0 .039-.009.06-.012a6.476 6.476 0 0 0 7.19 1.51V30.5a.5.5 0 0 1-.5.5h-21c-.28 0-.5-.22-.5-.5z" />
                      <path d="M5.5 10h6a.5.5 0 0 0 0-1h-6a.5.5 0 0 0 0 1m0 16h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0 0 1" />
                    </g>
                  </svg>
                </label>
                <input type="text" />
              </div>
              <div className="themeBtn">Create Record</div>
            </div>

            <div className="modal-mid-block">
              <div className="group-input-2">
                <label>Process</label>
                <select>
                  <option value="all_records">All Records</option>
                  <option value="internal_audit">Internal Audit</option>
                  <option value="external_audit">External Audit</option>
                  <option value="capa">Capa</option>
                  <option value="lab_incident">Lab Incident</option>
                  <option value="risk_assement">Risk Assesment</option>
                  <option value="root_cause_analysis">Root Cause Analysis</option>
                  <option value="management_review">Management Review</option>
                </select>
              </div>
              <div className="group-input-2">
                <label>Criteria</label>
                <select>
                  <option value="all_records">All Records</option>
                  <option value="1">Closed Records</option>
                  <option value="2">Opened Records</option>
                  <option value="3">Cancelled Records</option>
                  <option value="4">Overdue Records</option>
                  <option value="5">Assigned To Me</option>
                  <option value="6">Records Created Today</option>
                </select>
              </div>
            </div>

            <div className="modal-table-block">
              <div className="group-input-2">
                <label>
                  Filtered
                  <svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" stroke="#d0d0d0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <ellipse cx="12" cy="5" rx="9" ry="2" />
                      <path d="M3 5c0 2.23 3.871 6.674 5.856 8.805A4.197 4.197 0 0 1 10 16.657V19a2 2 0 0 0 2 2v0a2 2 0 0 0 2-2v-2.343c0-1.061.421-2.075 1.144-2.852C17.13 11.674 21 7.231 21 5" />
                    </g>
                  </svg>
                </label>
                <input type="text" value={records.join(", ")} disabled />
              </div>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Record ID</th>
                    <th>Site</th>
                    <th>Process</th>
                    <th>Short Description</th>
                    <th>Date Opened</th>
                    <th>Assigned To</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input type="checkbox" onChange={() => handleRecord(padNumber(item.id, 5))} />
                        </td>
                        <td>{padNumber(item.id, 5)}</td>
                        <td>{item.generalInformation[0].divisionCode}</td>
                        <td>{item.name}</td>
                        <td>{item.generalInformation[0].shortDescription}</td>
                        <td>{item.generalInformation[0].invocationType}</td>
                        <td>{item.generalInformation[0].assignedTo}</td>
                        <td>{convertDateFormat(item.generalInformation[0].dueDate)}</td>
                        <td></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-bottom">
            <div className="modal-btn btn-1" onClick={handleAdd}>
              Add
            </div>
            <div className="modal-btn btn-2" onClick={_props.closeModal}>
              Close
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RelatedRecordModal;
