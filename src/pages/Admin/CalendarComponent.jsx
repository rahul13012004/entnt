import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect } from "react";
const localizer = momentLocalizer(moment);
const getEventsFromIncidents = (incidents) => {
  return incidents.flatMap((incident) => {
    const baseStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      backgroundColor:
        incident.status?.toLowerCase() === "completed" ? "#D1FAE5" : "#FEF3C7",
      borderLeft: `5px solid ${
        incident.status?.toLowerCase() === "completed" ? "#10B981" : "#F59E0B"
      }`,
      padding: "4px 6px",
      fontSize: "0.85rem",
      color: "#1F2937",
      fontWeight: "500",
      lineHeight: "1.3",
      whiteSpace: "normal",
      overflow: "hidden",
      textAlign: "center",
    };
    
    const events = [];

    if (incident.appointmentDate && incident.appointmentDate !== "N/A") {
      events.push({
        id: incident.id + "-appt",
        title: ` ${incident.title} (${incident.status})`,
        start: new Date(incident.appointmentDate),
        end: new Date(new Date(incident.appointmentDate).getTime() + 60 * 60 * 1000),
        ...incident,
        style: baseStyle,
      });
    }

    
    if (incident.nextDate && incident.nextDate !== "N/A") {
      events.push({
        id: incident.id + "-followup",
        title: ` Follow-up: ${incident.title}`,
        start: new Date(incident.nextDate),
        end: new Date(new Date(incident.nextDate).getTime() + 60 * 60 * 1000),
        ...incident,
        style: baseStyle,
      });
    }

    return events;
  });
};

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [calendarView, setCalendarView] = useState("week");
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const syncEvents = () => {
      const incidents = JSON.parse(localStorage.getItem("incidents")) || [];
      const formattedEvents = getEventsFromIncidents(incidents);
      setEvents(formattedEvents);
    };

    syncEvents();
    const interval = setInterval(syncEvents, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEventClick = (event) => {
    alert(
      `${event.title}
    Patient ID: ${event.patientId}
    Treatment: ${event.treatment}
    Status: ${event.status}
    Details: ${event.description}`
    );
  };

  const eventPropGetter = (event) => {
    return { style: event.style };
  };

  return (
    <div style={{ height: "calc(100vh - 100px)", padding: "20px" }}>
      <h1 className="text-2xl font-bold mb-4 text-center">Calendar – Admin Schedule</h1>


      <Calendar
        localizer={localizer}
        events={events}
        date={calendarDate}
        view={calendarView}
        onView={(view) => setCalendarView(view)}
        onNavigate={(date) => setCalendarDate(date)}
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
        scrollToTime={new Date(2025, 6, 2, 9, 0)}
      />
    </div>
  );
}