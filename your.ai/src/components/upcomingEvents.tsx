import { format } from "date-fns";

// Sample events data
const upcomingEvents = [
  {
    id: 1,
    title: "Team Meeting",
    date: new Date(2025, 3, 15, 10, 0),
    duration: 60,
    type: "Meeting",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Project Deadline",
    date: new Date(2025, 3, 16, 23, 59),
    type: "Deadline",
    color: "bg-red-500",
  },
  {
    id: 3,
    title: "Lunch with Client",
    date: new Date(2025, 3, 17, 12, 30),
    duration: 90,
    type: "Personal",
    color: "bg-green-500",
  },
  {
    id: 4,
    title: "Gym Session",
    date: new Date(2025, 3, 18, 17, 0),
    duration: 60,
    type: "Personal",
    color: "bg-yellow-500",
  },
];

export default function UpcomingEvents() {
  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

  return (
    <div className="space-y-4">
      {upcomingEvents.map((event) => (
        <div key={event.id} className="flex items-start space-x-4 rounded-md border p-3 hover:bg-gray-50">
          <div className={cn("mt-1 h-2 w-2 rounded-full", event.color)} />
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{event.title}</p>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {event.type}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-3 w-3"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{format(event.date, "MMM d, yyyy")}</span>
              <span className="mx-1">•</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-3 w-3"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{format(event.date, "h:mm a")}</span>
              {event.duration && <span className="ml-1">({event.duration} min)</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}