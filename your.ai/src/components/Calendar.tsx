import React, { useEffect, useState } from "react";
import { useAuth } from "./authcontext";
import CalendarView from "./CalendarView";
import { CalendarClock } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import Sidebar from "./Sidebar";

interface Event {
  id: string;
  title: string;
  time: string;
  attendees: number;
  type: string;
  date: string;
}

const Calendar: React.FC = () => {
  const { token } = useAuth();
  const [view, setView] = useState<"Day" | "Weekly" | "Monthly">("Weekly");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [fetchedEvents, setFetchedEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState({
    "School Work": true,
    Organization: true,
    Gym: false,
    Groceries: false,
    Research: false,
  });

  const handleCategoryChange = (key: string) => {
    setCategories({ ...categories, [key]: !categories[key] });
  };

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const response = await fetch("http://localhost:5001/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        const formatted: Event[] = data.map((item: any, idx: number) => {
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

        setFetchedEvents(formatted);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchCalendarEvents();
  }, [token]);

  const filteredEvents = fetchedEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">Tasks Calendar</h1>
            <p className="text-gray-500">Your schedule and filters</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md text-sm font-medium bg-blue-600 text-white h-10 px-4 py-2 hover:bg-blue-700 transition-colors">
            <CalendarClock className="h-4 w-4" />
            Add Event
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {["Day", "Weekly", "Monthly"].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType as typeof view)}
                  className={`px-4 py-1 text-sm rounded-md ${
                    view === viewType ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {viewType}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-64">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <CalendarView
          view={view}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          filteredEvents={filteredEvents}
          dayViewEvents={dayViewEvents}
          categories={categories}
          handleCategoryChange={handleCategoryChange}
        />
      </main>
    </div>
  );
};

export default Calendar;