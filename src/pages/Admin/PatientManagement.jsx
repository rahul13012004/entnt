import { useState, useEffect, useRef } from "react";
import { mockPatients } from "../../utils/storage";
import "../../styles/PatientManagement.css";

const PatientManagement = () => {
  const formRef = useRef(null);

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
    const existingIds = new Set(stored.map(p => p.id));
    const withDefaults = [
      ...stored,
      ...mockPatients
        .filter(p => !existingIds.has(p.id))
        .map(p => ({ ...p, default: true })),
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
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <div className="patient-management-container">
      <div className="patient-form-card">
        <h2 className="patient-form-title">Patient Management</h2>

        <form onSubmit={handleSubmit} ref={formRef} className="patient-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="contact"
            placeholder="Contact eg +919876543210"
            value={formData.contact}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^\d+]/g, "");
              if (/^\+?\d{0,15}$/.test(cleaned)) {
                handleChange({ target: { name: "contact", value: cleaned } });
              }
            }}
            required
          />
          <input
            type="text"
            name="healthInfo"
            placeholder="Health Info"
            value={formData.healthInfo}
            onChange={handleChange}
          />

<div className="form-actions">
  <button type="submit" className="action-button">
    {isEditing ? "Update" : "Add Patient"}
  </button>

  {isEditing && (
    <button
      type="button"
      className="action-button"
      onClick={() => {
        setFormData({ id: "", name: "", dob: "", contact: "", healthInfo: "" });
        setIsEditing(false);
      }}
    >
      Cancel
    </button>
  )}
</div>
 </form>

        <ul className="patient-list">
          {patients.map((p) => (
            <li key={p.id} className="patient-item">
              <div>
                <strong>{p.name}</strong>
                {p.default && <span className="patient-default-label">(default)</span>}
              </div>
              <div className="patient-meta"><strong>DOB</strong>: {p.dob}</div>
              <div className="patient-meta"><strong>Contact</strong>: {p.contact}</div>
              <div className="patient-meta"><strong>Health Info</strong>: {p.healthInfo}</div>
              <div className="patient-actions">
                <button className="edit" onClick={() => handleEdit(p)}>Edit</button>
                {!p.default && (
                  <button className="delete" onClick={() => handleDelete(p.id)}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      
  
    </div>
  );
};

export default PatientManagement;
