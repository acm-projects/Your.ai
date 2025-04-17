import { useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";

// Sample events data
const events = [
  { id: 1, day: 1, time: "09:00", title: "Team Meeting", duration: 1, color: "bg-blue-500" },
  { id: 2, day: 1, time: "14:00", title: "Client Call", duration: 1.5, color: "bg-purple-500" },
  { id: 3, day: 2, time: "10:00", title: "Project Review", duration: 1, color: "bg-green-500" },
  { id: 4, day: 3, time: "13:00", title: "Lunch with Alex", duration: 1, color: "bg-yellow-500" },
  { id: 5, day: 4, time: "11:00", title: "Dentist Appointment", duration: 1, color: "bg-red-500" },
  { id: 6, day: 5, time: "15:00", title: "Gym Session", duration: 1.5, color: "bg-indigo-500" },
];

export default function WeeklyCalendar() {
  const [currentDate] = useState<Date>(new Date());
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i);
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "d"),
      isToday: format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
    };
  });

  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // Start from 8 AM
    return hour < 12 ? `${hour} AM` : hour === 12 ? `${hour} PM` : `${hour - 12} PM`;
  });

  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-white p-4 shadow-md">
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
        {weekDays.map((day, dayIdx) => (
          <div key={dayIdx} className="col-span-1">
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
                  day.isToday ? "bg-blue-600 text-white" : "text-gray-700"
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

              {/* Events */}
              {events
                .filter((event) => event.day === dayIdx + 1)
                .map((event) => {
                  const hour = Number.parseInt(event.time.split(":")[0]);
                  const minute = Number.parseInt(event.time.split(":")[1]);
                  const top = (hour - 8) * 64 + (minute / 60) * 64;
                  const height = event.duration * 64;

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute left-1 right-1 rounded-md p-2 text-xs font-medium text-white shadow",
                        event.color
                      )}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                      }}
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
