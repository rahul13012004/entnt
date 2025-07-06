import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import DashBoard from "./pages/Admin/DashBoard";
import PatientPortal from "./pages/PatientPortal";
import CalendarComponent from "./pages/Admin/CalendarComponent";
import Incidents from "./pages/Admin/Incidents";
import PatientManagement from "./pages/Admin/PatientManagement";
import "./App.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract tab name from current route (e.g., /dashboard → Dashboard)
  const currentPath = location.pathname.split("/")[1] || "dashboard";
  const [adminTab, setAdminTab] = useState(currentPath.charAt(0).toUpperCase() + currentPath.slice(1));

  useEffect(() => {
    localStorage.setItem("AdminPageDefaultValue", adminTab);
  }, [adminTab]);

  const handleTabChange = (tab) => {
    setAdminTab(tab);
    navigate(`/${tab.toLowerCase()}`);
  };

  return (
    <>
      <header className="admin-header">
        <button onClick={() => handleTabChange("Dashboard")}>Dashboard</button>
        <button onClick={() => handleTabChange("Patients")}>Patients</button>
        <button onClick={() => handleTabChange("CalendarComponent")}>Calendar</button>
        <button onClick={() => handleTabChange("Incidents")}>Incidents</button>
        <button
          style={{ marginLeft: "auto" }}
          onClick={() => {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("AdminPageDefaultValue");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </header>

      <main className="admin-content">
        <Routes>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/calendarcomponent" element={<CalendarComponent />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </>
  );
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) navigate("/login");
    else setUser(storedUser);
  }, [navigate]);

  if (!user) return null;
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {user.role === "Admin" && <Route path="/*" element={<AdminLayout />} />}
      {user.role === "Patient" && <Route path="/patients" element={<PatientPortal />} />}
      <Route path="*" element={<Navigate to={user.role === "Patient" ? "/patients" : "/dashboard"} />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
