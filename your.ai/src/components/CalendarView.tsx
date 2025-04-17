import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import DayView from "./DayView";
import Weekly from "./Weekly";
import { Dayjs } from "dayjs";

interface Event {
  id: string;
  title: string;
  time: string;
  attendees: number;
  type: "meeting" | "task" | "session";
  date: string;
}

interface CalendarViewProps {
  view: "Day" | "Weekly" | "Monthly";
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs) => void;
  filteredEvents: Event[];
  categories: Record<string, boolean>;
  handleCategoryChange: (key: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  view,
  selectedDate,
  setSelectedDate,
  filteredEvents,
  categories,
  handleCategoryChange,
}) => {
  const dayViewEvents = filteredEvents.map((event) => {
    const start = parseInt(event.time.split(":")[0], 10);
    const end = start + 1;
    return {
      id: event.id,
      title: event.title,
      startTime: String(start),
      endTime: String(end),
    };
  });

  if (view === "Monthly") {
    return (
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={filteredEvents.map((event) => ({
          title: event.title,
          date: event.date,
        }))}
      />
    );
  } else if (view === "Day") {
    return (
      <div className="h-[calc(100vh-100px)] w-full">
        <DayView
          date={selectedDate?.toDate() || new Date()}
          setDate={(d) => setSelectedDate(d)}
          events={dayViewEvents}
          onNewEvent={() => alert("New event clicked")}
        />
      </div>
    );
  } else if (view === "Weekly") {
    return (
      <Weekly
        filteredEvents={filteredEvents}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        categories={categories}
        handleCategoryChange={handleCategoryChange}
      />
    );
  } else {
    return null;
  }
};

export default CalendarView;
