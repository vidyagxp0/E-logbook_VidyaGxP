import { useEffect, useState } from "react";
import "./DataFields.css";
import RelatedRecordModal from "../Modals/RelatedRecordModal/RelatedRecordModal.jsx";
import { convertDateFormat } from "../DateReturners.jsx";
import { toast } from "react-toastify";

function RelatedRecords(_props) {
  const [openModal, setOpenModal] = useState(false);
  const closeRecordModal = () => setOpenModal(false);
  const [returnData, setReturnData] = useState([]);
  const [data, setData] = useState();
  function padNumber(number, width) {
    number = number + "";
    return number.length >= width ? number : new Array(width - number.length + 1).join("0") + number;
  }
  const fetchData = async () => {
    // try {
    //   const response = await fetch("http://195.35.6.197:9091/LabIncident/api/findAllDivision");
    //   if (!response.ok) {
    //     throw new Error("Failed to fetch data");
    //   }
    //   const result = await response.json();
    //   setData(result);
    // } catch (error) {
    //   toast.error(error);
    // }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleSelectedData = (data) => {
    setReturnData(data);
  };
  return (
    <>
      <div className="group-input">
        <label className={_props.coloredLabel ? "color-label" : ""}>
          {_props.isRequired === "true" && <div className="required"></div>}
          {_props.label}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setOpenModal(true)}
          >
            <path
              fill="#000000"
              d="M19.5 7.05h-7L9.87 3.87a1 1 0 0 0-.77-.37H4.5A2.47 2.47 0 0 0 2 5.93v12.14a2.47 2.47 0 0 0 2.5 2.43h15a2.47 2.47 0 0 0 2.5-2.43V9.48a2.47 2.47 0 0 0-2.5-2.43M14 15h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2"
            />
          </svg>
        </label>
        {_props.instruction && <div className="instruction">{_props.instruction}</div>}
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Division</th>
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
                data.map(
                  (item, index) =>
                    returnData.includes(padNumber(item.id, 5)) && (
                      <tr key={index}>
                        <td>{padNumber(item.id, 5)}</td>
                        <td>{item.generalInformation[0].divisionCode}</td>
                        <td>{item.name}</td>
                        <td>{item.generalInformation[0].shortDescription}</td>
                        <td>{item.generalInformation[0].invocationType}</td>
                        <td>{item.generalInformation[0].assignedTo}</td>
                        <td>{convertDateFormat(item.generalInformation[0].dueDate)}</td>
                        <td></td>
                      </tr>
                    )
                )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <RelatedRecordModal
          closeModal={closeRecordModal}
          formName={_props.formName}
          returnData={(data) => handleSelectedData(data)}
        />
      )}
    </>
  );
}

export default RelatedRecords;
