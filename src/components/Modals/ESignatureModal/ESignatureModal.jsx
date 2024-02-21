
import "./ESignatureModal.css";
import { useState , useEffect } from "react";
import { useDispatch } from 'react-redux';
import { saveSignature } from "../../../actions";

function ESignatureModal(_props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [comment, setComment] = useState("");
  const currentUsername = localStorage.getItem("username");
  const currentPassword = localStorage.getItem("password");
  const dispatch = useDispatch();
  function handleSubmit() {
    if (!username || !password) {
      alert('Please fill in all fields.');
      return;
    }

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    dispatch(
      saveSignature({
        username:username,
        password:password,
        comment:comment,
      })
    );
    _props.closeModal();
  }
 
  useEffect(() => {
    function exportData() {
      return { username: currentUsername, password: currentPassword };
    }
    const exportedData = exportData();
    console.log(exportedData);
    // Use the exportedData in other parts of your code here...
  }, [currentUsername, currentPassword]);
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
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="group-input-2">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="group-input-2">
              <label>Comments</label>
              <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
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
