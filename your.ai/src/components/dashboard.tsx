import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import dayjs, { Dayjs } from "dayjs";
import DayView from "./DayView";
import Weekly from "./Weekly";

interface Event {
  id: string;
  title: string;
  time: string;
  attendees: number;
  type: "meeting" | "task" | "session";
  date: string;
}

const Dashboard: React.FC = () => {
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
        const response = await fetch("http://localhost:5000/events");
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
  }, []);

  const filteredEvents = fetchedEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dayViewEvents = filteredEvents.map((event) => {
    const start = parseInt(event.time.split(":")[0], 10);
    const end = start + 1; 
    return { id: event.id, title: event.title, startTime: String(start), endTime: String(end) };
  });

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r">
        {/* Sidebar content */}
        <div className="p-5 flex items-center space-x-2">
          <img src="/react.svg" alt="Your.ai" className="h-8 w-8" />
          <span className="text-xl font-bold text-indigo-600">Your.ai</span>
        </div>
        <nav className="mt-8 text-sm">
          <div className="px-4 text-gray-500 uppercase tracking-wide text-xs">Main Menu</div>
          <ul className="mt-4 space-y-1">
            <li>
              <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
                <i className="fas fa-th-large mr-3"></i> Dashboard
              </Link>
            </li>
            <li>
              <span className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600">
                <i className="fas fa-calendar-alt mr-3"></i> My Calendar
              </span>
            </li>
            <li>
              <Link to="/newsletter" className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
                Newsletter
              </Link>
            </li>
            <li>
              <Link to="/kanban" className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
                Kanban
              </Link>
            </li>
            <li>
              <Link to="/tasks" className="block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center">
                Tasks
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">My Calendar</h1>
              <div className="flex space-x-2">
                {["Day", "Weekly", "Monthly"].map((viewType) => (
                  <button
                    key={viewType}
                    onClick={() => setView(viewType as any)}
                    className={`px-4 py-1 text-sm rounded-md ${
                      view === viewType ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {viewType}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              {selectedDate?.format("MMMM YYYY")}
              <button className="ml-3 text-gray-400 hover:text-gray-600">
                <i className="fas fa-pen"></i>
              </button>
            </h2>
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

          {view === "Monthly" ? (
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={filteredEvents.map((event) => ({
                title: event.title,
                date: event.date,
              }))}
            />
          ) : view === "Day" ? (
            <div className="h-[calc(100vh-100px)] w-full">
              <DayView
                date={selectedDate?.toDate() || new Date()}
                setDate={(d) => setSelectedDate(dayjs(d))}
                events={dayViewEvents}
                onNewEvent={() => alert("New event clicked")}
              />
            </div>
          ) : view === "Weekly" ? (
            <Weekly
              filteredEvents={filteredEvents}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              categories={categories}
              handleCategoryChange={handleCategoryChange}
            />
          ) : null}
        </main>
      </main>
    </div>
  );
};

export default Dashboard;
