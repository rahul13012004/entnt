import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import DashBoard from "./pages/Admin/DashBoard";
import PatientPortal from "./pages/PatientPortal";
import CalendarComponent from "./pages/Admin/CalendarComponent";
import Incidents from "./pages/Admin/Incidents";
import PatientManagement from "./pages/Admin/PatientManagement";

import "./App.css";

// ⬇️ Admin Layout
const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

            // ✅ Notify AppRoutes to re-check user
            window.dispatchEvent(new Event("storage"));

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

// ⬇️ Main Route Logic
const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      setUser(storedUser);

      // Redirect to login if user is not found
      if (!storedUser && location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    };

    syncUser();
    setIsLoading(false);

    // ⬇️ Listen to manual dispatches like logout/login
    const handleStorageChange = () => syncUser();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate, location.pathname]);

  if (isLoading) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {user?.role === "Admin" && <Route path="/*" element={<AdminLayout />} />}
      {user?.role === "Patient" && <Route path="/patients" element={<PatientPortal />} />}

      {/* Default route: if logged in, go to role-based home; else login */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === "Admin" ? "/dashboard" : "/patients"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch all */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate to={user.role === "Admin" ? "/dashboard" : "/patients"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

// ⬇️ Root App Component
export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
