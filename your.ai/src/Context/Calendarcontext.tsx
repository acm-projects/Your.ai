import React, { createContext, useContext, useState, useEffect } from "react";

interface Event {
  id: string;
  title: string;
  time: string;
  attendees: number;
  type: string;
  date: string;
}

interface CalendarContextType {
  events: Event[];
  fetchEvents: () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    console.log("Fetching calendar events..."); 
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch("http://localhost:5001/events", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      const formatted = data.map((item: any, idx: number) => {
        const startTime = item.start?.split("T")[1]?.substring(0, 5) || "00:00";
        const endTime = item.end?.split("T")[1]?.substring(0, 5) || "00:00";

        return {
          id: String(idx),
          title: item.summary || "No Title",
          time: `${startTime} - ${endTime}`,
          attendees: 1,
          type: "meeting",
          date: item.start?.split("T")[0],
        };
      });

      setEvents(formatted);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <CalendarContext.Provider value={{ events, fetchEvents }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error("useCalendar must be used within a CalendarProvider");
  return context;
};
