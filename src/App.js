import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import "./App.css";
import Login from "./pages/Login/Login";
import { routesConfig } from "./components/Utils/RoutesConfig";
import { useState, lazy, useEffect } from "react";
import SideBarContext from "./context/SidebarContext";
import { SCHOOL_NAME } from "config/schoolConfig";
import {
  SearchDialogProvider,
  useSearchDialog,
} from "context/SearchDialogContext";


// Layouts & Context
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthProvider from "./context/AuthContext";

// Utility Component for Lazy Loading
import Loadable from "./components/thirdparty/Loadable";

// Lazy Loaded Components

const FeeReceiptGenerator = Loadable(lazy(() => import("components/FeeRecieptGenerator/FeeRecieptGenerator")));
const FeeReceipt = Loadable(lazy(() => import("pages/FeeManager/FeeReceipt")));
const GenerateCustomFee = Loadable(lazy(() => import("pages/FeeManager/GenerateChallan/GenerateCustomFee")));
const GenerateMonthlyFee = Loadable(lazy(() => import("pages/FeeManager/GenerateChallan/GenerateMonthlyFee")));
const GenerateQrSticker = Loadable(lazy(() => import("pages/Attendance/GenerateQrSticker")));
const ManualAttendance = Loadable(lazy(() => import("pages/Attendance/ManualAttendance")));
const ViewAttendance = Loadable(lazy(() => import("pages/Attendance/ViewAttendance")));
const AdmissionEnquiry = Loadable(lazy(() => import("pages/Admission/AdmissionEnquiry")));
// const AddEnquire = Loadable(lazy(() => import("pages/Admission/AddEnquriStudent")));

const FacultyAttendance = Loadable(lazy(() => import("pages/Attendance/FacultyAttendance/facultyAttendance")));
const GenerateMonthlyChallan = Loadable(lazy(() => import("pages/FeeManager/GenerateChallan/GenerateMontlyChallan")));
const ViewStudentProfile = Loadable(lazy(() => import("pages/Users/StudentProfile/ViewStudentProfile")));


const UpdateResults = Loadable(lazy(() => import("pages/ResultsManagement/UpdateResults")));
const PrintResult = Loadable(lazy(() => import("pages/ResultsManagement/PrintResult")));
const IdCardGeneration = Loadable(lazy(() => import("pages/Extras/IdCardGeneration")));
const BalanceSheet = Loadable(lazy(() => import("pages/Reports/BalanceSheet")));
const DueReport = Loadable(lazy(() => import("pages/Reports/DueReport")));
const DemandSlip = Loadable(lazy(() => import("pages/Reports/DemandSlip")));
const Transport = Loadable(lazy(() => import("pages/transport/Transport")));
const VehicleDetails = Loadable(lazy(() => import("pages/transport/VehicleDetails")));
const WebsiteConfig = Loadable(lazy(() => import("pages/WebsiteConfig/WebsiteConfigPage")));
const AddStudentNew = Loadable(lazy(() => import("pages/Users/AddStudentNew")));

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

                {/* <Route
                  path="students/Admission-students/add-students/:id"
                  element={<AddEnquire />}
                /> */}
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
