import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // You can create a separate CSS file for styles

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Dashboard</h2>
      </div>
      <ul className="sidebar-menu">
        <li >
          <Link to="/admin-dashboard" activeClassName="active" >
            User Management
          </Link>
        </li>
        <li>
          <Link to="/admin-settings" activeClassName="active">Settings</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
