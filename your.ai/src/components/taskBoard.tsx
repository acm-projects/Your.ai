import { useState } from "react";

const initialTasks = {
  todo: [
    { id: 1, title: "Grocery shopping", priority: "medium", dueDate: "Today" },
    { id: 2, title: "Prepare presentation", priority: "high", dueDate: "Tomorrow" },
    { id: 3, title: "Call insurance company", priority: "low", dueDate: "This week" },
  ],
  inProgress: [
    { id: 4, title: "Research gym memberships", priority: "medium", dueDate: "Today" },
    { id: 5, title: "Draft email to professor", priority: "high", dueDate: "Today" },
  ],
  done: [
    { id: 6, title: "Pay rent", priority: "high", dueDate: "Yesterday" },
    { id: 7, title: "Schedule dentist appointment", priority: "medium", dueDate: "Yesterday" },
  ],
};

const priorityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export default function TaskBoard() {
  const [tasks] = useState(initialTasks);
  const [activeTab, setActiveTab] = useState<string>("todo");

  const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

  const tabList = [
    { key: "todo", label: "To Do" },
    { key: "inProgress", label: "In Progress" },
    { key: "done", label: "Done" },
  ];

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

        <button className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
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
            icon={
              activeTab === "todo" ? (
                <CircleIcon />
              ) : activeTab === "inProgress" ? (
                <ProgressIcon />
              ) : (
                <CheckIcon />
              )
            }
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
  icon: React.ReactNode;
}

function TaskCard({ task, priorityColors, icon }: TaskCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
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
    </div>
  );
}

// Icons
const CircleIcon = () => (
  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const ProgressIcon = () => (
  <svg className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
