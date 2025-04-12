import React, { useState } from "react";
import { format, addDays, subDays } from "date-fns";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
}

interface DayViewProps {
  date: Date;
  events: Event[];
  onNewEvent?: () => void;
  setDate: (date: Date) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

const DayView: React.FC<DayViewProps> = ({ date, events, onNewEvent, setDate }) => {
  const formatTime = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12} ${period}`;
  };

  const getEventForHour = (hour: number) => {
    return events.filter((event) => {
      const startHour = parseInt(event.startTime.split(":")[0], 10);
      return startHour === hour;
    });
  };

  return (
    <div className="p-4 bg-white h-full w-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDate(subDays(date, 1))}
            className="text-sm px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            ← Previous
          </button>

          <h2 className="text-lg font-semibold">
            {format(date, "EEEE MMMM d, yyyy")}
          </h2>

          <button
            onClick={() => setDate(addDays(date, 1))}
            className="text-sm px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
          >
            Next →
          </button>

          <button
            onClick={() => setDate(new Date())}
            className="border px-3 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-100"
          >
            Today
          </button>

          <button
            onClick={onNewEvent}
            className="bg-black text-white px-4 py-1 rounded-md text-sm hover:bg-gray-800"
          >
            + New event
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t border-gray-200">
        {hours.map((hour) => (
          <div key={hour} className="flex h-16 px-4 items-center relative">
            {/* Time label */}
            <div className="w-16 text-right text-xs text-gray-400 pr-4">
              {formatTime(hour)}
            </div>

            {/* Line + Events */}
            <div className="flex-1 h-px bg-gray-200 relative">
              {getEventForHour(hour).map((event) => (
                <div
                  key={event.id}
                  className="absolute top-1 left-0 bg-blue-100 text-blue-900 px-3 py-2 rounded shadow text-sm w-60"
                >
                  <strong>{event.title}</strong>
                  <div className="text-xs">
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;
