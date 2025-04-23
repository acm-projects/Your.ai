import { useState } from "react";
import { useTaskContext } from "./taskContext"; // Import the context

const priorityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export default function TaskBoard() {
  const { tasks, addTask, moveTask } = useTaskContext(); // Get tasks and context methods
  const [activeTab, setActiveTab] = useState<string>("todo");

  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

  const tabList = [
    { key: "todo", label: "To Do" },
    { key: "inProgress", label: "In Progress" },
    { key: "done", label: "Done" },
  ];

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: "New Task",
      priority: "medium",
      dueDate: "Tomorrow",
    };
    addTask(newTask, "todo");
  };

  return (
    <div className="w-full p-4">
      {/* Tab Selector + Add Task */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 rounded-md bg-gray-100 p-1">
          {tabList.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all duration-150",
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
              <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                {tasks[tab.key as keyof typeof tasks].length}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleAddTask}
          className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Task Cards */}
      <div className="mt-6 space-y-3">
        {tasks[activeTab as keyof typeof tasks].map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            priorityColors={priorityColors}
            onMoveTask={(from, to) => moveTask(task.id, from, to)} // Provide move task functionality
          />
        ))}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    priority: string;
    dueDate: string;
  };
  priorityColors: Record<string, string>;
  onMoveTask: (from: "todo" | "inProgress" | "done", to: "todo" | "inProgress" | "done") => void;
}

function TaskCard({ task, priorityColors, onMoveTask }: TaskCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-3">
        {/* Icon and Task Details */}
        <div>
          <p className="text-sm font-semibold text-gray-800">{task.title}</p>
          <div className="mt-1 flex items-center text-xs text-gray-500 space-x-4">
            <span>Due: {task.dueDate}</span>
            <div className="flex items-center space-x-1">
              <div className={`h-2 w-2 rounded-full ${priorityColors[task.priority]}`} />
              <span className="capitalize">{task.priority}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Move Task Button */}
      <div className="mt-4 flex gap-2">
        <button onClick={() => onMoveTask("todo", "inProgress")}>Move to In Progress</button>
        <button onClick={() => onMoveTask("inProgress", "done")}>Move to Done</button>
      </div>
    </div>
  );
}
