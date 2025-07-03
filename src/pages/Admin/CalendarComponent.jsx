// src/pages/Admin/Calendar.jsx
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";

// Localizer setup
const localizer = momentLocalizer(moment);

// Get calendar events from incidents
const getEventsFromIncidents = (incidents) => {
  const events = [];

  incidents.forEach((incident) => {
    const baseTitle = `${incident.title} - ${incident.status}`;
    const colorStyle = {
      backgroundColor:
        incident.status?.toLowerCase() === "completed" ? "#D1FAE5" : "#FEF3C7",
      borderLeft: `5px solid ${
        incident.status?.toLowerCase() === "completed" ? "#10B981" : "#F59E0B"
      }`,
    };

    // Appointment event
    if (incident.appointmentDate) {
      events.push({
        id: incident.id + "-appt",
        title: baseTitle + " (Appointment)",
        start: new Date(incident.appointmentDate),
        end: new Date(
          new Date(incident.appointmentDate).getTime() + 60 * 60 * 1000
        ),
        allDay: false,
        ...incident,
        style: colorStyle,
      });
    }

    // Next appointment (if exists)
    if (incident.nextDate && incident.nextDate !== "N/A") {
      events.push({
        id: incident.id + "-next",
        title: baseTitle + " (Follow-up)",
        start: new Date(incident.nextDate),
        end: new Date(new Date(incident.nextDate).getTime() + 60 * 60 * 1000),
        allDay: false,
        ...incident,
        style: colorStyle,
      });
    }
  });

  return events;
};

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const incidents = JSON.parse(localStorage.getItem("incidents")) || [];
    const formattedEvents = getEventsFromIncidents(incidents);
    setEvents(formattedEvents);
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    alert(
      `🦷 ${event.title}\nPatient ID: ${event.patientId}\nTreatment: ${event.treatment}\nDetails: ${event.description}`
    );
  };

  const eventPropGetter = (event) => {
    return {
      style: event.style || {},
    };
  };

  return (
    <div style={{ height: "calc(100vh - 100px)", padding: "20px" }}>
      <h1 className="text-2xl font-bold mb-4">🗓️ Calendar – Admin Schedule</h1>
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={["month", "week", "day"]}
        step={30}
        timeslots={2}
        selectable
        onSelectEvent={handleEventClick}
        eventPropGetter={eventPropGetter}
        style={{
          height: "100%",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
        scrollToTime={new Date(2025, 6, 2, 9, 0)} // 9AM scroll
      />
    </div>
  );
}
