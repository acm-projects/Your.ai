"use client"

import { useState, useEffect, useRef, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Context/authContext"

declare global {
  interface Window {
    __TOMORROW__?: {
      renderWidget: () => void
    }
  }
}

// Define interfaces for our data structures
interface Event {
  time: string
  title: string
  category: string
  location: string
  date?: string
  color?: string // Added color property
}

interface DaySchedule {
  day: string
  date: string
  events: Event[]
}

// Expanded color palette for events
const eventColors = [
  { bg: "bg-blue-500", text: "text-blue-50", light: "bg-blue-100" },
  { bg: "bg-green-500", text: "text-green-50", light: "bg-green-100" },
  { bg: "bg-amber-500", text: "text-amber-50", light: "bg-amber-100" },
  { bg: "bg-purple-500", text: "text-purple-50", light: "bg-purple-100" },
  { bg: "bg-rose-500", text: "text-rose-50", light: "bg-rose-100" },
  { bg: "bg-teal-500", text: "text-teal-50", light: "bg-teal-100" },
  { bg: "bg-indigo-500", text: "text-indigo-50", light: "bg-indigo-100" },
  { bg: "bg-pink-500", text: "text-pink-50", light: "bg-pink-100" },
  { bg: "bg-emerald-500", text: "text-emerald-50", light: "bg-emerald-100" },
  { bg: "bg-orange-500", text: "text-orange-50", light: "bg-orange-100" },
]

const categoryColors = {
  work: { bg: "bg-blue-500", text: "text-blue-50", light: "bg-blue-100", icon: "💼" },
  school: { bg: "bg-purple-500", text: "text-purple-50", light: "bg-purple-100", icon: "🎓" },
  health: { bg: "bg-green-500", text: "text-green-50", light: "bg-green-100", icon: "🏋️" },
  personal: { bg: "bg-amber-500", text: "text-amber-50", light: "bg-amber-100", icon: "🌟" },
  career: { bg: "bg-rose-500", text: "text-rose-50", light: "bg-rose-100", icon: "💻" },
}

// Fallback category when the API doesn't provide one
const defaultCategory = "personal"

// Helper function to determine category based on event title
const getCategoryFromTitle = (title: string): string => {
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes("meeting") || lowerTitle.includes("work") || lowerTitle.includes("project")) {
    return "work"
  } else if (lowerTitle.includes("class") || lowerTitle.includes("study") || lowerTitle.includes("research")) {
    return "school"
  } else if (lowerTitle.includes("gym") || lowerTitle.includes("workout") || lowerTitle.includes("run")) {
    return "health"
  } else if (lowerTitle.includes("interview") || lowerTitle.includes("resume") || lowerTitle.includes("job")) {
    return "career"
  }
  return "personal"
}

// Helper function to get a consistent color based on event title
const getColorForEvent = (event: Event): { bg: string; text: string; light: string } => {
  // Use the event title to generate a consistent color index
  const titleHash = event.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colorIndex = titleHash % eventColors.length
  return eventColors[colorIndex]
}

// We'll replace this with dynamically generated tips from the LLM
const fallbackTimeManagementTips = [
  {
    title: "Focus Blocks",
    description:
      "Schedule 90-minute focus blocks for deep work on Tuesday and Thursday mornings when you have fewer meetings.",
    icon: "🧠",
  },
  {
    title: "Exercise Routine",
    description:
      "You have consistent gym time on Monday. Consider adding another session on Thursday or Friday for balance.",
    icon: "💪",
  },
  {
    title: "Social Balance",
    description:
      "You have social activities planned for Wednesday and Friday. Great job balancing work and personal life!",
    icon: "🤝",
  },
  {
    title: "Career Development",
    description: "Thursday's job interview is a priority. Block out 2 hours before for preparation and review.",
    icon: "📈",
  },
]

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-blue-500",
}

interface NewsletterProps {
  isOpen: boolean
  onClose: () => void
}

// Define the structure for time management tips
interface TimeManagementTip {
  title: string
  description: string
  icon: string
}

