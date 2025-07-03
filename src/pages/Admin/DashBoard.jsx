import { useEffect, useState } from "react";
import Incidents from "./Incidents";
import PatientManagement from "./PatientManagement";
import CalendarComponent from "./CalendarComponent";
import { mockPatients, mockIncidents } from "../../utils/storage";

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

  const upcomingAppointments = incidents
    .filter((i) => i.nextDate && i.nextDate !== "N/A" && new Date(i.nextDate) > now)
    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
    .slice(0, 10);

  const recentCompletedIncidents = incidents
    .filter((i) => i.status?.toLowerCase() === "completed")
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
    .slice(0, 5);

  const recentPendingIncidents = incidents
    .filter((i) => i.status?.toLowerCase() !== "completed")
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
    .slice(0, 5);

  const patientCounts = {};
  incidents.forEach((i) => {
    if (i.patientId) {
      patientCounts[i.patientId] = (patientCounts[i.patientId] || 0) + 1;
    }
  });

  const topPatients = patients
    .map((p) => ({ ...p, count: patientCounts[p.id] || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const getPatientName = (id) => patients.find((p) => p.id === id)?.name || "Unknown";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🩺 Admin Dashboard</h1>

      <div className="bg-white rounded shadow p-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📆 Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          <ul className="divide-y">
            {upcomingAppointments.map((i) => (
              <li key={i.id} className="py-2">
                <div className="text-sm font-medium text-gray-800">{i.title}</div>
                <div className="text-sm text-gray-600">
                  {getPatientName(i.patientId)} — {new Date(i.nextDate).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ Recent Completed */}
      <div className="bg-white rounded shadow p-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">✅ Recent Completed Incidents</h2>
        {recentCompletedIncidents.length === 0 ? (
          <p className="text-gray-500">No completed incidents.</p>
        ) : (
          <ul className="divide-y">
            {recentCompletedIncidents.map((i) => (
              <li key={i.id} className="py-2">
                <div className="text-sm font-medium text-gray-800">{i.title}</div>
                <div className="text-sm text-gray-600">
                  {getPatientName(i.patientId)} — {new Date(i.appointmentDate).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ⏳ Recent Pending */}
      <div className="bg-white rounded shadow p-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">⏳ Recent Pending Incidents</h2>
        {recentPendingIncidents.length === 0 ? (
          <p className="text-gray-500">No pending incidents.</p>
        ) : (
          <ul className="divide-y">
            {recentPendingIncidents.map((i) => (
              <li key={i.id} className="py-2">
                <div className="text-sm font-medium text-gray-800">{i.title}</div>
                <div className="text-sm text-gray-600">
                  {getPatientName(i.patientId)} — {new Date(i.appointmentDate).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
          <div className="text-sm text-blue-700">Upcoming Appointments</div>
          <div className="text-2xl font-bold text-blue-900">{upcomingAppointments.length}</div>
        </div>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow">
          <div className="text-sm text-yellow-700">Top Patients</div>
          <ul className="text-sm text-yellow-900 mt-1 list-disc list-inside">
            {topPatients.length === 0 ? (
              <li>No data</li>
            ) : (
              topPatients.map((p) => (
                <li key={p.id}>
                  {p.name} ({p.count})
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded shadow">
          <div className="text-sm text-green-700">Treatments</div>
          <div className="mt-1 text-green-800">
            ✅ Completed: <strong>{completedCount}</strong>
            <br />
            ⏳ Pending: <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded shadow">
          <div className="text-sm text-purple-700">Total Revenue</div>
          <div className="text-2xl font-bold text-purple-900 mt-1">₹ {totalRevenue}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">📋 Patient Management</h2>
          <PatientManagement />
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">📝 Incidents</h2>
          <Incidents />
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">📅 Calendar</h2>
          <CalendarComponent />
        </div>
      </div>
    </div>
  );
}
