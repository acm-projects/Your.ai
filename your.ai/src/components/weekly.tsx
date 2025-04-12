import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Dayjs } from "dayjs";

interface WeeklyWithSidebarProps {
  filteredEvents: {
    id: string;
    title: string;
    time: string;
    type: string;
    date: string;
  }[];
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs | null) => void;
  categories: Record<string, boolean>;
  handleCategoryChange: (key: string) => void;
}

const Weekly: React.FC<WeeklyWithSidebarProps> = ({
  filteredEvents,
  selectedDate,
  setSelectedDate,
  categories,
  handleCategoryChange,
}) => {
  const startOfWeek = selectedDate ? selectedDate.startOf("week") : null;
  const daysOfWeek = startOfWeek
    ? Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"))
    : [];

  return (
    <div className="flex gap-8">
      {/* Weekly View */}
      <div className="flex-1 bg-white rounded-lg shadow border">
        {/* Week of Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-700">
            {startOfWeek ? `Week of ${startOfWeek.format("MMMM D, YYYY")}` : ""}
          </h2>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-center text-gray-600 border-b p-4 font-medium">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Hourly Grid */}
        <div className="divide-y">
          {Array.from({ length: 12 }).map((_, i) => {
            const hour = i + 9;
            const hour12 = hour % 12 === 0 ? 12 : hour % 12;
            const ampm = hour >= 12 ? "PM" : "AM";

            return (
              <div key={i} className="flex px-4 py-3">
                <div className="w-20 text-gray-500">{`${hour12}:00 ${ampm}`}</div>
                {daysOfWeek.map((day) => (
                  <div key={day.format("YYYY-MM-DD")} className="flex-1 relative">
                    {filteredEvents
                      .filter((event) => {
                        const eventHour = event.time.split(":")[0];
                        const targetHour = hour.toString().padStart(2, "0");
                        return (
                          event.time.startsWith(`${targetHour}:`) &&
                          event.date === day.format("YYYY-MM-DD")
                        );
                      })
                      .map((event) => (
                        <div
                          key={event.id}
                          className={`absolute left-0 right-0 p-2 rounded-md text-sm whitespace-nowrap overflow-hidden text-ellipsis shadow-md
                            ${event.type === "meeting"
                              ? "bg-red-100 border-l-4 border-red-500"
                              : event.type === "task"
                              ? "bg-green-100 border-l-4 border-green-500"
                              : "bg-yellow-100 border-l-4 border-yellow-500"}`}
                        >
                          <span className="font-semibold">{event.title}</span>
                          <div className="text-xs text-gray-600">{event.time}</div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-80 bg-white p-4 rounded-lg shadow-md border space-y-6">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            showDaysOutsideCurrentMonth
            displayWeekNumber={false} // 👈 removes the "#" column
          />
        </LocalizationProvider>
        <div>
          <h4 className="text-lg font-semibold mb-2 text-gray-700">Categories</h4>
          <div className="space-y-2 text-sm text-gray-600">
            {Object.keys(categories).map((cat) => (
              <label key={cat} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={categories[cat]}
                  onChange={() => handleCategoryChange(cat)}
                  className="accent-indigo-600"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="w-full bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-800 transition">
          + New Event
        </button>
      </div>
    </div>
  );
};

export default Weekly;
