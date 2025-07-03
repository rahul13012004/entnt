import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashBoard from "./pages/Admin/DashBoard";
import PatientPortal from "./pages/PatientPortal";
import Patients from "./pages/Patients";
import CalendarComponent from "./pages/Admin/CalendarComponent";
import Incidents from "./pages/Admin/Incidents";

function App() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {user?.role === "Admin" && (
          <>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/calendar" element={<CalendarComponent />} />
            <Route path="/incidents" element={<Incidents patientId="p1" />} /> {/* ✅ Add this */}

          </>
        )}
        {user?.role === "Patient" && (
          <Route path="/patient" element={<PatientPortal />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
