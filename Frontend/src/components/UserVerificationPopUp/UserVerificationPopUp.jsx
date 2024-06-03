/* eslint-disable react/prop-types */
import { useState } from 'react';
import './UserVerificationPopUp.css';

const UserVerificationPopUp = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Enter Credentials</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="popup-buttons">
            <button type="submit" className="btn">Submit</button>
            <button type="button" className="btn" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserVerificationPopUp;
