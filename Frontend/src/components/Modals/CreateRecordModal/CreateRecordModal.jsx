import React, { useState, useEffect } from "react";
import "../General.css";
import "./CreateRecordModal.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function CreateRecordModal(_props) {
  const [division, setDivision] = useState("KSA");
  const [processes, setProcesses] = useState([]);
  const [sites, setSites] = useState([]);
  const [project, setProject] = useState("");
  const [processVisible, setProcessVisible] = useState(false);
  const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get("http://192.168.1.29:1000/site/get-sites");
        setSites(response.data.message);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };

    fetchSites();
  }, []);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const response = await axios.get("http://192.168.1.29:1000/process/get-processes");
        setProcesses(response.data.message);
      } catch (error) {
        console.error("Error fetching processes:", error);
      }
    };

    if (processVisible) {
      fetchProcesses();
    }
  }, [processVisible]);

  const filteredSites = sites.filter((item) =>
    loggedInUser.roles.some((role) => role.site_id === 1 || role.site_id === 5)
  );

  const handleSelectProcess = (element) => {
    setProject(element.process);
  };

  return (
    <>
      <div className="custom-modal" id="create-record-modal">
        <div className="modal-container">
          <div className="modal-top">
            <div className="head">Initiate eLog</div>
          </div>

          <div className="modal-middle">
            <div className="selection-block">
              <div className="division">
                <div className="head">Site/Location</div>
                <div className="select-list division-list">
                  {filteredSites.map((item) => (
                    <div
                      className={division === item.site ? "active" : ""}
                      key={item.id}
                      onClick={() => {
                        setDivision(item.site);
                        setProcessVisible(true);
                      }}
                    >
                      {item.site}
                    </div>
                  ))}
                </div>
              </div>
              <div className="project">
                <div className="head">Process</div>
                <div className="select-list division-list">
                  {processes.map((item, index) => (
                    <Link
                      className={project === item.process ? "active" : ""}
                      key={index}
                      to={
                        item.process_id === 1
                          ? "/differential-pressure-record"
                          : item.process_id === 2
                          ? "/area-and-equiment-usage-log"
                          : item.process_id === 3
                          ? "/equipment-cleaning-checklist"
                          : item.process_id === 4
                          ? "/temperature-records"
                          : ""
                      }
                      onClick={() => handleSelectProcess(item)}
                    >
                      {item.process}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-bottom">
            <div className="modal-btn btn-2" onClick={_props.closeModal}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateRecordModal;
