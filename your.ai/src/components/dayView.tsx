"use client";

import React, { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { useCalendar } from "../context/CalendarContext";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DayViewProps {
  date: Date;
  setDate: (date: Date) => void;
  onNewEvent?: () => void;
}

const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

const DayView: React.FC<DayViewProps> = ({ date, setDate, onNewEvent }) => {
  const { events, fetchEvents } = useCalendar();
  const [isLoading, setIsLoading] = useState(true);

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12} ${period}`;
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchEvents();
      setIsLoading(false);
    };
    load();
  }, []);

  const currentDateStr = format(date, "yyyy-MM-dd");

  const dayEvents = events.filter((event) => event.date === currentDateStr);

  const getEventForHour = (hour: number) => {
    return dayEvents.filter((event) => {
      // Extract hour from time (assuming format like "9:00 AM")
      const eventTime = event.time;
      const [rawHour] = event.time.split(":");
      const hourInt = parseInt(rawHour, 10);
      const isPM = event.time.toLowerCase().includes("pm");
      const fullHour =
        isPM && hourInt !== 12
          ? hourInt + 12
          : hourInt === 12 && !isPM
          ? 0
          : hourInt;

      return fullHour === hour;
    });
  };

  const goToToday = () => {
    setDate(new Date());
  };

  return (
    <div className="bg-white rounded-lg shadow-md border overflow-hidden h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDate(subDays(date, 1))}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <h2 className="text-xl font-semibold text-gray-800">
            {format(date, "EEEE, MMMM d, yyyy")}
          </h2>

          <button
            onClick={() => setDate(addDays(date, 1))}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={goToToday}
            className="flex items-center gap-1 border px-3 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors ml-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </button>
        </div>

        <button
          onClick={onNewEvent}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors font-medium"
        >
          + New event
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100% - 72px)" }}
        >
          {/* Timeline */}
          <div className="border-t border-gray-200">
            {hours.map((hour) => {
              const isCurrentHour =
                new Date().getHours() === hour &&
                format(new Date(), "yyyy-MM-dd") === currentDateStr;

              return (
                <div
                  key={hour}
                  className={`flex min-h-[80px] border-b border-gray-100 ${
                    isCurrentHour ? "bg-blue-50" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  {/* Time label */}
                  <div className="w-20 text-right text-sm text-gray-500 font-medium p-2 border-r border-gray-100">
                    {formatTime(hour)}
                  </div>

                  {/* Events container */}
                  <div className="flex-1 relative p-2">
                    {getEventForHour(hour).map((event, index) => (
                      <div
                        key={event.id}
                        className={`mb-2 p-3 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer text-white ${
                          event.color || "bg-blue-500"
                        }`}
                        style={{
                          marginLeft: `${index * 10}px`,
                          maxWidth: "calc(100% - 20px)",
                        }}
                      >
                        <div className="font-semibold">{event.title}</div>
                        <div className="text-xs mt-1 opacity-90">
                          {event.startTime}{" "}
                          {event.endTime ? `- ${event.endTime}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayView;