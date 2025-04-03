import React, { useState } from "react";
import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';

interface Event {
  id: string;
  title: string;
  time: string;
  attendees: number;
  type: "meeting" | "task" | "session";
  date: string;
}

const Dashboard: React.FC = () => {
  const [view, setView] = useState<"Weekly" | "Monthly" | "Yearly">("Weekly");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [currentDate] = useState("March 2025");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs('2025-03-01'));

  const [categories, setCategories] = useState({
    "School Work": true,
    "Organization": true,
    "Gym": false,
    "Groceries": false,
    "Research": false,
  });

  const handleCategoryChange = (key: string) => {
    setCategories({ ...categories, [key]: !categories[key] });
  };

  const sampleEvents: Event[] = [
    { id: "1", title: "Test for data structures", time: "09:00 AM - 10:30 AM", attendees: 3, type: "task", date: "2025-03-10" },
    { id: "2", title: "Finishing frontend Pages", time: "08:30 AM - 10:00 AM", attendees: 3, type: "task", date: "2025-03-12" },
    { id: "3", title: "Hang out with friends at Starbucks", time: "10:30 AM - 12:00 PM", attendees: 3, type: "session", date: "2025-03-14" },
    { id: "4", title: "Interview for Apple", time: "11:35 AM - 01:00 AM", attendees: 3, type: "meeting", date: "2025-03-16" },
  ];

  const filteredEvents = sampleEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <img src="/react.svg" alt="Your.ai" className="h-8 w-8" />
            <span className="text-xl font-bold text-indigo-600">Your.ai</span>
          </Link>
        </div>
        <nav className="mt-8">
          <div className="px-4 font-medium text-gray-500 uppercase tracking-wider text-xs">
            MAIN MENU
          </div>
          <div className="mt-4">
            <Link to="/dashboard" className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
              <i className="fas fa-th-large mr-3"></i> Dashboard
            </Link>
            <a href="#" className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600">
              <i className="fas fa-calendar-alt mr-3"></i> My Calendar
            </a>
            <Link
            to="/newsletter"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Newsletter
          </Link>
          
          <Link
            to="/kanban"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Kanban
          </Link>
          
          <Link
            to="/tasks"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Tasks
          </Link>
          
          
          </div>

          <div className="mt-8 px-4 font-medium text-gray-500 uppercase tracking-wider text-xs">
            OTHERS
          </div>
          <div className="mt-4">
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600">
              <i className="fas fa-cog mr-3"></i> Settings
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">My Calendar</h1>
              <div className="flex space-x-2">
                {["Weekly", "Monthly", "Yearly"].map((viewType) => (
                  <button
                    key={viewType}
                    onClick={() => setView(viewType as any)}
                    className={`px-4 py-1 text-sm rounded-md ${view === viewType ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {viewType}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-50">
                <i className="fas fa-file-export mr-2"></i> Export
              </button>
              <button className="flex items-center px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                <i className="fas fa-plus mr-2"></i> Create Schedule
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              {currentDate}
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <i className="fas fa-pen"></i>
              </button>
            </h2>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search now..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          ) : view === "Yearly" ? (
            <div className="bg-white p-6 rounded-md shadow">
              <label htmlFor="year-select" className="block text-gray-700 font-medium mb-2">
                Select Year:
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border px-4 py-2 rounded-md mb-4"
              >
                {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="border p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">
                      {new Date(0, i).toLocaleString("default", { month: "long" })} {selectedYear}
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {filteredEvents
                        .filter((event) => new Date(event.date).getMonth() === i && new Date(event.date).getFullYear() === selectedYear)
                        .map((event) => (
                          <li key={event.id}>• {event.title}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-8">
              {/* Weekly Calendar */}
              <div className="flex-1 bg-white rounded-lg shadow">
                <div className="grid grid-cols-7 gap-4 p-4 border-b">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="divide-y">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex p-4">
                      <div className="w-20 text-gray-500">{`${(i + 9).toString().padStart(2, "0")}:00`}</div>
                      <div className="flex-1 relative">
                        {filteredEvents
                          .filter((event) => event.time.startsWith(`${(i + 9).toString().padStart(2, "0")}:`))
                          .map((event) => (
                            <div
                              key={event.id}
                              className={`absolute left-0 right-0 p-2 rounded-lg ${
                                event.type === "meeting"
                                  ? "bg-red-50 border-l-4 border-red-500"
                                  : event.type === "task"
                                  ? "bg-green-50 border-l-4 border-green-500"
                                  : "bg-yellow-50 border-l-4 border-yellow-500"
                              }`}
                            >
                              <span className="font-medium">{event.title}</span>
                              <div className="text-sm text-gray-500">{event.time}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right panel: Mini calendar and categories */}
              <div className="w-80 p-4 bg-white rounded-lg shadow-md space-y-6">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar value={selectedDate} onChange={setSelectedDate} />
                </LocalizationProvider>

                <div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-700">Category</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {Object.keys(categories).map((cat) => (
                      <label key={cat} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={categories[cat]}
                          onChange={() => handleCategoryChange(cat)}
                          className="accent-indigo-500"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full mt-4 bg-indigo-700 text-white py-2 rounded-md shadow hover:bg-indigo-800 transition">
                  New Event
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
