"use client"

import { useState } from "react"
import { useTaskContext } from "./taskContext" // Import the context
import { ArrowRight, CheckCircle, Clock, AlertTriangle, Plus, ChevronRight } from "lucide-react"

const priorityColors = {
  low: {
    bg: "bg-blue-500",
    text: "text-blue-700",
    light: "bg-blue-100",
    border: "border-blue-200",
  },
  medium: {
    bg: "bg-amber-500",
    text: "text-amber-700",
    light: "bg-amber-100",
    border: "border-amber-200",
  },
  high: {
    bg: "bg-red-500",
    text: "text-red-700",
    light: "bg-red-100",
    border: "border-red-200",
  },
}

export default function TaskBoard() {
  const { tasks, addTask, moveTask } = useTaskContext() // Get tasks and context methods
  const [activeTab, setActiveTab] = useState<string>("todo")

  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ")

  const tabList = [
    { key: "todo", label: "To Do", icon: <Clock className="h-4 w-4" /> },
    { key: "inProgress", label: "In Progress", icon: <ArrowRight className="h-4 w-4" /> },
    { key: "done", label: "Done", icon: <CheckCircle className="h-4 w-4" /> },
  ]

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: "New Task",
      priority: "medium",
      dueDate: "Tomorrow",
    }
    addTask(newTask, "todo")
  }

  return (
    <div className="w-full">
      {/* Tab Selector + Add Task */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          {tabList.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                activeTab === tab.key
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50",
              )}
            >
              <span className="flex items-center gap-1.5">
                {tab.icon}
                {tab.label}
              </span>
              <span className="ml-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                {tasks[tab.key as keyof typeof tasks].length}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleAddTask}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Task Cards */}
      <div className="mt-6 space-y-4">
        {tasks[activeTab as keyof typeof tasks].length > 0 ? (
          tasks[activeTab as keyof typeof tasks].map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              currentStatus={activeTab as "todo" | "inProgress" | "done"}
              onMoveTask={(from, to) => moveTask(task.id, from, to)} // Provide move task functionality
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-gray-100 p-3 mb-3">
              <AlertTriangle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">No tasks in this category</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "todo"
                ? "Add a new task to get started"
                : activeTab === "inProgress"
                  ? "Move tasks here when you start working on them"
                  : "Completed tasks will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface TaskCardProps {
  task: {
    id: number
    title: string
    priority: string
    dueDate: string
  }
  currentStatus: "todo" | "inProgress" | "done"
  onMoveTask: (from: "todo" | "inProgress" | "done", to: "todo" | "inProgress" | "done") => void
}

function TaskCard({ task, currentStatus, onMoveTask }: TaskCardProps) {
  const priority = task.priority as keyof typeof priorityColors
  const colors = priorityColors[priority]

  const getNextStatus = (current: string): "todo" | "inProgress" | "done" => {
    if (current === "todo") return "inProgress"
    if (current === "inProgress") return "done"
    return "todo" // If it's done, cycle back to todo
  }

  const getButtonLabel = (current: string): string => {
    if (current === "todo") return "Start Task"
    if (current === "inProgress") return "Complete Task"
    return "Restart Task" // If it's done
  }

  const getButtonStyle = (current: string): string => {
    if (current === "todo") return "bg-indigo-600 hover:bg-indigo-700 text-white"
    if (current === "inProgress") return "bg-green-600 hover:bg-green-700 text-white"
    return "bg-blue-600 hover:bg-blue-700 text-white" // If it's done
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-1 rounded-full ${colors.bg}`}></div>
          <div>
            <h3 className="font-medium text-gray-800">{task.title}</h3>
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {task.dueDate}
              </span>
              <span
                className={`inline-flex items-center rounded-full ${colors.light} ${colors.text} px-2.5 py-0.5 text-xs font-medium ${colors.border} border`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onMoveTask(currentStatus, getNextStatus(currentStatus))}
          className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${getButtonStyle(
            currentStatus,
          )}`}
        >
          {getButtonLabel(currentStatus)}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
