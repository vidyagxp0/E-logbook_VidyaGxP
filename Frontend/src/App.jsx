import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login.jsx";
import AdminLogin from "./pages/admin/adminLogin/adminLogin.jsx";
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
import ProtectedRoute from "./components/protectedRoutes/protectedUserRoutes.jsx";
import AdminDashboard from "./pages/admin/adminDashboard/adminDashboard.jsx";
import ProtectedAdminRoute from "./components/protectedRoutes/protectedAdminRoutes.jsx";
import AddNewUser from "./pages/admin/addUser/addUser.jsx";
import AdminSettings from "./pages/admin/AdminSettings/AdminSettings.jsx";
import EditUser from "./pages/admin/EditUser/EditUser.jsx";
import Wrapper from "./pages/Wrapper.jsx";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="" element={<Wrapper />}>
              <Route
                path="/admin-dashboard"
                element={<ProtectedAdminRoute element={<AdminDashboard />} />}
              />
              <Route
                path="/admin-add-user"
                element={<ProtectedAdminRoute element={<AddNewUser />} />}
              />
              <Route
                path="/admin-edit-user"
                element={<ProtectedAdminRoute element={<EditUser />} />}
              />
              <Route
                path="/admin-settings"
                element={<ProtectedAdminRoute element={<AdminSettings />} />}
              />
            </Route>
            <Route
              path="/chart"
              element={<ProtectedRoute element={<Chart />} />}
            />
            <Route
              path="/analytics"
              element={<ProtectedRoute element={<Analytics />} />}
            />
            <Route
              path="/dpr-panel"
              element={<ProtectedRoute element={<DPRpanel />} />}
            />
            <Route
              path="/tpr-panel"
              element={<ProtectedRoute element={<TempretureRecordsPanel />} />}
            />
            <Route
              path="/ecc-panel"
              element={
                <ProtectedRoute element={<EquipmentCleaningCheckListPanel />} />
              }
            />
            <Route
              path="/area-and-equipment-panel"
              element={<ProtectedRoute element={<AreaAndEquipmentPanel />} />}
            />
            <Route
              path="/desktop"
              element={<ProtectedRoute element={<Desktop />} />}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/differential-pressure-record"
              element={<ProtectedRoute element={<DiffrentialPressure />} />}
            />
            <Route
              path="/area-and-equiment-usage-log"
              element={<ProtectedRoute element={<AreaAndEquiment />} />}
            />
            <Route
              path="/equipment-cleaning-checklist"
              element={
                <ProtectedRoute element={<EquipmentCleaningCheckList />} />
              }
            />
            <Route
              path="/temperature-records"
              element={<ProtectedRoute element={<TemperatureRecords />} />}
            />
          </Routes>
        </BrowserRouter>
        <ToastContainer autoClose={2000} pauseOnHover={false} />
      </Provider>
    </>
  );
}

export default App;
