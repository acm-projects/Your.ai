"use client"

import type React from "react"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import { useCalendar } from "../context/CalendarContext"
import { CheckCircle2, Circle, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

interface WeeklyWithSidebarProps {
  selectedDate: Dayjs | null
  setSelectedDate: (date: Dayjs | null) => void
  categories: Record<string, boolean>
  handleCategoryChange: (key: string) => void
}

// Update the Weekly component to handle dates correctly
const Weekly: React.FC<WeeklyWithSidebarProps> = ({
  selectedDate,
  setSelectedDate,
  categories,
  handleCategoryChange,
}) => {
  const { events, isLoading, fetchEvents } = useCalendar()

  // Ensure we have a valid start of week
  const startOfWeek = selectedDate ? selectedDate.startOf("week") : dayjs().startOf("week")
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"))

  // Filter events based on the selected week
  const filteredEvents = events.filter((event) => {
    if (!event.date) return false

    try {
      const eventDate = new Date(event.date)
      const weekStart = startOfWeek.toDate()
      const weekEnd = startOfWeek.add(6, "day").toDate()
      return eventDate >= weekStart && eventDate <= weekEnd
    } catch (e) {
      return false // Skip events with invalid dates instead of logging errors
    }
  })

  // Format time to ensure 12-hour format
  const formatTime = (timeString: string) => {
    if (!timeString) return ""

    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString
    }

    try {
      const time = new Date(`2000-01-01T${timeString}`)
      return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    } catch (e) {
      return timeString
    }
  }

  // Extract hour from time string (e.g., "9:00 AM")
  const getHourFromTimeString = (timeString: string): number => {
    if (!timeString) return 0

    try {
      const matches = timeString.match(/(\d+):/)
      if (matches) {
        let hour = Number.parseInt(matches[1], 10)
        if (timeString.includes("PM") && hour !== 12) hour += 12
        if (timeString.includes("AM") && hour === 12) hour = 0
        return hour
      }
    } catch (e) {
      // Silent error handling
    }
    return 0
  }

  // Check if an event is in the past
  const isPastEvent = (date: string, time: string): boolean => {
    try {
      const eventDateTime = new Date(`${date}T${time.replace(/\s?[AP]M/, "")}`)
      return eventDateTime < new Date()
    } catch (e) {
      return false
    }
  }

  // Navigate to previous/next week
  const goToPreviousWeek = () => {
    setSelectedDate(startOfWeek.subtract(7, "day"))
  }

  const goToNextWeek = () => {
    setSelectedDate(startOfWeek.add(7, "day"))
  }

  // Refresh events
  const refreshEvents = () => {
    fetchEvents()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Weekly View */}
      <div className="flex-1 bg-white rounded-lg shadow-md border overflow-hidden">
        {/* Week of Header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
          <button
            onClick={goToPreviousWeek}
            className="p-1 rounded-full hover:bg-white/50 transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-5 w-5 text-indigo-600" />
          </button>

          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-800">Week of {startOfWeek.format("MMMM D, YYYY")}</h2>
            <div className="text-sm text-gray-500 mt-1">
              {startOfWeek.format("MMM D")} - {startOfWeek.add(6, "day").format("MMM D, YYYY")}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshEvents}
              className="p-1 rounded-full hover:bg-white/50 transition-colors"
              aria-label="Refresh events"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
            </button>
            <button
              onClick={goToNextWeek}
              className="p-1 rounded-full hover:bg-white/50 transition-colors"
              aria-label="Next week"
            >
              <ChevronRight className="h-5 w-5 text-indigo-600" />
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-center text-gray-700 border-b py-3 font-medium bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div key={day} className={`${index === new Date().getDay() ? "text-indigo-600 font-semibold" : ""}`}>
              {day}
              <div className="text-xs text-gray-500 mt-1">{daysOfWeek[index].format("MMM D")}</div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="divide-y">
            {Array.from({ length: 12 }).map((_, i) => {
              const hour = i + 9
              const hour12 = hour % 12 === 0 ? 12 : hour % 12
              const ampm = hour >= 12 ? "PM" : "AM"

              return (
                <div key={i} className="flex px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="w-20 text-gray-500 text-sm font-medium">{`${hour12}:00 ${ampm}`}</div>
                  <div className="flex flex-1">
                    {daysOfWeek.map((day, dayIndex) => {
                      const formattedDate = day.format("YYYY-MM-DD")
                      const dayEvents = filteredEvents.filter((event) => {
                        if (!event.date || !event.time) return false

                        const eventDate = event.date
                        const eventHour = getHourFromTimeString(event.time)

                        return eventDate === formattedDate && eventHour === hour
                      })

                      const isCurrentHourAndDay =
                        new Date().getDay() === dayIndex &&
                        new Date().getHours() === hour &&
                        new Date().toISOString().split("T")[0] === formattedDate

                      return (
                        <div
                          key={dayIndex}
                          className={`flex-1 relative min-h-[60px] border-l ${isCurrentHourAndDay ? "bg-blue-50" : ""}`}
                        >
                          {dayEvents.map((event) => {
                            const isPast = isPastEvent(event.date, event.time)

                            return (
                              <div
                                key={event.id}
                                className={`absolute left-1 right-1 p-2 rounded-md text-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                                  isPast ? "bg-gray-200 text-gray-700" : `${event.color || "bg-indigo-500"} text-white`
                                }`}
                                style={{ top: "0", minHeight: "50px" }}
                              >
                                <div className="font-semibold truncate flex items-center gap-1">
                                  {isPast && <span className="inline-block w-2 h-2 rounded-full bg-gray-500"></span>}
                                  {event.title}
                                </div>
                                {event.time && (
                                  <div className="text-xs opacity-90 flex items-center gap-1">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
                                    {formatTime(event.time)}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
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
          <h4 className="text-lg font-semibold mb-3 text-gray-700">Categories</h4>
          <div className="space-y-2 text-sm text-gray-600">
            {Object.keys(categories).map((cat) => (
              <label
                key={cat}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-md transition-colors"
                onClick={() => handleCategoryChange(cat)}
              >
                <div className="flex items-center justify-center">
                  {categories[cat] ? (
                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-1">
          <Plus className="h-4 w-4" />
          New Event
        </button>
      </div>
    </div>
  )
}

export default Weekly
