import React, { useEffect, useState } from "react";
import HeaderTop from "../../../components/Header/HeaderTop";
import Sidebar from "../../../components/sidebar/sidebar";
// import "../adminDashboard/";

function AdminSettings() {
  

  return (
    <>
      <HeaderTop />
      <div className="admin-dashboard">
        <Sidebar /> {/* Include the Sidebar component */}
        <div className="main-content"></div>
      </div>
    </>
  );
}

export default AdminSettings;
