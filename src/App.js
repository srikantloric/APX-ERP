import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import { routesConfig } from "./components/Utils/RoutesConfig";
import { useState, lazy, useEffect } from "react";
import SideBarContext from "./context/SidebarContext";

//Layouts
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthProvider from "./context/AuthContext";
import { Suspense } from "react";
import UpdateStudent from "./pages/Users/Update";
import Loadable from "./components/thirdparty/Loadable";
import FeeReceiptGenerator from "components/FeeRecieptGenerator/FeeRecieptGenerator";
import FeeReceipt from "pages/FeeManager/FeeReceipt";
import GenerateCustomFee from "pages/FeeManager/GenerateChallan/GenerateCustomFee";
import GenerateMonthlyFee from "pages/FeeManager/GenerateChallan/GenerateMonthlyFee";
import GenerateQrSticker from "pages/Attendance/GenerateQrSticker";
import ManualAttendance from "pages/Attendance/ManualAttendance";
import ViewAttendance from "pages/Attendance/ViewAttendance";
import AdmissionEnquiry from "pages/Admission/AdmissionEnquiry";
import AddEnquire from "pages/Admission/AddEnquriStudent";
import { FacultyAttendance } from "pages/Attendance/FacultyAttendance/facultyAttendance";
import GenerateMonthlyChallan from "pages/FeeManager/GenerateChallan/GenerateMontlyChallan";
import ViewStudentProfile from "pages/Users/StudentProfile/ViewStudentProfile";
import {
  SearchDialogProvider,
  useSearchDialog,
} from "context/SearchDialogContext";
import UpdateResults from "pages/ResultsManagement/UpdateResults";
import PrintResult from "pages/ResultsManagement/PrintResult";
import IdCardGeneration from "pages/Extras/IdCardGeneration";
import BalanceSheet from "pages/Reports/BalanceSheet";
import DueReport from "pages/Reports/DueReport";
import { SCHOOL_NAME } from "config/schoolConfig";
import DemandSlip from "pages/Reports/DemandSlip";
import Transport from "pages/transport/Transport";
import VehicleDetails from "pages/transport/VehicleDetails";
import WebsiteConfig from "pages/WebsiteConfig/WebsiteConfigPage";
import AddStudentNew from "pages/Users/AddStudentNew";

const StudentProfilePictureUpdater = Loadable(
  lazy(() => import("pages/ProfileUpdater/StudentProfilePictureUpdater"))
);

const ViewStudents = Loadable(lazy(() => import("./pages/Users/ViewStudents")));
const UnderConstruction = Loadable(
  lazy(() => import("./pages/Extras/UnderConstruction"))
);
const FacultyDetail = Loadable(
  lazy(() => import("./pages/FacutyManagment/FacultyDetail"))
);
const StudentFeeDetails = Loadable(
  lazy(() => import("./pages/FeeManager/StudentFeeDetails"))
);
const AddStudent = Loadable(lazy(() => import("./pages/Users/AddStudent")));

function App() {
  const routeItems = routesConfig.map(
    ({ to, Component, isHeader, childrens }) => {
      if (!isHeader) {
        return <Route key={to} path={to} element={<Component />} />;
      }
      return "";
    }
  );

  const [isActive, setIsActive] = useState(true);
  const toggle = () => {
    setIsActive(!isActive);
  };

  const setSidebarOpen = (status) => {
    setIsActive(status);
  };

  useEffect(() => {
    document.title = SCHOOL_NAME;
  }, []);

  return (
    <SideBarContext.Provider value={{ isActive, toggle, setSidebarOpen }}>
      <AuthProvider>
        <SearchDialogProvider>
          <Suspense>
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                {routeItems}
                <Route path="students/add-students" element={<AddStudentNew />} />
                <Route
                  path="students/update-student/:id"
                  element={<UpdateStudent />}
                />
                <Route
                  path="students/Admission-students/add-students/:id"
                  element={<AddEnquire />}
                />
                <Route
                  path="students/Admission-students"
                  element={<AdmissionEnquiry />}
                />

                <Route
                  path="students/view-students"
                  element={<ViewStudents />}
                />

                <Route path="/view-faculties" element={<UnderConstruction />} />
                <Route path="/Faculties/:id" element={<FacultyDetail />} />
                <Route path="/add-faculty" element={<UnderConstruction />} />
                <Route
                  path="/FeeManagement/FeeDetails/:id"
                  element={<StudentFeeDetails />}
                />
                <Route
                  path="accountings/generate-monthly-fee"
                  element={<GenerateMonthlyChallan />}
                />
                <Route
                  path="accountings/generate-custom-fee"
                  element={<GenerateMonthlyChallan />}
                />
                <Route
                  path="attendance/show-student-attendance"
                  element={<ViewAttendance />}
                />
                <Route
                  path="attendance/mark-manual-attendance"
                  element={<ManualAttendance />}
                />
                <Route
                  path="attendance/generate-attendance-qr"
                  element={<GenerateQrSticker />}
                />
                <Route
                  path="attendance/Facuities"
                  element={<FacultyAttendance />}
                />
                <Route
                  path="/students/profile/:id"
                  element={<ViewStudentProfile />}
                />
                <Route path="feeReciept" element={<FeeReceipt />} />

                <Route
                  path="/schoolResults/update-results"
                  element={<UpdateResults />}
                />
                <Route
                  path="/schoolResults/print-results"
                  element={<PrintResult />}
                />
                <Route path="/print-id-cards" element={<IdCardGeneration />} />

                {/* Reports Routes */}
                <Route
                  path="/reports/balance-sheet"
                  element={<BalanceSheet />}
                />

                <Route path="/reports/due-report" element={<DueReport />} />
                <Route path="/reports/demand-slip" element={<DemandSlip />} />
                {"Transport"}
                <Route
                  path="/transport/transport-location"
                  element={<Transport />}
                />
                <Route
                  path="/transport/vehicle-details"
                  element={<VehicleDetails />}
                />
              </Route>
              <Route
                path="update-student-profile-picture"
                element={<StudentProfilePictureUpdater />}
              />
              <Route path="/login" element={<AuthenticationLayout />}>
                <Route index element={<Login />} />
              </Route>
            </Routes>
          </Suspense>
        </SearchDialogProvider>
      </AuthProvider>
    </SideBarContext.Provider>
  );
}

export default App;
