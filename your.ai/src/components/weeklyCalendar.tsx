import { useEffect, useState } from "react";
import { addDays, format, startOfWeek, addWeeks } from "date-fns";
import { useAuth } from "../Context/authContext"; // Adjust path if needed

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  duration: number;
  color: string;
}

export default function WeeklyCalendar() {
  const { token } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [weekOffset, setWeekOffset] = useState<number>(0);

  const baseDate = addWeeks(new Date(), weekOffset);
  const startDate = startOfWeek(baseDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "d"),
      isToday: format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
      index: i + 1,
    };
  });

  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8;
    return hour < 12 ? `${hour} AM` : hour === 12 ? `${hour} PM` : `${hour - 12} PM`;
  });

  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

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

        const formatted: CalendarEvent[] = data.map((item: any, idx: number) => {
          const start = item.start?.split("T")[1]?.substring(0, 5) || "00:00";
          const date = item.start?.split("T")[0] || format(new Date(), "yyyy-MM-dd");

          return {
            id: String(idx),
            title: item.summary || "No Title",
            time: start,
            date,
            duration: 1,
            color: "bg-blue-500",
          };
        });

        setEvents(formatted);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchCalendarEvents();
  }, [token]);

  const selectedDateStr = format(addDays(startDate, selectedDay - 1), "yyyy-MM-dd");

  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-white p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          ← Previous
        </button>
        <h2 className="font-semibold text-lg">
          Week of {format(startDate, "MMM d, yyyy")}
        </h2>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-8 gap-px">
        {/* Time column */}
        <div className="col-span-1">
          <div className="h-14"></div>
          {hours.map((hour, idx) => (
            <div key={idx} className="h-16 pr-2 text-right text-sm text-gray-400">
              {hour}
            </div>
          ))}
        </div>

        {/* Days columns */}
        {weekDays.map((day) => (
          <div
            key={day.index}
            className="col-span-1 cursor-pointer"
            onClick={() => setSelectedDay(day.index)}
          >
            <div
              className={cn(
                "flex flex-col items-center justify-center h-14 border-b font-medium text-sm",
                day.isToday ? "text-blue-600" : "text-gray-700"
              )}
            >
              <span>{day.dayName}</span>
              <span
                className={cn(
                  "mt-1 flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full",
                  selectedDay === day.index
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700"
                )}
              >
                {day.dayNumber}
              </span>
            </div>

            {/* Time slots */}
            <div className="relative">
              {hours.map((_, hourIdx) => (
                <div
                  key={hourIdx}
                  className="h-16 border-t border-gray-200 hover:bg-gray-50 transition-colors"
                ></div>
              ))}

              {/* Events for selected day */}
              {events
                .filter(
                  (event) =>
                    event.date === format(addDays(startDate, day.index - 1), "yyyy-MM-dd")
                )
                .map((event) => {
                  const [hour, minute] = event.time.split(":").map(Number);
                  const top = (hour - 8) * 64 + (minute / 60) * 64;
                  const height = event.duration * 64;

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute left-1 right-1 rounded-md p-2 text-xs font-medium text-white shadow",
                        event.color
                      )}
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <div className="font-semibold truncate">{event.title}</div>
                      <div className="text-[10px]">{event.time}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
