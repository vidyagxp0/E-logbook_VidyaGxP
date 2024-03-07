import React, { useReducer, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import "../ConfigForms.css";

import { MultiSelect } from "react-multi-select-component";
import {
  docFormFile,
} from "./AreaAndEquimentFunction.jsx";


import Grid from "../../../components/datafields/Grid.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function AreaAndEquiment() {
  const [isSelectedGeneral, setIsSelectedGeneral] = useState(true)
  const [isSelectedDetails, setIsSelectedDetails] = useState(false)
  const uniqueId = "ABC/" + Math.floor(Math.random() * 1000).toString().padStart(3, '0') + "/" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const date = getCurrentDate()
  const [areaAndEquiment, setAreaAndEquiment] = useReducer(
    (prev, next) => ({
      ...prev,
      ...next,
    }),
    {
      eLogId: uniqueId,
      area: "",
      areaCode: "",
      initiator: "",
      dateOfInitiation: date.currentDate,
      shortDescription: "",
      status: "",
      description: "",
      process: "Area and equipment"
    }
  );

  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const currentDate = `${day}/${month}/${year}`;

    return {
      currentDate: currentDate,
    };
  }
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const createObject = (newObject) => {
    dispatch({ type: "AREAANDEQUIPMENT_DATA", payload: newObject });
  };

  const handleSave = (data) => {
    toast.success("eLog Saved Successfully!");
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
    createObject(data);
    navigate("/desktop");
  }

  return (
    <>
      <HeaderTop />
      <div id="main-form-container">
        <div id="config-form-document-page">
          <div className="top-block">
            <div>
              <strong> Record Name:&nbsp;</strong>Document
            </div>
            <div>
              <strong> Site:&nbsp;</strong>
              India
            </div>
            <div>
              <strong> Current Status:&nbsp;</strong>Under Initiation
            </div>
            <div>
              <strong> Initiated By:&nbsp;</strong>
              Amit Guru
            </div>
          </div>

          <div className="document-form">
            <div className="details-form-data">
              <div className="sop-type-header">
                <div className="logo">
                  <img src="/lifelogo.png" alt="..." />
                </div>
                <div className="main-head">
                  <div>LifeLink Digital </div>
                  {/* <div>Environmental Laboratory</div> */}
                </div>
              </div>
              <div className="sub-head-2">Area and Equipment Usage Log</div>
              <div className="btn-forms">
                <div className={`${isSelectedGeneral === true ? "btn-forms-isSelected" : "btn-forms-select"}`} onClick={() => { setIsSelectedGeneral(true), setIsSelectedDetails(false) }}>General Information</div>
                <div className={`${isSelectedDetails === true ? "btn-forms-isSelected" : "btn-forms-select"}`} onClick={() => { setIsSelectedDetails(true), setIsSelectedGeneral(false) }}> Details</div>
              </div>


              {isSelectedGeneral === true ? <>   <div className="group-input">
                <label className="color-label">Initiator </label>
                <div>
                  <input type="text" value={areaAndEquiment.initiator} onChange={(e) => setAreaAndEquiment({ initiator: e.target.value })} />
                </div>
              </div>

                <div className="group-input">
                  <label className="color-label">Date of Initiaton</label>
                  <div>
                    <input type="text" value={date.currentDate} onChange={(e) => setAreaAndEquiment({ dateOfInitiation: e.target.value })} />
                  </div>
                </div>

                <div className="group-input">
                  <label className="color-label">Short Description</label>
                  <div>
                    <input type="text" value={areaAndEquiment.shortDescription} onChange={(e) => setAreaAndEquiment({ shortDescription: e.target.value })} />
                  </div>
                </div>

                <div className="group-input">
                  <label className="color-label">Description</label>
                  <div>
                    <input type="text" value={areaAndEquiment.description} onChange={(e) => setAreaAndEquiment({ description: e.target.value })} />
                  </div>
                </div>

                <div className="group-input">
                  <label className="color-label">Status</label>
                  <div>
                    <input type="text" value={areaAndEquiment.status} onChange={(e) => setAreaAndEquiment({ status: e.target.value })} />
                  </div>
                </div></> : null}

              {isSelectedDetails === true ? <> <div className="group-input">
                <label className="color-label">Area </label>
                <div>
                  <input type="text" value={areaAndEquiment.area} onChange={(e) => setAreaAndEquiment({ area: e.target.value })} />
                </div>
              </div>
                <div className="group-input">
                  <label className="color-label">Area Code </label>
                  <div>
                    <input type="text" value={areaAndEquiment.areaCode} onChange={(e) => setAreaAndEquiment({ areaCode: e.target.value })} />
                  </div>
                </div>

                {/* <Grid
                  label={docFormFile[2].label}
                  coloredLabel={docFormFile[2].coloredLabel}
                  required={docFormFile[2].required}
                  instruction={docFormFile[2].instruction}
                  columnList={docFormFile[0].columnList}
                /> */}

                <table  >
                  <thead>
                    <tr>
                      <th className="width-date" ><div className="area-table-date">Date</div></th>
                      <th><div className="width-product">Product</div></th>
                      <th className="width-batchNo" ><div className="" >Batch No</div></th>
                      <th className="width-typeOfActivity"><div className="">Type of Activity</div></th>
                      <th className="width-reasonForCleaning" ><div className="">Reason For Cleaning</div></th>
                      <th className="width-area" rowSpan={"3"}><div className="">Area</div></th>
                      <th className="" ><div className="table-equipmentName">Equipment Name</div> <div>Code</div></th>
                      <th ><div className="table-equipmentName">Equipment Name</div> <div>Code</div></th>
                      <th className="width-checkedBy" ><div className="">Chec ked by</div></th>
                      <th className="width-remark" ><div className="">Remark</div></th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="height-table-tr1">
                      <td style={{height:"200px"}}></td>
                      <td></td>
                      <td></td>
                      <td>OP / QL / PM / BM </td>
                      <td>PP / CB / CD / BD / CO / PM / CV / CR / BB / ID /  SS / ES </td>

                      <td className="removedBorder3" rowSpan={"3"}>
                      <table className="removedBorder3" id="2">
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3"   >
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3" >
                                <table className="removedBorder3" id="3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {/* <table className="removedBorder3" id="1">
                          <thead className="removedBorder3" >
                            <tr className="removedBorder3">
                              <td >Activity Time</td>
                              <td>Cleaning Time</td>
                            </tr>
                          </thead>
                        
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3">
                                <table className="removedBorder3" id="2">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3">
                                <table className="removedBorder3" id="3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                          
                        </table> */}
                      </td>


                      <td className="removedBorder3" rowSpan={"3"}>
                      <table className="removedBorder3" id="2">
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3"   >
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3" >
                                <table className="removedBorder3" id="3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {/* <table className="removedBorder3">
                          <thead className="removedBorder3">
                          <tr className="removedBorder3">
                              <td>Activity Time</td>
                              <td>Cleaning Time</td>
                            </tr>
                          </thead>
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td > 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr>
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table> */}
                      </td>


                      <td className="removedBorder3" rowSpan={"3"}>

                      <table className="removedBorder3" id="2">
                           <tr className="removedBorder3">
                              <td colspan="4" className="removedBorder3">Activity Time</td>
                            </tr>
                            <tr>
                            <td colspan="5" className="removedBorder3">Cleaning Time</td>
                            </tr>
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3"   >
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3" >
                                <table className="removedBorder3" id="3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {/* <table className="removedBorder3" >
                          <thead className="removedBorder3">
                          <tr className="removedBorder3">
                              <td>Activity Time</td>
                              <td>Cleaning Time</td>
                            </tr>
                          </thead>
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td > 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table> */}
                      </td>

                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>

                  <tbody>
                    <tr className="height-table-tr1">
                      <td>01/ 02/ 21</td>
                      <td>
                        <select name="product" id="product" className="table-select">
                          <option value="product1">product 1</option>
                          <option value="product2">product 2</option>
                          <option value="product3">product 3</option>
                        </select>
                      </td>
                      <td>ATBBV0001</td>
                      <td>Operation </td>
                      <td>NA </td>

                      <td className="removedBorder3" >
                        <table className="removedBorder3" id="2">
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3"   >
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3" >
                                <table className="removedBorder3" id="3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td className="removedBorder3" >
                        <table className="removedBorder3">
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td className="removedBorder3" >
                        <table className="removedBorder3">
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td className="table-td-eSign">E-sign</td>
                      <td></td>
                    </tr>
                  </tbody>

                  <tbody className="removedBorder3">
                    <tr className="height-table-tr1">
                      <td>01/ 02/ 21</td>
                      <td>
                        <select name="product" id="product" className="table-select">
                          <option value="product1">product 1</option>
                          <option value="product2">product 2</option>
                          <option value="product3">product 3</option>
                        </select>
                      </td>
                      <td>ATBBV0001</td>
                      <td>Operation </td>
                      <td>NA </td>

                      <td className="removedBorder3">
                        <table className="removedBorder3">
                          <tbody className="removedBorder2">
                            <tr className="removedBorder3">
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td > 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td className="removedBorder3">
                        <table className="removedBorder3">
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td className="removedBorder3">
                        <table className="removedBorder3">
                          <tbody className="removedBorder3">
                            <tr className="removedBorder3">
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                              <td className="removedBorder3">
                                <table className="removedBorder3">
                                  <tr className="removedBorder3">
                                    <td> 1</td>
                                    <td> 2</td>
                                    <td> 3</td>
                                    <td> 4</td>
                                    <td> 4</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td className="table-td-eSign">E-sign</td>
                      <td></td>
                    </tr>
                  </tbody>

       
                </table>

                <table>
                  <tbody>
                    <tr className="height-table-tr1">
                      <td className="table-typeOfActiviy">
                        Type of Activity :
                      </td>
                      <td>
                        <table >
                          <tbody >
                            <tr ><td className="removedBorder3">OP</td></tr>
                            <tr> <td className="removedBorder2">QL</td></tr>
                            <tr> <td className="removedBorder2">PM</td></tr>
                            <tr> <td className="removedBorder2">BM</td></tr>
                            <tr> <td className="removedBorder2">NA</td></tr>
                          </tbody>
                        </table>

                      </td>
                      <td>
                        <table> <tbody>
                          <tr>
                            <td className="removedBorder3">Operation</td>
                          </tr>
                          <tr>
                            <td className="removedBorder2">Qualification</td>
                          </tr>
                          <tr>
                            <td className="removedBorder2">Preventive Maintenance</td>
                          </tr>
                          <tr>
                            <td className="removedBorder2">Breakdown Maintenance</td>
                          </tr>
                          <tr>
                            <td className="removedBorder2">No Activity</td>
                          </tr>
                        </tbody>
                        </table>
                      </td>

                      <td>
                        <table> <tbody>
                          <tr>
                            <td className="removedBorder3">For Type A Cleaning</td>
                          </tr>
                          <tr>
                            <td className="removedBorder2">PP (Product to Product changeover)</td>
                          </tr>
                          <tr>
                            <td className="removedBorder2">CB (More than 5 campaign batches) </td>
                          </tr>
                          <tr>
                            <td className="removedBorder2">CD (More than 6 campaign days)</td>
                          </tr>
                          <tr>
                            <td className="removedBorder2">BD (Breakdown)</td>
                          </tr>
                        </tbody>
                        </table>

                      </td>
                      <td className="">
                        <table>
                          <tbody>
                            <tr>
                              <td className="removedBorder3">For Type B Cleaning</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">BB (Batch to Batch changeover)</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">ES (End of shift)</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2"> -</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">- </td>
                            </tr>
                          </tbody>
                        </table>

                      </td>

                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td className="removedBorder3">For Type C Cleaning</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">SS (Start of shift)</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">ID (Idle condition)</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">-</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">-</td>
                            </tr>
                          </tbody>
                        </table>

                      </td>


                    </tr>
                  </tbody>
                  <tbody>
                    <tr className="height-table-tr1">
                      <td className="table-typeOfActiviy">
                        Type of Cleaning :
                      </td>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td className="removedBorder3">A</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">B</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">C</td>
                            </tr>
                          </tbody>

                        </table>

                      </td>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td className="removedBorder3">Product To Product</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">Batch To Batch</td>
                            </tr>
                            <tr>
                              <td className="removedBorder2">Start of shift, End of shift and incase of idle condition</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td>
                        <table>
                          <tbody>
                            <tr><td className="removedBorder3">PM (Preventive Maintenance) </td></tr>
                            <tr><td className="removedBorder2">CO (After cleaning validity is overdue)</td></tr>
                            <tr><td className="removedBorder2">CV (Cleaning Validation)</td></tr>
                          </tbody>
                        </table>

                      </td>
                      <td className="">
                        <table>
                          <tbody>
                            <tr><td className="removedBorder3">-</td></tr>
                            <tr><td className="removedBorder2">-</td></tr>
                            <tr><td className="removedBorder2">-</td></tr>

                          </tbody>
                        </table>
                      </td>

                      <td>
                        <table>
                          <tbody>
                            <tr><td className="removedBorder3">-</td></tr>
                            <tr><td className="removedBorder2">-</td></tr>
                            <tr><td className="removedBorder2">-</td></tr>
                          </tbody>
                        </table>

                      </td>


                    </tr>
                  </tbody>
                </table>

              </> : null}


              <div className="button-block" style={{ width: "100%" }}>
                <button className="themeBtn" onClick={() => handleSave(areaAndEquiment)}>
                  Save
                </button>
                <button className="themeBtn" onClick={() => navigate("/desktop")}>
                  Exit
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
