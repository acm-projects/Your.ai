"use client"

import { Clock, Calendar, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react"

export default function WeeklySummary() {
  return (
    <div className="space-y-5">
      {/* Time Management Tip */}
      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Time Management Tip</h4>
            <p className="mt-1 text-sm text-gray-600">
              You have 3 hours of free time on Wednesday afternoon. This would be a good time for your grocery shopping.
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Suggestion */}
      <div className="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Schedule Suggestion</h4>
            <p className="mt-1 text-sm text-gray-600">
              Based on your calendar, the best time for gym sessions this week would be Tuesday and Thursday at 5:00 PM.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Busy Period */}
      <div className="rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Upcoming Busy Period</h4>
            <p className="mt-1 text-sm text-gray-600">
              You have back-to-back meetings on Friday morning. Consider preparing materials in advance.
            </p>
          </div>
        </div>
      </div>

      {/* Week Overview */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Week Overview</h3>
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            <TrendingUp className="h-4 w-4" />
            <span>40% less busy</span>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Scheduled Events</span>
              <span className="text-gray-600">15 hours</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 w-[37.5%] rounded-full bg-blue-500"></div>
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Free Time</span>
              <span className="text-gray-600">25 hours</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 w-[62.5%] rounded-full bg-green-500"></div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 text-sm text-gray-600">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Your week is well balanced with work and free time</span>
          </div>
        </div>
      </div>
    </div>
  )
}
