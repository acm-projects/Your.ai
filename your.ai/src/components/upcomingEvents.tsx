"use client";

import { useEffect, useState } from "react";
import { format, isToday, isTomorrow, addDays, isBefore } from "date-fns";
import { useAuth } from "../Context/authContext";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Loader2,
  CalendarX,
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  duration?: number;
  type: string;
  color: string;
  location?: string;
}

export default function UpcomingEvents() {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

  // Function to get event color based on type
  const getEventColor = (type: string) => {
    const typeColors: Record<
      string,
      { bg: string; light: string; text: string; border: string }
    > = {
      Meeting: {
        bg: "bg-blue-500",
        light: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      Call: {
        bg: "bg-green-500",
        light: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
      },
      Appointment: {
        bg: "bg-purple-500",
        light: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      },
      Task: {
        bg: "bg-amber-500",
        light: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      Event: {
        bg: "bg-indigo-500",
        light: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
      },
    };

    return (
      typeColors[type] || {
        bg: "bg-gray-500",
        light: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
      }
    );
  };

  // Function to determine event type based on title
  const getEventType = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (
      lowerTitle.includes("meet") ||
      lowerTitle.includes("sync") ||
      lowerTitle.includes("standup")
    )
      return "Meeting";
    if (
      lowerTitle.includes("call") ||
      lowerTitle.includes("chat") ||
      lowerTitle.includes("interview")
    )
      return "Call";
    if (
      lowerTitle.includes("appointment") ||
      lowerTitle.includes("doctor") ||
      lowerTitle.includes("dentist")
    )
      return "Appointment";
    if (
      lowerTitle.includes("task") ||
      lowerTitle.includes("todo") ||
      lowerTitle.includes("review")
    )
      return "Task";
    return "Event";
  };

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch("http://localhost:5001/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        // Sort events by date
        data.sort(
          (a: any, b: any) =>
            new Date(a.start).getTime() - new Date(b.start).getTime()
        );

        const formatted = data.map((item: any, idx: number) => {
          const eventType = getEventType(item.summary || "");
          const eventDate = new Date(item.start);
          const endDate = new Date(item.end || eventDate);
          const durationMinutes = Math.round(
            (endDate.getTime() - eventDate.getTime()) / (1000 * 60)
          );

          return {
            id: idx,
            title: item.summary || "No Title",
            date: item.start || new Date().toISOString(),
            duration: durationMinutes,
            type: eventType,
            color: getEventColor(eventType).bg,
            location: item.location || "No location",
          };
        });

        // Filter out past events (more than 1 day old)
        const now = new Date();
        const filteredEvents = formatted.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= now;
        });

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [token]);

  // Group events by date category
  const todayEvents = events.filter((event) => isToday(new Date(event.date)));
  const tomorrowEvents = events.filter((event) =>
    isTomorrow(new Date(event.date))
  );
  const upcomingEvents = events.filter(
    (event) =>
      !isToday(new Date(event.date)) && !isTomorrow(new Date(event.date))
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500">Loading upcoming events...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <div className="rounded-full bg-gray-100 p-3">
          <CalendarX className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700">
          No upcoming events
        </h3>
        <p className="text-sm text-gray-500">
          Your schedule is clear for the next few days.
        </p>
        <button className="mt-2 inline-flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
          <Calendar className="h-4 w-4" />
          Add New Event
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Today
          </h3>
          <div className="space-y-3">
            {todayEvents.map((event) => (
              <EventCard key={`today-${event.id}`} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Tomorrow's Events */}
      {tomorrowEvents.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            Tomorrow
          </h3>
          <div className="space-y-3">
            {tomorrowEvents.map((event) => (
              <EventCard key={`tomorrow-${event.id}`} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-medium text-gray-900">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            Upcoming
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <EventCard key={`upcoming-${event.id}`} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const eventType = getEventType(event.type);
  const colors = eventType;

  function getEventType(type: string) {
    switch (type) {
      case "Meeting":
        return {
          bg: "bg-blue-500",
          light: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
        };
      case "Call":
        return {
          bg: "bg-green-500",
          light: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "Appointment":
        return {
          bg: "bg-purple-500",
          light: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
        };
      case "Task":
        return {
          bg: "bg-amber-500",
          light: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
        };
      case "Event":
        return {
          bg: "bg-indigo-500",
          light: "bg-indigo-50",
          text: "text-indigo-700",
          border: "border-indigo-200",
        };
      default:
        return {
          bg: "bg-gray-500",
          light: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      {/* Colored accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 ${colors.bg}`}></div>

      <div className="ml-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 line-clamp-1">
            {event.title}
          </h4>
          <span
            className={`inline-flex items-center rounded-full ${colors.light} ${colors.text} border ${colors.border} px-2.5 py-0.5 text-xs font-medium`}
          >
            {event.type}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-500" />
            <span>{format(eventDate, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            <span>{format(eventDate, "h:mm a")}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 col-span-2">
              <MapPin className="h-3.5 w-3.5 text-gray-500" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.attendees && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-500" />
              <span>
                {event.attendees} attendee{event.attendees !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          {event.duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gray-500" />
              <span>{event.duration} min</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 flex items-center justify-end bg-gradient-to-l from-gray-50/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pr-4">
        <button className="rounded-full bg-white p-1.5 shadow-sm border border-gray-200 text-gray-600 hover:text-indigo-600 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
