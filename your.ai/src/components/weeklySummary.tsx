export default function WeeklySummary() {
  return (
    <div className="space-y-4">
      {/* Time Management Tip */}
      <div className="rounded-md border p-4 text-sm">
        <div className="flex items-start gap-2">
          <svg
            className="h-4 w-4 mt-0.5 text-gray-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          <div>
            <h4 className="font-medium text-gray-900">Time Management Tip</h4>
            <p className="text-gray-500">
              You have 3 hours of free time on Wednesday afternoon. This would be a good time for your grocery shopping.
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Suggestion */}
      <div className="rounded-md border p-4 text-sm">
        <div className="flex items-start gap-2">
          <svg
            className="h-4 w-4 mt-0.5 text-gray-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div>
            <h4 className="font-medium text-gray-900">Schedule Suggestion</h4>
            <p className="text-gray-500">
              Based on your calendar, the best time for gym sessions this week would be Tuesday and Thursday at 5:00 PM.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Busy Period */}
      <div className="rounded-md border p-4 text-sm">
        <div className="flex items-start gap-2">
          <svg
            className="h-4 w-4 mt-0.5 text-gray-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <h4 className="font-medium text-gray-900">Upcoming Busy Period</h4>
            <p className="text-gray-500">
              You have back-to-back meetings on Friday morning. Consider preparing materials in advance.
            </p>
          </div>
        </div>
      </div>

      {/* Week Overview */}
      <div className="mt-4 text-sm text-gray-500">
        <h3 className="font-medium text-gray-900">Week Overview</h3>
        <p className="mt-1">
          This week is 40% less busy than last week. You have 15 hours of scheduled events and approximately 25 hours of
          free time during working hours.
        </p>
      </div>
    </div>
  );
}
