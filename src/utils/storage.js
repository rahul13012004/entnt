export const mockUsers = [
  { id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
  { id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" }
];
          
export const mockPatients = [
  { id: "p1", name: "John Doe", dob: "1990-05-10", contact: "1234567890", healthInfo: "No allergies" }
];

 export const mockIncidents=[{
  id: "i1",
  patientId: "p1",
  title: "Toothache",
  description: "Upper molar pain",
  comments: "Sensitive to cold",

  appointmentDate: "2025-07-01T10:00:00",
  treatment: "Cavity filling",
  cost: 80,
  status: "Completed",
  nextDate: "2025-07-10T09:00:00",
  files: [
    { name: "invoice.pdf", url: "base64-or-blob" },
    { name: "xray.png", url: "base64-or-blob" }
  ]
}
 ];
