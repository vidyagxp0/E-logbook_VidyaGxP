import React, { useEffect, useReducer, useState } from 'react'
import HeaderTop from '../../../components/Header/HeaderTop'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TinyEditor from '../../../components/TinyEditor';
import axios from 'axios';
import { NoteAdd } from '@mui/icons-material';
import DeleteIcon from "@mui/icons-material/Delete";
import UserVerificationPopUp from '../../../components/UserVerificationPopUp/UserVerificationPopUp';
import { toast } from 'react-toastify';
const UVvisCalibration = () => {
const [isSelectedGeneral, setIsSelectedGeneral] = useState(true);
        const [isSelectedDetails, setIsSelectedDetails] = useState(false);
        const [initiatorRemarks, setInitiatorRemarks] = useState(false);
        const [reviewerRemarks, setReviewerRemarks] = useState(false);
        const [approverRemarks, setApproverRemarks] = useState(false);
        const [allTableData, setAllTableData] = useState([]);
        const [reviewers, setReviewers] = useState([]);
        const [approvers, setApprovers] = useState([]);
        const [User, setUser] = useState(null);
        const [isPopupOpen, setIsPopupOpen] = useState(false);
        const loggedInUser = useSelector((state) => state.loggedInUser.loggedInUser);
        const navigate = useNavigate();
        const location = useLocation();
        const userDetails = JSON.parse(localStorage.getItem("user-details"));
      
        useEffect(() => {
          const config = {
            method: "post",
            url: "http://localhost:1000/differential-pressure/get-user-roleGroups",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
            data: {
              site_id: location.state?.site_id,
              role_id: 2,
              process_id: 9,
            },
          };
      
          axios(config)
            .then((response) => {
              setReviewers(response.data.message);
            })
            .catch((error) => {
              console.error("Error: ", error);
            });
      
          const newConfig = {
            method: "post",
            url: "http://localhost:1000/differential-pressure/get-user-roleGroups",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
            data: {
              site_id: location.state?.site_id,
              role_id: 3,
              process_id: 9,
            },
          };
      
          axios(newConfig)
            .then((response) => {
              setApprovers(response.data.message);
            })
            .catch((error) => {
              console.error("Error: ", error);
            });
        }, []);
      
        useEffect(() => {
          const requestOptions = {
            method: "GET",
            url: `http://localhost:1000/user/get-a-user/${loggedInUser?.userId}`, // Ensure you use the correct URL format including 'http://'
            headers: {}, // You can add any necessary headers here
          };
      
          axios(requestOptions)
            .then((response) => {
              setUser(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        }, []);
      
        const handlePopupClose = () => {
          setIsPopupOpen(false);
        };
      
        const handlePopupSubmit = (credentials) => {
          if (
            hplc.site_id === null ||
            hplc.approver_id === null ||
            hplc.reviewer_id === null
          ) {
            toast.error(
              "Please select an approver and a reviewer before saving e-log!"
            );
            return;
          }
      
          // if (hplc.initiatorComment === "") {
          //   toast.error("Please provide an initiator comment!");
          //   return;
          // }
          // if (hplc.description === "") {
          //   toast.error("Please provide a short description!");
          //   return;
          // }
          if (
            hplc?.FormRecordsArray?.some(
              (record) => record.sampleName === "" || record.remarks === ""
            )
          ) {
            toast.error("Please provide grid details!");
            return;
          }
      
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "multipart/form-data",
            },
          };
      
          hplc.email = credentials?.email;
          hplc.password = credentials?.password;
          hplc.initiatorDeclaration = credentials?.declaration;
      
          axios
            .post(
              "http://localhost:1000/uv-vis-calib/post",
              hplc,
              config
            )
            .then(() => {
              toast.success("eLog Saved Successfully!");
              navigate("/dashboard");
            })
            .catch((error) => {
              console.error("There was an error creating eLog:", error);
              toast.error("There was an error creating eLog");
            });
        };
      
        const object = getCurrentDateTime();
        let date = object.currentDate;
        function getCurrentDateTime() {
          const now = new Date();
          const year = now.getFullYear().toString().slice(0);
          const month = (now.getMonth() + 1).toString().padStart(2, "0");
          const day = now.getDate().toString().padStart(2, "0");
          const currentDate = `${year}/${month}/${day}`;
          return {
            currentDate: currentDate,
          };
        }
        console.log(allTableData, "allTableData");
        const addRow = () => {
          const options = {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true, // Use 24-hour format
          };
      
          const currentTime = new Date().toLocaleTimeString("en-us", options);
          const newRow = {
            date: date,
            reg_no: "",
            sample_name: "",
            method_used: "", 
            parameter_or_activity: "", 
            column_no: "", 
            start_time: "", 
            end_time: "", 
            no_of_injections: "", 
            done_by: User?.name,
            checked_by: User?.name,
            remarks: "",
          };
          setAllTableData([...allTableData, newRow]);
        };
      
        const deleteRow = (index) => {
          const updatedData = [...allTableData];
          updatedData.splice(index, 1);
          setAllTableData(updatedData);
        };
      
        // const currentDate = new Date();
        // const currentMonth = currentDate.toLocaleString("default", { month: "long" });
      
        const generateUniqueId = () => {
          return `UU0${new Date().getTime()}${Math.floor(Math.random() * 100)}`;
        };
      
        const [hplc, sethplc] = useReducer(
          (prev, next) => ({
            ...prev,
            ...next,
          }),
          {
            site_id: location.state?.site_id,
            reviewer_id: null,
            approver_id: null,
            description: "",
            department: "",
            review_comments: "",
            // compression_area: "",
            additionalAttachment: "",
            additionalInfo: "",
            // limit: null,
            initiatorComment: "",
            initiatorAttachment: null,
            initiatorDeclaration: "",
          }
        );
        console.log(hplc, "hplc");
        const handleInputChange1 = (e) => {
          const { name, value } = e.target;
          sethplc({ ...hplc, [name]: value });
        };
      
        const handleReviewerFileChange = (e) => {
          sethplc({
            ...hplc,
            reviewerAttachment: e.target.files[0],
          });
        };
        const handleApproverFileChange = (e) => {
          sethplc({
            ...hplc,
            approverAttachment: e.target.files[0],
          });
        };
      
        useEffect(() => {
          sethplc({ FormRecordsArray: allTableData });
        }, [allTableData]);
      
        const handleDeleteFile = (index) => {
          const updatedData = [...allTableData];
          updatedData[index].supporting_docs = null; // This should remove the file
          setAllTableData(updatedData);
        };
      
        const handleFileChange = (index, file) => {
          const updatedData = [...allTableData];
          updatedData[index].supporting_docs = file;
          setAllTableData(updatedData);
        };
        const handleFileChangeAttachment = (e) => {
          sethplc({
            ...hplc,
            additionalAttachment: e.target.files[0],
          });
        };
      
        const handleInitiatorFileChange = (e) => {
          sethplc({
            ...hplc,
            initiatorAttachment: e.target.files[0],
          });
        };
      
        const setTinyContent = (content) => {
          sethplc({
            description: content,
          });
        };
      
    return (
      <div>
          <HeaderTop />
          <div id="main-form-container">
            <div id="config-form-document-pages" className="min-w-full">
  <div className="top-blocks !grid !grid-cols-3">
              {/* <div>
                <strong> Record Name:&nbsp;</strong>HPLC
              </div> */}
              <div>
                <strong> Site:&nbsp;</strong>
                {location.state?.site}
              </div>
              <div>
                <strong> Current Status:&nbsp;</strong>Under Initiation
              </div>
              <div>
                <strong> Initiated By:&nbsp;</strong>
                {User?.name}
              </div>
            </div>
             <div className="document-form">
                        <div className="details-form-data">
                          {/* <div className="sop-type-header">
                            <div className="logo">
                              <img src="/vidyalogo21.png" alt="..." />
                            </div>
                            <div className="main-head">
                              <div>VidyaGxP Private Limited</div>
                            </div>
                          </div> */}
                          {/* <div className="sop-type-header">
                            <div className="logo">
                              <img src="/vidyalogo21.png" alt="..." width={20} />
                            </div>
                            <div className="main-head">
                              <div>VidyaGxP Private Limited</div>
                            </div>
                          </div> */}
                          <div className="sub-head-2">Operation and Calibration of UV-VIS Spectrophotometer</div>

                          <div className="outerDiv4">
                            <div className="btn-forms">
                              <div
                                className={`${
                                  isSelectedGeneral === true
                                    ? "btn-forms-isSelected"
                                    : "btn-forms-select"
                                }`}
                                onClick={() => {
                                  setIsSelectedDetails(false),
                                    setIsSelectedGeneral(true),
                                    setInitiatorRemarks(false),
                                    setReviewerRemarks(false),
                                    setApproverRemarks(false);
                                }}
                              >
                                General Information
                              </div>
                              <div
                                className={`${
                                  isSelectedDetails === true
                                    ? "btn-forms-isSelected"
                                    : "btn-forms-select"
                                }`}
                                onClick={() => {
                                  setIsSelectedDetails(true),
                                    setIsSelectedGeneral(false),
                                    setInitiatorRemarks(false),
                                    setReviewerRemarks(false),
                                    setApproverRemarks(false);
                                }}
                              >
                                Details
                              </div>
                              {/* <div
                                className={`${
                                  initiatorRemarks === true
                                    ? "btn-forms-isSelected"
                                    : "btn-forms-select"
                                }`}
                                onClick={() => {
                                  setIsSelectedDetails(false),
                                    setIsSelectedGeneral(false),
                                    setInitiatorRemarks(true),
                                    setReviewerRemarks(false),
                                    setApproverRemarks(false);
                                }}
                              >
                                Initiator Remarks
                              </div> */}
                              {/* <div
                                className={`${
                                  reviewerRemarks === true
                                    ? "btn-forms-isSelected"
                                    : "btn-forms-select"
                                }`}
                                onClick={() => {
                                  setIsSelectedDetails(false),
                                    setIsSelectedGeneral(false),
                                    setInitiatorRemarks(false),
                                    setReviewerRemarks(true),
                                    setApproverRemarks(false);
                                }}
                              >
                                Reviewer Remarks
                              </div>
                              <div
                                className={`${
                                  approverRemarks === true
                                    ? "btn-forms-isSelected"
                                    : "btn-forms-select"
                                }`}
                                onClick={() => {
                                  setIsSelectedDetails(false),
                                    setIsSelectedGeneral(false),
                                    setInitiatorRemarks(false),
                                    setReviewerRemarks(false),
                                    setApproverRemarks(true);
                                }}
                              >
                                Approver Remarks
                              </div> */}
                            </div>
                          </div>
            
                          {isSelectedGeneral === true ? (
                            <>
                              <div className="group-input">
                                <label className="color-label">Initiator</label>
                                <div>
                                  <input
                                    type="text"
                                    value={User?.name}
                                    onChange={(e) =>
                                      sethplc({ initiator: e.target.value })
                                    }
                                    disabled
                                    style={{ backgroundColor: "#fafafa" }}
                                    className="shadow-xl"
                                  />
                                </div>
                              </div>
            
                              <div className="group-input">
                                <label className="color-label">Date of Initiation</label>
                                <div>
                                  <input
                                    type="text"
                                    value={date}
                                    onChange={(e) =>
                                      sethplc({
                                        dateOfInitiation: e.target.value,
                                      })
                                    }
                                    disabled
                                    style={{ backgroundColor: "#fafafa" }}
                                    className="shadow-xl"
                                  />
                                </div>
                              </div>
            
                              <div className="group-input">
                                <label className="color-label">
                                  Description{" "}
                                  <span className="required-asterisk text-red-500">*</span>
                                </label>
                                <div>
                                  {/* <input
                                    type="text"
                                    value={hplc.description}
                                    onChange={(e) =>
                                      sethplc({
                                        description: e.target.value,
                                      })
                                    }
                                    required // HTML5 attribute to enforce field requirement
                                  /> */}
            
                                  <TinyEditor
                                    editorContent={hplc.description}
                                    setEditorContent={setTinyContent}
                                    tinyNo={1}
                                  />
                                </div>
                              </div>
            
                              <div className="group-input">
                                <label className="color-label">Status</label>
                                <div>
                                  <input
                                    type="text"
                                    value="Under Initiation"
                                    onChange={(e) =>
                                      sethplc({ status: e.target.value })
                                    }
                                    disabled
                                    style={{ backgroundColor: "#fafafa" }}
                                    className="shadow-xl"
                                  />
                                </div>
                              </div>
                            </>
                          ) : null}
            
                          {isSelectedDetails === true ? (
                            <>
                            <div className="group-input">
                      <label className="color-label">Department</label>
                      <select
                        className="form-control"
                        name="assign_to"
                        value={hplc.department}
                        onChange={(e) =>
                          sethplc({
                            department: e.target.value,
                          })
                        }
                        disabled={[3, 2, 4].includes(
                          userDetails.roles[0].role_id
                        )}
                      >
                        <option value="">-- Select --</option>
                        <option value="Corporate Quality Assurance">
                          Corporate Quality Assurance
                        </option>
                        <option value="Quality Assurance Bio-Pharma">
                          Quality Assurance Bio-Pharma
                        </option>
                        <option value="Central Quality Control">
                          Central Quality Control
                        </option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Plasma Sourcing Grou">
                          Plasma Sourcing Group
                        </option>
                        <option value="Central Stores">Central Stores</option>
                        <option value="Information Technology Group">
                          Information Technology Group
                        </option>
                        <option value="Molecular Medicine">
                          Molecular Medicine
                        </option>
                        <option value="Central Laboratory">
                          Central Laboratory
                        </option>
                        <option value="Tech team">Tech team</option>
                      </select>
                    </div>
  
                
  
  
                    <div className="form-flex">
                      <div className="group-input">
                        <label className="color-label">
                          Reviewer
                          <span style={{ color: "red", marginLeft: "2px" }}>
                            *
                          </span>
                        </label>
                        <div>
                          <select
                            value={hplc.reviewer_id}
                            onChange={(e) => {
                              sethplc({
                                reviewer_id: e.target.value,
                              });
                            }}
                          >
                            <option value="">Select a reviewer</option>
                            {[
                              ...new Map(
                                reviewers.map((reviewer) => [
                                  reviewer.user_id,
                                  reviewer,
                                ])
                              ).values(),
                            ].map((reviewer, index) => (
                              <option key={index} value={reviewer.user_id}>
                                {reviewer.User.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="group-input">
                        <label className="color-label">
                          Approver
                          <span style={{ color: "red", marginLeft: "2px" }}>
                            *
                          </span>
                        </label>
                        <div>
                          <select
                            value={hplc.approver_id}
                            onChange={(e) => {
                              sethplc({
                                approver_id: e.target.value,
                              });
                            }}
                          >
                            <option value="">Select an approver</option>
                            {[
                              ...new Map(
                                approvers.map((approver) => [
                                  approver.user_id,
                                  approver,
                                ])
                              ).values(),
                            ].map((approver, index) => (
                              <option key={index} value={approver.user_id}>
                                {approver.User.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                           
            
                              <div>
                                <div className="AddRows d-flex ">
                                  <NoteAdd
                                  onClick={addRow}
                                  className="cursor-pointer"
                                  />
                                  <div className="addrowinstruction"></div>
                                </div>
                              </div>
                              <table>
                                <thead>
                                  <tr>
                                    <th>S no.</th>
                                    <th>Date</th>
                                    <th>Sample Name</th>
                                    <th>Reg No.</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Done by</th>
                                    <th>Checked By</th>
                                    <th>Remarks</th>
                                    {/* <th>Supporting Documents</th> */}
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allTableData.map((item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                         <input
                                          value={item.date}
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].date = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                        />
                                        </td>
                                     
                                     
   <td>
                                        <input
                                          value={item.sampleName}
                                         
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].sampleName = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                        />
                                      </td>
                                      
                                      <td>
                                        <input
                                          value={item.regNo}
                                          
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].regNo = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                        />
                                      </td>
  
  
  
  
                                      <td>
                                        <input
                                          value={item.methodUsed}
                                          // disabled
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].methodUsed = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          value={item.parameterActivity}
                                          // disabled
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].parameterActivity = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          value={item.columnNo}
                                          // disabled
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].columnNo = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                        type='time'
                                          value={item.startTime}
                                          // disabled
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].startTime = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type='time'
                                          value={item.endTime}
                                          // disabled
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].endTime = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          value={item.noOfInjection}
                                          // disabled
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].noOfInjection = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <input
                                          value={item.doneBy}
                                          // disabled
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].doneBy = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                          // readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          value={item.checkedBy}
                                          // disabled
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].checkedBy = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                          // readOnly
                                        />
                                      </td>
                                      <td>
                                        <input
                                          value={item.remarks}
                                          onChange={(e) => {
                                            const newData = [...allTableData];
                                            newData[index].remarks = e.target.value;
                                            setAllTableData(newData);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <DeleteIcon onClick={() => deleteRow(index)} />
                                        {item.differential_pressure !== "" &&
                                          (item.differential_pressure < 0.6 ||
                                            item.differential_pressure > 2.6) && (
                                            <button
                                              style={{
                                                cursor: "pointer",
                                              }}
                                              className="deviation-btn"
                                              onClick={() => {
                                                window.location.href =
                                                  "https://naveen.vidyagxp.com/deviation";
                                              }}
                                            >
                                              Deviation
                                            </button>
                                          )}
                                        {item.differential_pressure !== "" &&
                                          (item.differential_pressure < 0.6 ||
                                            item.differential_pressure > 2.6) && (
                                            <button
                                              className="deviation-btn"
                                              onClick={() => {
                                                navigate("/chart");
                                              }}
                                            >
                                              Action item
                                            </button>
                                          )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="group-input flex flex-col gap-4 mt-4 items-start">
                                <div className="flex flex-col w-full">
                                  <label className="text-sm font-medium text-gray-900 mb-1">
                                    Additional Attachment{" "}
                                    <span className="text-sm text-zinc-600">
                                      (If / Any)
                                    </span>{" "}
                                    :
                                  </label>
                                  <input
                                    type="file"
                                    name="additionalAttachment"
                                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                    onChange={handleFileChangeAttachment}
                                    disabled
                                  />
                                </div>
            
                                <div className="flex flex-col w-full">
                                  <label className="text-sm font-medium text-gray-900 mb-1">
                                    Additional Info{" "}
                                    <span className="text-sm text-zinc-600">
                                      (If / Any)
                                    </span>{" "}
                                    :
                                  </label>
                                  <textarea
                                    className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                    rows="4"
                                    value={hplc.additionalInfo}
                                    disabled
                                    onChange={(e) => {
                                      sethplc({
                                        additionalInfo: e.target.value,
                                      });
                                    }}
                                  ></textarea>
                                </div>
                              </div>
                            </>
                          ) : null}
            
                          {initiatorRemarks === true ? (
                            <>
                              <div className="form-flex">
                                <div className="group-input">
                                  <label className="color-label">
                                    Initiator Comment
                                    <span style={{ color: "red", marginLeft: "2px" }}>
                                      *
                                    </span>
                                  </label>
                                  <div className="instruction"></div>
                                  <input
                                    name="initiatorComment"
                                    onChange={(e) =>
                                      sethplc({
                                        initiatorComment: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="group-input">
                                  <label
                                    htmlFor="initiatorAttachment"
                                    className="color-label"
                                    name="initiatorAttachment"
                                  >
                                    Initiator Attachment
                                  </label>
                                  <input
                                    type="file"
                                    name="initiatorAttachment"
                                    id="initiatorAttachment"
                                    onChange={handleInitiatorFileChange}
                                  />
                                </div>
                              </div>
            
                              <div className="form-flex">
                                <div className="group-input">
                                  <label className="color-label">Initiator </label>
                                  <div>
                                    <input
                                      type="text"
                                      name="initiator"
                                      value={User?.name}
                                      disabled
                                      style={{ backgroundColor: "#fafafa" }}
                                      className="shadow-xl"
                                    />
                                  </div>
                                </div>
                                <div className="group-input">
                                  <label className="color-label">Date of Initiation</label>
                                  <div>
                                    <input
                                      type="text"
                                      value={date}
                                      disabled
                                      style={{ backgroundColor: "#fafafa" }}
                                      className="shadow-xl"
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                          {reviewerRemarks === true ? (
                            <>
                              <div className="form-flex">
                                <div className="group-input">
                                  <label className="color-label" htmlFor="reviewComment">
                                    Review Comment
                                  </label>
                                  <input
                                    id="reviewComment"
                                    name="reviewComment"
                                    value={User?.reviewComment || ""}
                                    onChange={handleInputChange1}
                                    disabled
                                    style={{ backgroundColor: "#fafafa" }}
                                    className="shadow-xl"
                                  />
                                </div>
                                <div className="group-input">
                                  <label
                                    htmlFor="reviewerAttachment"
                                    className="color-label"
                                    name="reviewerAttachment"
                                  >
                                    Reviewer Attachment
                                  </label>
                                  <input
                                    type="file"
                                    name="reviewerAttachment"
                                    id="reviewerAttachment"
                                    onChange={handleReviewerFileChange}
                                    disabled
                                    style={{ backgroundColor: "#fafafa" }}
                                    className="shadow-xl"
                                  />
                                  {User?.reviewerAttachment && (
                                    <div>
                                      <h3>
                                        Selected File:{" "}
                                        <a
                                          href={User.reviewerAttachment}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View File
                                        </a>
                                      </h3>
                                    </div>
                                  )}
                                </div>
                              </div>
            
                              <div className="form-flex">
                                <div className="group-input">
                                  <label className="color-label">Reviewer </label>
                                  <div>
                                    <input
                                      type="text"
                                      name="reviewer"
                                      value={User?.reviewer?.name}
                                      disabled
                                      style={{ backgroundColor: "#fafafa" }}
                                      className="shadow-xl"
                                    />
                                  </div>
                                </div>
                                <div className="group-input">
                                  <label className="color-label">Date of Review</label>
                                  <div>
                                    <input
                                      type="text"
                                      value={User?.date_of_review?.split("T")[0]}
                                      disabled
                                      style={{ backgroundColor: "#fafafa" }}
                                      className="shadow-xl"
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
            
                          {approverRemarks === true ? (
                            <>
                              <div className="form-flex">
                                <div className="group-input">
                                  <label className="color-label" htmlFor="approverComment">
                                    Approver Comment
                                  </label>
                                  <input
                                    id="approverComment"
                                    name="approverComment"
                                    value={User?.approverComment || ""}
                                    onChange={handleInputChange1}
                                    disabled
                                    style={{ backgroundColor: "#fafafa" }}
                                    className="shadow-xl"
                                  />
                                </div>
                                <div className="group-input">
                                  <label
                                    htmlFor="approverAttachment"
                                    className="color-label"
                                    name="aproverAttachment"
                                  >
                                    Approver Attachment
                                  </label>
                                  <input
                                    type="file"
                                    name="approverAttachment"
                                    id="approverAttachment"
                                    onChange={handleApproverFileChange}
                                    disabled
                                    style={{ backgroundColor: "#fafafa" }}
                                    className="shadow-xl"
                                  />
                                  {User?.approverAttachment && (
                                    <div>
                                      <h3>
                                        Selected File:{" "}
                                        <a
                                          href={User.approverAttachment}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          View File
                                        </a>
                                      </h3>
                                    </div>
                                  )}
                                </div>
                              </div>
            
                              <div className="form-flex">
                                <div className="group-input">
                                  <label className="color-label">Approver </label>
                                  <div>
                                    <input
                                      type="text"
                                      name="approver"
                                      value={User?.approver?.name}
                                      disabled
                                      style={{ backgroundColor: "#fafafa" }}
                                      className="shadow-xl"
                                    />
                                  </div>
                                </div>
                                <div className="group-input">
                                  <label className="color-label">Date of Approval</label>
                                  <div>
                                    <input
                                      type="text"
                                      value={User?.date_of_approval?.split("T")[0]}
                                      disabled
                                      style={{ backgroundColor: "#fafafa" }}
                                      className="shadow-xl"
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                        <div className="button-block" style={{ width: "100%" }}>
                          <button
                            className="themeBtn"
                            onClick={() => {
                              setIsPopupOpen(true);
                            }}
                          >
                            Save
                          </button>
                          <button
                            className="themeBtn"
                            onClick={() => navigate("/dashboard")}
                          >
                            Exit
                          </button>
                        </div>
                        {isPopupOpen && (
                          <UserVerificationPopUp
                            onClose={handlePopupClose}
                            onSubmit={handlePopupSubmit}
                          />
                        )}
                      </div>
            </div>
  
          </div>
      </div>
    )
  }

export default UVvisCalibration