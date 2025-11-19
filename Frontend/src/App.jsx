import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login/Login.jsx";
import AdminLogin from "./pages/admin/adminLogin/adminLogin.jsx";
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
import AdminSites from "./pages/admin/AdminSites/AdminSites.jsx";
import EditUser from "./pages/admin/EditUser/EditUser.jsx";
import Wrapper from "./pages/Wrapper.jsx";
import AdminProcesses from "./pages/admin/AdminProcesses/AdminProcesses.jsx";
import DuplicateUser from "./pages/admin/DuplicateUser/DuplicateUser.jsx";
import AuditTrail from "./pages/AuditTrail/AuditTrail.jsx";
import LoadedQuantity from "./pages/configForms/LoadedQuantity/LoadedQuantity.jsx";
import OperationOfSterilizer from "./pages/configForms/OperationOfSterilizer/OperationOfSterilizer.jsx";
import MediaRecord from "./pages/configForms/MediaRecord/MediaRecord.jsx";
import DispensingOfMaterials from "./pages/configForms/DispensingOfMaterials/DispensingOfMaterials.jsx";
import LoadedQuantityPanels from "./pages/documentPanels/LoadedQuantityPanels/LoadedQuantityPanels.jsx";
import MediaRecordPanel from "./pages/documentPanels/MediaRecordPanel/MediaRecordPanel.jsx";
import OperationOfSterilizerPanel from "./pages/documentPanels/OperationOfSterilizerPanel/OperationOfSterilizerPanel.jsx";
import DispensingOfMaterialsPanel from "./pages/documentPanels/DispensingOfMaterialsPanel/DispensingOfMaterialsPanel.jsx";
import Analytics2 from "./pages/analytics2/Analytics2.jsx";
import EffectiveElogs from "./pages/Dashboard/EffectiveElogs.jsx";
import ViewReport from "./components/viewReport/ViewReport.jsx";
import DPREffective from "./pages/Dashboard/EffectiveElogs/DiffrentialPressureEffective.jsx";
import TempretureRecordsEffective from "./pages/Dashboard/EffectiveElogs/TemperatureRecordsEffective.jsx";
import LoadedQuantityEffective from "./pages/Dashboard/EffectiveElogs/LoadedQuantityEffective.jsx";
import OperationOfSterilizerEffective from "./pages/Dashboard/EffectiveElogs/OperationOfSterilizerEffective.jsx";
import MediaRecordEffective from "./pages/Dashboard/EffectiveElogs/MediaRecordEffective.jsx";
import DispensingOfMaterialsEffective from "./pages/Dashboard/EffectiveElogs/DispensingOfMaterialsEffective.jsx";
import ExcelSelectWithFileInput from "./pages/TestPages/ExcelImport.jsx";
import Effective_ViewReport from "./components/viewReport/Effective_ViewReport.jsx";
import Effective_AuditTrail from "./pages/AuditTrail/Effective_AuditTrail.jsx";
import AdvancedAnalytics from "./pages/analytics/AdvancedAnalytics.jsx";
import AnalyticalBalance from "./pages/configForms/AnalyticalBalance/AnalyticalBalance.jsx";
import Karl from "./pages/configForms/Karl/Karl.jsx";
import Hplc from "./pages/configForms/HPLC/Hplc.jsx";
import AnalitycalBalancePanel from "./pages/documentPanels/AnalitycalBalance/AnalitycalBalancePanel.jsx";
import AnalyticalBalanceEffective from "./pages/Dashboard/EffectiveElogs/AnalyticalBalanceEffective.jsx";
import KarlFischerPanel from "./pages/documentPanels/KarlFischerPanel/KarlFischerPanel.jsx";
import KarlFischerEffective from "./pages/Dashboard/EffectiveElogs/KarlFischerEffective.jsx";
import HplcPanel from "./pages/documentPanels/HPLC/HplcPanel.jsx";
import HplcEffective from "./pages/Dashboard/EffectiveElogs/HplcEffective.jsx";
import PhMeterOpCal from "./pages/configForms/PhMeterOpCal/PhMeterOpCalNew.jsx";
import PhMeterOpCalPanel from "./pages/documentPanels/PhMeterOpCalNew/PhMeterOpCalNewPanel.jsx";
import PhMeterOpCalEffective from "./pages/Dashboard/EffectiveElogs/PhMeterOpCalEffective.jsx";
import UVvisCalibration from "./pages/configForms/UVvisCalibration/UVvisCalibration.jsx";
import UVvisCalibrationPanel from "./pages/documentPanels/UVvisCalibration/UVvisCalibrationPanel.jsx";
import UVvisCalibrationEffective from "./pages/Dashboard/EffectiveElogs/UVvisCalibrationEffective.jsx";
import SdsPagePanel from "./pages/documentPanels/SdsPage/SdsPagePanel.jsx";
import SdsPage from "./pages/configForms/SdsPage/SdsPage.jsx";
import SdsPageEffective from "./pages/Dashboard/EffectiveElogs/SdsPageEffective.jsx";
import GelDocIGeneEffective from "./pages/Dashboard/EffectiveElogs/GelDocIGeneEffective.jsx";
import GelDocIGenePanel from "./pages/documentPanels/GelDocIGene/GelDocIGenePanel.jsx";
import GelDocIGene from "./pages/configForms/GelDocIGene/GelDocIGene.jsx";
import UvWlTransilluminatorPanel from "./pages/documentPanels/UvWlTransilluminator/UvWlTransilluminatorPanel.jsx";
import UvWlTransilluminator from "./pages/configForms/UvWlTransilluminator/UvWlTransilluminator.jsx";
import UvWITransilluminatorEffective from "./pages/Dashboard/EffectiveElogs/UvWlTransilluminatorEffective.jsx";
import VacuumOvenOpEffective from "./pages/Dashboard/EffectiveElogs/VacuumOvenOpEffective.jsx";
import VacuumOvenOpPanel from "./pages/documentPanels/VacuumOvenOp/VacuumOvenOpPanel.jsx";
import VacuumOvenOp from "./pages/configForms/VacuumOvenOp/VacuumOvenOp.jsx";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/test" element={<ExcelSelectWithFileInput />} />  */}

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
                path="/duplicate-user"
                element={<ProtectedAdminRoute element={<DuplicateUser />} />}
              />
              <Route
                path="/admin-sites"
                element={<ProtectedAdminRoute element={<AdminSites />} />}
              />
              <Route
                path="/admin-processes"
                element={<ProtectedAdminRoute element={<AdminProcesses />} />}
              />
            </Route>
            <Route
              path="/chart"
              element={<ProtectedRoute element={<Chart />} />}
            />
            <Route
              path="/analytics2"
              element={<ProtectedRoute element={<Analytics />} />}
            />
            <Route
              path="/analytics"
              element={<ProtectedRoute element={<Analytics />} />}
            />
            <Route
              path="/audit-trail"
              element={<ProtectedRoute element={<AuditTrail />} />}
            />
            <Route
              path="/effective-audit-trail"
              element={<ProtectedRoute element={<Effective_AuditTrail />} />}
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
              path="/effective-dispensing-of-material"
              element={
                <ProtectedRoute element={<DispensingOfMaterialsEffective />} />
              }
            />
            <Route
              path="/effective-media-record"
              element={<ProtectedRoute element={<MediaRecordEffective />} />}
            />
            <Route
              path="/effective-operation-of-sterilizer"
              element={
                <ProtectedRoute element={<OperationOfSterilizerEffective />} />
              }
            />
            <Route
              path="/effective-loaded-quantity"
              element={<ProtectedRoute element={<LoadedQuantityEffective />} />}
            />
            <Route
              path="/effective-tpr"
              element={
                <ProtectedRoute element={<TempretureRecordsEffective />} />
              }
            />
            <Route
              path="/effective-dpr"
              element={<ProtectedRoute element={<DPREffective />} />}
            />
            <Route
              path="/effective-analytical-balance"
              element={
                <ProtectedRoute element={<AnalyticalBalanceEffective />} />
              }
            />
            <Route
              path="/effective-karl-fischer"
              element={<ProtectedRoute element={<KarlFischerEffective />} />}
            />
            <Route
              path="/effective-hplc"
              element={<ProtectedRoute element={<HplcEffective />} />}
            />
            <Route
              path="/effective-pHMeterOpCal"
              element={<ProtectedRoute element={<PhMeterOpCalEffective />} />}
            />
            <Route
              path="/effective-uv-vis-calibration"
              element={<ProtectedRoute element={<UVvisCalibrationEffective />} />}
            />
            <Route
              path="/effective-sds-page"
              element={<ProtectedRoute element={<SdsPageEffective />} />}
            />
            <Route
              path="/effective-gel-doc-igene"
              element={<ProtectedRoute element={<GelDocIGeneEffective />} />}
            />
            <Route
              path="/effective-uv-wl-transilluminator"
              element={<ProtectedRoute element={<UvWITransilluminatorEffective />} />}
            />
            <Route
              path="/effective-vo-calibration"
              element={<ProtectedRoute element={<VacuumOvenOpEffective />} />}
            />

            <Route
              path="/area-and-equipment-panel"
              element={<ProtectedRoute element={<AreaAndEquipmentPanel />} />}
            />
            <Route
              path="/loaded-quantity-panel"
              element={<ProtectedRoute element={<LoadedQuantityPanels />} />}
            />
            <Route
              path="/media-record-panel"
              element={<ProtectedRoute element={<MediaRecordPanel />} />}
            />
            <Route
              path="/operation-of-sterilizer-panel"
              element={
                <ProtectedRoute element={<OperationOfSterilizerPanel />} />
              }
            />
            <Route
              path="/dispensing-of-material-panel"
              element={
                <ProtectedRoute element={<DispensingOfMaterialsPanel />} />
              }
            />
            <Route
              path="/analytical-balance-panel"
              element={<ProtectedRoute element={<AnalitycalBalancePanel />} />}
            />
            <Route
              path="/karl-fischer-panel"
              element={<ProtectedRoute element={<KarlFischerPanel />} />}
            />
            <Route
              path="/PhMeterOpCal-panel"
              element={<ProtectedRoute element={<PhMeterOpCalPanel />} />}
            />
            <Route
              path="/uv-vis-calibration-panel"
              element={<ProtectedRoute element={<UVvisCalibrationPanel />} />}
            />
            <Route
              path="/vo-calibration-panel"
              element={<ProtectedRoute element={<VacuumOvenOpPanel />} />}
            />
            <Route
              path="/sds-page-panel"
              element={<ProtectedRoute element={<SdsPagePanel />} />}
            />
            <Route
              path="/gel-doc-igene-panel"
              element={<ProtectedRoute element={<GelDocIGenePanel />} />}
            />
            <Route
              path="/uv-wl-transilluminator-panel"
              element={<ProtectedRoute element={<UvWlTransilluminatorPanel />} />}
            />
            <Route
              path="/hplc-panel"
              element={<ProtectedRoute element={<HplcPanel />} />}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/effectiveElogs"
              element={<ProtectedRoute element={<EffectiveElogs />} />}
            />
            <Route
              path="/differential-pressure-record"
              element={<ProtectedRoute element={<DiffrentialPressure />} />}
            />
            <Route
              path="/analytical-balance"
              element={<ProtectedRoute element={<AnalyticalBalance />} />}
            />
            <Route
              path="/karl-fischer"
              element={<ProtectedRoute element={<Karl />} />}
            />
            <Route
              path="/pHMeter-OpCal"
              element={<ProtectedRoute element={<PhMeterOpCal />} />}
            />
            <Route
              path="/uv-vis-calibration"
              element={<ProtectedRoute element={<UVvisCalibration />} />}
            />
            <Route
              path="/vo-calibration"
              element={<ProtectedRoute element={<VacuumOvenOp />} />}
            />
            <Route
              path="/sds-page"
              element={<ProtectedRoute element={<SdsPage />} />}
            />
            <Route
              path="/gel-doc-igene"
              element={<ProtectedRoute element={<GelDocIGene />} />}
            />
            <Route
              path="/uv-wl-transilluminator"
              element={<ProtectedRoute element={<UvWlTransilluminator />} />}
            />
            <Route
              path="/hplc"
              element={<ProtectedRoute element={<Hplc />} />}
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
            <Route
              path="/loaded-quantity"
              element={<ProtectedRoute element={<LoadedQuantity />} />}
            />
            <Route
              path="/operations-of-sterilizer"
              element={<ProtectedRoute element={<OperationOfSterilizer />} />}
            />
            <Route
              path="/media-record"
              element={<ProtectedRoute element={<MediaRecord />} />}
            />
            <Route
              path="/dispensing-of-material"
              element={<ProtectedRoute element={<DispensingOfMaterials />} />}
            />
            <Route path="/view-report" element={<ViewReport />} />
            <Route
              path="/effective-view-report"
              element={<Effective_ViewReport />}
            />
          </Routes>
        </BrowserRouter>
        <ToastContainer autoClose={3000} pauseOnHover={false} />
      </Provider>
    </>
  );
}

export default App;
