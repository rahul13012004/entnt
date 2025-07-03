import { useState, useEffect } from "react";
import { mockPatients } from "../../utils/storage";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    dob: "",
    contact: "",
    healthInfo: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("patients")) || [];

    // Merge default mock patients only once
    const existingIds = new Set(stored.map(p => p.id));
    const withDefaults = [
      ...stored,
      ...mockPatients
        .filter(p => !existingIds.has(p.id))
        .map(p => ({ ...p, default: true })), // Tag as default
    ];

    setPatients(withDefaults);
    localStorage.setItem("patients", JSON.stringify(withDefaults));
  }, []);

  const updateStorage = (updated) => {
    localStorage.setItem("patients", JSON.stringify(updated));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updated;

    if (isEditing) {
      updated = patients.map((p) => (p.id === formData.id ? { ...p, ...formData } : p));
    } else {
      const newPatient = { ...formData, id: `p${Date.now()}`, default: false };
      updated = [...patients, newPatient];
    }

    setPatients(updated);
    updateStorage(updated);
    setFormData({ id: "", name: "", dob: "", contact: "", healthInfo: "" });
    setIsEditing(false);
  };

  const handleEdit = (patient) => {
    setFormData(patient);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const patient = patients.find(p => p.id === id);
    if (patient?.default) {
      alert("Default patients cannot be deleted.");
      return;
    }

    const updated = patients.filter((p) => p.id !== id);
    setPatients(updated);
    updateStorage(updated);
    if (formData.id === id) {
      setFormData({ id: "", name: "", dob: "", contact: "", healthInfo: "" });
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h2 className="text-xl font-bold mb-4">Patient Management</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="tel"
          name="contact"
          placeholder="Contact eg +919876543210"
          value={formData.contact}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^\d+]/g, '');
            if (/^\+?\d{0,15}$/.test(cleaned)) {
              handleChange({ target: { name: 'contact', value: cleaned } });
            }
          }}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="healthInfo"
          placeholder="Health Info"
          value={formData.healthInfo}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {isEditing ? "Update Patient" : "Add Patient"}
        </button>
      </form>

      <ul className="space-y-3">
        {patients.map((p) => (
          <li key={p.id} className="p-3 border rounded">
            <div><strong>{p.name}</strong> {p.default && <span className="text-xs text-gray-500">(default)</span>}</div>
            <div>DOB: {p.dob}</div>
            <div>Contact: {p.contact}</div>
            <div>Health Info: {p.healthInfo}</div>
            <div className="mt-2 space-x-2">
              <button onClick={() => handleEdit(p)} className="text-blue-600 underline">Edit</button>
              {!p.default && (
                <button onClick={() => handleDelete(p.id)} className="text-red-600 underline">Delete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientManagement;
