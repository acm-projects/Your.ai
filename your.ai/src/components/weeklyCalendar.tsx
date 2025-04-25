"use client"

import { useEffect, useState } from "react"
import { addDays, format, startOfWeek, addWeeks } from "date-fns"
import { useAuth } from "../Context/authContext" // Adjust path if needed
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  time: string
  date: string
  duration: number
  color: string
  startHour: number
  startMinute: number
}

export default function WeeklyCalendar() {
  const { token } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay() || 7) // Default to 7 (Sunday) if 0
  const [weekOffset, setWeekOffset] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [minHour, setMinHour] = useState<number>(8) // Default start hour
  const [maxHour, setMaxHour] = useState<number>(19) // Default end hour (7 PM)

  const baseDate = addWeeks(new Date(), weekOffset)
  const startDate = startOfWeek(baseDate, { weekStartsOn: 1 })

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i)
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "d"),
      isToday: format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
      index: i + 1,
    }
  })

  // Generate hours based on min and max hour
  const hours = Array.from({ length: maxHour - minHour + 1 }, (_, i) => {
    const hour = i + minHour
    return hour < 12 ? `${hour} AM` : hour === 12 ? `${hour} PM` : `${hour - 12} PM`
  })

  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ")

  // Generate a color based on event title for consistency
  const getEventColor = (title: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-rose-500",
      "bg-emerald-500",
      "bg-amber-500",
    ]

    // Hash the title to get a consistent index
    const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:5001/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()

        // Process events and determine min/max hours
        let earliestHour = 8
        let latestHour = 19

        const formatted: CalendarEvent[] = data.map((item: any, idx: number) => {
          const startDateTime = item.start ? new Date(item.start) : new Date()
          const endDateTime = item.end ? new Date(item.end) : new Date(startDateTime.getTime() + 60 * 60 * 1000)

          const startHour = startDateTime.getHours()
          const startMinute = startDateTime.getMinutes()

          // Calculate duration in hours
          const durationMs = endDateTime.getTime() - startDateTime.getTime()
          const durationHours = Math.max(0.5, durationMs / (1000 * 60 * 60)) // Minimum 30 min

          // Update earliest and latest hours
          earliestHour = Math.min(earliestHour, startHour)
          latestHour = Math.max(latestHour, startHour + Math.ceil(durationHours))

          return {
            id: String(idx),
            title: item.summary || "No Title",
            time: format(startDateTime, "h:mm a"),
            date: format(startDateTime, "yyyy-MM-dd"),
            duration: durationHours,
            color: getEventColor(item.summary || "No Title"),
            startHour,
            startMinute,
          }
        })

        // Adjust min/max hours with some padding
        setMinHour(Math.max(6, earliestHour - 1))
        setMaxHour(Math.min(22, latestHour + 1))
        setEvents(formatted)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCalendarEvents()
  }, [token, weekOffset])

  return (
    <div className="w-full overflow-hidden rounded-xl border bg-white shadow-md">
      <div className="flex justify-between items-center p-4 border-b">
        <button
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="font-semibold text-lg text-gray-800">Week of {format(startDate, "MMMM d, yyyy")}</h2>
        <button
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[768px]">
            <div className="grid grid-cols-8 gap-px">
              {/* Time column */}
              <div className="col-span-1 bg-gray-50">
                <div className="h-14 border-b border-gray-200"></div>
                {hours.map((hour, idx) => (
                  <div
                    key={idx}
                    className="h-14 pr-2 text-right text-xs font-medium text-gray-500 border-b border-gray-100"
                  >
                    {hour}
                  </div>
                ))}
              </div>

              {/* Days columns */}
              {weekDays.map((day) => (
                <div
                  key={day.index}
                  className={cn(
                    "col-span-1 cursor-pointer border-l border-gray-100",
                    day.isToday ? "bg-blue-50" : "hover:bg-gray-50",
                  )}
                  onClick={() => setSelectedDay(day.index)}
                >
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center h-14 border-b font-medium text-sm",
                      day.isToday ? "text-blue-600" : "text-gray-700",
                    )}
                  >
                    <span>{day.dayName}</span>
                    <span
                      className={cn(
                        "mt-1 flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full",
                        selectedDay === day.index
                          ? "bg-indigo-600 text-white"
                          : day.isToday
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700",
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
                        className="h-14 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      ></div>
                    ))}

                    {/* Events for this day */}
                    {events
                      .filter((event) => event.date === format(addDays(startDate, day.index - 1), "yyyy-MM-dd"))
                      .map((event) => {
                        // Calculate position based on event time
                        const top = (event.startHour - minHour) * 56 + (event.startMinute / 60) * 56
                        const height = Math.max(28, event.duration * 56) // Minimum height for visibility

                        return (
                          <div
                            key={event.id}
                            className={cn(
                              "absolute left-1 right-1 rounded-md p-2 text-xs font-medium text-white shadow-sm transition-all hover:shadow-md",
                              event.color,
                            )}
                            style={{ top: `${top}px`, height: `${height}px` }}
                          >
                            <div className="font-semibold truncate">{event.title}</div>
                            <div className="text-[10px] opacity-90">{event.time}</div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
