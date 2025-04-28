"use client";

import type React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import type { Dayjs } from "dayjs";
import { useCalendar } from "../context/CalendarContext";
import dayjs from "dayjs";


interface WeeklyWithSidebarProps {
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs | null) => void;
  categories: Record<string, boolean>;
  handleCategoryChange: (key: string) => void;
}
function formatTimeTo12Hour(timeString: string) {
  if (!timeString) return "";

  const match = timeString.match(/(\d{1,2}):(\d{2})/);
  if (!match) return timeString;

  let [_, hourStr, minuteStr] = match;
  let hour = parseInt(hourStr);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  return `${hour}:${minuteStr} ${ampm}`;
}

const Weekly: React.FC<WeeklyWithSidebarProps> = ({
  selectedDate,
  setSelectedDate,
  categories,
  handleCategoryChange,
}) => {
  const { events, isLoading } = useCalendar();

  const startOfWeek = selectedDate ? selectedDate.startOf("week") : null;
  const daysOfWeek = startOfWeek
    ? Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"))
    : [];

  // Filter events based on the selected week
  const filteredEvents = events.filter((event) => {
    if (!startOfWeek) return false;
    const eventDate = new Date(event.date);
    const weekStart = startOfWeek.toDate();
    const weekEnd = startOfWeek.add(6, "day").toDate();
    return eventDate >= weekStart && eventDate <= weekEnd;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Weekly View */}
      <div className="flex-1 bg-white rounded-lg shadow-md border overflow-hidden">
        {/* Week of Header */}
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            {startOfWeek ? `Week of ${startOfWeek.format("MMMM D, YYYY")}` : ""}
          </h2>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-center text-gray-700 border-b py-3 font-medium bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => (
              <div
                key={day}
                className={`${
                  index === new Date().getDay() ? "text-blue-600" : ""
                }`}
              >
                {day}
              </div>
            )
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="divide-y">
            {Array.from({ length: 12 }).map((_, i) => {
              const hour = i + 9;
              const hour12 = hour % 12 === 0 ? 12 : hour % 12;
              const ampm = hour >= 12 ? "PM" : "AM";

              return (
                <div
                  key={i}
                  className="flex px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-20 text-gray-500 text-sm font-medium">{`${hour12}:00 ${ampm}`}</div>
                  <div className="flex flex-1">
                    {daysOfWeek.map((day, dayIndex) => {
                      const dayEvents = filteredEvents.filter((event) => {
                        if (!day) return false;

                        const eventDay = dayjs(event.date); // <- use Day.js
                        const calendarDay = day.startOf("day");

                        const eventHour = Number(event.time.split(":")[0]);
                        const isPM = event.time.toLowerCase().includes("pm");
                        const fullHour =
                          isPM && eventHour !== 12
                            ? eventHour + 12
                            : eventHour === 12 && !isPM
                            ? 0
                            : eventHour;

                        return (
                          eventDay.isSame(calendarDay, "day") &&
                          fullHour === hour
                        );
                      });

                      return (
                        <div
                          key={day.format("YYYY-MM-DD")}
                          className={`flex-1 relative min-h-[60px] border-l ${
                            dayIndex === new Date().getDay() &&
                            hour === new Date().getHours()
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`absolute left-1 right-1 p-2 rounded-md text-sm text-white shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                event.color || "bg-blue-500"
                              }`}
                              style={{ top: "0", minHeight: "50px" }}
                            >
                              <div className="font-semibold truncate">
                                {event.title}
                              </div>
                              <div className="text-xs opacity-90">
                                {formatTimeTo12Hour(event.time)}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div className="w-full lg:w-80 bg-white p-4 rounded-lg shadow-md border space-y-6">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            showDaysOutsideCurrentMonth
            displayWeekNumber={false}
          />
        </LocalizationProvider>
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-700">
            Categories
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            {Object.keys(categories).map((cat) => (
              <label
                key={cat}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={categories[cat]}
                  onChange={() => handleCategoryChange(cat)}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium">
          + New Event
        </button>
      </div>
    </div>
  );
};

export default Weekly;
