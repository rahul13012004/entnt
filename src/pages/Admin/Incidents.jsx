import { useState, useEffect, useMemo } from "react";
import { mockIncidents, mockPatients } from "../../utils/storage";

const Incidents = () => {
  const [patients, setPatients] = useState(() => {
    const stored = localStorage.getItem("patients");
    return stored ? JSON.parse(stored) : mockPatients;
  });

  const [incidents, setIncidents] = useState(() => {
    const stored = localStorage.getItem("incidents");
    if (stored) return JSON.parse(stored);
    localStorage.setItem("incidents", JSON.stringify(mockIncidents));
    return mockIncidents;
  });

  const [selectedPatientId, setSelectedPatientId] = useState("");

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
    treatment: "",
    cost: "",
    nextDate: "",
    status: "",
    files: [],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!selectedPatientId && patients.length > 0) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  useEffect(() => {
    const syncPatients = () => {
      const stored = localStorage.getItem("patients");
      const parsed = stored ? JSON.parse(stored) : mockPatients;
      setPatients(parsed);
      if (selectedPatientId && !parsed.some((p) => p.id === selectedPatientId)) {
        setSelectedPatientId("");
      }
    };

    const interval = setInterval(syncPatients, 1000);
    return () => clearInterval(interval);
  }, [selectedPatientId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("incidents");
      setIncidents(stored ? JSON.parse(stored) : []);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateStorage = (updated) => {
    localStorage.setItem("incidents", JSON.stringify(updated));
  };

  const patientIncidents = useMemo(() => {
    return incidents.filter((i) => i.patientId === selectedPatientId);
  }, [incidents, selectedPatientId]);

  const resetForm = () =>
    setFormData({
      id: "",
      title: "",
      description: "",
      comments: "",
      appointmentDate: "",
      treatment: "",
      cost: "",
      nextDate: "",
      status: "",
      files: [],
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const mapped = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setFormData((prev) => ({ ...prev, files: mapped }));
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatientId || !formData.title || !formData.description || !formData.appointmentDate) {
      alert("Please fill all required fields and select a patient.");
      return;
    }

    const newIncident = {
      ...formData,
      id: `i${Date.now()}`,
      patientId: selectedPatientId,
      treatment: "N/A",
      cost: "N/A",
      nextDate: "N/A",
      status: "N/A",
      files: [],
    };

    const updated = [...incidents, newIncident];
    setIncidents(updated);
    updateStorage(updated);
    resetForm();
  };

  const handleEdit = (incident) => {
    setFormData(incident);
    setSelectedPatientId(incident.patientId);
    setIsEditing(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      cost:
        formData.cost === "" || isNaN(Number(formData.cost))
          ? "N/A"
          : Number(formData.cost),
      treatment: formData.treatment === "" ? "N/A" : formData.treatment,
      status: formData.status === "" ? "N/A" : formData.status,
      nextDate: formData.nextDate === "" ? "N/A" : formData.nextDate,
      patientId: selectedPatientId,
    };

    const updated = incidents.map((i) =>
      i.id === formData.id ? { ...i, ...updatedFormData } : i
    );
    setIncidents(updated);
    updateStorage(updated);
    resetForm();
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    const updated = incidents.filter((i) => i.id !== id);
    setIncidents(updated);
    updateStorage(updated);
    if (formData.id === id) {
      resetForm();
      setIsEditing(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white mt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Patient:</label>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select a patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {!isEditing && (
        <form onSubmit={handleInitialSubmit} className="grid grid-cols-1 gap-2 mb-6">
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="border p-2" />
          <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="border p-2" />
          <input name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange} className="border p-2" />
          <input type="datetime-local" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required className="border p-2" />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Add Incident</button>
        </form>
      )}

      {isEditing && (
        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-2 mb-6">
          <div className="font-semibold">Editing: {formData.title}</div>
          <input name="treatment" placeholder="Treatment" value={formData.treatment === "N/A" ? "" : formData.treatment} onChange={handleChange} className="border p-2" />
          <input type="number" name="cost" placeholder="Cost" value={formData.cost === "N/A" ? "" : formData.cost} onChange={handleChange} className="border p-2" />
          <input type="datetime-local" name="nextDate" value={formData.nextDate === "N/A" ? "" : formData.nextDate} onChange={handleChange} className="border p-2" />
          <input name="status" placeholder="Status" value={formData.status === "N/A" ? "" : formData.status} onChange={handleChange} className="border p-2" />
          <input type="file" multiple onChange={handleFileChange} className="border p-2" />
          <div className="flex gap-3">
            <button type="submit" className="bg-green-600 text-white p-2 rounded">Save Changes</button>
            <button type="button" onClick={() => { resetForm(); setIsEditing(false); }} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {patientIncidents.map((incident) => {
          const isScheduled = incident.nextDate !== "N/A" && new Date(incident.nextDate) > new Date();
          const isMock = mockIncidents.some((mock) => mock.id === incident.id);

          return (
            <li key={incident.id} className="p-4 border rounded shadow">
              <div className="flex justify-between items-center">
                <strong>{incident.title}</strong>
                {isScheduled ? (
                  <span className="text-green-600 text-sm font-medium">Scheduled</span>
                ) : (
                  <span className="text-gray-500 text-sm">Inactive</span>
                )}
              </div>
              <div>Description: {incident.description}</div>
              <div>Date: {new Date(incident.appointmentDate).toLocaleString()}</div>
              <div>Comments: {incident.comments || "N/A"}</div>
              <div>Treatment: {incident.treatment || "N/A"}</div>
              <div>Cost: {incident.cost !== undefined ? `₹ ${incident.cost}` : "N/A"}</div>
              <div>Status: {incident.status || "N/A"}</div>
              <div>Next Appointment: {incident.nextDate === "N/A" || !incident.nextDate ? "N/A" : new Date(incident.nextDate).toLocaleString()}</div>
              {incident.files?.length > 0 ? (
                <div className="mt-2">
                  <div className="font-medium">Files:</div>
                  <ul className="list-disc list-inside">
                    {incident.files.map((file, index) => (
                      <li key={index}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{file.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>Files: N/A</div>
              )}
              <div className="mt-2 flex gap-4">
                <button onClick={() => handleEdit(incident)} className="text-blue-600 underline">Edit</button>
                {!isMock && (
                  <button onClick={() => handleDelete(incident.id)} className="text-red-600 underline">Delete</button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Incidents;
