// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login.jsx";
import Desktop from "./pages/Desktop/Desktop.jsx";
import DiffrentialPressure from "./pages/configForms/DiffrentialPressureRecord/DiffrentialPressure.jsx";
import AreaAndEquiment from "./pages/configForms/AreaAndEquipment/AreaAndEquiment.jsx";
import EquipmentCleaningCheckList from "./pages/configForms/EquipmentCheckList/EquipmentCleaningCheckList.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/desktop" element={<Desktop />} />
          <Route path="/differential-pressure-record" element={<DiffrentialPressure />} />
          <Route path="/area-and-equiment-usage-log" element={<AreaAndEquiment />} />
          <Route path="/equipment-cleaning-checklist" element={<EquipmentCleaningCheckList />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer autoClose={2000} pauseOnHover={false} />
    </>
  );
}

export default App;
