import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAuth } from "../Context/authContext";

interface Event {
  id: number;
  title: string;
  date: string;
  duration?: number;
  type: string;
  color: string;
}

export default function UpcomingEvents() {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

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

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const formatted = data.map((item: any, idx: number) => ({
          id: idx,
          title: item.summary || "No Title",
          date: item.start || new Date().toISOString(),
          duration: 60,
          type: "Meeting",
          color: ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"][idx % 4],
        }));

        setEvents(formatted);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [token]);

  if (loading) return <p className="text-sm text-gray-500">Loading upcoming events...</p>;

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-start space-x-4 rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
        >
          <div className={cn("mt-1 h-3 w-3 rounded-full", event.color)} />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-gray-800">{event.title}</p>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full border",
                  event.color,
                  "text-gray-800 bg-white"
                )}
              >
                {event.type}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <div className="flex items-center">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{format(new Date(event.date), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{format(new Date(event.date), "h:mm a")}</span>
              </div>
              {event.duration && (
                <span className="ml-1 text-gray-400">({event.duration} min)</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
