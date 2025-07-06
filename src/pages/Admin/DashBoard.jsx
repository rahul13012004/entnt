import { useEffect, useState } from "react";
import { mockPatients, mockIncidents } from "../../utils/storage";
import "../../styles/DashBoard.css";

export default function DashBoard() {
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    localStorage.removeItem("completedCount");
    localStorage.removeItem("pendingCount");
    localStorage.removeItem("totalRevenue");
  }, []);

  useEffect(() => {
    const storedIncidents = localStorage.getItem("incidents");
    if (!storedIncidents) {
      localStorage.setItem("incidents", JSON.stringify(mockIncidents));
    }

    const storedPatients = localStorage.getItem("patients");
    if (!storedPatients) {
      localStorage.setItem("patients", JSON.stringify(mockPatients));
    }

    const syncData = () => {
      const patients = JSON.parse(localStorage.getItem("patients")) || [];
      const incidents = JSON.parse(localStorage.getItem("incidents")) || [];

      setPatients(patients);
      setIncidents(incidents);

      const completed = incidents.filter(
        (i) => i.status?.toLowerCase() === "completed"
      );
      const pending = incidents.filter(
        (i) => i.status?.toLowerCase() !== "completed"
      );
      const revenue = incidents.reduce((sum, i) => {
        const val = typeof i.cost === "number" ? i.cost : 0;
        return sum + val;
      }, 0);

      setCompletedCount(completed.length);
      setPendingCount(pending.length);
      setTotalRevenue(revenue);

      localStorage.setItem("completedCount", completed.length.toString());
      localStorage.setItem("pendingCount", pending.length.toString());
      localStorage.setItem("totalRevenue", revenue.toString());
    };

    syncData();
    const interval = setInterval(syncData, 1000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const upcomingAppointments = [];

  incidents.forEach((i) => {
    if (i.appointmentDate && new Date(i.appointmentDate) > now) {
      upcomingAppointments.push({
        ...i,
        type: "Appointment",
        date: new Date(i.appointmentDate),
      });
    }
    if (i.nextDate && i.nextDate !== "N/A" && new Date(i.nextDate) > now) {
      upcomingAppointments.push({
        ...i,
        type: "Follow-up",
        date: new Date(i.nextDate),
      });
    }
  });

  upcomingAppointments.sort((a, b) => a.date - b.date).splice(10);


  const recentCompletedIncidents = incidents
    .filter((i) => i.status?.toLowerCase() === "completed")
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
    .slice(0, 5);

  const getPatientName = (id) =>
    patients.find((p) => p.id === id)?.name || "Unknown";


const pendingAppointments = incidents.filter((i) => {
  const appointmentDate = new Date(i.appointmentDate);
  const now = new Date();
  const status = i.status?.toLowerCase();

  return (
    appointmentDate < now &&
    status !== "completed" &&
    status !== "n/a"
  );
});


const sortedPendingAppointments = pendingAppointments.sort(
  (a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)
);
  
  

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Upcoming Appointments */}
      <div className="dashboard-section">
  <h2 className="section-title">Upcoming Appointments</h2>
  {upcomingAppointments.length === 0 ? (
    <p className="section-empty">No upcoming appointments.</p>
  ) : (
    <ul className="appointments-list">
      {upcomingAppointments.map((i, index) => (
        <li key={index} className="appointment-card">
          <div className="appointment-title">
            <span className="badge">{i.type}</span> {i.title}
          </div>
          <div className="appointment-meta">
            <span className="patient-name">{getPatientName(i.patientId)}</span>
            <span className="appointment-date">{i.date.toLocaleString()}</span>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

      
      <div className="dashboard-section">
  <h2 className="section-title">Recent Completed Incidents</h2>
  {recentCompletedIncidents.length === 0 ? (
    <p className="section-empty">No completed incidents.</p>
  ) : (
    <ul className="incident-cards">
      {recentCompletedIncidents.map((i) => (
        <li key={i.id} className="incident-card completed-card">
          <div className="incident-title">{i.title}</div>
          <div className="incident-meta">
            <span className="incident-patient">{getPatientName(i.patientId)}</span>
            <span className="incident-date">{new Date(i.appointmentDate).toLocaleString()}</span>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
<div className="dashboard-section">
  <h2 className="section-title">Pending Appointments</h2>
  {sortedPendingAppointments.length === 0 ? (
    <p className="section-empty">No pending appointments.</p>
  ) : (
    <ul className="appointments-list">
      {sortedPendingAppointments.map((i, index) => (
        <li key={index} className="appointment-card pending-card">
          <div className="appointment-title">
            {i.title}
          </div>
          <div className="appointment-meta">
            <span className="patient-name">{getPatientName(i.patientId)}</span>
            <span className="appointment-date">{new Date(i.appointmentDate).toLocaleString()}</span>
          </div>
          <div className="appointment-status">
            <strong>Status:</strong> {i.status || "Pending"}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

      
      <div className="dashboard-grid">
        <div className="dashboard-stat stat-blue">
          <div className="stat-label">Upcoming Appointments</div>
          <div className="stat-value">{upcomingAppointments.length}</div>
        </div>

        <div className="dashboard-stat stat-yellow">
          <div className="stat-label">Top Patients</div>
          <ul className="mt-2 list-disc list-inside text-sm text-yellow-900">
            {patients
              .map((p) => ({
                ...p,
                count: incidents.filter((i) => i.patientId === p.id).length,
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((p) => (
                <li key={p.id}>
                  {p.name} ({p.count})
                </li>
              ))}
          </ul>
        </div>

        <div className="dashboard-stat stat-green">
          <div className="stat-label">Treatments</div>
          <div className="mt-1 text-green-800">
            Completed: <strong>{completedCount}</strong>
            <br />
            Pending: <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="dashboard-stat stat-purple">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">₹ {totalRevenue}</div>
        </div>
      </div>
    </div>
  );
}
