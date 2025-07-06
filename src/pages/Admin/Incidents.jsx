import { useState, useEffect, useMemo } from "react";
import { mockIncidents, mockPatients } from "../../utils/storage";
import "../../styles/Incidents.css";
import FilePreview from "./FilePreview";
import { useRef } from "react";



const Incidents = () => {
  const [patients, setPatients] = useState(() => {
    const stored = localStorage.getItem("patients");
    return stored ? JSON.parse(stored) : mockPatients;
  });
  const [previewFiles, setPreviewFiles] = useState([]);
const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);


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
  const formRef = useRef(null);

  useEffect(() => {
    if (!isEditing) {
      const tempFiles = localStorage.getItem("temp_uploaded_files");
      if (tempFiles) {
        const parsed = JSON.parse(tempFiles);
        setFormData((prev) => ({ ...prev, files: parsed }));
      }
    }
  }, [isEditing]);
  

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

  // const today = new Date();

  /*const upcomingAppointments = useMemo(() => {
    return incidents.filter((i) => {
      const appt = new Date(i.appointmentDate);
      const next = i.nextDate !== "N/A" ? new Date(i.nextDate) : null;
      return appt > today || (next && next > today);
    });
  }, [incidents]);*/

  const patientIncidents = useMemo(() => {
    return incidents
      .filter((i) => i.patientId === selectedPatientId)
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  }, [incidents, selectedPatientId]);
  
  const resetForm = () => setFormData({
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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
  
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, type: file.type, base64: reader.result });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
  
    const mapped = await Promise.all(files.map(toBase64));
  
    
    if (!isEditing) {
      localStorage.setItem("temp_uploaded_files", JSON.stringify(mapped));
      setPreviewFiles(mapped);
      setCurrentPreviewIndex(0);
    }
  
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
      files: formData.files || [],
    };
  
    const updated = [...incidents, newIncident];
    setIncidents(updated);
    updateStorage(updated);
  
    resetForm();
    setPreviewFiles([]);
    setCurrentPreviewIndex(0);
    localStorage.removeItem("temp_uploaded_files");
  };
  
  const handleEdit = (incident) => {
    setFormData(incident);
    setSelectedPatientId(incident.patientId);
    setIsEditing(true);
  
    
    if (incident.files && incident.files.length > 0) {
      setPreviewFiles(incident.files);
      setCurrentPreviewIndex(0);
    }
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100); 
  
  };
  
  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      cost: formData.cost === "" || isNaN(Number(formData.cost)) ? "N/A" : Number(formData.cost),
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
  const handleOpenPreview = (files, index) => {
    setPreviewFiles(files);
    setCurrentPreviewIndex(index);
  };
  const handleClosePreview = () => {
    setPreviewFiles([]);
    setCurrentPreviewIndex(0);
  };
  const handleNextPreview = () => {
    setCurrentPreviewIndex((prev) => Math.min(prev + 1, previewFiles.length - 1));
  };
  const handlePrevPreview = () => {
    setCurrentPreviewIndex((prev) => Math.max(prev - 1, 0));
  };
  
  const handleDeletePreview = (indexToDelete) => {
    const updatedFiles = [...previewFiles];
    updatedFiles.splice(indexToDelete, 1);
  
    
    setPreviewFiles(updatedFiles);
    setCurrentPreviewIndex((prev) =>
      prev >= updatedFiles.length ? updatedFiles.length - 1 : prev
    );
  
    
    setFormData((prev) => ({
      ...prev,
      files: updatedFiles,
    }));
  
    
    localStorage.setItem("temp_uploaded_files", JSON.stringify(updatedFiles));
  
    
    if (isEditing && formData.id) {
      const updatedIncidents = incidents.map((incident) =>
        incident.id === formData.id
          ? { ...incident, files: updatedFiles }
          : incident
      );
      setIncidents(updatedIncidents);
      updateStorage(updatedIncidents);
    }
  };
  

  return (
    <div className="p-4 border rounded bg-white mt-4 incidents">
      <h2 className="incident-heading">Incidents</h2>


      <div className="mb-4">
        <label ><strong>Select Patient:</strong></label>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select a patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div ref={formRef}>
      {!isEditing && (
        <form onSubmit={handleInitialSubmit} className="grid grid-cols-1 gap-2 mb-6">
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="border p-2" />
          <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="border p-2" />
          <input name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange} className="border p-2" />
          <input type="datetime-local" name="appointmentDate" min={new Date().toISOString().slice(0, 16)} value={formData.appointmentDate} onChange={handleChange} required className="border p-2" />
          <input type="file" multiple onChange={handleFileChange} className="border p-2" />
          
          
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">Add Incident</button>
        </form>
      )}
      </div>

      {isEditing && (
        <form onSubmit={handleUpdate} ref={formRef}>
          <div> <strong>Editing: </strong> {formData.title}</div>
          <input name="treatment" placeholder="Treatment" value={formData.treatment === "N/A" ? "" : formData.treatment} onChange={handleChange} className="border p-2" />
          <input type="number" name="cost" min="0" placeholder="Cost" value={formData.cost === "N/A" ? "" : formData.cost} onChange={handleChange} className="border p-2" />
          <input type="datetime-local" name="nextDate" min={new Date().toISOString().slice(0, 16)} value={formData.nextDate === "N/A" ? "" : formData.nextDate} onChange={handleChange} className="border p-2" />
          <input name="status" placeholder="Status" value={formData.status === "N/A" ? "" : formData.status} onChange={handleChange} className="border p-2" />
          <input type="file" multiple onChange={handleFileChange} className="border p-2" />


<div className="flex gap-4">
    <button type="submit" className="bg-green-600 text-white p-2 rounded">
      Save Changes
    </button>
    <button
      type="button"
      onClick={() => {
        resetForm();
        setIsEditing(false);
        setPreviewFiles([]);
        setCurrentPreviewIndex(0);
        localStorage.removeItem("temp_uploaded_files");
      }}
      className="bg-gray-300 px-4 py-2 rounded"
    >
      Cancel
    </button>
  </div>
</form>

      
      )}

      <div className="space-y-3 incidentHolder">
        {patientIncidents.map((incident) => {
          // const isScheduled = incident.nextDate !== "N/A" && new Date(incident.nextDate) > new Date();
          const isMock = mockIncidents.some((mock) => mock.id === incident.id);

          return (
            <div key={incident.id} >
              <div className="flex justify-between items-center">
                <strong>{incident.title}</strong>
                 {/* {isScheduled ? (
                  <span className="text-green-600 text-sm font-medium">Scheduled</span>
                ) : (
                  <span className="text-gray-500 text-sm">Inactive</span>
                )} */}
              </div>
              <div><strong>Description</strong>: {incident.description}</div>
              <div><strong>Date</strong>: {new Date(incident.appointmentDate).toLocaleString()}</div>
              <div><strong>Comments</strong>: {incident.comments || "N/A"}</div>
              <div><strong>Treatment</strong>: {incident.treatment || "N/A"}</div>
              <div><strong>Cost</strong>: {incident.cost !== undefined ? `₹ ${incident.cost}` : "N/A"}</div>
              <div><strong>Status</strong>: {incident.status || "N/A"}</div>
              <div><strong>Next Appointment</strong>: {incident.nextDate === "N/A" || !incident.nextDate ? "N/A" : new Date(incident.nextDate).toLocaleString()}</div>
              {incident.files?.length > 0 ? (
              <div className="mt-2">
              <div className="font-medium">Files:</div>
              <ul className="list-disc list-inside">
              {incident.files.map((file, index) => (
              <li key={index}>
              <button
              type="button"
              className="text-blue-500 underline"
              onClick={() => handleOpenPreview(incident.files)}
            >
              {file.name}
            </button>
          </li>
           ))}
          </ul>
          </div>
) : (
  <div><strong>Files: N/A</strong></div>
)}

              <div className="mt-2 flex gap-4">
                <button onClick={() => handleEdit(incident)} className="text-blue-600 underline">Edit</button>
                {!isMock && (
                  <button onClick={() => handleDelete(incident.id)} className="text-red-600 underline">Delete</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {previewFiles.length > 0 && (
  <FilePreview
    files={previewFiles}
    currentIndex={currentPreviewIndex}
    onClose={handleClosePreview}
    onNext={handleNextPreview}
    onPrev={handlePrevPreview}
    onDelete={handleDeletePreview}
  />
)}


    </div>
  );
};

export default Incidents;
