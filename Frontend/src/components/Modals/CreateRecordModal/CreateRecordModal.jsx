import { useState, useEffect } from "react";
import "../General.css";
import "./CreateRecordModal.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateRecordModal(_props) {
  const [division, setDivision] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [sites, setSites] = useState([]);
  const [project, setProject] = useState("");
  const [processVisible, setProcessVisible] = useState(false);
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get(
          "https://elog-backend.mydemosoftware.com/site/get-sites"
        );
        const userSiteIds = await userDetails.roles
          .filter((role) => role.role_id === 1 || role.role_id === 5)
          .map((role) => role.site_id);

        // Filter sites based on user's roles
        const filteredSites = await response.data.message.filter((site) =>
          userSiteIds.includes(site.site_id)
        );

        setSites(filteredSites);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };

    fetchSites();
  }, []);

  const fetchProcesses = async () => {
    try {
      const response = await axios.get(
        "https://elog-backend.mydemosoftware.com/differential-pressure/get-processes"
      );

      const filteredProcessIds = userDetails.roles
        .filter(
          (role) =>
            (role.role_id === 1 || role.role_id === 5) &&
            role?.site_id === division?.site_id
        )
        .map((role) => role.process_id);

      // Filter processes based on user's roles
      const filteredProcesses = response.data.message.filter((process) =>
        filteredProcessIds.includes(process.process_id)
      );
      setProcesses(filteredProcesses);
      console.log(filteredProcesses);
    } catch (error) {
      console.error("Error fetching processes:", error);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, [division]);

  useEffect(() => {
    if (processVisible) {
      fetchProcesses();
    }
  }, [processVisible]);

  const handleSelectProcess = (element) => {
    setProject(element.process);

    switch (element.process_id) {
      case 1:
        navigate("/differential-pressure-record", {
          state: division,
        });
        break;
      case 2:
        navigate("/temperature-records", {
          state: division,
        });
        break;
      case 3:
        navigate("/loaded-quantity", {
          state: division,
        });
        break;
      case 4:
        navigate("/operations-of-sterilizer", {
          state: division,
        });
        break;
      case 5:
        navigate("/media-record", {
          state: division,
        });
        break;
      case 6:
        navigate("/dispensing-of-material", {
          state: division,
        });
        break;
      case 7:
        navigate("/media-record", {
          state: division,
        });
        break;
      case 8:
        navigate("/dispensing-of-material", {
          state: division,
        });
        break;
      default:
        break;
    }
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
                <div className="head text-lg font-semibold mb-2">
                  Site/Location
                </div>
                <div className="select-list division-list flex flex-col gap-2">
                  {sites?.map((item) => (
                    <div
                      className={` cursor-pointer transition-colors duration-300 
          ${
            division?.site === item?.site
              ? "bg-[#0c5fc6] text-white"
              : " hover:bg-gray-200"
          }`}
                      key={item.id}
                      onClick={() => {
                        setDivision(item);
                        setProcessVisible(true);
                      }}
                    >
                      {item.site}
                    </div>
                  ))}
                </div>
              </div>

              <div className="project">
                <div className="head gap-2">Process</div>
                <div className="select-list division-list gap-2">
                  {processes.map((item, index) => (
                    <div
                      className={project === item.process ? "active" : ""}
                      key={index}
                      onClick={() => handleSelectProcess(item)}
                    >
                      {item.process}
                    </div>
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
