import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Patient.css";

export default function PatientPortal() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [myIncidents, setMyIncidents] = useState([]);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const allIncidents = JSON.parse(localStorage.getItem("incidents")) || [];
    const allPatients = JSON.parse(localStorage.getItem("patients")) || [];

    const matchedIncidents = allIncidents.filter(i => i.patientId === user.patientId);
    const matchedPatient = allPatients.find(p => p.id === user.patientId);

    setMyIncidents(matchedIncidents);
    setPatient(matchedPatient);
  }, [user.patientId]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="patientPortal">
      <div className="patient-header">
        <h1 className="TitleBar">Patient Portal</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {patient && (
        <div className="personalDetails">
          <h2>My Information</h2>
          <hr />
          <div className="patientInfo">
            <p><b>Name</b>: {patient.name}</p>
            <p><b>Date of Birth</b>: {patient.dob}</p>
            <p><b>Contact</b>: {patient.contact}</p>
            <p><b>Health Info</b>: {patient.healthInfo}</p>
          </div>
        </div>
      )}

      <div className="myIncidentsList">
        <h2>My Appointments</h2>
        <hr />
        <div className="incidentCardHolder">
          {myIncidents.length > 0 ? (
            myIncidents.map(i => (
              <div key={i.id} className="incidentCard">
                <p><b>Title</b>: {i.title}</p>
                <p><b>Appointment Date</b>: {new Date(i.appointmentDate).toLocaleString()}</p>
                <p><b>Status</b>: {i.status}</p>
                <p><b>Charge</b>: ₹{i.cost}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4">No appointments found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
