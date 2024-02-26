
import "./ESignatureModal.css";
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { saveSignature } from "../../../actions";
import { useReducer } from "react";

function ESignatureModal(_props) {
 
  
  const [eSignatureData, setESignatureData] = useReducer((prev, next) => ({ ...prev, ...next }), {
    username: "",
    password: "", comment: ""
  })
  console.log(eSignatureData, "eSignatureData")
  const dispatch=useDispatch()
  function handleSubmit() {
    if (!eSignatureData.username || !eSignatureData.password) {
      alert('Please fill in all fields.');
      return;
    }
    // localStorage.setItem('username', username);
    // localStorage.setItem('password', password);
    dispatch(
      saveSignature({
        username:eSignatureData.username,
        password:eSignatureData.password,
        comment:eSignatureData.comment,
      })
    );
    _props.closeModal();
  }

  // useEffect(() => {
  //   function exportData() {
  //     return { username: currentUsername, password: currentPassword };
  //   }
  //   const exportedData = exportData();
  //   console.log(exportedData);
  //   // Use the exportedData in other parts of your code here...
  // }, [currentUsername, currentPassword]);
  return (
    <>
      <div className="custom-modal" id="e-signature-modal">
        <div className="modal-container">
          <div className="modal-top">
            <div className="head">E-Signature</div>
            <div className="close-modal" onClick={_props.closeModal}>
              x
            </div>
          </div>

          <div className="modal-middle">
            <div className="group-input-2">
              <label>Username</label>
              <input type="text" value={eSignatureData.username} onChange={(e) => setESignatureData({ username: e.target.value })} />
            </div>
            <div className="group-input-2">
              <label>Password</label>
              <input type="password" value={eSignatureData.password} onChange={(e) => setESignatureData({ password: e.target.value })} />
            </div>
            <div className="group-input-2">
              <label>Comments</label>
              <input type="text" value={eSignatureData.comment} onChange={(e) => setESignatureData({ comment: e.target.value })} />
            </div>
          </div>

          <div className="modal-bottom">
            <div className="modal-btn btn-1" onClick={handleSubmit}>
              Submit
            </div>
            <div className="modal-btn btn-2" onClick={_props.closeModal}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ESignatureModal;
