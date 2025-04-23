"use client"

import { useState, useEffect, useRef, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

declare global {
  interface Window {
    __TOMORROW__?: {
      renderWidget: () => void
    }
  }
}

// Sample data
const weeklySchedule = [
  {
    day: "Monday",
    date: "April 15",
    events: [
      { time: "9:00 AM", title: "Team Standup", category: "work", location: "Conference Room A" },
      { time: "1:00 PM", title: "Project Review", category: "work", location: "Zoom Meeting" },
      { time: "6:30 PM", title: "Gym Session", category: "health", location: "Fitness Center" },
    ],
  },
  {
    day: "Tuesday",
    date: "April 16",
    events: [
      { time: "10:00 AM", title: "Client Meeting", category: "work", location: "Client Office" },
      { time: "3:00 PM", title: "Research Time", category: "school", location: "Library" },
    ],
  },
  {
    day: "Wednesday",
    date: "April 17",
    events: [
      { time: "9:30 AM", title: "ACM Meeting", category: "school", location: "CS Building" },
      { time: "2:00 PM", title: "Study Group", category: "school", location: "Student Center" },
      { time: "7:00 PM", title: "Dinner with Friends", category: "personal", location: "Downtown Restaurant" },
    ],
  },
  {
    day: "Thursday",
    date: "April 18",
    events: [
      { time: "11:00 AM", title: "Job Interview", category: "career", location: "Tech Company HQ" },
      { time: "4:00 PM", title: "Research Paper Work", category: "school", location: "Home Office" },
    ],
  },
  {
    day: "Friday",
    date: "April 19",
    events: [
      { time: "9:00 AM", title: "Weekly Planning", category: "work", location: "Home Office" },
      { time: "12:00 PM", title: "Lunch with Mentor", category: "career", location: "Cafe" },
      { time: "5:00 PM", title: "Happy Hour", category: "personal", location: "Local Bar" },
    ],
  },
  {
    day: "Saturday",
    date: "April 20",
    events: [
      { time: "10:00 AM", title: "Morning Run", category: "health", location: "City Park" },
      { time: "2:00 PM", title: "Grocery Shopping", category: "personal", location: "Supermarket" },
    ],
  },
  {
    day: "Sunday",
    date: "April 21",
    events: [
      { time: "11:00 AM", title: "Brunch", category: "personal", location: "Cafe" },
      { time: "3:00 PM", title: "Prep for Week", category: "personal", location: "Home" },
    ],
  },
]

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

const weeklyHighlights = [
  { title: "Job Interview", day: "Thursday", category: "career", priority: "high" },
  { title: "ACM Meeting", day: "Wednesday", category: "school", priority: "medium" },
  { title: "Research Paper Work", day: "Thursday", category: "school", priority: "medium" },
]

const categoryColors = {
  work: { bg: "bg-blue-500", text: "text-blue-50", light: "bg-blue-100", icon: "💼" },
  school: { bg: "bg-purple-500", text: "text-purple-50", light: "bg-purple-100", icon: "🎓" },
  health: { bg: "bg-green-500", text: "text-green-50", light: "bg-green-100", icon: "🏋️" },
  personal: { bg: "bg-amber-500", text: "text-amber-50", light: "bg-amber-100", icon: "🌟" },
  career: { bg: "bg-rose-500", text: "text-rose-50", light: "bg-rose-100", icon: "💻" },
}

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
  const [selectedDay, setSelectedDay] = useState(weeklySchedule[0])
  const [timeManagementTips, setTimeManagementTips] = useState<TimeManagementTip[]>(fallbackTimeManagementTips)
  const [isLoadingTips, setIsLoadingTips] = useState(false)
  const [tipError, setTipError] = useState<string | null>(null)

  const weatherWidgetRef = useRef(null)
  const navigate = useNavigate()

  // Function to fetch time management tips from the LLM
  const fetchTimeManagementTips = async () => {
    setIsLoadingTips(true)
    setTipError(null)

    try {
      // Get the auth token - in a real app, you'd get this from your auth system
      // For this example, we'll assume it's available in localStorage or similar
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")

      if (!token) {
        throw new Error("Authentication token not found")
      }

      // Prepare the question for the LLM
      const question =
        "Based on my upcoming events for the week, generate 4 personalized time management tips. Format each tip with a title, description, and an appropriate emoji icon. Return the response as a JSON array with objects containing title, description, and icon fields."

      // Call the LLM API
      const response = await fetch("http://localhost:5001/llm/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      // Parse the LLM response - it might be in the message field as a string
      let tips: TimeManagementTip[] = []

      if (data.message) {
        // Try to extract JSON from the message if it's a string
        try {
          // Look for JSON-like content in the response
          const jsonMatch = data.message.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            tips = JSON.parse(jsonMatch[0])
          } else {
            // If no JSON array found, try to parse the entire message
            tips = JSON.parse(data.message)
          }
        } catch (e) {
          console.error("Failed to parse LLM response:", e)
          // If parsing fails, create a structured tip from the text response
          tips = [
            {
              title: "Weekly Optimization",
              description: data.message.substring(0, 150) + "...",
              icon: "⏱️",
            },
          ]
        }
      }

      // Ensure we have the right format and fallback if needed
      if (Array.isArray(tips) && tips.length > 0) {
        // Make sure each tip has the required fields
        const validatedTips = tips.map((tip) => ({
          title: tip.title || "Time Management Tip",
          description: tip.description || "No description provided",
          icon: tip.icon || "���️",
        }))
        setTimeManagementTips(validatedTips)
      } else {
        // If we couldn't get valid tips, use the fallback
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
    // Only load the script once
    if (!document.getElementById("tomorrow-sdk")) {
      const script = document.createElement("script")
      script.id = "tomorrow-sdk"
      script.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js"
      script.async = true
      script.onload = () => {
        if (window.__TOMORROW__) {
          window.__TOMORROW__.renderWidget()
        }
      }
      document.body.appendChild(script)
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
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Once the newsletter is loaded, fetch the time management tips
      fetchTimeManagementTips()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
        className="relative bg-white text-black rounded-2xl w-11/12 max-w-7xl h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-5 left-10 w-32 h-32 rounded-full bg-white/20"></div>
            <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-white/20"></div>
            <div className="absolute -bottom-10 left-1/3 w-40 h-40 rounded-full bg-white/20"></div>
          </div>

          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Your Weekly Digest</h1>
            <p className="text-white/80 mt-2 text-lg">April 15 - April 21, 2025</p>
          </div>

          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl transition-colors"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        {/* Navigation */}
        <div className="bg-gray-100 border-b border-gray-200 px-6 py-3 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView("week")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentView === "week" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Week at a Glance
            </button>
            {currentView === "day" && (
              <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium">
                {selectedDay.day}'s Schedule
              </button>
            )}
          </div>
          <div className="text-gray-500 text-sm">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>

        {/* Main content area - Increased bottom padding to ensure scrollability */}
        <div className="h-[calc(90vh-10rem)] overflow-y-auto pb-20">
          <AnimatePresence mode="wait">
            {currentView === "week" ? (
              <motion.div
                key="week-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                {/* This Week's Schedule - Full width at the top */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">This Week's Schedule</h2>
                  </div>
                  <div className="p-6">
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
                              day.events.map((event, idx) => (
                                <div
                                  key={idx}
                                  className={`mb-2 px-2 py-1 rounded text-xs ${categoryColors[event.category].bg} ${categoryColors[event.category].text} truncate`}
                                >
                                  {event.time}: {event.title}
                                </div>
                              ))
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
                  {/* Left column (1/3 width) - Weekly Highlights and Weekly Stats */}
                  <div className="md:col-span-1 space-y-6">
                    {/* Weekly highlights */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Weekly Highlights</h2>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {weeklyHighlights.map((highlight, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              <div className={`w-3 h-3 rounded-full ${priorityColors[highlight.priority]} mr-4`}></div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-800">{highlight.title}</h3>
                                <p className="text-gray-500 text-sm">{highlight.day}</p>
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[highlight.category].light} ${categoryColors[highlight.category].text.replace("text-blue-50", "text-blue-700").replace("text-purple-50", "text-purple-700").replace("text-green-50", "text-green-700").replace("text-amber-50", "text-amber-700").replace("text-rose-50", "text-rose-700")}`}
                              >
                                {highlight.category}
                              </div>
                            </motion.div>
                          ))}
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
                              <span className="font-medium text-gray-800">Wednesday (3 events)</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Category breakdown</span>
                            </div>
                            <div className="flex h-4 rounded-full overflow-hidden">
                              <div className="bg-blue-500 w-[30%]" title="Work: 30%"></div>
                              <div className="bg-purple-500 w-[25%]" title="School: 25%"></div>
                              <div className="bg-amber-500 w-[25%]" title="Personal: 25%"></div>
                              <div className="bg-green-500 w-[10%]" title="Health: 10%"></div>
                              <div className="bg-rose-500 w-[10%]" title="Career: 10%"></div>
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
                              <span className="font-medium text-gray-800">8 blocks (24h total)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column (2/3 width) - Time Management Tips and Weather */}
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
                                  <p className="text-gray-600 text-sm mt-1">{tip.description}</p>
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

                    {/* Weather Widget - Moved below time management tips */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Weather Forecast</h2>
                      </div>
                      <div className="p-6">
                        <div ref={weatherWidgetRef} className="weather-container min-h-[300px]">
                          <div
                            className="tomorrow"
                            data-location-id=""
                            data-language="EN"
                            data-unit-system="IMPERIAL"
                            data-skin="light"
                            data-widget-type="upcoming"
                            style={{ paddingBottom: "22px", position: "relative" }}
                          >
                            <a
                              href="https://www.tomorrow.io/weather-api/"
                              rel="nofollow noopener noreferrer"
                              target="_blank"
                              style={{ position: "absolute", bottom: 0, transform: "translateX(-50%)", left: "50%" }}
                            >
                              <img
                                alt="Powered by the Tomorrow.io Weather API"
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
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="day-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
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
                          selectedDay.events.map((event, index) => (
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
                                <div
                                  className={`w-1 self-stretch rounded-full ${categoryColors[event.category].bg} mr-4`}
                                ></div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${categoryColors[event.category].light} ${categoryColors[event.category].text.replace("text-blue-50", "text-blue-700").replace("text-purple-50", "text-purple-700").replace("text-green-50", "text-green-700").replace("text-amber-50", "text-amber-700").replace("text-rose-50", "text-rose-700")}`}
                                    >
                                      {event.category}
                                    </span>
                                  </div>
                                  <p className="text-gray-500 text-sm mt-1">{event.location}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))
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
                                      selectedDay.events.reduce((acc, event) => {
                                        acc[event.category] = (acc[event.category] || 0) + 1
                                        return acc
                                      }, {}),
                                    ).map(([category, count], index) => (
                                      <div
                                        key={index}
                                        className={`${categoryColors[category].bg}`}
                                        style={{
                                          width: `${(Number(count) / selectedDay.events.length) * 100}%`,
                                        }}
                                      ></div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="h-2.5 rounded-full bg-gray-300 w-full"></div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-2">Free Time</h4>
                            <p className="text-gray-800">
                              {selectedDay.events.length > 0
                                ? "You have approximately 6 hours of free time today."
                                : "Your entire day is free!"}
                            </p>
                          </div>

                          <div className="pt-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-2">Suggestions</h4>
                            <ul className="space-y-2 text-sm text-gray-800">
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {selectedDay.events.length > 0
                                  ? "Consider blocking 2 hours for focused work between your events."
                                  : "This would be a great day to tackle a big project or task."}
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {selectedDay.day === "Monday" || selectedDay.day === "Friday"
                                  ? "Don't forget to plan for the week ahead."
                                  : "Take short breaks between activities to stay refreshed."}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-10 bg-gray-50 border-t border-gray-200 flex items-center justify-between px-6">
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