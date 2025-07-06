# 🦷 ENTNT Dental Center Management (React)

A responsive dental center management system built with **React**, designed to simulate patient and incident tracking for both **Admin (Dentist)** and **Patients** — using **localStorage only**, with no backend.

---

## 🌐 Live Demo  
🔗 [Visit App](https://entnt-dental-app.netlify.app/login)  
🔗 [GitHub Repo](https://github.com/rahul13012004/entnt)

---

## 🛠️ Features

### 👨‍⚕️ Admin (Dentist)
- ✅ **Login Authentication** (Hardcoded credentials)
- ✅ **Manage Patients**
  - Add, Edit, Delete
- ✅ **Manage Appointments / Incidents**
  - Title, Description, Comments, Appointment Date
  - Post-visit: Cost, Treatment, Status, Next Appointment, File Uploads
- ✅ **Dashboard**
  - Upcoming Appointments
  - Top Patients
  - Treatment Stats
  - Total Revenue
- ✅ **Calendar View**
  - Color-coded appointments
  - Follow-up highlights
- ✅ **File Preview**
  - File carousel for uploaded images or documents

### 🧑‍🦱 Patient
- ✅ Login to view **own profile** and **appointments**
- ✅ See **cost**, **status**, and **treatment** details

---

## 🔐 Login Credentials

| Role     | Email            | Password   |
|----------|------------------|------------|
| Admin    | admin@entnt.in   | admin123   |
| Patient  | john@entnt.in    | patient123 |

---

## 📦 Tech Stack

- ✅ **React** (Functional Components)
- ✅ **React Router DOM** – Routing & navigation
- ✅ **Context API** – Global auth state
- ✅ **LocalStorage** – Persistent data storage
- ✅ **React Big Calendar** – Calendar view
- ✅ **Custom CSS + Tailwind utilities** – Styling
- ✅ **Fully Responsive Design**

---

## 📂 Project Structure
ENTNT-DENTAL-DASHBOARD/
├── public/
├── src/
│ ├── assets/
│ ├── context/
│ ├── data/
│ ├── pages/
│ │ ├── Admin/
│ │ │ ├── CalendarComponent.jsx
│ │ │ ├── DashBoard.jsx
│ │ │ ├── FilePreview.jsx
│ │ │ ├── Incidents.jsx
│ │ │ ├── PatientManagement.jsx
│ │ │ ├── Patients.jsx
│ │ ├── Login.jsx
│ │ ├── PatientPortal.jsx
│ ├── styles/
│ │ ├── *.css
│ │ ├── LoginPic.jpeg
│ ├── utils/
│ │ └── storage.js
│ ├── App.js / App.css / index.js / index.css
│ └── setupTests.js / reportWebVitals.js
├── .gitignore
├── netlify.toml
├── package.json
└── README.md

## 🚀 Getting Started Locally

1. **Create the App Folder**
   ```bash
   npx create-react-app entnt-dental-dashboard
   cd entnt-dental-dashboard
2. **Install Dependencies**
   ```bash
    npm install
    Start the App
3. **Start the App**
     ```bash
     npm start
Runs on http://localhost:3000


**🌍 Deployment (Netlify)**
Hosted on Netlify

Handles routing with a netlify.toml file:
    [[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200



  
📌 **Technical Highlights**



💾 Simulated backend using localStorage

🔐 Role-based Routing via React Router + Context

🖼️ Base64 File Uploads stored in localStorage

📱 Mobile-Responsive Design with Flexbox & Grid







🧪 **Challenges Faced**


🔄 File preview + deletion sync with localStorage

👥 Role-based UI rendering and access

📆 Calendar transitions and appointment tracking

🎯 Smooth UX with modals, scrolls, and feedback






✅ **Assignment Completion Checklist**


Feature	Status
Role-based Login	✅
CRUD for Patients and Incidents	✅
File Upload with Preview/Deletion	✅
Calendar View for Appointments	✅
Responsive Dashboard (Admin/Patient)	✅
Data Persistence via LocalStorage	✅
Deployed & Published on GitHub	✅







