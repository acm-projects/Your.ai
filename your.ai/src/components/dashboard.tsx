"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { CalendarClock, Clock, ListTodo, Calendar } from "lucide-react"
import WeeklyCalendar from "./weeklyCalendar"
import UpcomingEvents from "../components/UpcomingEvents"
import WeeklySummary from "../components/WeeklySummary"
import TaskBoard from "./taskBoard"
import Sidebar from "./Sidebar"
import Newsletter from "../components/newsletter"
import { useAuth } from "../Context/authContext"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

interface Event {
  id: string
  title: string
  time: string
  date: string
}

interface ApiEvent {
  summary: string
  start: string
  end: string
}

type StatsCardProps = {
  title: string
  value: string | number
  icon: React.ReactNode
  subtitle: string
}

function StatsCard({ title, value, icon, subtitle }: StatsCardProps) {
  return (
    <div className="rounded-2xl border bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between p-5">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>
      <div className="px-5 pb-5 pt-0">
        <div className="text-3xl font-bold text-blue-600">{value}</div>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  )
}

type SectionCardProps = {
  title: string
  subtitle: string
  children: React.ReactNode
  className?: string
}

function SectionCard({ title, subtitle, children, className = "" }: SectionCardProps) {
  return (
    <div
      className={`rounded-2xl border bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="p-6 border-b">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function Dashboard() {
  const { token } = useAuth()
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)
  const [todaysEvents, setTodaysEvents] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<ApiEvent[]>([])
  const [freeTime, setFreeTime] = useState({ hours: "0", timeSlot: "No free time available" })
  const [weekProgress, setWeekProgress] = useState({ percentage: "0%", daysCompleted: "0 of 0 days completed" })
  const [isLoading, setIsLoading] = useState(true)

  const openNewsletter = () => setIsNewsletterOpen(true)
  const closeNewsletter = () => setIsNewsletterOpen(false)

  // Calculate free time based on today's events
  const calculateFreeTime = (events: ApiEvent[]) => {
    const today = dayjs().format("YYYY-MM-DD")
    const todayEvents = events.filter((event) => event.start.startsWith(today))

    if (todayEvents.length === 0) {
      return { hours: "8", timeSlot: "All day" }
    }

    // Sort events by start time
    todayEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

    // Calculate total busy time (assuming each event takes its full duration)
    let totalBusyHours = 0
    let largestGap = { start: null, end: null, duration: 0 }

    for (let i = 0; i < todayEvents.length; i++) {
      const event = todayEvents[i]
      const startTime = dayjs(event.start)
      const endTime = dayjs(event.end)
      const duration = endTime.diff(startTime, "hour", true)
      totalBusyHours += duration

      // Find largest gap between events
      if (i < todayEvents.length - 1) {
        const nextEvent = todayEvents[i + 1]
        const gapStart = endTime
        const gapEnd = dayjs(nextEvent.start)
        const gapDuration = gapEnd.diff(gapStart, "hour", true)

        if (gapDuration > largestGap.duration) {
          largestGap = {
            start: gapStart,
            end: gapEnd,
            duration: gapDuration,
          }
        }
      }
    }

    // Assuming 12 working hours in a day (8am-8pm)
    const freeHours = Math.max(0, 12 - totalBusyHours)

    // Format the time slot string
    let timeSlot = "No significant free time blocks"
    if (largestGap.duration > 1 && largestGap.start && largestGap.end) {
      timeSlot = `Today between ${largestGap.start.format("h:mm A")} - ${largestGap.end.format("h:mm A")}`
    } else if (freeHours > 4) {
      timeSlot = "Several hours available throughout the day"
    }

    return {
      hours: freeHours.toFixed(1),
      timeSlot: timeSlot,
    }
  }

  // Calculate week progress
  const calculateWeekProgress = () => {
    const today = dayjs()
    const dayOfWeek = today.day() // 0 is Sunday, 6 is Saturday

    // Convert to Monday-based week (1-7)
    const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek

    // Calculate percentage (assuming 5-day work week)
    const workDaysCompleted = Math.min(adjustedDay - 1, 5) // Monday-Friday
    const percentage = Math.round((workDaysCompleted / 5) * 100)

    return {
      percentage: `${percentage}%`,
      daysCompleted: `${workDaysCompleted} of 5 days completed`,
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:5001/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch events")

        const data = await response.json()
        setAllEvents(data)

        const today = dayjs().format("YYYY-MM-DD")
        const filtered = data
          .filter((event: any) => event.start.startsWith(today))
          .map((item: any, idx: number) => {
            const timeStr = item.start?.split("T")[1]?.substring(0, 5) || "00:00"
            return {
              id: String(idx),
              title: item.summary || "No Title",
              time: timeStr,
              date: item.start,
            }
          })

        setTodaysEvents(filtered)

        // Calculate stats from events data
        setFreeTime(calculateFreeTime(data))
        setWeekProgress(calculateWeekProgress())
      } catch (err) {
        console.error("Failed to load events:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchEvents()
    }
  }, [token])

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      <Sidebar />

      <div className="flex-1 space-y-6 p-4 md:p-8 bg-gray-50 overflow-y-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2 py-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's an overview of your week.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openNewsletter}
              className="inline-flex items-center gap-2 rounded-md text-sm font-medium bg-indigo-600 text-white h-10 px-4 py-2 hover:bg-indigo-700 transition-colors"
            >
              Weekly Digest
            </button>
            <button className="inline-flex items-center gap-2 rounded-md text-sm font-medium bg-blue-600 text-white h-10 px-4 py-2 hover:bg-blue-700 transition-colors">
              <CalendarClock className="h-4 w-4" />
              Add Event
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Today's Events"
            value={todaysEvents.length}
            subtitle={
              todaysEvents.length > 0
                ? `Next: ${todaysEvents[0].title} at ${dayjs(todaysEvents[0].date)
                    .tz("America/Chicago") // change as needed
                    .format("h:mm A")}`
                : "No events today"
            }
            icon={<Calendar className="h-5 w-5 text-blue-500" />}
          />
          <StatsCard
            title="Free Time"
            value={`${freeTime.hours}h`}
            subtitle={freeTime.timeSlot}
            icon={<Clock className="h-5 w-5 text-green-500" />}
          />
          <StatsCard
            title="Pending Tasks"
            value={8}
            subtitle="3 due today"
            icon={<ListTodo className="h-5 w-5 text-red-500" />}
          />
          <StatsCard
            title="Week Progress"
            value={weekProgress.percentage}
            subtitle={weekProgress.daysCompleted}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-5 w-5 text-purple-500"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            }
          />
        </div>

        {/* Weekly Calendar and Upcoming Events */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <SectionCard title="Week at a Glance" subtitle="Your schedule for this week" className="col-span-4">
            <WeeklyCalendar />
          </SectionCard>

          <SectionCard title="Upcoming Events" subtitle="Your next appointments and deadlines" className="col-span-3">
            <UpcomingEvents />
          </SectionCard>
        </div>

        {/* Weekly Summary and Task Board */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <SectionCard title="Weekly Summary" subtitle="Time management suggestions" className="col-span-3">
            <WeeklySummary />
          </SectionCard>

          <SectionCard title="Task Board" subtitle="Manage your to-do list" className="col-span-4">
            <TaskBoard />
          </SectionCard>
        </div>
      </div>

      {/* Newsletter Modal */}
      <Newsletter isOpen={isNewsletterOpen} onClose={closeNewsletter} />
    </div>
  )
}