const Newsletter = ({ isOpen, onClose }: NewsletterProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState("week") // 'week' or 'day'
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([])
  const [selectedDay, setSelectedDay] = useState<DaySchedule | null>(null)
  const [timeManagementTips, setTimeManagementTips] = useState<TimeManagementTip[]>(fallbackTimeManagementTips)
  const [isLoadingTips, setIsLoadingTips] = useState(false)
  const [tipError, setTipError] = useState<string | null>(null)
  const [weeklyHighlights, setWeeklyHighlights] = useState<any[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [eventError, setEventError] = useState<string | null>(null)

  const weatherWidgetRef = useRef(null)
  const navigate = useNavigate()

  const { token } = useAuth()

  // Function to fetch events from the API
  const fetchEvents = async () => {
    setIsLoadingEvents(true)
    setEventError(null)

    try {
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch("http://localhost:5001/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // Process the events into our weekly schedule format
      const processedSchedule = processEventsIntoWeeklySchedule(data)
      setWeeklySchedule(processedSchedule)

      // Set the selected day to the first day with events, or today
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
      const todaySchedule = processedSchedule.find((day) => day.day === today) || processedSchedule[0]
      setSelectedDay(todaySchedule)

      // Extract highlights from the events
      const highlights = extractHighlights(data)
      setWeeklyHighlights(highlights)
    } catch (error) {
      console.error("Error fetching events:", error)
      setEventError("Failed to load events. Please try again later.")
      // Set empty schedule with days of the week
      setWeeklySchedule(generateEmptyWeekSchedule())
      setSelectedDay(generateEmptyWeekSchedule()[0])
    } finally {
      setIsLoadingEvents(false)
    }
  }

  // Calculate the date range for the header
  const getDateRangeString = () => {
    if (weeklySchedule.length === 0) return ""

    // Get the current date
    const now = new Date()

    // Find the start of the current week (Monday)
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1

    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - daysFromMonday)

    // Find the end of the current week (Sunday)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    // Format the date range
    return `${startOfWeek.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })} - ${endOfWeek.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`
  }

  // Helper function to process API events into our weekly schedule format
  const processEventsIntoWeeklySchedule = (events: any[]): DaySchedule[] => {
    // Create an object to hold events by day
    const eventsByDay: { [key: string]: Event[] } = {}

    // Get the current date
    const currentDate = new Date()

    // Find the start of the current week (Monday)
    const currentDay = currentDate.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1

    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - daysFromMonday)

    // Initialize with empty arrays for each day of the week
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    days.forEach((day, index) => {
      eventsByDay[day] = []
    })

    // Process each event
    events.forEach((event) => {
      try {
        // Parse the start date
        const startDate = new Date(event.start)

        // Get the day of the week
        const dayOfWeek = startDate.toLocaleDateString("en-US", { weekday: "long" })

        // Format the time
        const timeString = startDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })

        // Determine category based on event title
        const category = getCategoryFromTitle(event.title || "")

        // Create the event object with a color
        const formattedEvent: Event = {
          time: timeString,
          title: event.summary || "Untitled Event",
          category: category,
          location: event.location || "No location specified",
          date: startDate.toISOString(),
        }

        // Add to the appropriate day
        if (eventsByDay[dayOfWeek]) {
          eventsByDay[dayOfWeek].push(formattedEvent)
        }
      } catch (error) {
        console.error("Error processing event:", error, event)
      }
    })

    // Convert to our DaySchedule format with correct dates
    return days.map((day, index) => {
      // Calculate the date for this day based on the start of the week
      const dayDate = new Date(startOfWeek)
      dayDate.setDate(startOfWeek.getDate() + index)

      return {
        day: day,
        date: dayDate.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
        events: eventsByDay[day].sort((a, b) => {
          // Sort by time
          return a.time.localeCompare(b.time)
        }),
      }
    })
  }

  // Helper function to extract highlights from events
  const extractHighlights = (events: any[]): any[] => {
    // Sort events by some criteria (e.g., importance, recency)
    const sortedEvents = [...events].sort((a, b) => {
      // Example: Sort by start date
      return new Date(a.start).getTime() - new Date(b.start).getTime()
    })

    // Take the top 3 events
    const topEvents = sortedEvents.slice(0, 3)

    // Format them as highlights
    return topEvents.map((event) => {
      const startDate = new Date(event.start)
      const dayOfWeek = startDate.toLocaleDateString("en-US", { weekday: "long" })
      const category = getCategoryFromTitle(event.summary || "")

      return {
        title: event.summary || "Untitled Event",
        day: dayOfWeek,
        category: category,
        priority: category === "career" ? "high" : category === "work" ? "medium" : "low",
      }
    })
  }

  // Generate an empty week schedule for fallback
  const generateEmptyWeekSchedule = (): DaySchedule[] => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const currentDate = new Date()

    return days.map((day) => {
      const dayDate = new Date(currentDate)
      const dayIndex = days.indexOf(day)
      const currentDayIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1
      const daysToAdd = (dayIndex - currentDayIndex + 7) % 7
      dayDate.setDate(currentDate.getDate() + daysToAdd)

      return {
        day: day,
        date: dayDate.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
        events: [],
      }
    })
  }

  // Function to fetch time management tips from the LLM
  const fetchTimeManagementTips = async () => {
    setIsLoadingTips(true)
    setTipError(null)

    try {
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch("http://localhost:5001/llm/newsletter", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const message = data.newsletter
      // Clean up asterisks from the message
      const cleanedMessage = message.replace(/\*+/g, "")
      let tips: TimeManagementTip[] = []

      try {
        const jsonMatch = cleanedMessage.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          tips = JSON.parse(jsonMatch[0])
        } else {
          // If we can't parse JSON, try to extract structured content
          // Look for markdown-style headers and bullet points
          const sections = cleanedMessage.split(/#{1,3}\s+/).filter(Boolean)

          if (sections.length > 0) {
            tips = sections.map((section) => {
              const lines = section.trim().split("\n")
              const title = lines[0].trim()
              const description = lines.slice(1).join("\n").trim()

              // Determine an appropriate icon based on the title
              let icon = "🧠"
              if (title.toLowerCase().includes("focus")) icon = "🎯"
              else if (title.toLowerCase().includes("exercise") || title.toLowerCase().includes("health")) icon = "💪"
              else if (title.toLowerCase().includes("social") || title.toLowerCase().includes("balance")) icon = "🤝"
              else if (title.toLowerCase().includes("career") || title.toLowerCase().includes("work")) icon = "📈"
              else if (title.toLowerCase().includes("rest") || title.toLowerCase().includes("relax")) icon = "😴"

              return {
                title,
                description,
                icon,
              }
            })
          } else {
            // If no sections found, create a single tip
            tips = [
              {
                title: "Weekly Optimization",
                description: cleanedMessage.substring(0, 150) + "...",
                icon: "⏱️",
              },
            ]
          }
        }
      } catch (e) {
        console.error("Failed to parse newsletter content:", e)
        tips = [
          {
            title: "Weekly Optimization",
            description: cleanedMessage.substring(0, 150) + "...",
            icon: "⏱️",
          },
        ]
      }

      if (Array.isArray(tips) && tips.length > 0) {
        const validatedTips = tips.map((tip) => ({
          title: tip.title || "Time Management Tip",
          // Clean up any remaining asterisks in the description
          description: (tip.description || "No description provided").replace(/\*+/g, ""),
          icon: tip.icon || "🧠",
        }))
        setTimeManagementTips(validatedTips)
      } else {
        setTimeManagementTips(fallbackTimeManagementTips)
      }
    } catch (error) {
      console.error("Error fetching time management tips:", error)
      setTipError("Failed to load personalized tips. Using default recommendations.")
      setTimeManagementTips(fallbackTimeManagementTips)
    } finally {
      setIsLoadingTips(false)
    }
  }

  useEffect(() => {
    // Use the same script loading approach as provided
    if (!document.getElementById("tomorrow-sdk")) {
      const script = document.createElement("script")
      script.id = "tomorrow-sdk"
      script.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js"

      // Add the script to the document
      document.body.appendChild(script)

      script.onload = () => {
        if (window.__TOMORROW__) {
          window.__TOMORROW__.renderWidget()
        }
      }
    } else if (window.__TOMORROW__) {
      window.__TOMORROW__.renderWidget()
    }

    return () => {
      // Cleanup if needed
      const script = document.getElementById("tomorrow-sdk")
      if (script && script.parentNode) {
        // Only remove if component unmounts
        // script.parentNode.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen && token) {
      // Fetch events and tips when the newsletter is opened
      setIsLoading(true)

      Promise.all([fetchEvents(), fetchTimeManagementTips()]).finally(() => {
        setIsLoading(false)
      })
    }
  }, [isOpen, token])

  const handleDayClick = (day: SetStateAction<{ day: string; date: string; events: { time: string; title: string; category: string; location: string }[] }>) => {
    setSelectedDay(day)
    setCurrentView("day")
  }

  if (!isOpen) return null

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
        <div className="bg-white text-black rounded-xl w-3/4 h-4/5 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-medium text-gray-700">Preparing your weekly newsletter...</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Semi-transparent backdrop that allows the dashboard to be visible */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white text-black rounded-2xl w-11/12 max-w-7xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-5 left-10 w-32 h-32 rounded-full bg-white/20"></div>
            <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-white/20"></div>
            <div className="absolute -bottom-10 left-1/3 w-40 h-40 rounded-full bg-white/20"></div>
          </div>

          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Your Weekly Digest</h1>
            <p className="text-white/80 mt-2 text-lg">{getDateRangeString()}</p>
          </div>

          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl transition-colors"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        {/* Navigation */}
        <div className="sticky top-40 z-10 bg-gray-100 border-b border-gray-200 px-6 py-3 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView("week")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === "week" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Week at a Glance
            </button>
            {currentView === "day" && selectedDay && (
              <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium">
                {selectedDay.day}'s Schedule
              </button>
            )}
          </div>
          <div className="text-gray-500 text-sm">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>

        {/* Main content area - Removed fixed height to allow content to expand */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentView === "week" ? (
              <motion.div key="week-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* This Week's Schedule - Full width at the top */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">This Week's Schedule</h2>
                    {isLoadingEvents && (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <div className="p-6">
                    {eventError && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-700 text-sm mb-4">
                        {eventError}
                      </div>
                    )}

                    <div className="grid grid-cols-7 gap-4">
                      {weeklySchedule.map((day, index) => (
                        <motion.div
                          key={day.day}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleDayClick(day)}
                          className="cursor-pointer group"
                        >
                          <div className="text-center mb-2">
                            <div className="text-sm font-medium text-gray-500">{day.day.substring(0, 3)}</div>
                            <div className="text-lg font-bold text-gray-800">{day.date.split(" ")[1]}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 h-32 overflow-y-auto border border-gray-200 transition-colors group-hover:border-blue-300 group-hover:bg-blue-50">
                            {day.events.length > 0 ? (
                              day.events.map((event, idx) => {
                                // Get a color based on the event title
                                const eventColor = getColorForEvent(event)

                                return (
                                  <div
                                    key={idx}
                                    className={`mb-2 px-2 py-1 rounded text-xs ${eventColor.bg} ${eventColor.text} truncate`}
                                  >
                                    {event.time}: {event.title}
                                  </div>
                                )
                              })
                            ) : (
                              <div className="text-center text-gray-400 text-xs h-full flex items-center justify-center">
                                No events
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Two-column layout for the remaining widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left column (1/3 width) - Weekly Highlights, Weekly Stats, and Weather */}
                  <div className="md:col-span-1 space-y-6">
                    {/* Weekly highlights */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Weekly Highlights</h2>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {weeklyHighlights.length > 0 ? (
                            weeklyHighlights.map((highlight, index) => {
                              // Get a color based on the highlight title
                              const highlightColor = getColorForEvent({
                                title: highlight.title,
                                category: highlight.category,
                                time: "",
                                location: "",
                              })

                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                  <div
                                    className={`w-3 h-3 rounded-full ${priorityColors[highlight.priority]} mr-4`}
                                  ></div>
                                  <div className="flex-1">
                                    <h3 className="font-medium text-gray-800">{highlight.title}</h3>
                                    <p className="text-gray-500 text-sm">{highlight.day}</p>
                                  </div>
                                  <div
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${highlightColor.light} ${highlightColor.text
                                      .replace("text-blue-50", "text-blue-700")
                                      .replace("text-purple-50", "text-purple-700")
                                      .replace("text-green-50", "text-green-700")
                                      .replace("text-amber-50", "text-amber-700")
                                      .replace("text-rose-50", "text-rose-700")
                                      .replace("text-teal-50", "text-teal-700")
                                      .replace("text-indigo-50", "text-indigo-700")
                                      .replace("text-pink-50", "text-pink-700")
                                      .replace("text-emerald-50", "text-emerald-700")
                                      .replace("text-orange-50", "text-orange-700")}`}
                                  >
                                    {highlight.category}
                                  </div>
                                </motion.div>
                              )
                            })
                          ) : (
                            <div className="text-center text-gray-500 py-4">No highlights available</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Weekly stats */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Weekly Stats</h2>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Busiest day</span>
                              <span className="font-medium text-gray-800">
                                {(() => {
                                  // Find the day with the most events
                                  if (weeklySchedule.length === 0) return "N/A"

                                  const busiestDay = weeklySchedule.reduce((prev, current) =>
                                    prev.events.length > current.events.length ? prev : current,
                                  )

                                  return `${busiestDay.day} (${busiestDay.events.length} events)`
                                })()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Category breakdown</span>
                            </div>
                            <div className="flex h-4 rounded-full overflow-hidden">
                              {(() => {
                                // Calculate category percentages
                                const categories: { [key: string]: number } = {}
                                let totalEvents = 0

                                weeklySchedule.forEach((day) => {
                                  day.events.forEach((event) => {
                                    categories[event.category] = (categories[event.category] || 0) + 1
                                    totalEvents++
                                  })
                                })

                                if (totalEvents === 0) {
                                  return <div className="bg-gray-300 w-full h-4"></div>
                                }

                                // Convert to array for rendering
                                return Object.entries(categories).map(([category, count], index) => {
                                  const color =
                                    categoryColors[category as keyof typeof categoryColors]?.bg ||
                                    eventColors[index % eventColors.length].bg

                                  return (
                                    <div
                                      key={index}
                                      className={color}
                                      style={{ width: `${(count / totalEvents) * 100}%` }}
                                      title={`${category}: ${Math.round((count / totalEvents) * 100)}%`}
                                    ></div>
                                  )
                                })
                              })()}
                            </div>
                            <div className="flex text-xs mt-1 justify-between">
                              <span className="text-blue-600">Work</span>
                              <span className="text-purple-600">School</span>
                              <span className="text-amber-600">Personal</span>
                              <span className="text-green-600">Health</span>
                              <span className="text-rose-600">Career</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Free time blocks</span>
                              <span className="font-medium text-gray-800">
                                {(() => {
                                  // Calculate free time blocks more realistically
                                  const totalEvents = weeklySchedule.reduce((sum, day) => sum + day.events.length, 0)

                                  // Assuming each event takes 1.5 hours on average
                                  const busyHours = totalEvents * 1.5

                                  // Assuming 12 waking hours per day (8am-8pm)
                                  const totalWakingHours = 7 * 12

                                  // Calculate free hours
                                  const freeHours = Math.max(0, totalWakingHours - busyHours)

                                  // Calculate free blocks (assuming a block is 2 hours)
                                  const freeBlocks = Math.floor(freeHours / 2)

                                  return `${freeBlocks} blocks (${Math.round(freeHours)}h total)`
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weather Widget - Moved below weekly stats */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Weather Forecast</h2>
                      </div>
                      <div className="p-6">
                        <div ref={weatherWidgetRef} className="weather-container min-h-[375px]">
                          <div
                            className="tomorrow"
                            data-location-id=""
                            data-language="EN"
                            data-unit-system="IMPERIAL"
                            data-skin="light"
                            data-widget-type="upcoming"
                            style={{
                              paddingBottom: "22px",
                              position: "relative",
                            }}
                          >
                            <a
                              href="https://weather.tomorrow.io/"
                              rel="nofollow noopener noreferrer"
                              target="_blank"
                              style={{
                                position: "absolute",
                                bottom: 0,
                                transform: "translateX(-50%)",
                                left: "50%",
                              }}
                            >
                              <img
                                alt="Powered by Tomorrow.io"
                                src="https://weather-website-client.tomorrow.io/img/powered-by.svg"
                                width="250"
                                height="18"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column (2/3 width) - Time Management Tips */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Time management tips - Made expandable */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Time Management Tips</h2>
                        {isLoadingTips && (
                          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                      <div className="p-6">
                        {/* This div will expand with content */}
                        <div className="space-y-6">
                          {tipError && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-700 text-sm mb-4">
                              {tipError}
                            </div>
                          )}

                          {timeManagementTips.map((tip, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                            >
                              <div className="flex items-start">
                                <div className="text-3xl mr-3">{tip.icon}</div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-800">{tip.title}</h3>
                                  <div className="text-gray-600 text-sm mt-1">
                                    {tip.description.includes("•") || tip.description.includes("-") ? (
                                      <div className="space-y-1">
                                        {tip.description.split("\n").map((line, i) => {
                                          // Check if this is a bullet point
                                          if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
                                            return (
                                              <div key={i} className="flex items-start">
                                                <span className="text-blue-500 mr-2">•</span>
                                                <span>{line.trim().replace(/^[•-]\s*/, "")}</span>
                                              </div>
                                            )
                                          } else if (line.trim().startsWith("#")) {
                                            // This is a subheading
                                            return (
                                              <div key={i} className="font-medium text-gray-700 mt-2">
                                                {line.trim().replace(/^#+\s*/, "")}
                                              </div>
                                            )
                                          } else if (line.trim()) {
                                            // Regular text
                                            return <p key={i}>{line}</p>
                                          }
                                          return null
                                        })}
                                      </div>
                                    ) : (
                                      <p>{tip.description}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {/* Refresh button */}
                          <div className="flex justify-center">
                            <button
                              onClick={fetchTimeManagementTips}
                              disabled={isLoadingTips}
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                            >
                              {isLoadingTips ? "Generating tips..." : "Refresh Tips"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="day-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {selectedDay && (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedDay.day}, {selectedDay.date}
                      </h2>
                      <button
                        onClick={() => setCurrentView("week")}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        ← Back to Week View
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Schedule</h3>
                          </div>
                          <div className="divide-y divide-gray-100">
                            {selectedDay.events.length > 0 ? (
                              selectedDay.events.map((event, index) => {
                                // Get a color based on the event title
                                const eventColor = getColorForEvent(event)

                                return (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 hover:bg-gray-50"
                                  >
                                    <div className="flex items-start">
                                      <div className="w-20 text-right mr-6">
                                        <div className="text-sm font-semibold text-gray-800">{event.time}</div>
                                      </div>
                                      <div className={`w-1 self-stretch rounded-full ${eventColor.bg} mr-4`}></div>
                                      <div className="flex-1">
                                        <div className="flex justify-between">
                                          <h4 className="font-medium text-gray-800">{event.title}</h4>
                                          <span
                                            className={`px-2 py-1 rounded-full text-xs ${eventColor.light} ${eventColor.text
                                              .replace("text-blue-50", "text-blue-700")
                                              .replace("text-purple-50", "text-purple-700")
                                              .replace("text-green-50", "text-green-700")
                                              .replace("text-amber-50", "text-amber-700")
                                              .replace("text-rose-50", "text-rose-700")
                                              .replace("text-teal-50", "text-teal-700")
                                              .replace("text-indigo-50", "text-indigo-700")
                                              .replace("text-pink-50", "text-pink-700")
                                              .replace("text-emerald-50", "text-emerald-700")
                                              .replace("text-orange-50", "text-orange-700")}`}
                                          >
                                            {event.category}
                                          </span>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-1">{event.location}</p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })
                            ) : (
                              <div className="p-8 text-center text-gray-500">No events scheduled for this day.</div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Day Insights</h3>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Event Breakdown</h4>
                                <div className="flex items-center space-x-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    {selectedDay.events.length > 0 ? (
                                      <div className="flex h-2.5 rounded-full">
                                        {Object.entries(
                                          selectedDay.events.reduce(
                                            (acc, event) => {
                                              acc[event.category] = (acc[event.category] || 0) + 1
                                              return acc
                                            },
                                            {} as { [key: string]: number },
                                          ),
                                        ).map(([category, count], index) => {
                                          // Get a color for this category
                                          const color =
                                            categoryColors[category as keyof typeof categoryColors]?.bg ||
                                            eventColors[index % eventColors.length].bg

                                          return (
                                            <div
                                              key={index}
                                              className={color}
                                              style={{
                                                width: `${(Number(count) / selectedDay.events.length) * 100}%`,
                                              }}
                                            ></div>
                                          )
                                        })}
                                      </div>
                                    ) : (
                                      <div className="h-2.5 rounded-full bg-gray-300 w-full"></div>
                                    )}
                                  </div>
                                </div>
                                {selectedDay.events.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {Object.entries(
                                      selectedDay.events.reduce(
                                        (acc, event) => {
                                          acc[event.category] = (acc[event.category] || 0) + 1
                                          return acc
                                        },
                                        {} as { [key: string]: number },
                                      ),
                                    ).map(([category, count], index) => {
                                      // Get a color for this category tag
                                      const color =
                                        categoryColors[category as keyof typeof categoryColors] ||
                                        eventColors[index % eventColors.length]

                                      return (
                                        <div
                                          key={index}
                                          className={`text-xs px-2 py-1 rounded-full ${color.light} ${color.text
                                            .replace("text-blue-50", "text-blue-700")
                                            .replace("text-purple-50", "text-purple-700")
                                            .replace("text-green-50", "text-green-700")
                                            .replace("text-amber-50", "text-amber-700")
                                            .replace("text-rose-50", "text-rose-700")
                                            .replace("text-teal-50", "text-teal-700")
                                            .replace("text-indigo-50", "text-indigo-700")
                                            .replace("text-pink-50", "text-pink-700")
                                            .replace("text-emerald-50", "text-emerald-700")
                                            .replace("text-orange-50", "text-orange-700")}`}
                                        >
                                          {category}: {count}
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>

                              <div className="pt-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Time Distribution</h4>
                                {selectedDay.events.length > 0 ? (
                                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="relative h-16 w-full">
                                      {/* Time scale */}
                                      <div className="absolute top-0 left-0 w-full flex justify-between text-xs text-gray-400">
                                        <span>8AM</span>
                                        <span>12PM</span>
                                        <span>4PM</span>
                                        <span>8PM</span>
                                        <span>12AM</span>
                                      </div>

                                      {/* Time blocks */}
                                      <div className="absolute top-6 left-0 w-full h-4 bg-gray-100 rounded-full">
                                        {selectedDay.events.map((event, idx) => {
                                          // Convert time to position
                                          const timeMatch = event.time.match(/(\d+):(\d+)\s*([AP]M)/)
                                          if (!timeMatch) return null

                                          let hour = Number.parseInt(timeMatch[1])
                                          const minute = Number.parseInt(timeMatch[2])
                                          const ampm = timeMatch[3]

                                          if (ampm === "PM" && hour < 12) hour += 12
                                          if (ampm === "AM" && hour === 12) hour = 0

                                          // Calculate position (8AM-12AM = 16 hours = 100% width)
                                          const startHour = 8 // 8AM
                                          const totalHours = 16
                                          const position = Math.max(
                                            0,
                                            Math.min(100, ((hour + minute / 60 - startHour) / totalHours) * 100),
                                          )
                                          const width = Math.max(4, Math.min(15, 100 / selectedDay.events.length)) // Ensure minimum visibility

                                          // Get a color for this event
                                          const eventColor = getColorForEvent(event)

                                          return (
                                            <div
                                              key={idx}
                                              className={`absolute top-0 h-4 rounded-full ${eventColor.bg}`}
                                              style={{
                                                left: `${position}%`,
                                                width: `${width}%`,
                                                opacity: 0.8,
                                              }}
                                              title={`${event.time}: ${event.title}`}
                                            ></div>
                                          )
                                        })}
                                      </div>
                                    </div>

                                    <div className="mt-2 text-sm text-gray-600">
                                      {(() => {
                                        // Calculate busy periods
                                        const morningEvents = selectedDay.events.filter((e) => {
                                          const timeMatch = e.time.match(/(\d+):(\d+)\s*([AP]M)/)
                                          if (!timeMatch) return false
                                          let hour = Number.parseInt(timeMatch[1])
                                          const ampm = timeMatch[3]
                                          if (ampm === "PM" && hour < 12) hour += 12
                                          if (ampm === "AM" && hour === 12) hour = 0
                                          return hour < 12
                                        }).length

                                        const afternoonEvents = selectedDay.events.filter((e) => {
                                          const timeMatch = e.time.match(/(\d+):(\d+)\s*([AP]M)/)
                                          if (!timeMatch) return false
                                          let hour = Number.parseInt(timeMatch[1])
                                          const ampm = timeMatch[3]
                                          if (ampm === "PM" && hour < 12) hour += 12
                                          if (ampm === "AM" && hour === 12) hour = 0
                                          return hour >= 12 && hour < 17
                                        }).length

                                        const eveningEvents = selectedDay.events.filter((e) => {
                                          const timeMatch = e.time.match(/(\d+):(\d+)\s*([AP]M)/)
                                          if (!timeMatch) return false
                                          let hour = Number.parseInt(timeMatch[1])
                                          const ampm = timeMatch[3]
                                          if (ampm === "PM" && hour < 12) hour += 12
                                          if (ampm === "AM" && hour === 12) hour = 0
                                          return hour >= 17
                                        }).length

                                        const busiest = Math.max(morningEvents, afternoonEvents, eveningEvents)
                                        let busiestTime = "evening"
                                        if (busiest === morningEvents) busiestTime = "morning"
                                        else if (busiest === afternoonEvents) busiestTime = "afternoon"

                                        return `Your busiest time is in the ${busiestTime} with ${busiest} event${busiest !== 1 ? "s" : ""}.`
                                      })()}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-gray-600 italic">No events scheduled for this day.</p>
                                )}
                              </div>

                              <div className="pt-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Free Time</h4>
                                {selectedDay.events.length > 0 ? (
                                  <div>
                                    <div className="flex items-center mb-2">
                                      <div className="w-full bg-gray-200 h-2 rounded-full">
                                        <div
                                          className="bg-green-500 h-2 rounded-full"
                                          style={{
                                            width: `${Math.max(0, Math.min(100, ((16 - selectedDay.events.length * 1.5) / 16) * 100))}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                    <p className="text-gray-800">
                                      {(() => {
                                        const avgEventDuration = 1.5 // hours
                                        const busyHours = selectedDay.events.length * avgEventDuration
                                        const freeHours = Math.max(0, 16 - busyHours)

                                        if (freeHours < 2) {
                                          return "You have very little free time today. Consider rescheduling non-essential tasks."
                                        } else if (freeHours < 6) {
                                          return `You have about ${Math.round(freeHours)} hours of free time between your scheduled events.`
                                        } else {
                                          return `You have plenty of free time today (approximately ${Math.round(freeHours)} hours).`
                                        }
                                      })()}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-gray-800">
                                    Your entire day is free! Perfect for tackling big projects or taking some time for
                                    yourself.
                                  </p>
                                )}
                              </div>

                              <div className="pt-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Suggestions</h4>
                                <ul className="space-y-2 text-sm text-gray-800">
                                  {(() => {
                                    const suggestions = []

                                    if (selectedDay.events.length === 0) {
                                      suggestions.push(
                                        <li key="empty-1" className="flex items-start">
                                          <span className="text-blue-500 mr-2">•</span>
                                          This would be a great day to tackle a big project or task.
                                        </li>,
                                      )
                                      suggestions.push(
                                        <li key="empty-2" className="flex items-start">
                                          <span className="text-blue-500 mr-2">•</span>
                                          Consider planning your week or month ahead.
                                        </li>,
                                      )
                                    } else {
                                      // Check for morning events
                                      const hasMorningEvents = selectedDay.events.some((e) => {
                                        const timeMatch = e.time.match(/(\d+):(\d+)\s*([AP]M)/)
                                        if (!timeMatch) return false
                                        const hour = Number.parseInt(timeMatch[1])
                                        const ampm = timeMatch[3]
                                        if (ampm === "AM" || (ampm === "PM" && hour === 12)) return true
                                        return false
                                      })

                                      // Check for evening events
                                      const hasEveningEvents = selectedDay.events.some((e) => {
                                        const timeMatch = e.time.match(/(\d+):(\d+)\s*([AP]M)/)
                                        if (!timeMatch) return false
                                        const hour = Number.parseInt(timeMatch[1])
                                        const ampm = timeMatch[3]
                                        if (ampm === "PM" && hour >= 5) return true
                                        return false
                                      })

                                      if (!hasMorningEvents) {
                                        suggestions.push(
                                          <li key="morning" className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            Your morning is free. Consider using this time for focused work or exercise.
                                          </li>,
                                        )
                                      }

                                      if (!hasEveningEvents) {
                                        suggestions.push(
                                          <li key="evening" className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            Your evening is open. Good time to relax or catch up on personal tasks.
                                          </li>,
                                        )
                                      }

                                      if (selectedDay.events.length > 3) {
                                        suggestions.push(
                                          <li key="busy" className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            This is a busy day. Remember to take short breaks between activities.
                                          </li>,
                                        )
                                      } else {
                                        suggestions.push(
                                          <li key="focus" className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            Consider blocking 2 hours for focused work between your events.
                                          </li>,
                                        )
                                      }
                                    }

                                    // Add day-specific suggestions
                                    if (selectedDay.day === "Monday") {
                                      suggestions.push(
                                        <li key="monday" className="flex items-start">
                                          <span className="text-blue-500 mr-2">•</span>
                                          Start your week by reviewing your goals and priorities.
                                        </li>,
                                      )
                                    } else if (selectedDay.day === "Friday") {
                                      suggestions.push(
                                        <li key="friday" className="flex items-start">
                                          <span className="text-blue-500 mr-2">•</span>
                                          Take time to wrap up loose ends before the weekend.
                                        </li>,
                                      )
                                    }

                                    return suggestions.slice(0, 3) // Limit to 3 suggestions
                                  })()}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-gray-50 border-t border-gray-200 flex items-center justify-between px-6 py-3">
          <div className="text-gray-500 text-xs">© 2025 Your.ai Personal Assistant</div>
          <div className="flex space-x-4">
            <button className="text-blue-600 hover:text-blue-800 text-xs">Export</button>
            <button className="text-blue-600 hover:text-blue-800 text-xs">Share</button>
            <button className="text-blue-600 hover:text-blue-800 text-xs">Print</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Newsletter