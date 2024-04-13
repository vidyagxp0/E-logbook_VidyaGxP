import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login.jsx";
import Desktop from "./pages/Desktop/Desktop.jsx";
import DiffrentialPressure from "./pages/configForms/DiffrentialPressureRecord/DiffrentialPressure.jsx";
import AreaAndEquiment from "./pages/configForms/AreaAndEquipment/AreaAndEquiment.jsx";
import EquipmentCleaningCheckList from "./pages/configForms/EquipmentCheckList/EquipmentCleaningCheckList.jsx";
import { Provider } from "react-redux";
import store from "./store.js";
import Chart from "./chart/Chart.jsx";
import Analytics from "./pages/analytics/Analytics.jsx";
import DPRpanel from "./pages/documentPanels/Dpr/DPRpanel.jsx";
import TemperatureRecords from "./pages/configForms/TemperatureRecords/TemperatureRecords.jsx";
import TempretureRecordsPanel from "./pages/documentPanels/TempreratureRecordsPanel/TempretureRecordsPanel.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import EquipmentCleaningCheckListPanel from "./pages/documentPanels/EquipmentChecklistPanel/EquipmentCleaningChecklistPanel.jsx";
import AreaAndEquipmentPanel from "./pages/documentPanels/AreaAndEquipmentPanel/AreaAndEquipmentPanel.jsx";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/chart" element={<Chart />} />
            <Route path="/" element={<Login />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/dpr-panel" element={<DPRpanel />} />
            <Route path="/tpr-panel" element={<TempretureRecordsPanel />} />
            <Route path="/ecc-panel" element={<EquipmentCleaningCheckListPanel />} />
            <Route path="/area-and-equiment-panel" element={<AreaAndEquipmentPanel/>} />
            <Route path="/desktop" element={<Desktop />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/differential-pressure-record" element={<DiffrentialPressure />} />
            <Route path="/area-and-equiment-usage-log" element={<AreaAndEquiment />} />
            <Route path="/equipment-cleaning-checklist" element={<EquipmentCleaningCheckList />} />
            <Route path="/temperature-records" element={<TemperatureRecords/>}/>
          </Routes>
        </BrowserRouter>
        <ToastContainer autoClose={2000} pauseOnHover={false} />
      </Provider>
    </>
  );
}

export default App;
