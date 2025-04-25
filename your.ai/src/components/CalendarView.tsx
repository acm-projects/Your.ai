import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import DayView from "./dayView"
import Weekly from "./weekly"
import { Dayjs } from "dayjs"
import { useCalendar } from "../context/CalendarContext" // ✅ Adjust this path if needed

type CalendarDay = {
  date: Date
  isCurrentMonth: boolean
}

const handleDayClick = (day: CalendarDay) => {
  console.log(day.date)
}

interface Event {
  id: string
  title: string
  time: string
  attendees: number
  type: "meeting" | "task" | "session"
  date: string
  color?: string // ✅ Include optional color
}

interface CalendarViewProps {
  view: "Day" | "Weekly" | "Monthly"
  selectedDate: Dayjs | null
  setSelectedDate: (date: Dayjs) => void
  categories: Record<string, boolean>
  handleCategoryChange: (key: string) => void
}

const CalendarView: React.FC<CalendarViewProps> = ({
  view,
  selectedDate,
  setSelectedDate,
  categories,
  handleCategoryChange,
}) => {
  const { events } = useCalendar()

  if (view === "Monthly") {
    return (
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events.map((event) => ({
            title: event.title,
            date: event.date,
            backgroundColor: event.color?.replace("bg-", "#") || "#3b82f6",
            borderColor: event.color?.replace("bg-", "#") || "#3b82f6",
          }))}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
        />
      </div>
    )
  }

  if (view === "Day") {
    return (
      <div className="h-[calc(100vh-200px)] w-full">
        <DayView
          date={selectedDate?.toDate() || new Date()}
          setDate={(d) => setSelectedDate(d)}
          onNewEvent={() => alert("New event clicked")}
        />
      </div>
    )
  }

  if (view === "Weekly") {
    return (
      <Weekly
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        categories={categories}
        handleCategoryChange={handleCategoryChange}
      />
    )
  }

  return null
}

export default CalendarView
