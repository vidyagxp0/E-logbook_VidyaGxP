/* eslint-disable react/prop-types */
import { useState } from "react";
import "./UserVerificationPopUp.css";

const UserVerificationPopUp = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [declaration, setDeclaration] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password, declaration });
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>E-signature</h2>
        {/* <h4> Before saving, kindly ensure all fields are filled correctly. Changes cannot be edited once saved.</h4> */}
        
<h4 className="text-sm text-gray-600 bg-yellow-100 border border-yellow-300 p-2 rounded-md mt-5">
  Note: Before saving, kindly ensure all fields are filled correctly. Changes cannot be edited once saved.
</h4>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-5">
            <label className="color-label">
              Email <span className="required-asterisk text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="color-label">
              Password <span className="required-asterisk text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* <div className="form-group">
            <label className="color-label">
              Declaration{" "}
              <span className="required-asterisk text-red-500">*</span>
            </label>
            <input
              type="string"
              value={declaration}
              onChange={(e) => setDeclaration(e.target.value)}
              required
            />
          </div> */}
          <div className="popup-buttons">
            <button type="submit" className="btn">
              Submit
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserVerificationPopUp;
