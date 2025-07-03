import { useEffect, useState } from "react";
import { mockIncidents } from "../utils/storage";

export default function PatientPortal() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [myIncidents, setMyIncidents] = useState([]);

  useEffect(() => {
    setMyIncidents(mockIncidents.filter(i => i.patientId === user.patientId));
  }, [user.patientId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">My Appointments</h2>
      <ul>
        {myIncidents.map(i => (
          <li key={i.id}>
            {i.title} - {i.appointmentDate}-{i.status} - ${i.cost}
          </li>
        ))}
      </ul>
    </div>
  );
}

