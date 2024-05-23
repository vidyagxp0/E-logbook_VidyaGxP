import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/sidebar";
import AdminHeaderTop from "../../../components/Header/AdminHeader";
// import "../adminDashboard/";

function AdminSettings() {
  

  return (
    <>
      <AdminHeaderTop />
      <div className="admin-dashboard">
        <Sidebar /> {/* Include the Sidebar component */}
        <div className="main-content"></div>
      </div>
    </>
  );
}

export default AdminSettings;
