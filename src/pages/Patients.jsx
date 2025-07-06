import { mockPatients } from "../utils/storage";

export default function Patients() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Patients</h2>
      <ul className="mt-4 space-y-2">
        {mockPatients.map(patient => (
          <li key={patient.id} className="border p-2 rounded">
            {patient.name} - {patient.contact}
          </li>
        ))}
      </ul>
    </div>
  );
}
